import { useCallback, useEffect, useState } from "react";
import { Linking, Text, View } from "react-native";
import { Badge, Card, EmptyState, ErrorText, PrimaryButton, Screen, ScreenTitle } from "@/components/ui";
import { colors, spacing } from "@/lib/theme";
import { apiFetch, ApiError } from "@/lib/api";

type BillingInfo = { subscriptionStatus: string; trialEndsAt: string | null; stripeConfigured: boolean };

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

export default function BillingScreen() {
  const [info, setInfo] = useState<BillingInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setInfo(await apiFetch<BillingInfo>("/api/billing"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function openStripe(path: "checkout" | "portal") {
    setError(null);
    setLoading(true);
    try {
      // Stripe Checkout/Portal are hosted pages -- opened in the device's
      // browser rather than embedded, same as the web app just handing
      // off to stripe.com instead of building payment UI itself.
      const { url } = await apiFetch<{ url: string }>(`/api/billing/${path}`, { method: "POST" });
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
      <View style={{ padding: spacing.lg, gap: spacing.md }}>
        <ScreenTitle>Abonnement</ScreenTitle>

        {!info && <EmptyState text="Chargement…" />}

        {info && (
          <>
            <Card style={{ gap: spacing.sm }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                <Text style={{ color: colors.white40, fontSize: 13 }}>Statut :</Text>
                <Badge variant="todo">{STATUS_LABEL[info.subscriptionStatus] ?? info.subscriptionStatus}</Badge>
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

            {info.stripeConfigured && (
              <PrimaryButton
                title={isSubscribed ? "Gérer la facturation" : "S'abonner"}
                onPress={() => openStripe(isSubscribed ? "portal" : "checkout")}
                loading={loading}
              />
            )}

            <Text style={{ color: colors.white40, fontSize: 11 }}>
              Abonnement annuel prépayé (~400 €/an). Gérable à tout moment depuis Stripe : moyen de paiement,
              factures, résiliation.
            </Text>
          </>
        )}
      </View>
    </Screen>
  );
}
