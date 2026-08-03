"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { LANDING_DICT } from "@/lib/i18n/dictionaries/landing";
import type { LanguageCode } from "@/lib/i18n/languages";

type PeriodKey = "monthly" | "quarterly" | "semiannual" | "annual";

/**
 * The whole pricing ticket -- period toggle, price, feature list, CTA, and
 * the Stripe/cards trust badge -- as one unit so the displayed price can
 * actually react to the selected period instead of the toggle being purely
 * cosmetic (which is what it was before: PricingToggle managed its own
 * active-pill state but nothing above it ever read that state back out).
 *
 * Four real prices, not three-plus-a-"Presto" placeholder: 50 €/month
 * month-to-month, stepping down to 33 €/month prepaid annually (~400 €/
 * year, the original single plan) -- exact figures from the founder, never
 * invented (see CONTEXT.md's running discipline against fabricated
 * numbers).
 */
export default function PricingCard({
  locale = "it",
  showDetailsLink = true,
}: {
  locale?: LanguageCode;
  /** Off on /prezzi itself -- a "see all details" link pointing at the
      page you're already on would be a dead-end loop. */
  showDetailsLink?: boolean;
}) {
  const t = LANDING_DICT[locale].pricing;
  const [active, setActive] = useState<PeriodKey>("annual");

  const PERIODS: { key: PeriodKey; label: string }[] = [
    { key: "monthly", label: t.periodLabels.oneMonth },
    { key: "quarterly", label: t.periodLabels.threeMonths },
    { key: "semiannual", label: t.periodLabels.sixMonths },
    { key: "annual", label: t.periodLabels.twelveMonths },
  ];
  const price = t.periods[active];

  return (
    <div>
      <div className="flex justify-center">
        <div className="inline-flex flex-wrap items-center justify-center gap-1 rounded-full border border-ink/10 bg-surface p-1 shadow-soft">
          {PERIODS.map((period) => {
            const isActive = active === period.key;
            return (
              <button
                key={period.key}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActive(period.key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition duration-200 ${
                  isActive ? "bg-brand-gradient text-white shadow-soft" : "text-muted hover:text-ink"
                }`}
              >
                {period.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="ticket mt-8 !pt-9 sm:p-8 sm:!pt-10">
        <div className="flex flex-wrap items-baseline justify-center gap-2">
          <span className="font-mono text-4xl font-extrabold tabular-nums text-ink">{price.price}</span>
          <span className="text-sm text-muted">{price.suffix}</span>
        </div>
        <p className="mt-2 text-center text-sm text-muted">{t.trialNote}</p>
        <ul className="mx-auto mt-6 flex max-w-sm flex-col gap-2.5">
          {t.features.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-ink/80">
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link href="/signup" className="btn-primary px-6 py-3 text-base">
            {t.ctaPrimary}
          </Link>
          {showDetailsLink && (
            <Link href="/prezzi" className="nav-link text-sm">
              {t.ctaSecondary}
            </Link>
          )}
        </div>
        <div className="mt-6 flex justify-center">
          <Image
            src="/badges/powered-by-stripe.png"
            alt="Pagamenti protetti, Powered by Stripe — Visa, Mastercard, American Express"
            width={286}
            height={85}
            className="h-auto w-56"
          />
        </div>
      </div>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}>
      <path d="M4 12l6 6L20 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
