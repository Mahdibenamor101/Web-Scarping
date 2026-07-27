import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { withTenant } from "@/lib/db";
import { getStripeClient, getStripeWebhookSecret } from "@/lib/stripe";

export const dynamic = "force-dynamic";

// Stripe calls this with no session, no staff account behind it -- the
// same shape of problem as signup/login/QR ordering (see CONTEXT.md §12.3
// and §12.5). The difference here: the organization id isn't looked up
// from an untrusted token via a SECURITY DEFINER function, it's read back
// from event metadata that *this app itself* set when creating the
// Checkout Session / subscription (POST /api/billing/checkout). Stripe's
// signature verification below proves the event genuinely came from
// Stripe and wasn't tampered with, which makes that metadata trustworthy.
// That's why a plain withTenant() write is enough here -- no new RLS
// bypass function needed, the sixth escape hatch this project didn't end
// up needing.
async function syncSubscription(organizationId: string, subscription: Stripe.Subscription) {
  // Since Stripe's 2025 API versions, `current_period_end` lives on each
  // subscription item rather than the subscription itself (multiple items
  // can now have independent billing periods). This app only ever creates
  // single-item subscriptions, so the first item's period is the whole
  // subscription's period.
  const firstItem = subscription.items.data[0];
  const currentPeriodEnd = firstItem ? new Date(firstItem.current_period_end * 1000) : null;

  await withTenant(organizationId, (tx) =>
    Promise.all([
      tx.organization.update({
        where: { id: organizationId },
        data: { subscriptionStatus: subscription.status, subscriptionPlan: "annual" },
      }),
      tx.subscription.upsert({
        where: { externalSubscriptionId: subscription.id },
        create: {
          organizationId,
          plan: "annual",
          status: subscription.status,
          paymentProvider: "stripe",
          externalSubscriptionId: subscription.id,
          currentPeriodEnd,
        },
        update: {
          status: subscription.status,
          currentPeriodEnd,
        },
      }),
    ]),
  );
}

export async function POST(req: NextRequest) {
  const stripe = getStripeClient();
  const webhookSecret = getStripeWebhookSecret();
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "stripe_not_configured" }, { status: 501 });
  }

  // Signature verification needs the exact raw bytes Stripe signed, so the
  // body must be read as text -- never parsed as JSON first.
  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    if (!signature) throw new Error("missing_signature");
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe webhook] signature verification failed", err);
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const organizationId = session.metadata?.organizationId;
        if (organizationId && typeof session.subscription === "string") {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          await syncSubscription(organizationId, subscription);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        // Only subscriptions created through our own checkout carry this --
        // anything else (e.g. manually created in the Stripe dashboard) is
        // skipped rather than guessed at.
        const organizationId = subscription.metadata?.organizationId;
        if (organizationId) {
          await syncSubscription(organizationId, subscription);
        }
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error(`[stripe webhook] failed to process ${event.type}`, err);
    return NextResponse.json({ error: "processing_failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
