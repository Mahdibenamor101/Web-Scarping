"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Badge from "@/components/badge";
import Skeleton from "@/components/skeleton";
import HelpTip from "@/components/help-tip";

type OrderStatus = "PENDING" | "IN_PROGRESS" | "READY" | "SERVED" | "CANCELLED";

type Order = {
  id: string;
  tableId: string;
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

const COLUMNS: {
  status: OrderStatus;
  title: string;
  next?: OrderStatus;
  badge: "todo" | "progress" | "ready";
  borderClass: string;
}[] = [
  { status: "PENDING", title: "À faire", next: "IN_PROGRESS", badge: "todo", borderClass: "border-l-brand" },
  { status: "IN_PROGRESS", title: "En cours", next: "READY", badge: "progress", borderClass: "border-l-progress" },
  { status: "READY", title: "Prêt", next: "SERVED", badge: "ready", borderClass: "border-l-ready" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [staffCalls, setStaffCalls] = useState<StaffCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/orders");
    if (res.ok) setOrders((await res.json()).orders);
    setLoading(false);
  }, []);

  const loadStaffCalls = useCallback(async () => {
    const res = await fetch("/api/staff-calls");
    if (res.ok) setStaffCalls((await res.json()).calls);
  }, []);

  useEffect(() => {
    load();
    loadStaffCalls();
    const es = new EventSource("/api/orders/stream");
    eventSourceRef.current = es;
    es.onopen = () => setConnected(true);
    es.onerror = () => setConnected(false);
    es.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.kind === "order") load();
      if (data.kind === "staffCall") loadStaffCalls();
    };
    return () => es.close();
  }, [load, loadStaffCalls]);

  async function setStatus(orderId: string, status: OrderStatus) {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) load();
  }

  async function acknowledgeCall(callId: string) {
    const res = await fetch(`/api/staff-calls/${callId}`, { method: "PATCH" });
    if (res.ok) loadStaffCalls();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">Comande</h1>
          <HelpTip>
            Chaque commande passe par trois colonnes : <strong className="text-white">À faire</strong> dès qu&apos;un
            client valide sa commande, <strong className="text-white">En cours</strong> une fois que la cuisine a
            démarré, <strong className="text-white">Prêt</strong> quand elle peut être servie. Cliquez sur le bouton
            d&apos;une carte pour la faire avancer. La page se met à jour toute seule (badge &laquo;&nbsp;EN
            DIRECT&nbsp;&raquo;) — aucun rafraîchissement nécessaire.
          </HelpTip>
        </div>
        {connected ? (
          <Badge variant="ready" pulse dash>
            EN DIRECT
          </Badge>
        ) : (
          <span className="font-mono text-xs font-medium text-white/40">Connexion…</span>
        )}
      </div>

      {staffCalls.length > 0 && (
        <div className="flex flex-col gap-2 rounded-card border-l-[3px] border-l-brand bg-white/[0.03] p-3">
          {staffCalls.map((call) => (
            <div key={call.id} className="flex animate-bump-in items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-2.5">
                <Badge variant="todo" dash>
                  {call.table.label}
                </Badge>
                <span className="text-white">chiama il cameriere</span>
                <span className="font-mono text-xs text-white/40">
                  {new Date(call.createdAt).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <button onClick={() => acknowledgeCall(call.id)} className="btn-link-dash text-xs">
                Segna come vista
              </button>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {COLUMNS.map((column) => (
            <div key={column.status} className="flex flex-col gap-3 rounded-card bg-white/[0.03] p-3">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {COLUMNS.map((column) => {
            const columnOrders = orders
              .filter((o) => o.status === column.status)
              .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
            return (
              <section key={column.status} className="flex flex-col gap-3 rounded-card bg-white/[0.03] p-3">
                <div className="flex items-center justify-between px-1">
                  <Badge variant={column.badge} dash>
                    {column.title}
                  </Badge>
                  <span className="font-mono text-xs font-medium text-white/40">{columnOrders.length}</span>
                </div>
                {columnOrders.length === 0 && <p className="px-1 text-xs text-white/40">Rien pour l&apos;instant.</p>}
                {columnOrders.map((order) => (
                  <div
                    key={order.id}
                    className={`ticket-dash flex animate-bump-in flex-col gap-2 border-l-[3px] text-sm ${column.borderClass}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-base font-extrabold text-white">
                        {order.orderingMode === "TABLE" ? order.table.label : `${order.table.label} · #${order.orderNumber}`}
                      </span>
                      <Badge variant={column.badge} dash>
                        {column.title}
                      </Badge>
                    </div>
                    <span className="font-mono text-xs text-white/40">
                      {new Date(order.createdAt).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                      {order.pickupName && <> · {order.pickupName}</>}
                    </span>
                    <ul className="flex flex-col gap-1 border-t border-dashed border-white/10 pt-2">
                      {order.items.map((item) => (
                        <li key={item.id} className="text-xs text-white/60">
                          <span className="font-mono">{item.quantity}×</span> {item.menuItem.nameIt}
                          {item.notes && <span className="text-white/40"> — {item.notes}</span>}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between border-t border-dashed border-white/10 pt-2">
                      <span className="flex items-center gap-1.5 font-mono text-xs font-semibold tabular-nums text-white">
                        {order.totalAmount.toFixed(2)} €
                        {order.paymentStatus === "PAID" && (
                          <span className="rounded-[3px] border border-ready/40 bg-ready/10 px-1 py-0.5 text-[9px] uppercase text-ready">
                            Payé
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-3">
                        {column.next && (
                          <button
                            onClick={() => setStatus(order.id, column.next as OrderStatus)}
                            className="rounded-full bg-brand-gradient px-3 py-1 text-xs font-bold text-white shadow-soft transition duration-200 hover:-translate-y-0.5"
                          >
                            {column.next === "IN_PROGRESS" && "Démarrer"}
                            {column.next === "READY" && "Prêt"}
                            {column.next === "SERVED" && "Servi"}
                          </button>
                        )}
                        <button onClick={() => setStatus(order.id, "CANCELLED")} className="btn-link-dash-danger text-xs">
                          Annuler
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
