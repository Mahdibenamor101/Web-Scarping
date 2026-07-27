/**
 * Pulsing placeholder block for first-load states, so a page shows
 * "loading" rather than briefly flashing an empty state (e.g. "Aucune
 * table pour l'instant") before the real fetch resolves. `tone="dash"`
 * for the dark dashboard, default for light marketing/public pages.
 */
export default function Skeleton({
  className = "",
  tone = "dash",
}: {
  className?: string;
  tone?: "dash" | "light";
}) {
  return (
    <div
      className={`animate-pulse rounded-lg ${tone === "dash" ? "bg-white/[0.06]" : "bg-slate-200"} ${className}`}
    />
  );
}
