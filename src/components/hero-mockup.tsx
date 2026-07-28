import LiveOrderCard from "@/components/live-order-card";

/**
 * Decorative hero illustration: a tilted, floating phone mockup with
 * floating cards drifting around it at different z-depths -- a
 * hand-drawn stylized vignette (not a screenshot). The honest, real
 * product screenshots live further down the page in "Aperçu du produit"
 * (src/components/product-preview.tsx). Two different jobs: this one
 * sells a feeling, that one proves the feeling is true.
 *
 * Each floating card shows real product data (an order, a QR sticker, a
 * revenue figure) per DESIGN.md, not decorative placeholder numbers. The
 * live order card (src/components/live-order-card.tsx) is the one
 * animated, looping element -- everything else here is a static float.
 *
 * Floating is plain CSS (Tailwind `animate-float*`) rather than Framer
 * Motion: a fixed-period infinite loop doesn't need JS, and each element
 * nests its static tilt (rotate) and its float (translateY) on separate
 * elements so the two transforms don't clobber each other. The CSS
 * animations are already silenced by the global prefers-reduced-motion
 * kill-switch in globals.css.
 */
export default function HeroMockup() {
  return (
    <div className="relative mx-auto flex h-[30rem] w-full max-w-sm items-center justify-center sm:h-[34rem]">
      {/* Soft brand halo behind everything */}
      <div className="pointer-events-none absolute h-[26rem] w-[26rem] rounded-full bg-brand/20 blur-[90px]" />

      {/* Phone: static tilt on the outer element, float animation on the inner one */}
      <div className="-rotate-6">
        <div className="animate-float">
          <div className="w-[15rem] rounded-[2.75rem] border-[10px] border-ink bg-ink shadow-softLg">
            <div className="relative overflow-hidden rounded-[2.1rem] bg-white">
              <div className="absolute left-1/2 top-0 z-10 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-ink" />
              <div className="flex flex-col gap-3 px-4 pb-5 pt-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-ink">Trattoria da Mario</p>
                    <p className="text-[9px] text-muted">Tavolo 4</p>
                  </div>
                  <span className="rounded-full bg-brand px-2 py-0.5 text-[8px] font-bold text-white">IT</span>
                </div>
                {[
                  { name: "Bruschetta al pomodoro", price: "6,50 €" },
                  { name: "Tagliatelle al ragù", price: "13,00 €" },
                  { name: "Tiramisù della casa", price: "6,00 €" },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-xl bg-paper px-3 py-2.5">
                    <div>
                      <p className="text-[10px] font-semibold text-ink">{item.name}</p>
                      <p className="text-[9px] text-muted tabular-nums">{item.price}</p>
                    </div>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-gradient text-[10px] font-bold text-white">
                      +
                    </span>
                  </div>
                ))}
                <div className="mt-1 rounded-full bg-brand-gradient py-2.5 text-center text-[10px] font-bold text-white shadow-soft tabular-nums">
                  Ordina · 25,50 €
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating cards at different z-depths: live order (front, animated),
          QR sticker preview (back), revenue + mini-graph (mid). */}
      <div className="absolute -right-2 top-8 z-20 sm:-right-6">
        <LiveOrderCard />
      </div>
      <div className="animate-float-delayed absolute left-0 top-1/2 z-0 -translate-y-1/2 sm:-left-6">
        <QrStickerCard />
      </div>
      <div className="animate-float absolute bottom-6 left-4 z-10 sm:left-0">
        <RevenueCard />
      </div>
    </div>
  );
}

function QrStickerCard() {
  return (
    <div className="card-static flex w-32 flex-col items-center gap-2 !p-3">
      <div className="grid grid-cols-5 gap-[2px] rounded-md bg-ink p-1.5">
        {QR_PATTERN.map((row, i) =>
          row.map((on, j) => (
            <span key={`${i}-${j}`} className={`h-[3px] w-[3px] rounded-[1px] ${on ? "bg-white" : "bg-transparent"}`} />
          )),
        )}
      </div>
      <p className="text-[9px] font-semibold text-ink">Tavolo 4</p>
      <p className="text-center text-[8px] leading-tight text-muted">Scansiona per ordinare</p>
    </div>
  );
}

// Stylized, not a scannable code -- decorative vignette only (see file comment).
const QR_PATTERN = [
  [1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0],
  [1, 1, 1, 0, 1],
  [0, 0, 0, 1, 0],
  [1, 0, 1, 0, 1],
];

function RevenueCard() {
  return (
    <div className="card-static flex w-36 flex-col gap-2 !p-3">
      <p className="text-[9px] font-medium text-muted">Oggi</p>
      <p className="text-[16px] font-bold tabular-nums text-ink">€248,50</p>
      <div className="flex h-6 items-end gap-1">
        {REVENUE_BARS.map((h, i) => (
          <span key={i} className="flex-1 rounded-sm bg-brand/25" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

const REVENUE_BARS = [35, 55, 40, 70, 60, 85, 100];
