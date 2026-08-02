/**
 * Wraps a phone/browser mockup in a padded, shadowed "showcase card" --
 * the presentation pattern the founder pointed at (a Claude.ai template
 * gallery card: soft card, mockup breathing in the middle, caption below
 * the card rather than crammed against the frame). Reused everywhere the
 * landing page shows a real screenshot of the app (see product-preview.tsx);
 * not applied inside the dashboard itself, which has no reason to show a
 * mockup of itself.
 */
export default function MockupFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full rounded-[2rem] border border-ink/5 bg-paper p-6 shadow-softLg sm:p-10">
      <div className="flex w-full items-center justify-center">{children}</div>
    </div>
  );
}

/**
 * macOS-style window-chrome dots, colored the classic red/yellow/green --
 * a widely recognized "this is a browser chrome, not a status pill"
 * convention, distinct enough in placement and shape (small circles in a
 * chrome bar) from the app's real status badges that it doesn't compete
 * with their semantic meaning.
 */
export function WindowChromeDots() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full bg-[#EC6A5E]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#F4BF4F]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#61C554]" />
    </div>
  );
}
