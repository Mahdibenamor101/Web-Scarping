/**
 * Real screen recording of the public menu/ordering flow (Playwright,
 * see CONTEXT.md §12.13) -- not stock footage or an AI-generated clip,
 * same "honest over polished" call as the product screenshots
 * (src/components/product-preview.tsx). Shown inside a phone bezel,
 * autoplaying muted so it reads as a demo loop rather than a video the
 * visitor has to press play on.
 */
export default function DemoVideo() {
  return (
    <div className="mx-auto w-[19rem] rounded-[2.75rem] border-[10px] border-ink bg-ink shadow-softLg sm:w-[21rem]">
      <div className="relative overflow-hidden rounded-[2.1rem] bg-white">
        <div className="absolute left-1/2 top-0 z-10 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-ink" />
        <video className="block w-full" autoPlay muted loop playsInline poster="/videos/demo-poster.jpg">
          <source src="/videos/demo.webm" type="video/webm" />
          <source src="/videos/demo.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
