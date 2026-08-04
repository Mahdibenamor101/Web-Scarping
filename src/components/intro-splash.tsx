"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useLayoutEffect, useState } from "react";
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion";

// SSR has no DOM to flush before paint -- same swap as use-safe-reduced-motion.ts.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Once per browser tab (sessionStorage, not localStorage): a first-time
// visitor sees the intro once, but it doesn't replay on every internal
// link click or page refresh within the same visit. A fresh tab/session
// sees it again.
const SESSION_KEY = "tavolino-intro-seen";

/**
 * Full-screen intro splash for the landing page only (mounted in
 * src/app/page.tsx, not the root layout -- dashboard/auth/menu pages never
 * show it). Renders nothing during SSR and the first client render (same
 * hydration-safe pattern as useSafeReducedMotion: always starts false,
 * flips in a layout effect before paint) to avoid a hydration mismatch and
 * to skip entirely under prefers-reduced-motion, per this app's
 * non-negotiable reduced-motion rule (see reveal.tsx).
 */
export default function IntroSplash() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useSafeReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, "1");
    setVisible(true);
  }, []);

  if (reduceMotion) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-paper"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <motion.span
            className="font-display text-6xl font-normal tracking-wide text-gold-dark sm:text-8xl"
            initial={{ opacity: 0, scale: 0.72 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => {
              window.setTimeout(() => setVisible(false), 550);
            }}
          >
            Tavolino
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
