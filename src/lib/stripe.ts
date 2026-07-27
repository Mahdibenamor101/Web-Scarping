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

export function getStripePriceId(): string | null {
  return process.env.STRIPE_PRICE_ID ?? null;
}

export function getStripeWebhookSecret(): string | null {
  return process.env.STRIPE_WEBHOOK_SECRET ?? null;
}
