import type { Config } from "tailwindcss";
import { colors, radius, shadow } from "./src/lib/design-tokens";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        canvas: colors.background,
        ink: colors.ink,
        accent: {
          DEFAULT: colors.accent,
          dark: colors.accentDark,
        },
        dash: {
          bg: colors.dashboardBg,
          card: colors.dashboardCard,
        },
        success: colors.badge.success,
        warning: colors.badge.warning,
        live: colors.badge.live,
      },
      borderRadius: {
        card: radius.card,
      },
      boxShadow: {
        soft: shadow.soft,
        softLg: shadow.softLg,
        dark: shadow.dark,
      },
      backgroundImage: {
        "accent-gradient": `linear-gradient(135deg, ${colors.accent}, ${colors.accentDark})`,
      },
      keyframes: {
        // Symmetric +-10px oscillation, not a 0-to-N bounce.
        float: {
          "0%, 100%": { transform: "translateY(-10px)" },
          "50%": { transform: "translateY(10px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(-8px) rotate(-1deg)" },
          "50%": { transform: "translateY(8px) rotate(1deg)" },
        },
        "bump-in": {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.85)" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "float-delayed": "float 4s ease-in-out 1.3s infinite",
        "float-slow": "float-slow 5.5s ease-in-out infinite",
        "float-slow-delayed": "float-slow 5.5s ease-in-out 0.8s infinite",
        "bump-in": "bump-in 0.2s ease-out",
        "pulse-dot": "pulse-dot 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
