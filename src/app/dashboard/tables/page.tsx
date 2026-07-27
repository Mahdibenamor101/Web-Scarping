"use client";

import { useEffect, useState } from "react";
import QrCode from "./qr-code";
import Badge from "@/components/badge";

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
      <h1 className="text-2xl font-extrabold tracking-tight text-white">Tables</h1>

      <section className="card-dash max-w-3xl">
        <h2 className="mb-3 text-base font-semibold text-white">Nouvelle table</h2>
        <form onSubmit={addTable} className="flex max-w-md gap-2">
          <input
            required
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Table 1, Terrasse 3…"
            className="input-dash flex-1"
          />
          <button type="submit" className="btn-primary shrink-0">
            Ajouter
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}
      </section>

      {tables.length === 0 && (
        <p className="text-sm text-slate-400">Aucune table pour l&apos;instant — ajoutez-en une pour obtenir un QR.</p>
      )}

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {tables.map((table) => {
          const url = origin ? `${origin}/menu/${table.qrToken}` : "";
          return (
            <div key={table.id} className="card-dash flex animate-bump-in flex-col items-center gap-2 text-center">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-white">{table.label}</p>
                <Badge variant={table.status === "OCCUPIED" ? "warning" : "success"}>
                  {table.status === "OCCUPIED" ? "Occupée" : "Libre"}
                </Badge>
              </div>
              {url && (
                <div className="rounded-xl border border-white/10 bg-white p-2">
                  <QrCode url={url} />
                </div>
              )}
              <p className="break-all text-xs text-slate-500">{url}</p>
              <button onClick={() => removeTable(table.id)} className="btn-link-dash-danger">
                Supprimer
              </button>
            </div>
          );
        })}
      </section>
    </div>
  );
}
