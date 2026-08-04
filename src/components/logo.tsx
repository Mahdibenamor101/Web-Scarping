// Wordmark-only logo (CONTEXT.md §12.36): the founder rejected the icon
// mark entirely in favor of a plain serif wordmark, all gold, fine serifs
// -- Playfair Display at its light 400 weight (the rest of the app uses
// 600-900 for headings, see layout.tsx) with the existing `gold-dark`
// token rather than a new color.
export default function Logo({
  wordmarkClassName = "font-display text-xl font-normal tracking-wide text-gold-dark",
  className = "",
}: {
  wordmarkClassName?: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <span className={wordmarkClassName}>Tavolino</span>
    </span>
  );
}
