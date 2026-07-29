type Variant = "todo" | "progress" | "ready";

const VARIANT_CLASS: Record<Variant, string> = {
  todo: "badge-todo",
  progress: "badge-progress",
  ready: "badge-ready",
};

const VARIANT_CLASS_DASH: Record<Variant, string> = {
  todo: "badge-todo-dash",
  progress: "badge-progress-dash",
  ready: "badge-ready-dash",
};

/**
 * Stamped status badge ("Comanda" direction, see CONTEXT.md). Exactly
 * three variants, strict semantic coding: todo=brand/marigold "à faire"
 * (brand doubles as the marketing accent), progress=denim "en cours",
 * ready=moss "prêt" -- also covers "live", so a real-time indicator is
 * `variant="ready" pulse`. The pulsing dot is reserved for that one case
 * ("un point qui pulse = flux temps réel actif, nulle part ailleurs") --
 * never attach `pulse` to an ordinary status badge.
 */
export default function Badge({
  variant,
  pulse = false,
  dash = false,
  children,
}: {
  variant: Variant;
  pulse?: boolean;
  dash?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span className={dash ? VARIANT_CLASS_DASH[variant] : VARIANT_CLASS[variant]}>
      {pulse && <span className="badge-dot-live" />}
      {children}
    </span>
  );
}
