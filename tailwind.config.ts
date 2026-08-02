import type { Config } from "tailwindcss";
import { colors, radius, shadow, typeScale } from "./src/lib/design-tokens";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      // One system typeface, not a mix of display/mono families -- the
      // Apple system-font stack renders as San Francisco on Apple
      // hardware and a clean native fallback everywhere else, exactly
      // how apple.com itself sets type. `display` and `mono` keep their
      // class names (font-display/font-mono are already used in ~70
      // places across the app) but now resolve to the same stack: San
      // Francisco differentiates by weight/optical size, not by family,
      // so no per-callsite edits were needed to adopt this. `mono`
      // additionally gets tabular figures via a small rule in
      // globals.css (.font-mono), standing in for what a monospace
      // face used to do for prices/timestamps.
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "SF Pro Display",
          "var(--font-manrope)",
          "system-ui",
          "sans-serif",
        ],
        display: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "var(--font-manrope)",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "var(--font-manrope)",
          "system-ui",
          "sans-serif",
        ],
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
