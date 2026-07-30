"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Dashboard-wide nudge, not a gate -- an unverified account can use every
 * feature exactly as before this existed (see src/lib/verification.ts).
 * Re-checks /api/me instead of trusting the session JWT, which never
 * carries emailVerifiedAt and would go stale the moment it's set anyway
 * (see src/app/api/me/route.ts's own reasoning for re-reading the row).
 */
export default function EmailVerificationBanner() {
  const searchParams = useSearchParams();
  const justVerified = searchParams.get("email_verified") === "1";
  const [verified, setVerified] = useState<boolean | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/me").then(async (res) => {
      if (!res.ok || cancelled) return;
      const { user } = await res.json();
      setVerified(Boolean(user.emailVerifiedAt));
    });
    return () => {
      cancelled = true;
    };
    // Re-check right after a verify-email redirect lands, in case this
    // banner mounted before the click (e.g. verified in another tab).
  }, [justVerified]);

  async function resend() {
    setSending(true);
    const res = await fetch("/api/auth/resend-verification", { method: "POST" });
    setSending(false);
    if (res.ok) setSent(true);
  }

  if (verified === null || verified) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-card border border-dashed border-brand-light/40 bg-brand-light/10 px-4 py-3 text-sm text-brand-light">
      <span>Confirmez votre adresse email pour sécuriser votre compte.</span>
      {sent ? (
        <span className="font-mono text-xs">Email envoyé — pensez à vérifier vos spams.</span>
      ) : (
        <button onClick={resend} disabled={sending} className="btn-link-dash whitespace-nowrap">
          {sending ? "Envoi…" : "Renvoyer l'email"}
        </button>
      )}
    </div>
  );
}
