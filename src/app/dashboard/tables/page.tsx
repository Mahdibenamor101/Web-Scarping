"use client";

import { useEffect, useState } from "react";
import QrCode from "./qr-code";

type Table = { id: string; label: string; qrToken: string; status: "FREE" | "OCCUPIED" };

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [label, setLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    load();
  }, []);

  async function load() {
    const res = await fetch("/api/tables");
    if (res.ok) setTables((await res.json()).tables);
  }

  async function addTable(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/tables", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Erreur inconnue");
      return;
    }
    setLabel("");
    load();
  }

  async function removeTable(id: string) {
    if (!confirm("Supprimer cette table ? Le QR associé cessera de fonctionner.")) return;
    const res = await fetch(`/api/tables/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      alert(body.error === "referenced_by_other_records" ? "Cette table a déjà des commandes, suppression impossible." : "Erreur");
      return;
    }
    load();
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tables</h1>

      <section className="card max-w-3xl">
        <h2 className="mb-3 text-base font-semibold text-slate-900">Nouvelle table</h2>
        <form onSubmit={addTable} className="flex max-w-md gap-2">
          <input
            required
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Table 1, Terrasse 3…"
            className="input flex-1"
          />
          <button type="submit" className="btn-primary shrink-0">
            Ajouter
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
      </section>

      {tables.length === 0 && (
        <p className="text-sm text-slate-500">Aucune table pour l&apos;instant — ajoutez-en une pour obtenir un QR.</p>
      )}

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {tables.map((table) => {
          const url = origin ? `${origin}/menu/${table.qrToken}` : "";
          return (
            <div
              key={table.id}
              className="card flex animate-bump-in flex-col items-center gap-2 text-center transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-slate-900">{table.label}</p>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    table.status === "OCCUPIED" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${table.status === "OCCUPIED" ? "bg-amber-500" : "bg-emerald-500"}`}
                  />
                  {table.status === "OCCUPIED" ? "Occupée" : "Libre"}
                </span>
              </div>
              {url && (
                <div className="rounded-xl border border-slate-100 p-2">
                  <QrCode url={url} />
                </div>
              )}
              <p className="break-all text-xs text-slate-400">{url}</p>
              <button onClick={() => removeTable(table.id)} className="btn-link-danger">
                Supprimer
              </button>
            </div>
          );
        })}
      </section>
    </div>
  );
}
