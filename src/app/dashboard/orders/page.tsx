"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

const COLUMNS: { status: OrderStatus; title: string; next?: OrderStatus }[] = [
  { status: "PENDING", title: "À faire", next: "IN_PROGRESS" },
  { status: "IN_PROGRESS", title: "En cours", next: "READY" },
  { status: "READY", title: "Prêt", next: "SERVED" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [connected, setConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/orders");
    if (res.ok) setOrders((await res.json()).orders);
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
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Commandes</h1>
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium ${connected ? "text-emerald-600" : "text-slate-400"}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-emerald-500" : "bg-slate-300"}`} />
          {connected ? "En direct" : "Connexion…"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {COLUMNS.map((column) => {
          const columnOrders = orders
            .filter((o) => o.status === column.status)
            .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
          return (
            <section key={column.status} className="flex flex-col gap-3 rounded-2xl bg-slate-100/70 p-3">
              <h2 className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {column.title} · {columnOrders.length}
              </h2>
              {columnOrders.length === 0 && <p className="px-1 text-xs text-slate-400">Rien pour l&apos;instant.</p>}
              {columnOrders.map((order) => (
                <div key={order.id} className="card flex flex-col gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{order.table.label}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <ul className="flex flex-col gap-1">
                    {order.items.map((item) => (
                      <li key={item.id} className="text-xs text-slate-600">
                        {item.quantity} × {item.menuItem.nameIt}
                        {item.notes && <span className="text-slate-400"> — {item.notes}</span>}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-semibold text-slate-900">{order.totalAmount.toFixed(2)} €</span>
                    <div className="flex items-center gap-3">
                      {column.next && (
                        <button
                          onClick={() => setStatus(order.id, column.next as OrderStatus)}
                          className="rounded-full bg-sky-500 px-3 py-1 text-xs font-semibold text-white shadow-sm shadow-sky-500/30 transition hover:bg-sky-600"
                        >
                          {column.next === "IN_PROGRESS" && "Démarrer"}
                          {column.next === "READY" && "Prêt"}
                          {column.next === "SERVED" && "Servi"}
                        </button>
                      )}
                      <button onClick={() => setStatus(order.id, "CANCELLED")} className="btn-link-danger">
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
    </div>
  );
}
