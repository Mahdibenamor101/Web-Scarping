import Link from "next/link";
import Reveal from "@/components/reveal";
import LandingNav from "@/components/landing-nav";
import LandingFooter from "@/components/landing-footer";
import PricingCard from "@/components/pricing-card";
import { getLocale } from "@/lib/i18n/get-locale";

export const metadata = { title: "Prezzi — mbQr" };

// Dedicated page for the same plan shown on the landing's "#tarifs" section
// (src/app/page.tsx) -- same PricingCard component so the two can't drift
// apart, presented with a bit more room to breathe for anyone who clicks
// through wanting the full detail before signing up.
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

        <Reveal className="mt-8">
          <PricingCard showDetailsLink={false} />
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
