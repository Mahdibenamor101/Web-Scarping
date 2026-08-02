import Stripe from "stripe";

let client: Stripe | null | undefined;

/**
 * Returns null when Stripe isn't configured (no secret key in the
 * environment) instead of throwing, so the app -- and `npm run setup` in
 * particular -- keeps working fully in local dev without requiring a real
 * Stripe account. Callers must handle the null case explicitly (a clean
 * 501, not a crash); see src/app/api/billing/*.
 */
export function getStripeClient(): Stripe | null {
  if (client !== undefined) return client;
  const key = process.env.STRIPE_SECRET_KEY;
  client = key ? new Stripe(key) : null;
  return client;
}

/**
 * Four prepaid commitment lengths on the same single plan (no feature
 * tiers) -- each is its own Stripe Price object (its own env var), created
 * once in the Stripe Dashboard against one Product. `id` is what travels
 * through the checkout request body and the subscription's own metadata
 * (see POST /api/billing/checkout and the webhook's syncSubscription),
 * so a subscription always knows which commitment it was sold under
 * without having to reverse-map a price id back to a label.
 */
export const BILLING_PERIODS = [
  { id: "monthly", label: "Mensile", envVar: "STRIPE_PRICE_ID_MONTHLY" },
  { id: "quarterly", label: "3 mesi", envVar: "STRIPE_PRICE_ID_QUARTERLY" },
  { id: "semiannual", label: "6 mesi", envVar: "STRIPE_PRICE_ID_SEMIANNUAL" },
  { id: "annual", label: "12 mesi", envVar: "STRIPE_PRICE_ID_ANNUAL" },
] as const;

export type BillingPeriod = (typeof BILLING_PERIODS)[number]["id"];

export function getStripePriceId(period: BillingPeriod): string | null {
  const entry = BILLING_PERIODS.find((p) => p.id === period);
  return entry ? (process.env[entry.envVar] ?? null) : null;
}

export function getStripeWebhookSecret(): string | null {
  return process.env.STRIPE_WEBHOOK_SECRET ?? null;
}
