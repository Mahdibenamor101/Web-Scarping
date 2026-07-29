import type { Config } from "tailwindcss";
import { colors, radius, shadow, typeScale } from "./src/lib/design-tokens";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        display: ["var(--font-shoulders)", "var(--font-manrope)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
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
        progress: { DEFAULT: colors.progress, light: colors.progressLight },
        ready: { DEFAULT: colors.ready, light: colors.readyLight },
        danger: { DEFAULT: colors.danger, light: colors.dangerLight },
        muted: colors.muted,
        dash: {
          bg: colors.dashBg,
          card: colors.dashCard,
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
      },
      backgroundImage: {
        "brand-gradient": `linear-gradient(140deg, ${colors.brand}, ${colors.brandDark})`,
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
        // The "stamp" settle: a small overshoot rotation + scale, for
        // badges/tags landing -- distinct from the plain bump-in used
        // elsewhere (cards, list items).
        stamp: {
          "0%": { transform: "scale(0.7) rotate(-8deg)", opacity: "0" },
          "60%": { transform: "scale(1.05) rotate(2deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(var(--stamp-rotate, -2deg))", opacity: "1" },
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
        stamp: "stamp 0.28s cubic-bezier(0.2, 0.8, 0.3, 1.1)",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
