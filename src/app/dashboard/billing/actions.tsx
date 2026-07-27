"use client";

import { useState } from "react";

function BillingActionButton({ endpoint, label }: { endpoint: string; label: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint, { method: "POST" });
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
        {loading ? "…" : label}
      </button>
      {error && <p className="text-sm text-rose-400">{error}</p>}
    </div>
  );
}

export function SubscribeButton() {
  return <BillingActionButton endpoint="/api/billing/checkout" label="S'abonner (~400 €/an)" />;
}

export function ManageBillingButton() {
  return <BillingActionButton endpoint="/api/billing/portal" label="Gérer mon abonnement" />;
}
