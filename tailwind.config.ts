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
    },
  },
  plugins: [],
};

export default config;
