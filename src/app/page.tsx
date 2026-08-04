import Link from "next/link";
import Image from "next/image";
import IntroSplash from "@/components/intro-splash";
import Reveal, { StaggerGroup, StaggerItem } from "@/components/reveal";
import ProductPreview from "@/components/product-preview";
import HeroMockup from "@/components/hero-mockup";
import DemoVideo from "@/components/demo-video";
import StatCounter from "@/components/stat-counter";
import PricingCard from "@/components/pricing-card";
import LandingNav from "@/components/landing-nav";
import LandingFooter from "@/components/landing-footer";
import FaqAccordion from "@/components/faq-accordion";
import ArabesquePattern from "@/components/arabesque-pattern";
import ArchFrame from "@/components/arch-frame";
import { getLocale } from "@/lib/i18n/get-locale";
import { isRtl } from "@/lib/i18n/languages";
import { LANDING_DICT } from "@/lib/i18n/dictionaries/landing";

// Landing copy defaults to Italian (dashboard/auth default to French --
// see CONTEXT.md) but is now fully translatable via the language switcher
// in the nav (src/components/language-switcher.tsx) -- see CONTEXT.md
// §12.30 for the six supported languages and what's still Italian-only
// (the standalone /prezzi, /chi-siamo, /contatti page bodies).
const PILLAR_ICONS = [<ClockIcon key="clock" />, <PhoneIcon key="phone" />, <LeafIcon key="leaf" />];
const FEATURE_ICONS = [<ShieldIcon key="shield" />, <GlobeIcon key="globe" />, <BoltIcon key="bolt" />, <LockIcon key="lock" />];
const STAT_VALUES: { value: number; suffix: string }[] = [
  { value: 14, suffix: "" },
  { value: 2, suffix: "" },
  { value: 100, suffix: "%" },
  { value: 0, suffix: " €" },
];
const TRUST_BADGE_ICONS = [<BoltIcon key="bolt" className="h-4 w-4" />, <CardIcon key="card" className="h-4 w-4" />, <StarIcon key="star" className="h-4 w-4" />];
const PERSONA_ICONS = [<UtensilsIcon key="utensils" />, <PizzaIcon key="pizza" />, <WineIcon key="wine" />];

