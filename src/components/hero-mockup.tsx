/**
 * Decorative hero illustration: a tilted, floating phone mockup with a
 * couple of notification cards drifting around it at slightly different
 * speeds. This is a hand-drawn stylized vignette (not a screenshot) --
 * the honest, real product screenshots live further down the page in the
 * "Aperçu du produit" section (src/components/product-preview.tsx). Two
 * different jobs: this one sells a feeling, that one proves the feeling
 * is true.
 *
 * Floating is plain CSS (Tailwind `animate-float*`) rather than Framer
 * Motion: a fixed-period infinite loop doesn't need JS, and each element
 * nests its static tilt (rotate) and its float (translateY) on separate
 * elements so the two transforms don't clobber each other.
 */
export default function HeroMockup() {
  return (
    <div className="relative mx-auto flex h-[30rem] w-full max-w-sm items-center justify-center sm:h-[34rem]">
      {/* Soft blue halo behind everything */}
      <div className="pointer-events-none absolute h-[26rem] w-[26rem] rounded-full bg-accent/20 blur-[90px]" />

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
                    <p className="text-[9px] text-slate-400">Tavolo 4</p>
                  </div>
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[8px] font-bold text-white">IT</span>
                </div>
                {[
                  { name: "Bruschetta al pomodoro", price: "6,50 €" },
                  { name: "Tagliatelle al ragù", price: "13,00 €" },
                  { name: "Tiramisù della casa", price: "6,00 €" },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                    <div>
                      <p className="text-[10px] font-semibold text-ink">{item.name}</p>
                      <p className="text-[9px] text-slate-400">{item.price}</p>
                    </div>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-gradient text-[10px] font-bold text-white">
                      +
                    </span>
                  </div>
                ))}
                <div className="mt-1 rounded-full bg-accent-gradient py-2.5 text-center text-[10px] font-bold text-white shadow-soft">
                  Ordina · 25,50 €
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating notification cards, each at a slightly different speed/phase */}
      <div className="animate-float-slow absolute left-0 top-10 sm:-left-4">
        <NotificationCard tone="accent" title="Nouvelle commande" subtitle="Tavolo 4 · 3 articles" />
      </div>
      <div className="animate-float-delayed absolute -right-2 top-1/3 sm:-right-6">
        <NotificationCard tone="success" title="Commande prête" subtitle="Servi en 9 min" />
      </div>
      <div className="animate-float-slow-delayed absolute bottom-8 left-2 sm:-left-2">
        <NotificationCard tone="neutral" title="QR scanné" subtitle="Table 4 · à l'instant" />
      </div>
    </div>
  );
}

function NotificationCard({
  tone,
  title,
  subtitle,
}: {
  tone: "accent" | "success" | "neutral";
  title: string;
  subtitle: string;
}) {
  const dot =
    tone === "accent" ? "bg-accent" : tone === "success" ? "bg-emerald-500" : "bg-slate-400";
  return (
    <div className="card-static flex w-40 items-center gap-2.5 !p-3">
      <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
      <div>
        <p className="text-[11px] font-semibold text-ink">{title}</p>
        <p className="text-[10px] text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}
