import type { Config } from "tailwindcss";
import { colors, radius, shadow, typeScale } from "./src/lib/design-tokens";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      // "Oriental Luxury" direction: an elegant serif for headings
      // (Playfair Display -- the brief's own suggested Latin equivalent
      // to Amiri/Reem Kufi for a site whose actual content is Italian,
      // not Arabic) over a clean, warm sans for everything else
      // (Poppins, the brief's suggested Latin equivalent to Cairo/
      // Tajawal). `mono` keeps tabular figures via globals.css
      // (.font-mono) but otherwise reads as Poppins like the rest of
      // the body text -- prices/timestamps don't need a separate face,
      // just alignment.
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
        mono: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      fontSize: {
        14: typeScale[14],
        16: typeScale[16],
        20: typeScale[20],
        28: typeScale[28],
        40: typeScale[40],
        56: typeScale[56],
        72: "72px",
      },
      colors: {
        paper: colors.paper,
        ink: colors.ink,
        surface: colors.surface,
        brand: {
          DEFAULT: colors.brand,
          dark: colors.brandDark,
          light: colors.brandLight,
        },
        gold: {
          DEFAULT: colors.gold,
          dark: colors.goldDark,
          light: colors.goldLight,
        },
        progress: { DEFAULT: colors.progress, light: colors.progressLight },
        ready: { DEFAULT: colors.ready, light: colors.readyLight },
        danger: { DEFAULT: colors.danger, light: colors.dangerLight },
        muted: colors.muted,
        dash: {
          bg: colors.dashBg,
          card: colors.dashCard,
        },
        glass: {
          light: colors.glassLight,
          "light-border": colors.glassLightBorder,
          dark: colors.glassDark,
          "dark-border": colors.glassDarkBorder,
        },
      },
      borderRadius: {
        card: radius.card,
        container: radius.container,
      },
      boxShadow: {
        soft: shadow.soft,
        softLg: shadow.softLg,
        dark: shadow.dark,
        gold: shadow.gold,
      },
      backgroundImage: {
        "brand-gradient": `linear-gradient(140deg, ${colors.brand}, ${colors.brandDark})`,
        "gold-gradient": `linear-gradient(140deg, ${colors.goldLight}, ${colors.gold})`,
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(-6px)" },
          "50%": { transform: "translateY(6px)" },
        },
        "bump-in": {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        "float-delayed": "float 8s ease-in-out 2s infinite",
        "bump-in": "bump-in 0.2s ease-out",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
