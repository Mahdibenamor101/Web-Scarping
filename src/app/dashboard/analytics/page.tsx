"use client";

import { useEffect, useState } from "react";
import Skeleton from "@/components/skeleton";
import HelpTip from "@/components/help-tip";
import StatCounter from "@/components/stat-counter";

type DayCount = { date: string; count: number };
type DaySales = { date: string; total: number; orders: number };
type PopularItem = { name: string; quantity: number };
type Analytics = {
  viewsByDay: DayCount[];
  salesByDay: DaySales[];
  popularItems: PopularItem[];
  totals: { views: number; orders: number; revenue: number };
};

const DAY_LABEL = new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "2-digit" });

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then(async (res) => (res.ok ? setData(await res.json()) : null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-2">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">Analytics</h1>
        <HelpTip>
          Chiffres des 14 derniers jours (30 pour les plats populaires). Une vue est comptée à chaque ouverture du
          menu public — un même client qui recharge la page en compte plusieurs.
        </HelpTip>
      </div>

      {loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      )}

      {!loading && data && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <KpiTile label="Vues du menu" value={data.totals.views} />
            <KpiTile label="Commandes" value={data.totals.orders} />
            <KpiTile label="Chiffre d'affaires" value={data.totals.revenue} suffix=" €" decimals />
          </div>

          <section className="card-dash-static">
            <h2 className="mb-4 text-sm font-semibold text-white/70">Ventes par jour (14 jours)</h2>
            <DayBarChart
              points={data.salesByDay.map((d) => ({ date: d.date, value: d.total }))}
              colorClass="bg-brand-gradient"
              formatValue={(v) => `${v.toFixed(2)} €`}
            />
          </section>

          <section className="card-dash-static">
            <h2 className="mb-4 text-sm font-semibold text-white/70">Vues du menu par jour (14 jours)</h2>
            <DayBarChart
              points={data.viewsByDay.map((d) => ({ date: d.date, value: d.count }))}
              colorClass="bg-progress"
              formatValue={(v) => `${v} vue${v === 1 ? "" : "s"}`}
            />
          </section>

          <section className="card-dash-static max-w-xl">
            <h2 className="mb-4 text-sm font-semibold text-white/70">Plats les plus commandés (30 jours)</h2>
            {data.popularItems.length === 0 && <p className="text-sm text-white/40">Pas encore de commandes.</p>}
            {data.popularItems.length > 0 && (
              <ul className="flex flex-col gap-3">
                {(() => {
                  const max = Math.max(...data.popularItems.map((i) => i.quantity));
                  return data.popularItems.map((item, i) => (
                    <li key={item.name} className="flex items-center gap-3">
                      <span className="w-5 shrink-0 font-mono text-xs text-white/30">{i + 1}</span>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="text-white/80">{item.name}</span>
                          <span className="font-mono text-white/50">{item.quantity}×</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-brand-gradient"
                            style={{ width: `${Math.max(4, (item.quantity / max) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </li>
                  ));
                })()}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function KpiTile({ label, value, suffix = "", decimals = false }: { label: string; value: number; suffix?: string; decimals?: boolean }) {
  return (
    <div className="ticket-dash">
      <p className="text-xs font-medium uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-1 font-mono text-3xl font-extrabold text-white">
        {decimals ? (
          value.toFixed(2) + suffix
        ) : (
          <>
            <StatCounter value={value} />
            {suffix}
          </>
        )}
      </p>
    </div>
  );
}

function DayBarChart({
  points,
  colorClass,
  formatValue,
}: {
  points: { date: string; value: number }[];
  colorClass: string;
  formatValue: (v: number) => string;
}) {
  const max = Math.max(1, ...points.map((p) => p.value));
  const trackHeight = 140;
  return (
    <div className="flex items-end gap-1.5">
      {points.map((p, i) => {
        const heightPct = Math.max(2, (p.value / max) * 100);
        const showLabel = i === points.length - 1 || i % 3 === 0;
        return (
          <div key={p.date} className="flex flex-1 flex-col items-center gap-1.5">
            {/* Explicit pixel height, not h-full: the outer row uses
                items-end so its children don't stretch, which would
                otherwise leave this track's height at 0 and every bar's
                percentage height resolving against nothing. */}
            <div className="flex w-full items-end" style={{ height: trackHeight }}>
              <div
                title={`${DAY_LABEL.format(new Date(p.date))} — ${formatValue(p.value)}`}
                className={`w-full rounded-t-[3px] transition-opacity hover:opacity-80 ${colorClass}`}
                style={{ height: `${heightPct}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-white/30">{showLabel ? DAY_LABEL.format(new Date(p.date)) : ""}</span>
          </div>
        );
      })}
    </div>
  );
}
