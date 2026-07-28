import type { Config } from "tailwindcss";
import { colors, radius, shadow, typeScale } from "./src/lib/design-tokens";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-bricolage)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        14: typeScale[14],
        16: typeScale[16],
        20: typeScale[20],
        28: typeScale[28],
        40: typeScale[40],
        56: typeScale[56],
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
        signal: colors.signal,
        progress: colors.progress,
        muted: colors.muted,
        dash: {
          bg: colors.ink,
          card: colors.dashboardCard,
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
        "brand-gradient": `linear-gradient(135deg, ${colors.brand}, ${colors.brandDark})`,
      },
      keyframes: {
        // Symmetric +-6px oscillation over 8s, per DESIGN.md's floating-card spec.
        float: {
          "0%, 100%": { transform: "translateY(-6px)" },
          "50%": { transform: "translateY(6px)" },
        },
        "bump-in": {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        // Opacity pulse, 2s -- reserved for the live/real-time indicator dot only.
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
