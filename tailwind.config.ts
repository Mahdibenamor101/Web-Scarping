import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Dark navy for hero/sidebar surfaces -- not one of Tailwind's
        // stock scales, kept minimal (just the two shades actually used).
        navy: {
          DEFAULT: "#0d1b3e",
          light: "#16264f",
        },
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "bump-in": {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        "float-delayed": "float 7s ease-in-out 2s infinite",
        "bump-in": "bump-in 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
