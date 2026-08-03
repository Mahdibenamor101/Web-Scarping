"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { friendlyErrorMessage } from "@/lib/client-errors";
import AuthShell from "@/components/auth-shell";
import OAuthButtons from "@/components/oauth-buttons";
import { useLocale } from "@/lib/i18n/use-locale";
import { AUTH_DICT } from "@/lib/i18n/dictionaries/auth";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale("fr");
  const t = AUTH_DICT[locale];
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
        throw new Error(await friendlyErrorMessage(res, t.signup.genericError));
      }
      router.push("/dashboard/staff");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.signup.genericError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title={t.signup.title} subtitle={t.signup.subtitle} locale={locale}>
      <OAuthButtons from="signup" error={searchParams.get("oauth_error")} locale={locale} />
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field label={t.fields.restaurantName}>
          <input
            required
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            className="input"
            placeholder="Trattoria da Mario"
          />
        </Field>
        <Field label={t.fields.yourName}>
          <input required value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className="input" />
        </Field>
        <Field label={t.fields.email}>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
        </Field>
        <Field label={t.fields.passwordMin}>
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
          {loading ? t.signup.submitting : t.signup.submit}
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
