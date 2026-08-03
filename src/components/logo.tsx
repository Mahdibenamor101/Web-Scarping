import Image from "next/image";

// The mark: the founder's own Tavolino icon export (see CONTEXT.md §12.34/35
// -- public/branding/logo-mark.png, from tavolino-app-icon-dark.png in the
// supplied logo pack), used as-is rather than redrawn as SVG. An earlier
// pass recolored the app's pre-existing hand-drawn "finder pattern" SVG to
// match the new palette instead of using the real asset -- replaced here
// because the founder asked for the actual logo file, not a lookalike.
export function LogoMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/branding/logo-mark.png"
      alt=""
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}

export default function Logo({
  size = 28,
  wordmarkClassName = "font-display text-xl font-extrabold tracking-tight",
  className = "",
}: {
  size?: number;
  wordmarkClassName?: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark size={size} />
      <span className={wordmarkClassName}>Tavolino</span>
    </span>
  );
}
