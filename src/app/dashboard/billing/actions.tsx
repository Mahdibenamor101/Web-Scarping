"use client";

import { useState } from "react";

async function startCheckout(body: Record<string, string>): Promise<string> {
  const res = await fetch("/api/billing/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Erreur inconnue");
  return json.url as string;
}

// Same four ids as BILLING_PERIODS in src/lib/stripe.ts -- kept as a
// plain client-safe array here rather than importing that module, which
// pulls in the (Node-only) `stripe` package.
const PERIODS = [
  { id: "monthly", label: "Mensuel" },
  { id: "quarterly", label: "3 mois" },
  { id: "semiannual", label: "6 mois" },
  { id: "annual", label: "12 mois" },
] as const;

export function SubscribeButton() {
  const [loadingPeriod, setLoadingPeriod] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSelect(period: string) {
    setLoadingPeriod(period);
    setError(null);
    try {
      window.location.href = await startCheckout({ period });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      setLoadingPeriod(null);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-white/40">Choisissez la durée d&apos;engagement :</p>
      <div className="flex flex-wrap gap-2">
        {PERIODS.map((period) => (
          <button
            key={period.id}
            onClick={() => onSelect(period.id)}
            disabled={loadingPeriod !== null}
            className="btn-primary"
          >
            {loadingPeriod === period.id ? "…" : period.label}
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}

export function ManageBillingButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Erreur inconnue");
      window.location.href = body.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button onClick={onClick} disabled={loading} className="btn-primary w-fit">
        {loading ? "…" : "Gérer mon abonnement"}
      </button>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
