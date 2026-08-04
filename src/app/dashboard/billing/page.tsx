import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { withTenant } from "@/lib/db";
import { getStripeClient } from "@/lib/stripe";
import { SubscribeButton, ManageBillingButton } from "./actions";
import HelpTip from "@/components/help-tip";
import { getLocale } from "@/lib/i18n/get-locale";
import { isRtl } from "@/lib/i18n/languages";
import { BILLING_DICT } from "@/lib/i18n/dictionaries/billing";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: { checkout?: string };
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const locale = getLocale("fr");
  const t = BILLING_DICT[locale];

  const organization = await withTenant(session.organizationId, (tx) =>
    tx.organization.findUniqueOrThrow({ where: { id: session.organizationId } }),
  );

  const stripeConfigured = getStripeClient() !== null;
  const isSubscribed = organization.subscriptionStatus === "active";
  const trialDaysLeft = organization.trialEndsAt
    ? Math.max(0, Math.ceil((organization.trialEndsAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
    : null;

  return (
    <div dir={isRtl(locale) ? "rtl" : "ltr"} className="flex max-w-md flex-col gap-6">
      <div className="flex items-center gap-2">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">{t.title}</h1>
        <HelpTip>{t.help}</HelpTip>
      </div>

      {searchParams.checkout === "success" && (
        <p className="rounded-card border border-ready-light/20 bg-ready-light/10 p-3 text-sm text-ready-light">
          {t.checkoutSuccess}
        </p>
      )}
      {searchParams.checkout === "cancelled" && (
        <p className="rounded-card border border-white/10 bg-white/[0.03] p-3 text-sm text-white/40">
          {t.checkoutCancelled}
        </p>
      )}

      <div className="card-dash animate-bump-in text-sm">
        <p className="text-white/40">
          {t.statusPrefix}
          <span className="badge-pill bg-brand-light/15 text-brand-light">
            {t.statusLabels[organization.subscriptionStatus as keyof typeof t.statusLabels] ?? organization.subscriptionStatus}
          </span>
          {isSubscribed && (
            <>
              {" "}
              &middot; {t.engagementLabel}{" "}
              <span className="badge-pill bg-brand-light/15 text-brand-light">
                {t.planLabels[organization.subscriptionPlan as keyof typeof t.planLabels] ?? organization.subscriptionPlan}
              </span>
            </>
          )}
        </p>
        {organization.subscriptionStatus === "trialing" && trialDaysLeft !== null && (
          <p className="mt-2 text-white/40">
            {trialDaysLeft > 0 ? t.trialDaysLeftTemplate.replace("{n}", String(trialDaysLeft)) : t.trialEnded}
          </p>
        )}
      </div>

      {!stripeConfigured && (
        <p className="rounded-card border border-danger-light/20 bg-danger-light/10 p-3 text-sm text-danger-light">
          {t.stripeNotConfigured.before}
          <code>STRIPE_SECRET_KEY</code>
          {t.stripeNotConfigured.betweenVars}
          <code>STRIPE_PRICE_ID_*</code>
          {t.stripeNotConfigured.beforeEnvExample}
          <code>.env.example</code>
          {t.stripeNotConfigured.afterEnvExample}
        </p>
      )}

      {stripeConfigured &&
        (isSubscribed ? <ManageBillingButton locale={locale} /> : <SubscribeButton locale={locale} />)}

      <p className="text-xs text-white/40">{t.footerNote}</p>
    </div>
  );
}
