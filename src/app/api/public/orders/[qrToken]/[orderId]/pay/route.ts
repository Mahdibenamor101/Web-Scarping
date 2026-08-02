import { NextRequest, NextResponse } from "next/server";
import { withTenant } from "@/lib/db";
import { resolveTableByQrToken } from "@/lib/qr-resolve";
import { getStripeClient } from "@/lib/stripe";
import { ApiError, handleApiError, requireRateLimit } from "@/lib/api";
import { getClientIp, getRequestOrigin } from "@/lib/rate-limit";

// Customer-facing payment, distinct from the org's own subscription
// checkout (POST /api/billing/checkout) -- same Stripe account, a
// mode: "payment" Checkout Session instead of "subscription". This is a
// deliberate simplification: money collected here settles into the
// PLATFORM's Stripe balance, not the restaurant's. A real launch needs
// Stripe Connect (each organization onboards its own connected account,
// this route creates the session `on_behalf_of`/with `transfer_data`
// pointing at it) -- out of scope for this pass, never tested against a
// real account either way; see CONTEXT.md.
export async function POST(req: NextRequest, { params }: { params: { qrToken: string; orderId: string } }) {
  try {
    requireRateLimit(`order-pay:ip:${getClientIp(req)}`, { limit: 20, windowMs: 60 * 60 * 1000 });

    const stripe = getStripeClient();
    if (!stripe) {
      throw new ApiError(501, "stripe_not_configured");
    }

    const table = await resolveTableByQrToken(params.qrToken);

    // organizationId filtered explicitly, not left to RLS alone (same
    // defense-in-depth convention as every other tenant-scoped query in
    // this codebase) -- a guessed order id from another restaurant gets
    // the same 404 as a nonexistent one, never a permission-style error
    // that would confirm it exists.
    const order = await withTenant(table.organizationId, (tx) =>
      tx.order.findFirst({ where: { id: params.orderId, organizationId: table.organizationId } }),
    );

    if (!order) {
      throw new ApiError(404, "order_not_found");
    }
    if (order.paymentStatus === "PAID") {
      throw new ApiError(409, "already_paid");
    }

    const origin = getRequestOrigin(req);
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: `${table.organizationName} — commande #${order.orderNumber}` },
            unit_amount: Math.round(Number(order.totalAmount) * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/menu/${params.qrToken}?payment=success`,
      cancel_url: `${origin}/menu/${params.qrToken}?payment=cancelled`,
      metadata: { orderId: order.id, organizationId: table.organizationId },
    });

    if (!checkoutSession.url) {
      throw new Error("stripe_checkout_session_missing_url");
    }

    await withTenant(table.organizationId, (tx) =>
      tx.order.update({ where: { id: order.id }, data: { stripeCheckoutSessionId: checkoutSession.id } }),
    );

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    return handleApiError(error);
  }
}
