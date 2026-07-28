"use client";

import { useEffect, useState } from "react";
import QrCode from "./qr-code";
import Badge from "@/components/badge";
import ConfirmDialog from "@/components/confirm-dialog";
import Skeleton from "@/components/skeleton";

type Table = { id: string; label: string; qrToken: string; status: "FREE" | "OCCUPIED" };

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
    load();
  }, []);

  async function load() {
    const res = await fetch("/api/tables");
    if (res.ok) setTables((await res.json()).tables);
    setLoading(false);
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
    setDeleteError(null);
    const res = await fetch(`/api/tables/${id}`, { method: "DELETE" });
    setConfirmDeleteId(null);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setDeleteError(
        body.error === "referenced_by_other_records" ? "Cette table a déjà des commandes, suppression impossible." : "Erreur",
      );
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
        {error && <p className="mt-2 text-sm text-signal">{error}</p>}
      </section>

      {deleteError && (
        <p className="animate-bump-in rounded-xl border border-signal/20 bg-signal/10 px-4 py-2.5 text-sm text-signal">
          {deleteError}
        </p>
      )}

      {loading && (
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card-dash-static flex flex-col items-center gap-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-32 w-32" />
              <Skeleton className="h-3 w-28" />
            </div>
          ))}
        </section>
      )}

      {!loading && tables.length === 0 && (
        <p className="text-sm text-white/40">Aucune table pour l&apos;instant — ajoutez-en une pour obtenir un QR.</p>
      )}

      {!loading && tables.length > 0 && (
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {tables.map((table) => {
            const url = origin ? `${origin}/menu/${table.qrToken}` : "";
            return (
              <div key={table.id} className="card-dash flex animate-bump-in flex-col items-center gap-2 text-center">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white">{table.label}</p>
                  <Badge variant={table.status === "OCCUPIED" ? "todo" : "ready"} dash>
                    {table.status === "OCCUPIED" ? "Occupée" : "Libre"}
                  </Badge>
                </div>
                {url && (
                  <div className="rounded-xl border border-white/10 bg-white p-2">
                    <QrCode url={url} />
                  </div>
                )}
                <p className="break-all text-xs text-white/40">{url}</p>
                <button onClick={() => setConfirmDeleteId(table.id)} className="btn-link-dash-danger">
                  Supprimer
                </button>
              </div>
            );
          })}
        </section>
      )}

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Supprimer cette table ?"
        body="Le QR associé cessera de fonctionner immédiatement."
        confirmLabel="Supprimer"
        danger
        onConfirm={() => confirmDeleteId && removeTable(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
