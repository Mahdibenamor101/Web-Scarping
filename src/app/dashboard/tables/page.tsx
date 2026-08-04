"use client";

import { useEffect, useState } from "react";
import QrCode from "./qr-code";
import Badge from "@/components/badge";
import ConfirmDialog from "@/components/confirm-dialog";
import Skeleton from "@/components/skeleton";
import HelpTip from "@/components/help-tip";
import { useLocale } from "@/lib/i18n/use-locale";
import { isRtl } from "@/lib/i18n/languages";
import { TABLES_DICT } from "@/lib/i18n/dictionaries/tables";

type OrderingMode = "TABLE" | "COUNTER" | "PICKUP" | "DISPLAY_ONLY";
type Table = { id: string; label: string; qrToken: string; status: "FREE" | "OCCUPIED"; orderingMode: OrderingMode };

export default function TablesPage() {
  const locale = useLocale("fr");
  const t = TABLES_DICT[locale];

  const MODE_LABEL: Record<OrderingMode, string> = {
    TABLE: t.modes.table.label,
    COUNTER: t.modes.counter.label,
    PICKUP: t.modes.pickup.label,
    DISPLAY_ONLY: t.modes.displayOnly.label,
  };

  const MODE_OPTIONS: { value: OrderingMode; label: string; hint: string }[] = [
    { value: "TABLE", label: t.modes.table.label, hint: t.modes.table.hint },
    { value: "COUNTER", label: t.modes.counter.label, hint: t.modes.counter.hint },
    { value: "PICKUP", label: t.modes.pickup.label, hint: t.modes.pickup.hint },
    { value: "DISPLAY_ONLY", label: t.modes.displayOnly.label, hint: t.modes.displayOnly.hint },
  ];

  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState("");
  const [orderingMode, setOrderingMode] = useState<OrderingMode>("TABLE");
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
      body: JSON.stringify({ label, orderingMode }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? t.genericError);
      return;
    }
    setLabel("");
    setOrderingMode("TABLE");
    load();
  }

  async function removeTable(id: string) {
    setDeleteError(null);
    const res = await fetch(`/api/tables/${id}`, { method: "DELETE" });
    setConfirmDeleteId(null);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setDeleteError(body.error === "referenced_by_other_records" ? t.deleteHasOrders : t.deleteGenericError);
      return;
    }
    load();
  }

  return (
    <div dir={isRtl(locale) ? "rtl" : "ltr"} className="flex flex-col gap-8">
      <div className="flex items-center gap-2">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">{t.title}</h1>
        <HelpTip>
          {t.help.intro}
          <strong className="text-white">{t.help.qrUnique}</strong>
          {t.help.afterQr}
          <strong className="text-white">{t.modes.table.label}</strong>
          {t.help.tableSuffix}
          <strong className="text-white">{t.modes.counter.label}</strong>
          {t.help.counterSuffix}
          <strong className="text-white">{t.modes.pickup.label}</strong>
          {t.help.pickupSuffix}
          <strong className="text-white">{t.modes.displayOnly.label}</strong>
          {t.help.displayOnlySuffix}
        </HelpTip>
      </div>

      <section className="card-dash max-w-3xl">
        <h2 className="mb-3 text-base font-semibold text-white">{t.newLink.heading}</h2>
        <form onSubmit={addTable} className="flex flex-col gap-3">
          <div className="flex max-w-md gap-2">
            <input
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={`${t.modes.table.label} 1, ${t.modes.counter.label}, ${t.modes.pickup.label}…`}
              className="input-dash flex-1"
            />
            <button type="submit" className="btn-primary shrink-0">
              {t.newLink.add}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {MODE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                title={opt.hint}
                onClick={() => setOrderingMode(opt.value)}
                className={`badge-pill transition ${
                  orderingMode === opt.value
                    ? "border-brand-light/50 bg-brand-light/15 text-brand-light"
                    : "border-white/15 text-white/40 hover:border-white/30 hover:text-white/70"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </form>
        {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      </section>

      {deleteError && (
        <p className="animate-bump-in rounded-xl border border-danger/20 bg-danger/10 px-4 py-2.5 text-sm text-danger">
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
        <p className="text-sm text-white/40">{t.noTablesYet}</p>
      )}

      {!loading && tables.length > 0 && (
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {tables.map((table) => {
            const url = origin ? `${origin}/menu/${table.qrToken}` : "";
            return (
              <div key={table.id} className="card-dash flex animate-bump-in flex-col items-center gap-2 text-center">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white">{table.label}</p>
                  {table.orderingMode === "TABLE" ? (
                    <Badge variant={table.status === "OCCUPIED" ? "todo" : "ready"} dash>
                      {table.status === "OCCUPIED" ? t.occupied : t.free}
                    </Badge>
                  ) : (
                    <Badge variant="progress" dash>
                      {MODE_LABEL[table.orderingMode]}
                    </Badge>
                  )}
                </div>
                {url && (
                  <div className="rounded-xl border border-white/10 bg-white p-2">
                    <QrCode url={url} />
                  </div>
                )}
                <p className="break-all text-xs text-white/40">{url}</p>
                <button onClick={() => setConfirmDeleteId(table.id)} className="btn-link-dash-danger">
                  {t.delete}
                </button>
              </div>
            );
          })}
        </section>
      )}

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title={t.confirmDelete.title}
        body={t.confirmDelete.body}
        confirmLabel={t.confirmDelete.confirm}
        danger
        onConfirm={() => confirmDeleteId && removeTable(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
