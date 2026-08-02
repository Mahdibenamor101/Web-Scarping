"use client";

import { useEffect, useLayoutEffect, useState } from "react";

// useLayoutEffect warns when it runs on the server; swap to useEffect there
// since SSR has no DOM to flush before paint anyway.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * SSR-safe alternative to framer-motion's useReducedMotion(). That hook
 * reads matchMedia synchronously on first render -- including the client's
 * first hydration pass -- so on a device with reduced motion actually on,
 * the client's first render already returns true while the server (no
 * matchMedia) always rendered as false. Any component branching its
 * initial variant or DOM structure on that raw value hits a genuine
 * hydration mismatch (confirmed via Playwright with reducedMotion:
 * "reduce"). This always starts at false, matching SSR, then flips to the
 * real value in a layout effect -- before the browser paints, so the
 * correction isn't perceptible -- and never during the render that gets
 * diffed against server HTML.
 */
export function useSafeReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mql.matches);
    const onChange = () => setReduceMotion(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduceMotion;
}
