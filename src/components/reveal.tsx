"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { revealVariants, staggerContainerVariants } from "@/lib/design-tokens";

/** Fades + slides a section in once it scrolls into view (once, not on scroll-back). */
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
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={revealVariants}
    >
      {children}
    </MotionTag>
  );
}

/** Wraps a group of children so they reveal with a stagger, one after another. */
export function StaggerGroup({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
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
