"use client";

import { useState } from "react";
import type { LanguageCode } from "@/lib/i18n/languages";
import { BILLING_DICT } from "@/lib/i18n/dictionaries/billing";

async function startCheckout(body: Record<string, string>, genericError: string): Promise<string> {
  const res = await fetch("/api/billing/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? genericError);
  return json.url as string;
}

export function SubscribeButton({ locale = "fr" }: { locale?: LanguageCode }) {
  const t = BILLING_DICT[locale];
  // Same four ids as BILLING_PERIODS in src/lib/stripe.ts -- kept as a
  // plain client-safe array here rather than importing that module, which
  // pulls in the (Node-only) `stripe` package.
  const PERIODS = [
    { id: "monthly", label: t.periods.monthly },
    { id: "quarterly", label: t.periods.quarterly },
    { id: "semiannual", label: t.periods.semiannual },
    { id: "annual", label: t.periods.annual },
  ] as const;
  const [loadingPeriod, setLoadingPeriod] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSelect(period: string) {
    setLoadingPeriod(period);
    setError(null);
    try {
      window.location.href = await startCheckout({ period }, t.genericError);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.genericError);
      setLoadingPeriod(null);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-white/40">{t.chooseDuration}</p>
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

export function ManageBillingButton({ locale = "fr" }: { locale?: LanguageCode }) {
  const t = BILLING_DICT[locale];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? t.genericError);
      window.location.href = body.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : t.genericError);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button onClick={onClick} disabled={loading} className="btn-primary w-fit">
        {loading ? "…" : t.manageSubscription}
      </button>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
