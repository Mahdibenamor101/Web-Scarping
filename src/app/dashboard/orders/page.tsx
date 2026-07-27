"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Badge from "@/components/badge";
import Skeleton from "@/components/skeleton";

type OrderStatus = "PENDING" | "IN_PROGRESS" | "READY" | "SERVED" | "CANCELLED";

type Order = {
  id: string;
  tableId: string;
  table: { label: string };
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  items: { id: string; quantity: number; notes: string | null; menuItem: { nameIt: string; nameEn: string | null } }[];
};

const COLUMNS: { status: OrderStatus; title: string; next?: OrderStatus; badge: "warning" | "neutral" | "success" }[] = [
  { status: "PENDING", title: "À faire", next: "IN_PROGRESS", badge: "warning" },
  { status: "IN_PROGRESS", title: "En cours", next: "READY", badge: "neutral" },
  { status: "READY", title: "Prêt", next: "SERVED", badge: "success" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/orders");
    if (res.ok) setOrders((await res.json()).orders);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const es = new EventSource("/api/orders/stream");
    eventSourceRef.current = es;
    es.onopen = () => setConnected(true);
    es.onerror = () => setConnected(false);
    es.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "created" || data.type === "updated") load();
    };
    return () => es.close();
  }, [load]);

  async function setStatus(orderId: string, status: OrderStatus) {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) load();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Commandes</h1>
        {connected ? (
          <Badge variant="live">EN DIRECT</Badge>
        ) : (
          <span className="text-xs font-medium text-slate-500">Connexion…</span>
        )}
      </div>

      {loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {COLUMNS.map((column) => (
            <div key={column.status} className="flex flex-col gap-3 rounded-2xl bg-white/[0.03] p-3">
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
            <section key={column.status} className="flex flex-col gap-3 rounded-2xl bg-white/[0.03] p-3">
              <div className="flex items-center justify-between px-1">
                {column.badge === "neutral" ? (
                  <span className="badge-pill bg-white/10 text-slate-300">{column.title}</span>
                ) : (
                  <Badge variant={column.badge}>{column.title}</Badge>
                )}
                <span className="text-xs font-medium text-slate-500">{columnOrders.length}</span>
              </div>
              {columnOrders.length === 0 && <p className="px-1 text-xs text-slate-500">Rien pour l&apos;instant.</p>}
              {columnOrders.map((order) => (
                <div key={order.id} className="card-dash flex animate-bump-in flex-col gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{order.table.label}</span>
                    <span className="text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <ul className="flex flex-col gap-1">
                    {order.items.map((item) => (
                      <li key={item.id} className="text-xs text-slate-400">
                        {item.quantity} × {item.menuItem.nameIt}
                        {item.notes && <span className="text-slate-500"> — {item.notes}</span>}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-semibold text-white">{order.totalAmount.toFixed(2)} €</span>
                    <div className="flex items-center gap-3">
                      {column.next && (
                        <button
                          onClick={() => setStatus(order.id, column.next as OrderStatus)}
                          className="rounded-full bg-accent-gradient px-3 py-1 text-xs font-semibold text-white shadow-soft transition duration-200 hover:scale-[1.03]"
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
