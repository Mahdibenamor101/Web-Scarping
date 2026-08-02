import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { withTenant } from "@/lib/db";
import { getStripeClient } from "@/lib/stripe";
import { SubscribeButton, ManageBillingButton } from "./actions";
import HelpTip from "@/components/help-tip";

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

const PLAN_LABEL: Record<string, string> = {
  monthly: "mensuel",
  quarterly: "3 mois",
  semiannual: "6 mois",
  annual: "12 mois",
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
      <div className="flex items-center gap-2">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">Abonnement</h1>
        <HelpTip>
          Réservé au propriétaire. L&apos;abonnement débloque les tables et commandes illimitées. Le paiement et
          les factures sont gérés par Stripe : cliquez sur &laquo;&nbsp;Gérer la facturation&nbsp;&raquo; pour
          changer de carte, télécharger une facture ou annuler à tout moment.
        </HelpTip>
      </div>

      {searchParams.checkout === "success" && (
        <p className="rounded-card border border-ready-light/20 bg-ready-light/10 p-3 text-sm text-ready-light">
          Paiement en cours de confirmation — le statut ci-dessous se mettra à jour automatiquement dès que Stripe
          nous aura notifiés.
        </p>
      )}
      {searchParams.checkout === "cancelled" && (
        <p className="rounded-card border border-white/10 bg-white/[0.03] p-3 text-sm text-white/40">
          Paiement annulé, rien n&apos;a été débité.
        </p>
      )}

      <div className="card-dash animate-bump-in text-sm">
        <p className="text-white/40">
          Statut :{" "}
          <span className="badge-pill bg-brand-light/15 text-brand-light">
            {STATUS_LABEL[organization.subscriptionStatus] ?? organization.subscriptionStatus}
          </span>
          {isSubscribed && (
            <>
              {" "}
              &middot; engagement{" "}
              <span className="badge-pill bg-brand-light/15 text-brand-light">
                {PLAN_LABEL[organization.subscriptionPlan] ?? organization.subscriptionPlan}
              </span>
            </>
          )}
        </p>
        {organization.subscriptionStatus === "trialing" && trialDaysLeft !== null && (
          <p className="mt-2 text-white/40">
            {trialDaysLeft > 0 ? `${trialDaysLeft} jour(s) restant(s) d'essai gratuit.` : "Essai gratuit terminé."}
          </p>
        )}
      </div>

      {!stripeConfigured && (
        <p className="rounded-card border border-danger-light/20 bg-danger-light/10 p-3 text-sm text-danger-light">
          Stripe n&apos;est pas configuré sur cet environnement (variable <code>STRIPE_SECRET_KEY</code> et/ou les
          variables <code>STRIPE_PRICE_ID_*</code> absentes) — normal en local sans compte Stripe. Voir{" "}
          <code>.env.example</code>.
        </p>
      )}

      {stripeConfigured && (isSubscribed ? <ManageBillingButton /> : <SubscribeButton />)}

      <p className="text-xs text-white/40">
        Abonnement prépayé, au choix mensuel, 3 mois, 6 mois ou 12 mois. Gérable à tout moment depuis Stripe : moyen
        de paiement, factures, résiliation.
      </p>
    </div>
  );
}
