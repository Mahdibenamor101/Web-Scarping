"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { friendlyErrorMessage } from "@/lib/client-errors";
import AuthShell from "@/components/auth-shell";

type InvitationPreview = { organizationName: string; email: string; role: string };

export default function AcceptInvitePage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
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
        throw new Error(await friendlyErrorMessage(res, "Erreur inconnue"));
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  if (loadError) {
    return (
      <AuthShell title="Invitation invalide">
        <p className="text-sm text-muted">Ce lien d&apos;invitation est invalide ou a expiré.</p>
      </AuthShell>
    );
  }

  if (!preview) {
    return null;
  }

  return (
    <AuthShell
      title={`Rejoindre ${preview.organizationName}`}
      subtitle={`Invitation pour ${preview.email} — rôle : ${preview.role}`}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink/70">Votre nom</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="input" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink/70">Mot de passe (10 caractères min.)</span>
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
          {loading ? "Activation…" : "Activer mon compte"}
        </button>
      </form>
    </AuthShell>
  );
}
