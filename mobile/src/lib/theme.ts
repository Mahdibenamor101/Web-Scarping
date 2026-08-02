// Ported from the web app's src/lib/design-tokens.ts -- "Liquid Glass"
// direction (2 août 2026), same hex values/semantic roles as the web
// system. Typography stays on the platform system font (San Francisco
// on iOS, Roboto on Android) via React Native's "System" family, which
// is actually a closer match to the Apple-glass intent than the web
// app's own -apple-system CSS stack: on-device this *is* real SF Pro,
// no web-font substitution needed.
export const colors = {
  ink: "#1D1D1F",
  paper: "#F5F5F7",
  surface: "#FFFFFF",
  brand: "#E2811F",
  brandDark: "#A85614",
  brandLight: "#F0952F",
  muted: "#6E6E73",
  progress: "#0A84FF",
  progressLight: "#5AC8FA",
  ready: "#30D158",
  readyLight: "#63E6A0",
  danger: "#FF3B30",
  dangerLight: "#FF6961",
  // True black, not a dark slate -- the ground Liquid Glass cards float
  // over via BlurView (see components/ui.tsx), same as the web dashboard.
  dashBg: "#000000",
  dashCard: "#1C1C1E",
  white10: "rgba(255,255,255,0.08)",
  white15: "rgba(255,255,255,0.15)",
  white40: "rgba(255,255,255,0.4)",
  white70: "rgba(255,255,255,0.7)",
} as const;

// Generous, continuous-feeling corners -- iOS cards/sheets sit in the
// 20-32px range, a deliberate step up from the previous system's tight
// 6-10px ticket-inspired radii.
export const radius = { card: 22, container: 32, pill: 999 } as const;

export const font = {
  display: { fontWeight: "800" as const, fontFamily: "System", letterSpacing: -0.5 },
  // Numbers keep tabular alignment on the system font rather than a
  // separate monospace face -- iOS's own San Francisco does this too.
  mono: { fontFamily: "System" as const, fontVariant: ["tabular-nums" as const] },
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
