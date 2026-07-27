"use client";

import { useState } from "react";

const PERIODS = [
  { months: 3, label: "3 mois", available: false },
  { months: 6, label: "6 mois", available: false },
  { months: 12, label: "12 mois", available: true },
] as const;

/**
 * Segmented period toggle. Only "12 mois" is real: the product sells one
 * annual prepaid plan (CONTEXT.md §8 -- monthly/short-term billing was
 * deliberately rejected for cash-flow reasons, not just unbuilt yet). The
 * other two are shown as "Bientôt" rather than left off entirely, since a
 * working toggle that quietly only has one real option would look broken;
 * a disabled one is honest about what's actually purchasable today.
 */
export default function PricingToggle({ onChange }: { onChange?: (months: number) => void }) {
  const [active, setActive] = useState<number>(12);

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-soft">
      {PERIODS.map((period) => {
        const isActive = active === period.months;
        return (
          <button
            key={period.months}
            type="button"
            disabled={!period.available}
            aria-pressed={isActive}
            onClick={() => {
              if (!period.available) return;
              setActive(period.months);
              onChange?.(period.months);
            }}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition duration-200 ${
              isActive
                ? "bg-accent-gradient text-white shadow-soft"
                : period.available
                  ? "text-slate-600 hover:text-ink"
                  : "cursor-not-allowed text-slate-300"
            }`}
          >
            {period.label}
            {!period.available && (
              <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                Bientôt
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
