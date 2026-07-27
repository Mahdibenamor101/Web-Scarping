/**
 * Single source of truth for the mbQr design system. `tailwind.config.ts`
 * imports the raw values (Tailwind needs static color/keyframe objects);
 * components import the same constants directly for anything Tailwind
 * classes can't express -- Framer Motion variants, inline gradients, SVG
 * fills. Change a value here and both follow.
 */

export const colors = {
  // Marketing pages (landing, auth, public menu): light, near-white.
  background: "#FAFBFC",
  ink: "#0B1220",
  accent: "#2196F3",
  accentDark: "#0D8BF0",

  // Dashboard only: dark mode, deliberately distinct from the marketing
  // site so the operator surface and the sales surface don't look like
  // the same screen with the lights off.
  dashboardBg: "#0F1420",
  dashboardCard: "#1A2035",

  badge: {
    success: { bg: "#DCFCE7", text: "#15803D", dot: "#22C55E" },
    warning: { bg: "#FFEDD5", text: "#C2410C", dot: "#F97316" },
    live: { bg: "#FEE2E2", text: "#DC2626", dot: "#EF4444" },
  },
} as const;

export const gradientAccent = `linear-gradient(135deg, ${colors.accent}, ${colors.accentDark})`;

export const radius = {
  pill: "9999px",
  card: "18px",
} as const;

export const shadow = {
  // Diffuse, accent-tinted -- not neutral gray -- per the "ombres très
  // douces et diffuses" spec.
  soft: "0 24px 48px -24px rgba(33, 150, 243, 0.28)",
  softLg: "0 32px 64px -20px rgba(33, 150, 243, 0.32)",
  dark: "0 24px 48px -20px rgba(0, 0, 0, 0.55)",
} as const;

export const motion = {
  hoverSeconds: 0.2,
  floatSeconds: 4,
  staggerChildren: 0.08,
  slideUpPx: 30,
  liftPx: 4,
  hoverScale: 1.03,
} as const;

/** Framer Motion variants shared by every scroll-reveal section. */
export const revealVariants = {
  hidden: { opacity: 0, y: motion.slideUpPx },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export const staggerContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: motion.staggerChildren },
  },
};
