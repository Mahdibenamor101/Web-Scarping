"use client";

/**
 * The signature element (DESIGN.md: "le seul endroit où l'on dépense de
 * l'audace"). A single order card that loops every ~6s: slides in amber
 * "da fare" with a running timer, flips to basil "pronto", slides out,
 * then a new order takes its place. Silent, continuous, isolated to the
 * hero -- nothing else in the app loops like this.
 *
 * DESIGN.md prescribes the ~6s cadence but not the internal split; the
 * 3s/2s/1s breakdown below (fare / pronto / gap) is a documented choice,
 * not a hidden invented value.
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion";

const TODO_MS = 3000;
const READY_MS = 2000;
const GAP_MS = 1000;
// Slide/scale transition for the card itself entering and leaving --
// DESIGN.md doesn't prescribe this one, only the ~6s cadence above.
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
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.96 }}
          transition={{ duration: reduceMotion ? 0 : TRANSITION_SECONDS, ease: "easeOut" }}
        >
          <CardShell phase={phase} seconds={seconds} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CardShell({ phase, seconds }: { phase: "todo" | "ready"; seconds: number }) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return (
    <div
      className={`card-static flex w-48 items-center gap-3 !p-3.5 border-l-[3px] ${
        phase === "todo" ? "border-signal" : "border-brand"
      }`}
    >
      <div className="flex-1">
        <p className="text-[11px] font-semibold text-ink">{ORDER.table}</p>
        <p className="text-[10px] text-muted">
          {ORDER.items} piatti · {ORDER.total}
        </p>
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
