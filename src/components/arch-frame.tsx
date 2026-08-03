import { useId } from "react";

/**
 * Decorative ogive (pointed Moorish arch) outline, gold-to-emerald
 * gradient stroke -- sits behind the hero's HeroMockup as the "arc ou
 * ogive comme élément de design autour de l'image principale" from the
 * brief. A drawn silhouette, not a literal architectural rendering:
 * same "vignette, not a screenshot" spirit as HeroMockup itself.
 */
export default function ArchFrame({ className = "" }: { className?: string }) {
  const gradientId = `arch-gradient-${useId()}`;
  return (
    <svg viewBox="0 0 400 480" className={className} aria-hidden="true" fill="none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#0F6E6E" />
        </linearGradient>
      </defs>
      <path
        d="M12 476 V210 C12 84 96 12 200 12 C304 12 388 84 388 210 V476"
        stroke={`url(#${gradientId})`}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M44 476 V216 C44 108 112 44 200 44 C288 44 356 108 356 216 V476"
        stroke={`url(#${gradientId})`}
        strokeWidth="1"
        strokeOpacity="0.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
