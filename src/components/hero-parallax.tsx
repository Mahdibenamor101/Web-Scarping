"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Hero content recedes (fades, scales down slightly, drifts up) as the
 * page scrolls past it -- the "the hero doesn't just sit there, it
 * reacts to scroll" pattern from apple.com product pages. Scroll-linked
 * (not viewport-triggered like Reveal), so it's continuous rather than
 * a one-shot animation -- reserved for the hero only, since having every
 * section scroll-jack the page at once would fight the reader instead
 * of guiding them.
 */
export default function HeroParallax({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.15]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <motion.div ref={ref} style={{ opacity, scale, y }}>
      {children}
    </motion.div>
  );
}
