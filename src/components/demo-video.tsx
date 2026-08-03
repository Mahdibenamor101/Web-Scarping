import PhoneFrame from "@/components/phone-frame";

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
    <div className="mx-auto w-[19rem] sm:w-[21rem]">
      <PhoneFrame>
        <video className="h-full w-full object-cover" autoPlay muted loop playsInline poster="/videos/demo-poster.jpg">
          <source src="/videos/demo.webm" type="video/webm" />
          <source src="/videos/demo.mp4" type="video/mp4" />
        </video>
      </PhoneFrame>
    </div>
  );
}
