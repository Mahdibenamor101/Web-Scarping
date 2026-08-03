"use client";

import { useState } from "react";
import { LANDING_DICT } from "@/lib/i18n/dictionaries/landing";
import type { LanguageCode } from "@/lib/i18n/languages";

/**
 * Segmented period toggle. Only "12 mesi" is real: the product sells one
 * annual prepaid plan (CONTEXT.md §8 -- monthly/short-term billing was
 * deliberately rejected for cash-flow reasons, not just unbuilt yet). The
 * other two are shown as "Presto" rather than left off entirely, since a
 * working toggle that quietly only has one real option would look broken;
 * a disabled one is honest about what's actually purchasable today.
 */
export default function PricingToggle({ onChange, locale = "it" }: { onChange?: (months: number) => void; locale?: LanguageCode }) {
  const [active, setActive] = useState<number>(12);
  const labels = LANDING_DICT[locale].pricing.periodLabels;
  const PERIODS = [
    { months: 3, label: labels.threeMonths, available: false },
    { months: 6, label: labels.sixMonths, available: false },
    { months: 12, label: labels.twelveMonths, available: true },
  ] as const;

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-ink/10 bg-surface p-1 shadow-soft">
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
                ? "bg-brand-gradient text-white shadow-soft"
                : period.available
                  ? "text-muted hover:text-ink"
                  : "cursor-not-allowed text-muted/40"
            }`}
          >
            {period.label}
            {!period.available && (
              <span className="rounded-full bg-ink/5 px-1.5 py-0.5 text-[10px] font-medium text-muted">{labels.soon}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
