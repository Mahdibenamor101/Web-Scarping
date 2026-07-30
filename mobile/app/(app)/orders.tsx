import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import * as Notifications from "expo-notifications";
import { Badge, Screen, ScreenTitle, TicketCard } from "@/components/ui";
import { colors, spacing } from "@/lib/theme";
import { apiFetch } from "@/lib/api";

type OrderStatus = "PENDING" | "IN_PROGRESS" | "READY" | "SERVED" | "CANCELLED";

type Order = {
  id: string;
  table: { label: string };
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  orderingMode: "TABLE" | "COUNTER" | "PICKUP" | "DISPLAY_ONLY";
  orderNumber: number;
  pickupName: string | null;
  paymentStatus: "UNPAID" | "PAID";
  items: { id: string; quantity: number; notes: string | null; menuItem: { nameIt: string; nameEn: string | null } }[];
};

type StaffCall = { id: string; createdAt: string; table: { label: string } };

const COLUMNS: { status: OrderStatus; title: string; next?: OrderStatus; badge: "todo" | "progress" | "ready" }[] = [
  { status: "PENDING", title: "À faire", next: "IN_PROGRESS", badge: "todo" },
  { status: "IN_PROGRESS", title: "En cours", next: "READY", badge: "progress" },
  { status: "READY", title: "Prêt", next: "SERVED", badge: "ready" },
];

const NEXT_LABEL: Record<OrderStatus, string> = {
  PENDING: "",
  IN_PROGRESS: "Démarrer",
  READY: "Prêt",
  SERVED: "Servi",
  CANCELLED: "",
};

// No SSE here: React Native's fetch has no native EventSource, so this
// polls -- same data, just pulled every few seconds instead of pushed.
// A received push notification (order/staffCall) also triggers an
// immediate refetch, so staff see new orders as fast as the push arrives
// even between poll ticks.
const POLL_MS = 4000;

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [staffCalls, setStaffCalls] = useState<StaffCall[]>([]);
  const [column, setColumn] = useState<OrderStatus>("PENDING");
  const [refreshing, setRefreshing] = useState(false);
  const mounted = useRef(true);

  const load = useCallback(async () => {
    try {
      const [{ orders }, { calls }] = await Promise.all([
        apiFetch<{ orders: Order[] }>("/api/orders"),
        apiFetch<{ calls: StaffCall[] }>("/api/staff-calls"),
      ]);
      if (!mounted.current) return;
      setOrders(orders);
      setStaffCalls(calls);
    } catch {
      // Transient network hiccup -- next poll tick or pull-to-refresh recovers.
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    load();
    const interval = setInterval(load, POLL_MS);
    const sub = Notifications.addNotificationReceivedListener((n) => {
      const kind = n.request.content.data?.kind;
      if (kind === "order" || kind === "staffCall") load();
    });
    return () => {
      mounted.current = false;
      clearInterval(interval);
      sub.remove();
    };
  }, [load]);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  async function setStatus(orderId: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    try {
      await apiFetch(`/api/orders/${orderId}`, { method: "PATCH", body: { status } });
    } catch {
      load();
    }
  }

  async function acknowledgeCall(callId: string) {
    setStaffCalls((prev) => prev.filter((c) => c.id !== callId));
    try {
      await apiFetch(`/api/staff-calls/${callId}`, { method: "PATCH" });
    } catch {
      load();
    }
  }

  const columnOrders = orders
    .filter((o) => o.status === column)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  return (
    <Screen>
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md, gap: spacing.md }}>
        <ScreenTitle>Commandes</ScreenTitle>

        {staffCalls.length > 0 && (
          <View style={{ gap: spacing.sm }}>
            {staffCalls.map((call) => (
              <Pressable
                key={call.id}
                onPress={() => acknowledgeCall(call.id)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderLeftWidth: 3,
                  borderLeftColor: colors.brand,
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderRadius: 6,
                  padding: spacing.md,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                  <Badge variant="todo">{call.table.label}</Badge>
                  <Text style={{ color: "#fff", fontSize: 13 }}>appelle le serveur</Text>
                </View>
                <Text style={{ color: colors.white40, fontSize: 11 }}>Vu</Text>
              </Pressable>
            ))}
          </View>
        )}

        <View style={{ flexDirection: "row", gap: spacing.sm }}>
          {COLUMNS.map((c) => {
            const count = orders.filter((o) => o.status === c.status).length;
            const active = column === c.status;
            return (
              <Pressable
                key={c.status}
                onPress={() => setColumn(c.status)}
                style={{
                  flex: 1,
                  alignItems: "center",
                  paddingVertical: spacing.sm,
                  borderRadius: 6,
                  backgroundColor: active ? colors.dashCard : "transparent",
                  borderWidth: 1,
                  borderColor: active ? colors.white15 : "transparent",
                }}
              >
                <Text style={{ color: active ? "#fff" : colors.white40, fontWeight: "700", fontSize: 13 }}>
                  {c.title} ({count})
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <FlatList
        data={columnOrders}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} />}
        ListEmptyComponent={
          <Text style={{ color: colors.white40, fontSize: 13, textAlign: "center", marginTop: spacing.xl }}>
            Rien pour l&apos;instant.
          </Text>
        }
        renderItem={({ item: order }) => {
          const col = COLUMNS.find((c) => c.status === order.status);
          return (
            <TicketCard>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ color: "#fff", fontSize: 17, fontWeight: "800" }}>
                  {order.orderingMode === "TABLE" ? order.table.label : `${order.table.label} · #${order.orderNumber}`}
                </Text>
                {col && <Badge variant={col.badge}>{col.title}</Badge>}
              </View>
              <Text style={{ color: colors.white40, fontSize: 11, marginTop: 4 }}>
                {new Date(order.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                {order.pickupName ? ` · ${order.pickupName}` : ""}
              </Text>

              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: colors.white10,
                  borderStyle: "dashed",
                  marginTop: spacing.sm,
                  paddingTop: spacing.sm,
                  gap: 2,
                }}
              >
                {order.items.map((item) => (
                  <Text key={item.id} style={{ color: colors.white70, fontSize: 13 }}>
                    {item.quantity}× {item.menuItem.nameIt}
                    {item.notes ? <Text style={{ color: colors.white40 }}> — {item.notes}</Text> : null}
                  </Text>
                ))}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderTopWidth: 1,
                  borderTopColor: colors.white10,
                  borderStyle: "dashed",
                  marginTop: spacing.sm,
                  paddingTop: spacing.sm,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>{order.totalAmount.toFixed(2)} €</Text>
                  {order.paymentStatus === "PAID" && <Badge variant="ready">Payé</Badge>}
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                  {order.status !== "CANCELLED" && order.status !== "SERVED" && (
                    <Pressable onPress={() => setStatus(order.id, "CANCELLED")}>
                      <Text style={{ color: colors.dangerLight, fontSize: 12, fontWeight: "600" }}>Annuler</Text>
                    </Pressable>
                  )}
                  {col?.next && (
                    <Pressable
                      onPress={() => setStatus(order.id, col.next as OrderStatus)}
                      style={{
                        backgroundColor: colors.brand,
                        borderRadius: 999,
                        paddingHorizontal: 14,
                        paddingVertical: 6,
                      }}
                    >
                      <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>{NEXT_LABEL[col.next]}</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </TicketCard>
          );
        }}
      />
    </Screen>
  );
}
