import { NextResponse } from "next/server";
import { withTenant } from "@/lib/db";
import { getStripeClient } from "@/lib/stripe";
import { requireSession, requireRole, handleApiError } from "@/lib/api";
import { BILLING_MANAGEMENT_ROLES } from "@/lib/rbac";

// The web billing page (src/app/dashboard/billing/page.tsx) reads this
// straight from the DB in a server component; the mobile app has no
// server-component equivalent, so it needs this as a JSON route instead.
export async function GET() {
  try {
    const session = await requireSession();
    requireRole(session, BILLING_MANAGEMENT_ROLES);

    const organization = await withTenant(session.organizationId, (tx) =>
      tx.organization.findUniqueOrThrow({
        where: { id: session.organizationId },
        select: { subscriptionStatus: true, trialEndsAt: true },
      }),
    );

    return NextResponse.json({
      subscriptionStatus: organization.subscriptionStatus,
      trialEndsAt: organization.trialEndsAt,
      stripeConfigured: getStripeClient() !== null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
