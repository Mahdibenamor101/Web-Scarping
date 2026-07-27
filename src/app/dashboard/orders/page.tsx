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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Commandes</h1>
        <span className={`text-xs ${connected ? "text-green-600" : "text-slate-400"}`}>
          {connected ? "● en direct" : "○ connexion…"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {COLUMNS.map((column) => {
          const columnOrders = orders
            .filter((o) => o.status === column.status)
            .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
          return (
            <section key={column.status} className="flex flex-col gap-2 rounded-md border border-slate-200 p-3">
              <h2 className="text-sm font-semibold text-slate-600">
                {column.title} ({columnOrders.length})
              </h2>
              {columnOrders.length === 0 && <p className="text-xs text-slate-400">Rien pour l&apos;instant.</p>}
              {columnOrders.map((order) => (
                <div key={order.id} className="flex flex-col gap-2 rounded-md border border-slate-200 bg-white p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{order.table.label}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <ul className="flex flex-col gap-1">
                    {order.items.map((item) => (
                      <li key={item.id} className="text-xs">
                        {item.quantity} × {item.menuItem.nameIt}
                        {item.notes && <span className="text-slate-400"> — {item.notes}</span>}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{order.totalAmount.toFixed(2)} €</span>
                    <div className="flex gap-2">
                      {column.next && (
                        <button
                          onClick={() => setStatus(order.id, column.next as OrderStatus)}
                          className="rounded bg-slate-900 px-2 py-1 text-xs font-medium text-white"
                        >
                          {column.next === "IN_PROGRESS" && "Démarrer"}
                          {column.next === "READY" && "Prêt"}
                          {column.next === "SERVED" && "Servi"}
                        </button>
                      )}
                      <button
                        onClick={() => setStatus(order.id, "CANCELLED")}
                        className="text-xs text-red-600 underline"
                      >
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
