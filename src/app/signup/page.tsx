"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { friendlyErrorMessage } from "@/lib/client-errors";
import AuthShell from "@/components/auth-shell";
import OAuthButtons from "@/components/oauth-buttons";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [organizationName, setOrganizationName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationName, ownerName, email, password }),
      });
      if (!res.ok) {
        throw new Error(await friendlyErrorMessage(res, "Erreur inconnue"));
      }
      router.push("/dashboard/staff");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Créer mon restaurant" subtitle="Essai gratuit, sans carte bancaire.">
      <OAuthButtons from="signup" error={searchParams.get("oauth_error")} />
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field label="Nom du restaurant">
          <input
            required
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            className="input"
            placeholder="Trattoria da Mario"
          />
        </Field>
        <Field label="Votre nom">
          <input required value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className="input" />
        </Field>
        <Field label="Email">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Mot de passe (10 caractères min.)">
          <input
            required
            type="password"
            minLength={10}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
        </Field>
        {error && <p className="text-sm text-danger">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary mt-1 w-full">
          {loading ? "Création…" : "Créer le compte"}
        </button>
      </form>
    </AuthShell>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-ink/70">{label}</span>
      {children}
    </label>
  );
}
