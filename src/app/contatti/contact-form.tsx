"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "@/components/reveal";

// No static "write to us at ..." address on this page on purpose: the only
// public contact address in the codebase (CONTACT_EMAIL, src/lib/brand.ts)
// is explicitly documented there as a placeholder, not a working inbox --
// showing it here as if it were real would mislead a visitor. This form is
// the one genuinely working contact path: POST /api/contact really sends
// through sendEmail() when RESEND_API_KEY/EMAIL_FROM/CONTACT_EMAIL are
// configured, and degrades to a server-side log otherwise, same pattern as
// every other optional integration in this app.
//
// Split out of page.tsx (a server component, see CONTEXT.md §12.30) so the
// page itself can resolve the visitor's language for the shared nav/footer
// -- this form's own copy stays Italian-only for now, same as /prezzi and
// /chi-siamo.
export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, restaurantName: restaurantName || undefined, message }),
      });
      if (res.status === 429) throw new Error("Troppi tentativi, riprova tra qualche minuto.");
      if (!res.ok) throw new Error("Invio non riuscito, riprova.");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-lg px-6 py-16 sm:py-20">
      <Reveal className="text-center">
        <span className="eyebrow">Contatti</span>
        <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">Parliamone.</h1>
        <p className="mt-3 text-sm text-muted">
          Domande, richieste particolari, o vuoi solo capire se mbQr fa per il tuo locale — scrivici.
        </p>
      </Reveal>

      <Reveal className="mt-10">
        {sent ? (
          <div className="ticket text-center">
            <p className="font-display text-lg font-extrabold text-ink">Messaggio inviato!</p>
            <p className="mt-2 text-sm text-muted">Ti risponderemo il prima possibile.</p>
            <Link href="/" className="btn-secondary mt-6 inline-block px-5 py-2.5 text-sm">
              Torna alla home
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="ticket flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-ink/70">Nome</span>
              <input required value={name} onChange={(e) => setName(e.target.value)} className="input" />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-ink/70">Email</span>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-ink/70">Nome del locale (facoltativo)</span>
              <input value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} className="input" />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-ink/70">Messaggio</span>
              <textarea
                required
                minLength={10}
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="input resize-none"
              />
            </label>
            {error && <p className="text-sm text-danger">{error}</p>}
            <button type="submit" disabled={submitting} className="btn-primary mt-2 py-3">
              {submitting ? "…" : "Invia messaggio"}
            </button>
          </form>
        )}
      </Reveal>
    </main>
  );
}
