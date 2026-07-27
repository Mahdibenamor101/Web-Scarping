"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { friendlyErrorMessage } from "@/lib/client-errors";

export default function SignupPage() {
  const router = useRouter();
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
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 px-6">
      <h1 className="text-xl font-semibold">Créer mon restaurant</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
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
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {loading ? "Création…" : "Créer le compte"}
        </button>
      </form>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-slate-600">{label}</span>
      {children}
    </label>
  );
}
