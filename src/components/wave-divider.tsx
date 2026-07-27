/** Reusable SVG wave section divider. `flip` mirrors it vertically. */
export default function WaveDivider({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 60"
      fill="currentColor"
      preserveAspectRatio="none"
      className={`block w-full ${flip ? "rotate-180" : ""} ${className}`}
      aria-hidden="true"
    >
      <path d="M0,32 C320,72 1120,-8 1440,32 L1440,60 L0,60 Z" />
    </svg>
  );
}
