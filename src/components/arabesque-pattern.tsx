import { useId } from "react";

/**
 * Repeating 8-pointed-star lattice (two overlapping squares, one rotated
 * 45°) -- the classic simple construction for this motif, tiled via an
 * SVG <pattern> rather than a baked CSS data-URI so it can take a color
 * prop without string-escaping a URL. Purely decorative filigrane behind
 * the hero/CTA/footer sections (design-tokens.ts, "Oriental Luxury"):
 * absolutely positioned by the caller, this component only draws the
 * tile. `useId` keyed per instance so multiple copies on one page don't
 * collide on the same `<pattern id>`.
 */
export default function ArabesquePattern({
  className = "",
  color = "#C9A227",
  opacity = 0.16,
  size = 64,
}: {
  className?: string;
  color?: string;
  opacity?: number;
  size?: number;
}) {
  const id = `arabesque-${useId()}`;
  return (
    <svg className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <g fill="none" stroke={color} strokeWidth="1" opacity={opacity}>
            <rect x={size * 0.2} y={size * 0.2} width={size * 0.6} height={size * 0.6} />
            <rect
              x={size * 0.2}
              y={size * 0.2}
              width={size * 0.6}
              height={size * 0.6}
              transform={`rotate(45 ${size / 2} ${size / 2})`}
            />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
