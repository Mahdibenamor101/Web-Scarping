/**
 * Single source of truth for the mbQr design system, per DESIGN.md.
 * `tailwind.config.ts` imports the raw values (Tailwind needs static
 * color/keyframe objects); components import the same constants directly
 * for anything Tailwind classes can't express -- Framer Motion variants,
 * inline gradients, SVG fills. Change a value here (and in DESIGN.md) and
 * every consumer follows.
 */

export const colors = {
  ink: "#0E1418",
  paper: "#F6F7F5",
  surface: "#FFFFFF",
  brand: "#1E6F52",
  signal: "#E8873A",
  progress: "#4A7FB5",
  muted: "#6B7580",

  // Not in DESIGN.md's token table -- derived, same hue family, documented
  // here rather than invented silently. DESIGN.md gives `ink` for dark
  // section backgrounds but no second, lighter dark tone for cards sitting
  // on top of it (the dashboard always being dark needs that contrast).
  dashboardCard: "#171F26",
  // Second stop for the brand gradient (buttons, signature card) -- DESIGN.md
  // gives one brand value, not a two-stop gradient; darkened ~15% from brand.
  brandDark: "#17593F",
  // Lightened brand, for text/dots on the dark dashboard only. DESIGN.md's
  // own "contraste AA minimum" rule can't be met by the literal `brand`
  // value (#1E6F52, a dark saturated green) against `ink` (#0E1418, near
  // black) -- both are dark, so text in raw `brand` would be nearly
  // unreadable there. `signal` and `progress` don't have this problem
  // (both light enough to read on ink directly).
  brandLight: "#4FA980",
} as const;

export const gradientBrand = `linear-gradient(135deg, ${colors.brand}, ${colors.brandDark})`;

export const radius = {
  pill: "9999px",
  card: "16px",
  container: "24px",
} as const;

/** 14 / 16 / 20 / 28 / 40 / 56 -- DESIGN.md's type scale, no in-between sizes. */
export const typeScale = {
  14: "14px",
  16: "16px",
  20: "20px",
  28: "28px",
  40: "40px",
  56: "56px",
} as const;

export const shadow = {
  soft: "0 24px 48px -24px rgba(14, 20, 24, 0.18)",
  softLg: "0 32px 64px -20px rgba(14, 20, 24, 0.24)",
  dark: "0 24px 48px -20px rgba(0, 0, 0, 0.5)",
} as const;

/** Exact motion spec from DESIGN.md -- nothing here is improvised. */
export const motion = {
  hoverSeconds: 0.2,
  hoverLiftPx: 2,
  floatSeconds: 8,
  floatPx: 6,
  staggerChildrenSeconds: 0.06,
  maxStaggerChildren: 4,
  revealSeconds: 0.5,
  revealSlideUpPx: 16,
  revealViewportAmount: 0.15,
  liveDotPulseSeconds: 2,
  kpiCountSeconds: 0.8,
} as const;

/** Scroll-reveal variants: opacity 0->1, translateY 16px->0, 500ms ease-out, once. */
export const revealVariants = {
  hidden: { opacity: 0, y: motion.revealSlideUpPx },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motion.revealSeconds, ease: "easeOut" as const },
  },
};

export const staggerContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: motion.staggerChildrenSeconds },
  },
};
