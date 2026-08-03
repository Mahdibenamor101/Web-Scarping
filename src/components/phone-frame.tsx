import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Shared iPhone chrome for every phone mockup on the landing page
 * (hero-mockup.tsx, product-preview.tsx, demo-video.tsx). Previously a
 * hand-drawn CSS bezel (padding-based border + a drawn Dynamic Island
 * pill, see git history) -- replaced with an actual device-photo asset
 * the founder supplied (`public/mockups/iphone-frame.png` +
 * `iphone-mask.png`, a matched frame/mask pair from a phone-mockup
 * generator, plus the screen-rect coordinates that shipped alongside them
 * as `template.json`, hardcoded below as SCREEN_RECT/FRAME_SIZE since
 * they never change at runtime). Real device photography instead of CSS
 * approximation -- the frame image itself has an alpha channel that's
 * transparent everywhere except the physical bezel/button/camera-cutout
 * pixels, so it composites cleanly over any screen content.
 *
 * Compositing order (bottom to top):
 * 1. Screen content (children), absolutely positioned at the screen
 *    sub-rect within the frame's own coordinate space.
 * 2. That content wrapper is CSS-masked with iphone-mask.png (white =
 *    visible, black = hidden) so it gets the screen's real rounded
 *    corners AND a Dynamic Island-shaped cutout -- without this, a
 *    screenshot's square corners or a light-colored top edge would show
 *    through past where the frame's photographed corners/island actually
 *    are.
 * 3. iphone-frame.png on top, filling the whole box -- draws the bezel,
 *    side buttons, and Dynamic Island (with camera dot) as an actual
 *    photograph, letting the masked content show through the transparent
 *    screen area.
 *
 * The frame has a fixed intrinsic aspect ratio (a real photo, not a
 * flexible CSS shape) -- the outer box is locked to it via `aspect-[]`,
 * so callers only need to control width (as before) and height follows
 * automatically. Sizing is still left to the caller (a wrapping div with
 * a fixed or responsive width) for the same reason as before: the three
 * callers need three different sizing strategies.
 */
const FRAME_SIZE = { width: 1406, height: 2822 };
const SCREEN_RECT = { x: 100, y: 100, width: 1206, height: 2622 };

const screenStyle = {
  left: `${(SCREEN_RECT.x / FRAME_SIZE.width) * 100}%`,
  top: `${(SCREEN_RECT.y / FRAME_SIZE.height) * 100}%`,
  width: `${(SCREEN_RECT.width / FRAME_SIZE.width) * 100}%`,
  height: `${(SCREEN_RECT.height / FRAME_SIZE.height) * 100}%`,
};

const maskStyle = {
  WebkitMaskImage: "url(/mockups/iphone-mask.png)",
  maskImage: "url(/mockups/iphone-mask.png)",
  WebkitMaskSize: "100% 100%",
  maskSize: "100% 100%",
  WebkitMaskRepeat: "no-repeat" as const,
  maskRepeat: "no-repeat" as const,
};

export default function PhoneFrame({
  children,
  screenClassName = "",
  className = "",
}: {
  children: ReactNode;
  /** Extra classes on the screen content wrapper -- e.g. `object-cover`
      helpers aren't needed here since the wrapper is already sized exactly
      to the screen rect; left for callers that want extra styling. */
  screenClassName?: string;
  className?: string;
}) {
  return (
    <div className={`relative w-full shadow-softLg aspect-[1406/2822] ${className}`}>
      <div className="absolute inset-0" style={maskStyle}>
        <div className={`absolute overflow-hidden bg-white ${screenClassName}`} style={screenStyle}>
          <StatusBar />
          {children}
        </div>
      </div>
      <Image
        src="/mockups/iphone-frame.png"
        alt=""
        aria-hidden="true"
        fill
        sizes="(min-width: 640px) 336px, 240px"
        className="pointer-events-none select-none"
        priority={false}
      />
    </div>
  );
}

/** Sits inside the masked screen content -- the mask's Dynamic Island
    cutout naturally clips the middle of this bar, leaving just the time
    (left) and status icons (right) visible around the real photographed
    island, the same way a real iOS status bar reads. 9:41 is Apple's own
    marketing-shot convention (every keynote/App Store screenshot uses it). */
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
