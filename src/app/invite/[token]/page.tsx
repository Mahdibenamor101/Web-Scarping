"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { friendlyErrorMessage } from "@/lib/client-errors";
import AuthShell from "@/components/auth-shell";
import { useLocale } from "@/lib/i18n/use-locale";
import { AUTH_DICT } from "@/lib/i18n/dictionaries/auth";

type InvitationPreview = { organizationName: string; email: string; role: string };

export default function AcceptInvitePage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const locale = useLocale("fr");
  const t = AUTH_DICT[locale];
  const [preview, setPreview] = useState<InvitationPreview | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/invitations/${params.token}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? "invitation_invalid");
        }
        return res.json();
      })
      .then(setPreview)
      .catch((err) => setLoadError(err.message));
  }, [params.token]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/invitations/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: params.token, name, password }),
      });
      if (!res.ok) {
        throw new Error(await friendlyErrorMessage(res, t.invite.genericError));
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t.invite.genericError);
    } finally {
      setLoading(false);
    }
  }

  if (loadError) {
    return (
      <AuthShell title={t.invite.invalidTitle} locale={locale}>
        <p className="text-sm text-muted">{t.invite.invalidBody}</p>
      </AuthShell>
    );
  }

  if (!preview) {
    return null;
  }

  const roleLabel = t.roles[preview.role as keyof typeof t.roles] ?? preview.role;

  return (
    <AuthShell
      title={`${t.invite.joinPrefix}${preview.organizationName}`}
      subtitle={`${t.invite.invitationFor} ${preview.email} — ${t.invite.roleLabel} : ${roleLabel}`}
      locale={locale}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink/70">{t.fields.yourName}</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="input" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink/70">{t.fields.passwordMin}</span>
          <input
            required
            type="password"
            minLength={10}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
        </label>
        {submitError && <p className="text-sm text-danger">{submitError}</p>}
        <button type="submit" disabled={loading} className="btn-primary mt-1 w-full">
          {loading ? t.invite.submitting : t.invite.submit}
        </button>
      </form>
    </AuthShell>
  );
}
