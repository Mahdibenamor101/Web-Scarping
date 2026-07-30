import { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { Card, EmptyState, Screen, ScreenTitle } from "@/components/ui";
import { colors, spacing } from "@/lib/theme";
import { apiFetch } from "@/lib/api";

type DayCount = { date: string; count: number };
type DaySales = { date: string; total: number; orders: number };
type PopularItem = { name: string; quantity: number };
type Analytics = {
  viewsByDay: DayCount[];
  salesByDay: DaySales[];
  popularItems: PopularItem[];
  totals: { views: number; orders: number; revenue: number };
};

const DAY_LABEL = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit" });

export default function AnalyticsScreen() {
  const [data, setData] = useState<Analytics | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setData(await apiFetch<Analytics>("/api/analytics"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} />}
      >
        <ScreenTitle>Analytics</ScreenTitle>

        {!data && <EmptyState text="Chargement…" />}

        {data && (
          <>
            <View style={{ flexDirection: "row", gap: spacing.sm }}>
              <KpiTile label="Vues du menu" value={String(data.totals.views)} />
              <KpiTile label="Commandes" value={String(data.totals.orders)} />
              <KpiTile label="Chiffre d'affaires" value={`${data.totals.revenue.toFixed(2)} €`} />
            </View>

            <Card style={{ gap: spacing.md }}>
              <Text style={styles.sectionTitle}>Ventes par jour (14 jours)</Text>
              <DayBarChart
                points={data.salesByDay.map((d) => ({ date: d.date, value: d.total }))}
                color={colors.brand}
                formatValue={(v) => `${v.toFixed(2)} €`}
              />
            </Card>

            <Card style={{ gap: spacing.md }}>
              <Text style={styles.sectionTitle}>Vues du menu par jour (14 jours)</Text>
              <DayBarChart
                points={data.viewsByDay.map((d) => ({ date: d.date, value: d.count }))}
                color={colors.progress}
                formatValue={(v) => `${v} vue${v === 1 ? "" : "s"}`}
              />
            </Card>

            <Card style={{ gap: spacing.md }}>
              <Text style={styles.sectionTitle}>Plats les plus commandés (30 jours)</Text>
              {data.popularItems.length === 0 && (
                <Text style={{ color: colors.white40, fontSize: 13 }}>Pas encore de commandes.</Text>
              )}
              {data.popularItems.length > 0 && (
                <View style={{ gap: spacing.sm }}>
                  {(() => {
                    const max = Math.max(...data.popularItems.map((i) => i.quantity));
                    return data.popularItems.map((item, i) => (
                      <View key={item.name} style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                        <Text style={{ width: 16, color: colors.white40, fontSize: 11 }}>{i + 1}</Text>
                        <View style={{ flex: 1, gap: 4 }}>
                          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text style={{ color: colors.white70, fontSize: 12 }}>{item.name}</Text>
                            <Text style={{ color: colors.white40, fontSize: 12 }}>{item.quantity}×</Text>
                          </View>
                          <View style={{ height: 6, borderRadius: 999, backgroundColor: colors.white10, overflow: "hidden" }}>
                            <View
                              style={{
                                height: "100%",
                                borderRadius: 999,
                                backgroundColor: colors.brand,
                                width: `${Math.max(4, (item.quantity / max) * 100)}%`,
                              }}
                            />
                          </View>
                        </View>
                      </View>
                    ));
                  })()}
                </View>
              )}
            </Card>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

function KpiTile({ label, value }: { label: string; value: string }) {
  return (
    <Card style={{ flex: 1, gap: 4, paddingVertical: spacing.md }}>
      <Text style={{ color: colors.white40, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</Text>
      <Text style={{ color: "#fff", fontSize: 20, fontWeight: "800" }}>{value}</Text>
    </Card>
  );
}

function DayBarChart({
  points,
  color,
  formatValue,
}: {
  points: { date: string; value: number }[];
  color: string;
  formatValue: (v: number) => string;
}) {
  const max = Math.max(1, ...points.map((p) => p.value));
  const trackHeight = 90;
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 3 }}>
      {points.map((p, i) => {
        const heightPct = Math.max(2, (p.value / max) * 100);
        const showLabel = i === points.length - 1 || i % 4 === 0;
        return (
          <View key={p.date} style={{ flex: 1, alignItems: "center", gap: 4 }}>
            <View style={{ width: "100%", height: trackHeight, justifyContent: "flex-end" }}>
              <View style={{ width: "100%", height: `${heightPct}%`, backgroundColor: color, borderRadius: 2 }} />
            </View>
            <Text style={{ fontSize: 8, color: colors.white40 }}>{showLabel ? DAY_LABEL.format(new Date(p.date)) : ""}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = { sectionTitle: { color: colors.white70, fontSize: 13, fontWeight: "700" as const } };
