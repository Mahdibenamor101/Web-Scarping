import { NextRequest, NextResponse } from "next/server";
import { withTenant } from "@/lib/db";
import { getStripeClient, getStripePriceId } from "@/lib/stripe";
import { requireSession, requireRole, handleApiError, ApiError, requireRateLimit } from "@/lib/api";
import { BILLING_MANAGEMENT_ROLES } from "@/lib/rbac";

// Creates (or reuses) a Stripe Customer for the organization, then a
// Checkout Session for the single annual plan (§8 of CONTEXT.md: ~400€/an
// prépayé -- one plan, one price, no tier picker needed for the MVP).
// The organization id travels in both the session's and the resulting
// subscription's metadata, so the webhook handler (POST /api/billing/webhook)
// can always resolve which tenant an event belongs to without guessing
// from the Stripe customer id alone.
export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    requireRole(session, BILLING_MANAGEMENT_ROLES);
    requireRateLimit(`billing-checkout:org:${session.organizationId}`, { limit: 10, windowMs: 60 * 60 * 1000 });

    const stripe = getStripeClient();
    const priceId = getStripePriceId();
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

    const origin = req.nextUrl.origin;
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard/billing?checkout=success`,
      cancel_url: `${origin}/dashboard/billing?checkout=cancelled`,
      metadata: { organizationId: session.organizationId },
      subscription_data: { metadata: { organizationId: session.organizationId } },
    });

    if (!checkoutSession.url) {
      throw new Error("stripe_checkout_session_missing_url");
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    return handleApiError(error);
  }
}