export default function HomePage() {
  const locale = getLocale("it");
  const t = LANDING_DICT[locale];
  const dir = isRtl(locale) ? "rtl" : "ltr";

  return (
    <main lang={locale} dir={dir}>
      <IntroSplash />
      <LandingNav locale={locale} />

      {/* Hero -- light steel-paper ground, dot texture + soft marigold halo
          behind the floating phone. No scroll-linked motion (explicit
          choice, see CONTEXT.md "pas de parallax") -- the continuous
          movement lives in the floating cards and the signature comanda
          inside HeroMockup instead. */}
      <div className="relative overflow-hidden bg-dot-grid">
        {/* Geometric watermark, gold-on-ivory, low opacity -- the brief's
            "motifs géométriques islamiques en arrière-plan... en
            filigrane léger derrière le hero." */}
        <ArabesquePattern
          className="pointer-events-none absolute inset-0 h-full w-full"
          color="#C9A227"
          opacity={0.1}
        />
        {/* Decorative depth blobs, asymmetric so they read as background
            texture rather than a centered halo -- emerald tone top-left,
            gold tone bottom-right, both very low opacity/heavy blur so
            they never compete with the text or the phone mockup's own
            halo (src/components/hero-mockup.tsx). */}
        <div className="pointer-events-none absolute -left-32 -top-24 h-[26rem] w-[26rem] rounded-full bg-brand/15 blur-[120px]" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-gold/15 blur-[110px]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-6 pb-10 pt-6 sm:grid-cols-2 sm:gap-4 sm:pb-20 sm:pt-14">
          <div className="flex flex-col items-start gap-6 text-left">
            <span className="eyebrow">{t.hero.eyebrow}</span>
            <h1 className="font-display text-6xl font-extrabold leading-[0.98] tracking-tight text-ink sm:text-7xl lg:text-[5.5rem]">
              {t.hero.titleLine1} <span className="bg-brand-gradient bg-clip-text text-transparent">{t.hero.titleLine1Highlight}</span>.
              <br />
              {t.hero.titleLine2} <span className="bg-brand-gradient bg-clip-text text-transparent">{t.hero.titleLine2Highlight}</span>.
            </h1>
            <p className="max-w-md text-lg text-muted">{t.hero.subtitle}</p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/signup" className="btn-primary px-6 py-3 text-base">
                {t.hero.ctaPrimary}
              </Link>
              <a href="#apercu" className="btn-secondary px-6 py-3 text-base">
                {t.hero.ctaSecondary}
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs font-medium text-muted">
              {t.hero.trustBadges.map((label, i) => (
                <span key={label} className="inline-flex items-center gap-1.5">
                  <span className="text-brand">{TRUST_BADGE_ICONS[i]}</span>
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            {/* Ogive arch outline behind the phone, larger than the
                mockup so it reads as a frame around it, not a shape
                the phone sits inside of -- the brief's "arc ou ogive
                comme élément de design autour de l'image principale." */}
            <ArchFrame className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 sm:h-[40rem] sm:w-[33rem]" />
            <HeroMockup />
          </div>
        </div>

        <div className="bg-rail-top h-px w-full" />
      </div>

      <section className="bg-dot-grid py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal className="text-center">
            <span className="eyebrow">{t.why.eyebrow}</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              {t.why.titlePre} <span className="bg-brand-gradient bg-clip-text text-transparent">{t.why.titleHighlight}</span>
            </h2>
          </Reveal>
          <StaggerGroup className="mt-10 grid gap-6 sm:grid-cols-3">
            {t.why.pillars.map((pillar, i) => (
              <StaggerItem key={pillar.title}>
                <div className="card h-full">
                  <span className="icon-badge">{PILLAR_ICONS[i]}</span>
                  <h3 className="mt-3 font-display text-lg font-extrabold text-ink">{pillar.title}</h3>
                  <ul className="mt-3 flex flex-col gap-2">
                    {pillar.points.map((point) => (
                      <li key={point} className="flex items-start gap-2 text-sm text-muted">
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Lifestyle photography -- royalty-free stock, not staged customer
          photos of a real mbQr client (see CONTEXT.md): purely decorative
          texture, same "inspiration/texture, never a fabricated claim"
          line as everywhere else on this page. Uneven column heights
          (one tall, two stacked) instead of a plain 3-up grid for a less
          template-y feel. */}
      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-6 sm:grid-cols-[1.1fr_1fr] sm:gap-6">
          <Reveal className="row-span-2 overflow-hidden rounded-container shadow-softLg">
            <div className="relative h-full min-h-[16rem]">
              <Image
                src="/photos/scan-menu.webp"
                alt="Cliente che scansiona il QR del menu al tavolo"
                fill
                sizes="(min-width: 640px) 420px, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal className="overflow-hidden rounded-container shadow-softLg">
            <div className="relative aspect-[4/3]">
              <Image
                src="/photos/scan-cafe-friends.webp"
                alt="Due amiche al tavolo, una scansiona il QR del menu"
                fill
                sizes="(min-width: 640px) 380px, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal className="overflow-hidden rounded-container shadow-softLg">
            <div className="relative aspect-[4/3]">
              <Image
                src="/photos/scan-table-sticker.webp"
                alt="QR code al tavolo, pronto per essere scansionato"
                fill
                sizes="(min-width: 640px) 380px, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section id="demo" className="bg-surface py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <span className="eyebrow">{t.demoSection.eyebrow}</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              {t.demoSection.titlePre} <span className="bg-brand-gradient bg-clip-text text-transparent">{t.demoSection.titleHighlight}</span>
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted">{t.demoSection.subtitle}</p>
          </Reveal>
          <Reveal className="mt-12">
            <DemoVideo />
          </Reveal>
        </div>
      </section>

      <section id="apercu" className="bg-dot-grid py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal className="text-center">
            <span className="eyebrow">{t.preview.eyebrow}</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              {t.preview.titlePre} <span className="bg-brand-gradient bg-clip-text text-transparent">{t.preview.titleHighlight}</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted">{t.preview.subtitle}</p>
          </Reveal>
          <Reveal className="mt-10">
            <ProductPreview locale={locale} />
          </Reveal>
        </div>
      </section>

      <section id="comment-ca-marche" className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal className="text-center">
            <span className="eyebrow">{t.steps.eyebrow}</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              {t.steps.titlePre} <span className="bg-brand-gradient bg-clip-text text-transparent">{t.steps.titleHighlight}</span>
            </h2>
          </Reveal>
          <StaggerGroup className="mt-10 grid gap-6 sm:grid-cols-3">
            {t.steps.items.map((step, i) => (
              <StaggerItem key={step.title}>
                <div className="ticket h-full !pt-7">
                  <span className="font-mono text-xs font-bold tracking-wide text-brand">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 font-display text-xl font-extrabold text-ink">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted">{step.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section id="fonctionnalites" className="bg-dot-grid py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal className="text-center">
            <span className="eyebrow">{t.features.eyebrow}</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              {t.features.titlePre}
              <span className="bg-brand-gradient bg-clip-text text-transparent">{t.features.titleHighlight}</span>
            </h2>
          </Reveal>
          <StaggerGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.features.items.map((feature, i) => (
              <StaggerItem key={feature.title}>
                <div className="card h-full">
                  <span className="icon-badge">{FEATURE_ICONS[i]}</span>
                  <h3 className="mt-3 font-display text-lg font-extrabold text-ink">{feature.title}</h3>
                  <p className="mt-1 text-sm text-muted">{feature.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Zigzag #1 -- text left, real screenshot right. */}
      <section id="marchio" className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-10 sm:grid-cols-2 sm:items-center">
            <Reveal>
              <span className="eyebrow">{t.branding.eyebrow}</span>
              <h2 className="mt-4 font-display text-3xl font-extrabold leading-[1.02] tracking-tight text-ink sm:text-4xl">
                {t.branding.titlePre} <span className="bg-brand-gradient bg-clip-text text-transparent">{t.branding.titleHighlight}</span>{" "}
                {t.branding.titleRest}
              </h2>
              <p className="mt-3 max-w-md text-sm text-muted">{t.branding.body}</p>
              <p className="mt-6 font-mono text-xs font-bold uppercase tracking-wide text-muted">{t.branding.advantagesLabel}</p>
              <ul className="mt-3 flex flex-col gap-2.5">
                {t.branding.steps.map((step) => (
                  <li key={step.title} className="flex items-start gap-2 text-sm text-ink/80">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    <span>
                      <strong className="font-semibold text-ink">{step.title}.</strong> {step.body}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal>
              <div className="overflow-hidden rounded-container border border-ink/10 shadow-softLg">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/screenshots/public-menu.png"
                    alt="Menu pubblico personalizzato con il logo e l'immagine del locale"
                    fill
                    sizes="(min-width: 640px) 480px, 100vw"
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Zigzag #2 -- real screenshot left, text right (alternated).
          Same bg-surface as zigzag #1 right above (the pair reads as one
          "product showcase" block) so the dot-grid rhythm resumes cleanly
          at "per-chi" below, same precedent as the hero/"Perché Tavolino" pair
          at the top of the page. */}
      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-10 sm:grid-cols-2 sm:items-center">
            <Reveal>
              <div className="overflow-hidden rounded-container border border-ink/10 shadow-softLg">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/screenshots/dashboard-orders.png"
                    alt="Bacheca ordini in tre colonne: da fare, in corso, pronto"
                    fill
                    sizes="(min-width: 640px) 480px, 100vw"
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </Reveal>
            <Reveal>
              <span className="eyebrow">{t.kitchen.eyebrow}</span>
              <h2 className="mt-4 font-display text-3xl font-extrabold leading-[1.02] tracking-tight text-ink sm:text-4xl">
                {t.kitchen.titlePre} <span className="bg-brand-gradient bg-clip-text text-transparent">{t.kitchen.titleHighlight}</span>.
              </h2>
              <p className="mt-3 max-w-md text-sm text-muted">{t.kitchen.body}</p>
              <p className="mt-6 font-mono text-xs font-bold uppercase tracking-wide text-muted">{t.kitchen.advantagesLabel}</p>
              <ul className="mt-3 flex flex-col gap-2.5">
                {t.kitchen.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-ink/80">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="per-chi" className="bg-dot-grid py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal className="text-center">
            <span className="eyebrow">{t.personas.eyebrow}</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              {t.personas.titlePre} <span className="bg-brand-gradient bg-clip-text text-transparent">{t.personas.titleHighlight}</span>
            </h2>
          </Reveal>
          <StaggerGroup className="mt-10 grid gap-6 sm:grid-cols-3">
            {t.personas.items.map((persona, i) => (
              <StaggerItem key={persona.title}>
                <div className="card h-full">
                  <span className="icon-badge">{PERSONA_ICONS[i]}</span>
                  <h3 className="mt-3 font-display text-lg font-extrabold text-ink">{persona.title}</h3>
                  <p className="mt-1 text-sm text-muted">{persona.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal className="text-center">
            <span className="eyebrow">{t.stats.eyebrow}</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              {t.stats.titlePre} <span className="bg-brand-gradient bg-clip-text text-transparent">{t.stats.titleHighlight}</span>
            </h2>
          </Reveal>
          <StaggerGroup className="mt-10 grid gap-6 sm:grid-cols-4">
            {t.stats.labels.map((label, i) => (
              <StaggerItem key={label} className="text-center">
                <p className="font-mono text-4xl font-extrabold tabular-nums tracking-tight text-ink sm:text-5xl">
                  <StatCounter value={STAT_VALUES[i]!.value} suffix={STAT_VALUES[i]!.suffix} />
                </p>
                <p className="mt-2 text-sm text-muted">{label}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="bg-dot-grid py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <Reveal className="text-center">
            <span className="eyebrow">{t.comparison.eyebrow}</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              {t.comparison.titlePre} <span className="bg-brand-gradient bg-clip-text text-transparent">{t.comparison.titleHighlight}</span>
              {t.comparison.titleRest}
            </h2>
          </Reveal>
          <Reveal className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-card border border-ink/10 bg-surface p-6 shadow-soft">
              <h3 className="font-display text-base font-extrabold text-muted">{t.comparison.paperHeading}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {t.comparison.rows.map((row) => (
                  <li key={row.paper} className="flex items-start gap-2 text-sm text-ink/70">
                    <MinusIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
                    {row.paper}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-card border border-brand/20 bg-brand/5 p-6 shadow-soft">
              <h3 className="font-display text-base font-extrabold text-brand-dark">{t.comparison.qrHeading}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {t.comparison.rows.map((row) => (
                  <li key={row.qr} className="flex items-start gap-2 text-sm text-ink/80">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    {row.qr}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="tarifs" className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-6">
          <Reveal className="text-center">
            <span className="eyebrow">{t.pricing.eyebrow}</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              {t.pricing.titlePre} <span className="bg-brand-gradient bg-clip-text text-transparent">{t.pricing.titleHighlight}</span>
            </h2>
            <p className="mt-3 text-sm text-muted">{t.pricing.subtitle}</p>
          </Reveal>
          <Reveal className="mt-8">
            <PricingCard locale={locale} />
          </Reveal>
        </div>
      </section>

      <section id="faq" className="bg-dot-grid py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-6">
          <Reveal className="text-center">
            <span className="eyebrow">{t.faq.eyebrow}</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              {t.faq.titlePre} <span className="bg-brand-gradient bg-clip-text text-transparent">{t.faq.titleHighlight}</span>
            </h2>
          </Reveal>
          <Reveal className="mt-10">
            <FaqAccordion items={t.faq.items} />
          </Reveal>
        </div>
      </section>

      {/* Full-bleed, not inset in a max-w container like every other section
          -- the one place on the page that's allowed to feel loud, right
          before the footer closes things out. */}
      <section className="relative overflow-hidden bg-brand-gradient py-20 sm:py-24">
        <ArabesquePattern className="pointer-events-none absolute inset-0 h-full w-full" color="#FAF6EE" opacity={0.12} />
        <Reveal className="relative mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{t.finalCta.title}</h2>
          <p className="mt-3 text-white/80">{t.finalCta.subtitle}</p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/signup"
              className="rounded-full border-2 border-gold bg-white px-6 py-3 text-base font-semibold text-brand-dark shadow-gold transition duration-200 hover:-translate-y-0.5"
            >
              {t.finalCta.button}
            </Link>
          </div>
        </Reveal>
      </section>

      <LandingFooter />
    </main>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="6" y="2" width="12" height="20" rx="2.5" />
      <path d="M11 18h2" strokeLinecap="round" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 21c0-9 5-15 14-15 0 9-5 15-14 15z" strokeLinejoin="round" />
      <path d="M5 21c3-5 6-8 10-11" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3z" />
    </svg>
  );
}

function BoltIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 018 0v3" strokeLinecap="round" />
    </svg>
  );
}

function CardIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" strokeLinecap="round" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l2.9 6.5 7.1.7-5.4 4.7 1.6 7-6.2-3.7L6 21l1.6-7L2.2 9.2l7.1-.7L12 2z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}>
      <path d="M4 12l6 6L20 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}>
      <path d="M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function UtensilsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 3v7a2 2 0 002 2 2 2 0 002-2V3M8 12v9M17 3c-1.5 0-3 1.5-3 4v4h3M17 3v18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PizzaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 4l18 6-9 12L3 4z" strokeLinejoin="round" />
      <circle cx="11" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="9" cy="14" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WineIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 3h10l-1 6a4 4 0 01-8 0L7 3z" strokeLinejoin="round" />
      <path d="M12 13v8M8 21h8" strokeLinecap="round" />
    </svg>
  );
}
