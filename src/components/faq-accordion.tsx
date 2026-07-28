"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion";

export type FaqItem = { question: string; answer: string };

// Expand/collapse duration isn't in DESIGN.md's motion table (that one
// covers reveal/stagger/float/pulse/KPI/hover only) -- this is UI chrome,
// same category as the confirm dialog's own timing.
const TRANSITION_SECONDS = 0.2;

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduceMotion = useSafeReducedMotion();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-3">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.question} className="overflow-hidden rounded-card border border-ink/[0.06] bg-surface shadow-soft">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={open}
            >
              <span className="text-sm font-semibold text-ink">{item.question}</span>
              <span
                className={`shrink-0 text-brand transition-transform duration-200 ${open ? "rotate-45" : ""}`}
                aria-hidden="true"
              >
                <PlusIcon />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : TRANSITION_SECONDS, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-sm text-muted">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}
