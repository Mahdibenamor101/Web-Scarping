"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { revealVariants, staggerContainerVariants, motion as motionTokens } from "@/lib/design-tokens";
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion";

/**
 * Fades + slides a section in once it scrolls into view (once, not on
 * scroll-back). Exact spec (DESIGN.md): opacity 0->1, translateY 16px->0,
 * 500ms ease-out, triggered at 15% visibility. Respects
 * prefers-reduced-motion -- content renders visible immediately instead
 * of animating in, per DESIGN.md's non-negotiable rule.
 */
export default function Reveal({
  children,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
}) {
  const MotionTag = as === "section" ? motion.section : motion.div;
  const reduceMotion = useSafeReducedMotion();
  return (
    <MotionTag
      className={className}
      initial={reduceMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: motionTokens.revealViewportAmount }}
      variants={revealVariants}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Wraps a group of children so they reveal with a 60ms cascade, one after
 * another. DESIGN.md caps this at 4 elements -- callers are responsible
 * for keeping stagger groups that short (current usage: 3-4 items each).
 */
export function StaggerGroup({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduceMotion = useSafeReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: motionTokens.revealViewportAmount }}
      variants={staggerContainerVariants}
    >
      {children}
    </motion.div>
  );
}

/** A single staggered child -- use inside <StaggerGroup>, not on its own. */
export function StaggerItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={revealVariants}>
      {children}
    </motion.div>
  );
}
