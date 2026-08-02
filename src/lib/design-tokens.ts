/**
 * Single source of truth for the mbQr design system -- "Liquid Glass"
 * direction (2 août 2026), replacing the "Comanda" ticket system. Grounded
 * in Apple's current software material language (iOS 26 / iPhone 17 Pro
 * era): translucent glass surfaces over a light or true-black ground,
 * generous continuous-feeling corners, soft diffuse elevation instead of
 * hard drop shadows, one system typeface at varying weight rather than a
 * mix of display/mono families. The brand's own marigold accent is kept
 * (real identity, tied to the logo and months of marketing work) --
 * "Apple-style" describes the *material*, not a hue swap to Apple's own
 * system blue. `tailwind.config.ts` imports these raw values; components
 * import them directly for anything Tailwind classes can't express --
 * Framer Motion variants, inline gradients.
 */

export const colors = {
  // Apple's own text/background pair from apple.com and iOS's light
  // mode -- #1D1D1F reads as near-black without the harshness of pure
  // #000, #F5F5F7 is the classic "systemGroupedBackground" light gray.
  ink: "#1D1D1F",
  paper: "#F5F5F7",
  surface: "#FFFFFF",
  brand: "#E2811F",
  // Apple's secondary-label gray (#6E6E73), not a hand-picked tone.
  muted: "#6E6E73",

  // Second gradient stop for `brand` (buttons) -- one hex in the plan
  // isn't a two-stop gradient by itself; darkened ~25% from brand.
  brandDark: "#A85614",
  // Lightened brand, for text/badges on the always-dark dashboard --
  // raw `brand` reads fine on paper but is a hair low-contrast on
  // `dashBg` at small sizes, same AA reasoning as the previous system.
  brandLight: "#F0952F",

  // Three status colors, mapped onto iOS's own systemBlue/systemGreen so
  // the "en cours"/"prêt" language reads as native as the material
  // around it, not just a reskinned version of the previous denim/moss
  // pair. `brand` still doubles as "à faire" (dual-purpose: marketing
  // accent AND status, same call as before, no fourth invented hue for
  // one status).
  progress: "#0A84FF",
  progressLight: "#5AC8FA",
  ready: "#30D158",
  readyLight: "#63E6A0",
  // Fourth functional color, not in the original three-status set:
  // destructive actions (cancel an order, delete a table) are a distinct
  // meaning from "à faire" -- iOS systemRed, same reasoning.
  danger: "#FF3B30",
  dangerLight: "#FF6961",

  // Dashboard stays its own always-dark room (not a light/dark toggle),
  // now true black rather than a dark slate -- the OLED "Space Black"
  // ground Liquid Glass cards are designed to float over. `dashCard` is
  // no longer an opaque fill: real cards use `glassDark`/`glassDarkBorder`
  // below with backdrop-blur; `dashCard` is kept only for the rare
  // non-glass solid surface (e.g. an opaque modal backdrop).
  dashBg: "#000000",
  dashCard: "#1C1C1E",

  // Glass fills -- translucent, meant to sit on top of a blurred
  // backdrop-filter layer, not used as a flat color on its own. Light
  // glass for the public site/marketing surface (over `paper`), dark
  // glass for the dashboard (over `dashBg`).
  glassLight: "rgba(255, 255, 255, 0.6)",
  glassLightBorder: "rgba(255, 255, 255, 0.7)",
  glassDark: "rgba(255, 255, 255, 0.07)",
  glassDarkBorder: "rgba(255, 255, 255, 0.14)",
} as const;

export const gradientBrand = `linear-gradient(140deg, ${colors.brand}, ${colors.brandDark})`;

export const radius = {
  pill: "9999px",
  // Generous, continuous-feeling corners -- iOS cards/sheets sit in the
  // 20-32px range, a deliberate step up from the previous system's tight
  // 6-10px ticket-inspired radii.
  card: "22px",
  container: "32px",
} as const;

export const typeScale = {
  14: "14px",
  16: "16px",
  20: "20px",
  28: "28px",
  40: "40px",
  56: "56px",
} as const;

// Soft, diffuse elevation -- the backdrop-blur glass fill does most of
// the "floating" work, these shadows are a low-opacity assist rather
// than the harder ink-tinted drop shadows of the previous system.
export const shadow = {
  soft: "0 8px 30px -10px rgba(0, 0, 0, 0.12)",
  softLg: "0 24px 60px -16px rgba(0, 0, 0, 0.18)",
  dark: "0 24px 60px -16px rgba(0, 0, 0, 0.6)",
} as const;

/**
 * Motion vocabulary. No parallax/scroll-linked effects (explicit choice,
 * see CONTEXT.md) -- richness comes from more reveal/stagger/hover variety
 * instead.
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
