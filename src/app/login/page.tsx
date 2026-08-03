"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { friendlyErrorMessage } from "@/lib/client-errors";
import AuthShell from "@/components/auth-shell";
import OAuthButtons from "@/components/oauth-buttons";
import { useLocale } from "@/lib/i18n/use-locale";
import { AUTH_DICT } from "@/lib/i18n/dictionaries/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale("fr");
  const t = AUTH_DICT[locale];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        if (res.status === 429) throw new Error(await friendlyErrorMessage(res, t.login.tooManyAttempts));
        throw new Error(t.login.invalidCredentials);
      }
      router.push(searchParams.get("next") ?? "/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.login.genericError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title={t.login.title} locale={locale}>
      <div className="flex flex-col gap-4">
        <OAuthButtons from="login" error={searchParams.get("oauth_error")} locale={locale} />
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink/70">{t.fields.email}</span>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink/70">{t.fields.password}</span>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
          </label>
          {error && <p className="text-sm text-danger">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary mt-1 w-full">
            {loading ? t.login.submitting : t.login.submit}
          </button>
        </form>
      </div>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
