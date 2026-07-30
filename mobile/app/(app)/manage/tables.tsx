import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, RefreshControl, ScrollView, Share, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Badge, Card, ErrorText, PrimaryButton, Screen, ScreenTitle, TextField } from "@/components/ui";
import { colors, spacing } from "@/lib/theme";
import { apiFetch, apiBaseUrl, ApiError } from "@/lib/api";

type OrderingMode = "TABLE" | "COUNTER" | "PICKUP" | "DISPLAY_ONLY";
type Table = { id: string; label: string; qrToken: string; status: "FREE" | "OCCUPIED"; orderingMode: OrderingMode };

const MODE_OPTIONS: { value: OrderingMode; label: string }[] = [
  { value: "TABLE", label: "Table" },
  { value: "COUNTER", label: "Comptoir" },
  { value: "PICKUP", label: "Retrait" },
  { value: "DISPLAY_ONLY", label: "Affichage seul" },
];
const MODE_LABEL: Record<OrderingMode, string> = {
  TABLE: "Table",
  COUNTER: "Comptoir",
  PICKUP: "Retrait",
  DISPLAY_ONLY: "Affichage seul",
};

export default function TablesScreen() {
  const [tables, setTables] = useState<Table[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [label, setLabel] = useState("");
  const [orderingMode, setOrderingMode] = useState<OrderingMode>("TABLE");
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    const { tables } = await apiFetch<{ tables: Table[] }>("/api/tables");
    setTables(tables);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  async function addTable() {
    setError(null);
    setCreating(true);
    try {
      await apiFetch("/api/tables", { method: "POST", body: { label, orderingMode } });
      setLabel("");
      setOrderingMode("TABLE");
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur inconnue.");
    } finally {
      setCreating(false);
    }
  }

  function confirmDelete(table: Table) {
    Alert.alert("Supprimer cette table ?", "Le QR associé cessera de fonctionner immédiatement.", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            await apiFetch(`/api/tables/${table.id}`, { method: "DELETE" });
            load();
          } catch (err) {
            Alert.alert(
              err instanceof ApiError && err.message === "referenced_by_other_records"
                ? "Cette table a déjà des commandes, suppression impossible."
                : "Erreur",
            );
          }
        },
      },
    ]);
  }

  function shareLink(url: string, tableLabel: string) {
    Share.share({ message: url, title: `Lien QR — ${tableLabel}` });
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} />}
      >
        <ScreenTitle>Tables</ScreenTitle>

        <Card style={{ gap: spacing.sm }}>
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Nouveau lien de commande</Text>
          <TextField label="Nom" placeholder="Table 1, Comptoir, Retrait…" value={label} onChangeText={setLabel} />
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
            {MODE_OPTIONS.map((opt) => {
              const active = orderingMode === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => setOrderingMode(opt.value)}
                  style={{
                    borderRadius: 999,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderWidth: 1,
                    borderColor: active ? colors.brandLight : colors.white15,
                    backgroundColor: active ? colors.brandLight + "26" : "transparent",
                  }}
                >
                  <Text style={{ color: active ? colors.brandLight : colors.white40, fontSize: 12, fontWeight: "600" }}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {error && <ErrorText>{error}</ErrorText>}
          <PrimaryButton title="Ajouter" onPress={addTable} loading={creating} disabled={!label.trim()} />
        </Card>

        {tables.length === 0 && (
          <Text style={{ color: colors.white40, fontSize: 13 }}>Aucune table pour l&apos;instant.</Text>
        )}

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md }}>
          {tables.map((table) => {
            const url = `${apiBaseUrl()}/menu/${table.qrToken}`;
            return (
              <Card key={table.id} style={{ alignItems: "center", gap: spacing.sm, width: "100%" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                  <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>{table.label}</Text>
                  {table.orderingMode === "TABLE" ? (
                    <Badge variant={table.status === "OCCUPIED" ? "todo" : "ready"}>
                      {table.status === "OCCUPIED" ? "Occupée" : "Libre"}
                    </Badge>
                  ) : (
                    <Badge variant="progress">{MODE_LABEL[table.orderingMode]}</Badge>
                  )}
                </View>
                <View style={{ backgroundColor: "#fff", padding: spacing.sm, borderRadius: 12 }}>
                  <QRCode value={url} size={140} />
                </View>
                <Text style={{ color: colors.white40, fontSize: 11, textAlign: "center" }}>{url}</Text>
                <View style={{ flexDirection: "row", gap: spacing.lg }}>
                  <Pressable onPress={() => shareLink(url, table.label)}>
                    <Text style={{ color: colors.brandLight, fontSize: 12, fontWeight: "600" }}>Partager</Text>
                  </Pressable>
                  <Pressable onPress={() => confirmDelete(table)}>
                    <Text style={{ color: colors.dangerLight, fontSize: 12, fontWeight: "600" }}>Supprimer</Text>
                  </Pressable>
                </View>
              </Card>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
}
