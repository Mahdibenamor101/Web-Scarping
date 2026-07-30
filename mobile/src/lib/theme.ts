// Ported from the web app's src/lib/design-tokens.ts ("Comanda" direction,
// see CONTEXT.md) -- same hex values, same semantic roles. Typography
// uses system fonts rather than the web app's exact custom faces (Big
// Shoulders Display / Manrope / JetBrains Mono): pulling those in via
// @expo-google-fonts hit a peer-dependency conflict from expo-router's
// own web-only dependencies in this Expo SDK version, not worth forcing
// with --legacy-peer-deps for a font swap. `fontWeight: "800"` + a
// condensed system face gets close for headings; the real fonts are a
// follow-up once that conflict is resolved upstream, see mobile/README.md.
export const colors = {
  ink: "#12161C",
  paper: "#EEF1F0",
  surface: "#FFFFFF",
  brand: "#E2811F",
  brandDark: "#A85614",
  brandLight: "#F0952F",
  muted: "#5B6570",
  progress: "#4F7396",
  progressLight: "#7EA3C8",
  ready: "#57774C",
  readyLight: "#8AB27A",
  danger: "#B84C3E",
  dangerLight: "#D97B6C",
  dashBg: "#14181E",
  dashCard: "#1C2129",
  white10: "rgba(255,255,255,0.08)",
  white15: "rgba(255,255,255,0.15)",
  white40: "rgba(255,255,255,0.4)",
  white70: "rgba(255,255,255,0.7)",
} as const;

export const radius = { card: 6, container: 10, pill: 999 } as const;

export const font = {
  display: { fontWeight: "800" as const, fontFamily: "System", letterSpacing: -0.5 },
  mono: { fontFamily: "Courier" as const },
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
