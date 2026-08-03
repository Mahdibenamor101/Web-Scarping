"use client";

/**
 * The signature element ("Comanda" direction, see CONTEXT.md: "le seul
 * endroit où l'on dépense de l'audace"). A single order ticket that loops
 * every ~6s: slides in marigold "da fare" with a running timer, flips to
 * moss "pronto", slides out, then a new order takes its place. Silent,
 * continuous, isolated to the hero -- nothing else in the app loops like
 * this. Styled as a literal comanda (torn-ticket top edge, stamped
 * status), not a generic notification card.
 *
 * The ~6s cadence isn't further specified; the 3s/2s/1s breakdown below
 * (fare / pronto / gap) is a documented choice, not a hidden invented value.
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion";

const TODO_MS = 3000;
const READY_MS = 2000;
const GAP_MS = 1000;
// Slide/scale transition for the card itself entering and leaving --
// not part of the ~6s cadence above, just the UI chrome around it.
const TRANSITION_SECONDS = 0.5;

const ORDER = { table: "Tavolo 4", items: 3, total: "25,50 €" };

export default function LiveOrderCard() {
  // SSR-safe: this is guaranteed false on the render that hydration checks
  // against the server, so it can't cause a structural/style mismatch --
  // see src/lib/use-safe-reduced-motion.ts for why the framer-motion
  // hook directly can't be used the way this component needs it.
  const reduceMotion = useSafeReducedMotion();
  const [phase, setPhase] = useState<"todo" | "ready" | "hidden">("todo");
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setPhase("ready");
      setSeconds(0);
      return;
    }
    let cancelled = false;
    let stepTimer: ReturnType<typeof setTimeout>;
    let tickTimer: ReturnType<typeof setInterval>;

    function loop() {
      setPhase("todo");
      setSeconds(0);
      let tick = 0;
      tickTimer = setInterval(() => {
        tick += 1;
        setSeconds(tick);
      }, 1000);

      stepTimer = setTimeout(() => {
        clearInterval(tickTimer);
        if (cancelled) return;
        setPhase("ready");
        stepTimer = setTimeout(() => {
          if (cancelled) return;
          setPhase("hidden");
          stepTimer = setTimeout(() => {
            if (!cancelled) loop();
          }, GAP_MS);
        }, READY_MS);
      }, TODO_MS);
    }

    loop();
    return () => {
      cancelled = true;
      clearTimeout(stepTimer);
      clearInterval(tickTimer);
    };
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {phase !== "hidden" && (
        <motion.div
          key="live-order-card"
          initial={{ opacity: 0, y: 20, scale: 0.94, rotate: -3 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: -1.5 }}
          exit={{ opacity: 0, x: 24, scale: 0.94, rotate: 3 }}
          transition={{ duration: reduceMotion ? 0 : TRANSITION_SECONDS, ease: "easeOut" }}
        >
          <CardShell phase={phase} seconds={seconds} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// A push-notification card, not a ticket: bold circular icon + a title
// line reads at a glance the way a real phone notification does, closer
// to the reference pulled up during the redesign (design/refs/
// qonnectqr-hero-mobile.jpg) than the previous thin text-only ticket.
function CardShell({ phase, seconds }: { phase: "todo" | "ready"; seconds: number }) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return (
    <div className="card flex w-48 items-start gap-3 !p-3 sm:w-56">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white shadow-soft">
        <BellIcon />
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="font-mono text-[9px] font-semibold uppercase tracking-wide text-muted">mbQr · ora</p>
        <p className="mt-0.5 font-display text-[14px] font-extrabold leading-tight text-ink">Nuovo ordine</p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="rounded-full bg-paper px-2 py-0.5 font-mono text-[9px] font-semibold text-ink/70">
            {ORDER.table}
          </span>
          <span className="rounded-full bg-paper px-2 py-0.5 font-mono text-[9px] font-semibold text-ink/70">
            {ORDER.items} piatti
          </span>
        </div>
      </div>
      {phase === "todo" ? (
        <span className="badge-todo shrink-0 tabular-nums">
          {mm}:{ss}
        </span>
      ) : (
        <span className="badge-ready shrink-0">Pronto</span>
      )}
    </div>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 8a6 6 0 1112 0c0 4 1.5 5.5 2 6.5H4c.5-1 2-2.5 2-6.5z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 19a2 2 0 004 0" strokeLinecap="round" />
    </svg>
  );
}
