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
    <div className="flex flex-col gap-1">
      <button
        onClick={onClick}
        disabled={loading}
        className="w-fit rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
      >
        {loading ? "…" : label}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export function SubscribeButton() {
  return <BillingActionButton endpoint="/api/billing/checkout" label="S'abonner (~400 €/an)" />;
}

export function ManageBillingButton() {
  return <BillingActionButton endpoint="/api/billing/portal" label="Gérer mon abonnement" />;
}
