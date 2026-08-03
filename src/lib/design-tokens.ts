/**
 * Single source of truth for the mbQr design system -- "Oriental Luxury"
 * direction (3 août 2026), replacing "Liquid Glass". Founder's brief: a
 * traditional Arab/Moorish architectural and decorative language (deep
 * emerald, gold accents, ivory ground, geometric star lattices, ogive
 * arches) read through a modern lens -- "five-star hotel in Marrakech/
 * Dubai," not a literal historical pastiche. Explicitly LTR: the site's
 * content is Italian, not Arabic (the founder's own brief made RTL
 * conditional on Arabic content, which doesn't exist here) -- this is a
 * visual/material language borrowed independent of script direction, the
 * same way a European hotel can furnish a room in Moroccan style without
 * its signage going RTL. `tailwind.config.ts` imports these raw values;
 * components import them directly for anything Tailwind classes can't
 * express -- Framer Motion variants, inline gradients, the geometric
 * pattern components.
 */

export const colors = {
  // Deep emerald-tinted charcoal rather than pure black -- warmer, sits
  // better against the ivory ground than a cold near-black would.
  ink: "#1E2A26",
  // Ivory/cream, not white -- the traditional ground tone this whole
  // palette is built around.
  paper: "#FAF6EE",
  surface: "#FFFFFF",
  // Deep emerald/teal, replacing the previous marigold -- the brief's
  // primary color, standing in for the old `brand` everywhere that token
  // is already used (buttons, badges, gradients, nav underline...).
  brand: "#0F6E6E",
  // Warm bronze-gray secondary text -- neutral but not cold, keeps the
  // ivory/emerald/gold palette coherent even in body copy.
  muted: "#6B6259",

  brandDark: "#0B5252",
  brandLight: "#1B7A7A",

  // Gold/bronze accent -- CTAs, borders, icon rims, the geometric
  // watermark pattern. Distinct role from `brand`: never a background
  // fill on its own, always a border/line/accent, per the brief.
  gold: "#C9A227",
  goldDark: "#A9841C",
  goldLight: "#D4AF37",

  // Status colors intentionally untouched by this pass: they carry
  // operational meaning on the live orders board (§12.3 "informational,
  // never decorative"), not brand identity -- restyling them alongside
  // the accent would risk `ready` (green) reading as a variant of the
  // new emerald `brand` instead of a distinct status.
  progress: "#0A84FF",
  progressLight: "#5AC8FA",
  ready: "#30D158",
  readyLight: "#63E6A0",
  danger: "#FF3B30",
  dangerLight: "#FF6961",

  // Dashboard's always-dark room, now emerald-black rather than neutral
  // black -- coherent with the rest of the palette while staying dark
  // enough to read as its own OLED-friendly ground.
  dashBg: "#0A1715",
  dashCard: "#153029",

  // Glass fills -- gold-tinted borders are the main carrier of "bordures
  // dorées sur les cards" from the brief: every `.card`/`.btn-secondary`/
  // `.oauth-btn` that already borrows `glassLightBorder`/`glassDarkBorder`
  // picks up a gold rim for free, no per-component edits needed.
  glassLight: "rgba(255, 253, 246, 0.62)",
  glassLightBorder: "rgba(201, 162, 39, 0.35)",
  glassDark: "rgba(212, 175, 55, 0.07)",
  glassDarkBorder: "rgba(212, 175, 55, 0.18)",
} as const;

export const gradientBrand = `linear-gradient(140deg, ${colors.brand}, ${colors.brandDark})`;
export const gradientGold = `linear-gradient(140deg, ${colors.goldLight}, ${colors.gold})`;

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
  // "Ombres douces dorées" from the brief -- reserved for the handful of
  // elements meant to read as important (primary CTA, the pricing card),
  // not a blanket replacement for `soft`.
  gold: "0 10px 32px -10px rgba(201, 162, 39, 0.45)",
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
