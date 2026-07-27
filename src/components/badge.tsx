type Variant = "success" | "warning" | "live";

const VARIANT_CLASS: Record<Variant, string> = {
  success: "badge-success",
  warning: "badge-warning",
  live: "badge-live",
};

/** Pastel pill badge. `variant="live"` gets a pulsing dot (e.g. "EN DIRECT"). */
export default function Badge({ variant, children }: { variant: Variant; children: React.ReactNode }) {
  return (
    <span className={VARIANT_CLASS[variant]}>
      {variant === "live" && <span className="badge-dot-live" />}
      {children}
    </span>
  );
}
