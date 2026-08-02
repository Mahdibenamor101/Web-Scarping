import { useCallback, useEffect, useState } from "react";
import { Linking, RefreshControl, ScrollView, Text, View } from "react-native";
import { Badge, Card, EmptyState, ErrorText, PrimaryButton, Screen, ScreenTitle, SecondaryButton } from "@/components/ui";
import { colors, spacing } from "@/lib/theme";
import { apiFetch, ApiError } from "@/lib/api";

type BillingInfo = {
  subscriptionStatus: string;
  subscriptionPlan: string;
  trialEndsAt: string | null;
  stripeConfigured: boolean;
};

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

// Same four ids as BILLING_PERIODS in src/lib/stripe.ts on the web side.
const PERIODS = [
  { id: "monthly", label: "Mensuel" },
  { id: "quarterly", label: "3 mois" },
  { id: "semiannual", label: "6 mois" },
  { id: "annual", label: "12 mois" },
] as const;

export default function BillingScreen() {
  const [info, setInfo] = useState<BillingInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setInfo(await apiFetch<BillingInfo>("/api/billing"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  async function openStripePortal() {
    setError(null);
    setLoading(true);
    try {
      // Stripe Checkout/Portal are hosted pages -- opened in the device's
      // browser rather than embedded, same as the web app just handing
      // off to stripe.com instead of building payment UI itself.
      const { url } = await apiFetch<{ url: string }>("/api/billing/portal", { method: "POST" });
      await Linking.openURL(url);
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 501
          ? "Stripe n'est pas configuré sur cet environnement."
          : "Erreur lors de l'ouverture de Stripe.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function openStripeCheckout(period: string) {
    setError(null);
    setLoading(true);
    try {
      const { url } = await apiFetch<{ url: string }>("/api/billing/checkout", {
        method: "POST",
        body: { period },
      });
      await Linking.openURL(url);
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 501
          ? "Stripe n'est pas configuré sur cet environnement."
          : "Erreur lors de l'ouverture de Stripe.",
      );
    } finally {
      setLoading(false);
    }
  }

  const trialDaysLeft = info?.trialEndsAt
    ? Math.max(0, Math.ceil((new Date(info.trialEndsAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
    : null;
  const isSubscribed = info?.subscriptionStatus === "active";

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} />}
      >
        <ScreenTitle>Abonnement</ScreenTitle>

        {!info && <EmptyState text="Chargement…" />}

        {info && (
          <>
            <Card style={{ gap: spacing.sm }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, flexWrap: "wrap" }}>
                <Text style={{ color: colors.white40, fontSize: 13 }}>Statut :</Text>
                <Badge variant="todo">{STATUS_LABEL[info.subscriptionStatus] ?? info.subscriptionStatus}</Badge>
                {isSubscribed && (
                  <>
                    <Text style={{ color: colors.white40, fontSize: 13 }}>· engagement :</Text>
                    <Badge variant="todo">{PLAN_LABEL[info.subscriptionPlan] ?? info.subscriptionPlan}</Badge>
                  </>
                )}
              </View>
              {info.subscriptionStatus === "trialing" && trialDaysLeft !== null && (
                <Text style={{ color: colors.white40, fontSize: 12 }}>
                  {trialDaysLeft > 0 ? `${trialDaysLeft} jour(s) restant(s) d'essai gratuit.` : "Essai gratuit terminé."}
                </Text>
              )}
            </Card>

            {!info.stripeConfigured && (
              <Card style={{ borderColor: colors.dangerLight + "40" }}>
                <Text style={{ color: colors.dangerLight, fontSize: 12 }}>
                  Stripe n&apos;est pas configuré sur cet environnement — normal en local sans compte Stripe.
                </Text>
              </Card>
            )}

            {error && <ErrorText>{error}</ErrorText>}

            {info.stripeConfigured && isSubscribed && (
              <PrimaryButton title="Gérer la facturation" onPress={openStripePortal} loading={loading} />
            )}

            {info.stripeConfigured && !isSubscribed && (
              <View style={{ gap: spacing.sm }}>
                <Text style={{ color: colors.white40, fontSize: 13 }}>Choisissez la durée d&apos;engagement :</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
                  {PERIODS.map((period) => (
                    <SecondaryButton
                      key={period.id}
                      title={loading ? "…" : period.label}
                      onPress={() => !loading && openStripeCheckout(period.id)}
                    />
                  ))}
                </View>
              </View>
            )}

            <Text style={{ color: colors.white40, fontSize: 11 }}>
              Abonnement prépayé, au choix mensuel, 3 mois, 6 mois ou 12 mois. Gérable à tout moment depuis Stripe :
              moyen de paiement, factures, résiliation.
            </Text>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}
