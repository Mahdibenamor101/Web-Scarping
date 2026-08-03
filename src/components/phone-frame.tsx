import type { ReactNode } from "react";

/**
 * Shared iPhone chrome for every phone mockup on the landing page
 * (hero-mockup.tsx, product-preview.tsx, demo-video.tsx) -- previously
 * three near-identical hand-copies of the same bezel that had already
 * drifted slightly out of sync (8px vs 10px border). Modeled on the
 * QonnectQR reference (design/refs/) the founder pointed at: a thin
 * realistic bezel rather than a thick generic one, real Dynamic Island
 * proportions, a real status bar, and side buttons -- not a literal
 * device render, but close enough to read as "a real iPhone" instead of
 * "a rounded rectangle with a black pill."
 *
 * Sizing is deliberately left to the caller (a wrapping div with a fixed
 * or responsive width) rather than a `width` prop here -- the three
 * callers need three different sizing strategies (fixed 240px, `w-full
 * max-w-[18rem]`, a breakpoint-responsive width), and this component
 * only needs to fill whatever box it's placed in.
 *
 * The bezel is a fixed-width `padding` (not a CSS `border`) specifically
 * so the outer and inner corner radii can be set to an exact
 * outer-minus-bezel relationship -- a plain `border` never nests
 * perfectly with its own `border-radius`, which is what made the
 * previous frame's corners look thicker than its straight edges.
 */
const OUTER_RADIUS = 44; // px
const BEZEL = 9; // px, within the 8-12px range the founder asked for
const INNER_RADIUS = OUTER_RADIUS - BEZEL;

export default function PhoneFrame({
  children,
  screenClassName = "",
  className = "",
}: {
  children: ReactNode;
  /** Extra classes on the screen itself -- e.g. `aspect-[9/17.5]` for a
      `next/image fill` screenshot, left unset for content that sizes
      itself naturally (hero-mockup's synthetic UI, demo-video's <video>). */
  screenClassName?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative bg-ink shadow-softLg ${className}`}
      style={{ borderRadius: OUTER_RADIUS, padding: BEZEL }}
    >
      {/* Side buttons -- small flat ticks proud of the frame edge, not
          functional, just the detail that reads as "real hardware." A
          lighter fill than the frame itself (not `bg-ink` again) --
          otherwise they're perfectly camouflaged against it. */}
      <span className="absolute -right-[1.5px] top-[26%] h-12 w-[3px] rounded-r-sm bg-white/25" />
      <span className="absolute -left-[1.5px] top-[16%] h-6 w-[3px] rounded-l-sm bg-white/25" />
      <span className="absolute -left-[1.5px] top-[23%] h-10 w-[3px] rounded-l-sm bg-white/25" />

      <div className={`relative overflow-hidden bg-white ${screenClassName}`} style={{ borderRadius: INNER_RADIUS }}>
        <StatusBar />
        <DynamicIsland />
        {children}
      </div>
    </div>
  );
}

/** Centered, real-proportion pill -- ~100x28px on a ~240px-wide frame. */
function DynamicIsland() {
  return <div className="absolute left-1/2 top-[10px] z-20 h-[28px] w-[100px] -translate-x-1/2 rounded-full bg-ink" />;
}

/** Opaque so it cleanly caps whatever screenshot/video sits underneath, the
    same way a real device-mockup composite works -- time left, iOS's own
    three-glyph status cluster right. 9:41 is Apple's own marketing-shot
    convention (every keynote/App Store screenshot uses it). */
function StatusBar() {
  return (
    <div className="absolute inset-x-0 top-0 z-10 flex h-11 items-center justify-between bg-white px-6 pt-1.5 text-[13px] font-semibold text-ink">
      <span>9:41</span>
      <div className="flex items-center gap-1">
        <SignalIcon />
        <WifiIcon />
        <BatteryIcon />
      </div>
    </div>
  );
}

function SignalIcon() {
  return (
    <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor" aria-hidden="true">
      <rect x="0" y="7" width="3" height="4" rx="0.5" />
      <rect x="4.5" y="5" width="3" height="6" rx="0.5" />
      <rect x="9" y="3" width="3" height="8" rx="0.5" />
      <rect x="13" y="0" width="3" height="11" rx="0.5" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M1 4a10 10 0 0113 0" strokeLinecap="round" />
      <path d="M3.3 6.6a6.4 6.4 0 018.4 0" strokeLinecap="round" />
      <path d="M5.7 9.1a2.8 2.8 0 013.6 0" strokeLinecap="round" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="24" height="12" viewBox="0 0 24 12" fill="none" aria-hidden="true">
      <rect x="0.75" y="0.75" width="19.5" height="10.5" rx="2.5" stroke="currentColor" strokeWidth="1.1" opacity="0.4" />
      <rect x="2.25" y="2.25" width="16.5" height="7.5" rx="1.3" fill="currentColor" />
      <rect x="21" y="4" width="1.6" height="4" rx="0.8" fill="currentColor" opacity="0.4" />
    </svg>
  );
}
