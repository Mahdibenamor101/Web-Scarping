// The mark: a QR "finder pattern" motif (the nested squares every QR code
// uses to orient a scanner) at three corners, with the fourth corner left
// as a single dot -- deliberately asymmetric so it reads as a mark, not a
// literal QR code. Built as inline SVG rather than in Figma: no Figma
// connector is available in this session (see CONTEXT.md §12.9), and a
// three-shape geometric mark like this has no real benefit from a visual
// design tool over precise coordinates in code.
function Finder({ x, y }: { x: number; y: number }) {
  return (
    <>
      <rect x={x} y={y} width={11} height={11} rx={3.2} fill="white" />
      <rect x={x + 2.4} y={y + 2.4} width={6.2} height={6.2} rx={1.8} fill="url(#mbqr-logo-gradient)" />
      <rect x={x + 4.3} y={y + 4.3} width={2.4} height={2.4} rx={0.7} fill="white" />
    </>
  );
}

export function LogoMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="mbqr-logo-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2196F3" />
          <stop offset="1" stopColor="#0D8BF0" />
        </linearGradient>
      </defs>
      <rect width={40} height={40} rx={11} fill="url(#mbqr-logo-gradient)" />
      <Finder x={5} y={5} />
      <Finder x={24} y={5} />
      <Finder x={5} y={24} />
      <rect x={26.5} y={26.5} width={8} height={8} rx={2.6} fill="white" />
    </svg>
  );
}

export default function Logo({
  size = 28,
  wordmarkClassName = "text-lg font-bold tracking-tight",
  className = "",
}: {
  size?: number;
  wordmarkClassName?: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark size={size} />
      <span className={wordmarkClassName}>mbQr</span>
    </span>
  );
}
