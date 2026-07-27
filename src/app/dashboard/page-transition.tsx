"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

/** Fades + rises new dashboard content in on every navigation, instead of a hard cut. */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
