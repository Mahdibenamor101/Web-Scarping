/**
 * Single source of truth for the mbQr design system -- "Comanda"
 * direction (28 juillet 2026), replacing the basil/amber DESIGN.md
 * system. Grounded in the kitchen order ticket ("la comanda") rather
 * than generic trattoria imagery: cool steel-paper ground, a single
 * marigold "stamp" accent, condensed display type, monospace for every
 * number. `tailwind.config.ts` imports these raw values; components
 * import them directly for anything Tailwind classes can't express --
 * Framer Motion variants, inline gradients.
 */

export const colors = {
  ink: "#12161C",
  paper: "#EEF1F0",
  surface: "#FFFFFF",
  brand: "#E2811F",
  muted: "#5B6570",

  // Second gradient stop for `brand` (buttons, stamps) -- one hex in the
  // plan isn't a two-stop gradient by itself; darkened ~25% from brand.
  brandDark: "#A85614",
  // Lightened brand, for text/badges on the always-dark dashboard --
  // raw `brand` reads fine on paper but is a hair low-contrast on `dashBg`
  // at small sizes, same AA reasoning as the previous system.
  brandLight: "#F0952F",

  // Two more semantic colors, same "exactly three, informational only"
  // discipline as before, just re-hued: progress = denim (en cours),
  // ready = moss (prêt). `brand` doubles as "à faire" (dual-purpose:
  // marketing accent AND status, same call as the previous system for
  // the same reason -- no fourth invented hue for one status).
  progress: "#4F7396",
  progressLight: "#7EA3C8",
  ready: "#57774C",
  readyLight: "#8AB27A",
  // Fourth functional color, not in the original three-status set:
  // destructive actions (cancel an order, delete a table) are a distinct
  // meaning from "à faire" and reusing `brand` for both would blur two
  // different signals into one color. Muted brick, not alarm-red, to stay
  // inside the restrained palette.
  danger: "#B84C3E",
  dangerLight: "#D97B6C",

  // Dashboard stays its own always-dark room (not a light/dark toggle --
  // see globals.css), distinct from `ink`/`paper` which are the public
  // site's light ground.
  dashBg: "#14181E",
  dashCard: "#1C2129",
} as const;

export const gradientBrand = `linear-gradient(140deg, ${colors.brand}, ${colors.brandDark})`;

export const radius = {
  pill: "9999px",
  card: "6px",
  container: "10px",
} as const;

export const typeScale = {
  14: "14px",
  16: "16px",
  20: "20px",
  28: "28px",
  40: "40px",
  56: "56px",
} as const;

export const shadow = {
  soft: "0 20px 40px -24px rgba(18, 22, 28, 0.22)",
  softLg: "0 32px 64px -20px rgba(18, 22, 28, 0.3)",
  dark: "0 24px 48px -20px rgba(0, 0, 0, 0.5)",
} as const;

/**
 * Motion vocabulary. No parallax/scroll-linked effects (explicit choice,
 * see CONTEXT.md) -- richness comes from more reveal/stagger/hover variety
 * instead, plus the signature ticket element.
 */
export const motion = {
  hoverSeconds: 0.2,
  hoverLiftPx: 3,
  floatSeconds: 8,
  floatPx: 6,
  staggerChildrenSeconds: 0.07,
  maxStaggerChildren: 4,
  revealSeconds: 0.5,
  revealSlideUpPx: 18,
  revealViewportAmount: 0.16,
  liveDotPulseSeconds: 2,
  kpiCountSeconds: 0.8,
  // "Stamp" bump: the small scale+rotate settle used on badges/tags when
  // they first appear -- evokes an ink stamp landing, not a generic pop.
  stampSeconds: 0.28,
} as const;

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

/** Small rotation range for stamped badges/tags -- never more than a few degrees. */
export const stampRotations = [-2, 1.4, -1, 2.2, -1.6] as const;
