type Testimonial = {
  name: string;
  role: string;
  quote: string;
  initial: string;
};

/**
 * Built for the design system (white card, 5 yellow stars, round
 * initial-avatar on a light accent background) per spec -- deliberately
 * not wired into the live landing page yet. No pilot has run (see
 * CONTEXT.md §12.10 / §9 Phase A): there is no real restaurateur to quote,
 * and inventing a name and a quote would be a fabricated testimonial
 * presented as genuine. Wire this in once Phase A produces real feedback.
 */
export default function TestimonialCard({ name, role, quote, initial }: Testimonial) {
  return (
    <div className="card-static flex flex-col gap-4">
      <div className="flex gap-0.5 text-danger">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} />
        ))}
      </div>
      <p className="text-sm text-ink/80">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
          {initial}
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">{name}</p>
          <p className="text-xs text-muted">{role}</p>
        </div>
      </div>
    </div>
  );
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.9 6.5 7.1.7-5.4 4.7 1.6 7-6.2-3.7L6 21l1.6-7L2.2 9.2l7.1-.7L12 2z" />
    </svg>
  );
}
