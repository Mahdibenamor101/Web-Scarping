import { NextRequest, NextResponse } from "next/server";
import { withTenant } from "@/lib/db";
import { getStripeClient, getStripePriceId } from "@/lib/stripe";
import { requireSession, requireRole, handleApiError, ApiError, requireRateLimit } from "@/lib/api";
import { BILLING_MANAGEMENT_ROLES } from "@/lib/rbac";
import { getRequestOrigin } from "@/lib/rate-limit";
import { billingCheckoutSchema } from "@/lib/validation";

// Creates (or reuses) a Stripe Customer for the organization, then a
// Checkout Session for the caller's chosen commitment length (monthly,
// 3/6/12 months -- one plan, four prepaid periods, no feature tiers; see
// BILLING_PERIODS in src/lib/stripe.ts). The organization id travels in
// both the session's and the resulting subscription's metadata, so the
// webhook handler (POST /api/billing/webhook) can always resolve which
// tenant an event belongs to without guessing from the Stripe customer id
// alone; the chosen period travels the same way so the webhook can record
// it without reverse-mapping a price id back to a label.
export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    requireRole(session, BILLING_MANAGEMENT_ROLES);
    requireRateLimit(`billing-checkout:org:${session.organizationId}`, { limit: 10, windowMs: 60 * 60 * 1000 });

    const { period } = billingCheckoutSchema.parse(await req.json());

    const stripe = getStripeClient();
    const priceId = getStripePriceId(period);
    if (!stripe || !priceId) {
      throw new ApiError(501, "stripe_not_configured");
    }

    const organization = await withTenant(session.organizationId, (tx) =>
      tx.organization.findUniqueOrThrow({ where: { id: session.organizationId } }),
    );

    let customerId = organization.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.email,
        name: organization.name,
        metadata: { organizationId: session.organizationId },
      });
      customerId = customer.id;
      await withTenant(session.organizationId, (tx) =>
        tx.organization.update({ where: { id: session.organizationId }, data: { stripeCustomerId: customerId } }),
      );
    }

    const origin = getRequestOrigin(req);
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard/billing?checkout=success`,
      cancel_url: `${origin}/dashboard/billing?checkout=cancelled`,
      metadata: { organizationId: session.organizationId, plan: period },
      subscription_data: { metadata: { organizationId: session.organizationId, plan: period } },
    });

    if (!checkoutSession.url) {
      throw new Error("stripe_checkout_session_missing_url");
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    return handleApiError(error);
  }
}
