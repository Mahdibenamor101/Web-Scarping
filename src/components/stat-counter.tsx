"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { motion as motionTokens } from "@/lib/design-tokens";

/** Counts up from 0 to `value` over 800ms once it scrolls into view (DESIGN.md). */
export default function StatCounter({
  value,
  prefix = "",
  suffix = "",
  durationSeconds = motionTokens.kpiCountSeconds,
  className = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  durationSeconds?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: durationSeconds,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, durationSeconds, reduceMotion]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
