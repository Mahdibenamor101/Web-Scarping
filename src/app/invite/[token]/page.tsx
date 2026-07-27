"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { friendlyErrorMessage } from "@/lib/client-errors";

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
      <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 px-6 text-center">
        <p className="text-red-600">Invitation invalide ou expirée.</p>
      </main>
    );
  }

  if (!preview) {
    return null;
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 px-6">
      <h1 className="text-xl font-semibold">Rejoindre {preview.organizationName}</h1>
      <p className="text-sm text-slate-600">
        Invitation pour <strong>{preview.email}</strong> — rôle : {preview.role}
      </p>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-600">Votre nom</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="input" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-600">Mot de passe (10 caractères min.)</span>
          <input
            required
            type="password"
            minLength={10}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
        </label>
        {submitError && <p className="text-sm text-red-600">{submitError}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {loading ? "Activation…" : "Activer mon compte"}
        </button>
      </form>
    </main>
  );
}
