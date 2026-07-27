import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { withTenant } from "@/lib/db";
import { getStripeClient } from "@/lib/stripe";
import { SubscribeButton, ManageBillingButton } from "./actions";

const STATUS_LABEL: Record<string, string> = {
  trialing: "essai gratuit",
  active: "actif",
  past_due: "paiement en retard",
  canceled: "annulé",
  unpaid: "impayé",
  incomplete: "incomplet",
  incomplete_expired: "expiré",
  paused: "en pause",
};

export default async function BillingPage({
  searchParams,
}: {
  searchParams: { checkout?: string };
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const organization = await withTenant(session.organizationId, (tx) =>
    tx.organization.findUniqueOrThrow({ where: { id: session.organizationId } }),
  );

  const stripeConfigured = getStripeClient() !== null;
  const isSubscribed = organization.subscriptionStatus === "active";
  const trialDaysLeft = organization.trialEndsAt
    ? Math.max(0, Math.ceil((organization.trialEndsAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
    : null;

  return (
    <div className="flex max-w-md flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Abonnement</h1>

      {searchParams.checkout === "success" && (
        <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
          Paiement en cours de confirmation — le statut ci-dessous se mettra à jour automatiquement dès que Stripe
          nous aura notifiés.
        </p>
      )}
      {searchParams.checkout === "cancelled" && (
        <p className="rounded-xl bg-slate-100 p-3 text-sm text-slate-600">Paiement annulé, rien n&apos;a été débité.</p>
      )}

      <div className="card text-sm">
        <p className="text-slate-600">
          Statut :{" "}
          <span className="badge">{STATUS_LABEL[organization.subscriptionStatus] ?? organization.subscriptionStatus}</span>
        </p>
        {organization.subscriptionStatus === "trialing" && trialDaysLeft !== null && (
          <p className="mt-2 text-slate-500">
            {trialDaysLeft > 0 ? `${trialDaysLeft} jour(s) restant(s) d'essai gratuit.` : "Essai gratuit terminé."}
          </p>
        )}
      </div>

      {!stripeConfigured && (
        <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
          Stripe n&apos;est pas configuré sur cet environnement (variables <code>STRIPE_SECRET_KEY</code> /{" "}
          <code>STRIPE_PRICE_ID</code> absentes) — normal en local sans compte Stripe. Voir <code>.env.example</code>.
        </p>
      )}

      {stripeConfigured && (isSubscribed ? <ManageBillingButton /> : <SubscribeButton />)}

      <p className="text-xs text-slate-400">
        Abonnement annuel prépayé (~400 €/an). Gérable à tout moment depuis Stripe : moyen de paiement, factures,
        résiliation.
      </p>
    </div>
  );
}
