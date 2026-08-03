import Link from "next/link";
import Reveal from "@/components/reveal";
import LandingNav from "@/components/landing-nav";
import LandingFooter from "@/components/landing-footer";
import PricingToggle from "@/components/pricing-toggle";
import { PLAN_FEATURES } from "@/lib/landing-content";
import { getLocale } from "@/lib/i18n/get-locale";

export const metadata = { title: "Prezzi — mbQr" };

// Dedicated page for the same single plan shown on the landing's "#tarifs"
// section (src/app/page.tsx) -- same PLAN_FEATURES import so the two can't
// drift apart, presented with a bit more room to breathe for anyone who
// clicks through wanting the full detail before signing up.
//
// Body copy stays Italian-only for now (see CONTEXT.md §12.30) -- only the
// shared nav/footer respect the language switcher here.
export default function PricingPage() {
  const locale = getLocale("it");
  return (
    <div className="min-h-screen bg-paper">
      <LandingNav locale={locale} />
      <main className="mx-auto max-w-2xl px-6 py-16 sm:py-20">
        <Reveal className="text-center">
          <span className="eyebrow">Prezzi</span>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            Un solo piano. <span className="bg-brand-gradient bg-clip-text text-transparent">Tutto incluso.</span>
          </h1>
          <p className="mt-3 text-sm text-muted">
            Nessuna offerta &laquo;&nbsp;Base&nbsp;&raquo; contro &laquo;&nbsp;Pro&nbsp;&raquo;: ogni ristorante
            accede a tutta la piattaforma, qualunque sia la durata scelta.
          </p>
        </Reveal>

        <Reveal className="mt-8 flex justify-center">
          <PricingToggle />
        </Reveal>

        <Reveal>
          <div className="ticket mt-8 !pt-9 sm:p-8 sm:!pt-10">
            <div className="flex flex-wrap items-baseline justify-center gap-2">
              <span className="font-mono text-4xl font-extrabold tabular-nums text-ink">~33 €</span>
              <span className="text-sm text-muted">/ mese, fatturato ~400 € / anno</span>
            </div>
            <p className="mt-2 text-center text-sm text-muted">14 giorni di prova gratuita, senza carta di credito.</p>
            <ul className="mx-auto mt-6 flex max-w-sm flex-col gap-2.5">
              {PLAN_FEATURES.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-ink/80">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex justify-center">
              <Link href="/signup" className="btn-primary px-6 py-3 text-base">
                Inizia la prova gratuita
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-10 text-center text-sm text-muted">
          Esigenze particolari (più locali, integrazioni)?{" "}
          <Link href="/contatti" className="nav-link font-medium">
            Scrivici
          </Link>
          .
        </Reveal>
      </main>
      <LandingFooter />
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}>
      <path d="M4 12l6 6L20 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
