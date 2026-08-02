import { NextRequest, NextResponse } from "next/server";
import { withTenant } from "@/lib/db";
import { getStripeClient } from "@/lib/stripe";
import { requireSession, requireRole, handleApiError, ApiError, requireRateLimit } from "@/lib/api";
import { BILLING_MANAGEMENT_ROLES } from "@/lib/rbac";

// Stripe's hosted Billing Portal: lets an owner update payment details,
// view invoices, or cancel -- without this app building any of that UI.
export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    requireRole(session, BILLING_MANAGEMENT_ROLES);
    requireRateLimit(`billing-portal:org:${session.organizationId}`, { limit: 20, windowMs: 60 * 60 * 1000 });

    const stripe = getStripeClient();
    if (!stripe) {
      throw new ApiError(501, "stripe_not_configured");
    }

    const organization = await withTenant(session.organizationId, (tx) =>
      tx.organization.findUniqueOrThrow({ where: { id: session.organizationId } }),
    );

    if (!organization.stripeCustomerId) {
      throw new ApiError(400, "no_stripe_customer_yet");
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: organization.stripeCustomerId,
      return_url: `${req.nextUrl.origin}/dashboard/billing`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    return handleApiError(error);
  }
}
