import Link from "next/link";
import Logo from "@/components/logo";
import Reveal, { StaggerGroup, StaggerItem } from "@/components/reveal";
import ProductPreview from "@/components/product-preview";
import HeroMockup from "@/components/hero-mockup";
import StatCounter from "@/components/stat-counter";
import PricingToggle from "@/components/pricing-toggle";
import WaveDivider from "@/components/wave-divider";
import { APP_NAME } from "@/lib/brand";

const STEPS = [
  {
    n: "1",
    title: "Le client scanne",
    body: "Un QR par table. Rien à installer, le menu s'ouvre dans le navigateur.",
  },
  {
    n: "2",
    title: "Il commande depuis son téléphone",
    body: "Menu en italien et en anglais, allergènes indiqués sur chaque plat.",
  },
  {
    n: "3",
    title: "Ça arrive en cuisine, en direct",
    body: "À faire, en cours, prêt — mis à jour sans recharger la page.",
  },
];

const FEATURES = [
  {
    title: "14 allergènes UE",
    body: "Étiquetage conforme au Règlement (UE) n°1169/2011, plat par plat.",
    icon: <ShieldIcon />,
  },
  {
    title: "IT / EN",
    body: "Menu bilingue dès le départ, pensé pour une clientèle touristique.",
    icon: <GlobeIcon />,
  },
  {
    title: "Temps réel",
    body: "La commande arrive en cuisine en quelques secondes, pas en rechargeant la page.",
    icon: <BoltIcon />,
  },
  {
    title: "Isolation stricte",
    body: "Chaque restaurant ne voit que ses propres données — appliqué au niveau de la base.",
    icon: <LockIcon />,
  },
];

// Genuine, checkable facts about the product itself -- not fabricated usage
// or customer numbers. No pilot has run yet (CONTEXT.md §9 Phase A), so
// there is no real "X restaurants" or "X commandes/mois" to show.
const STATS = [
  { value: 14, suffix: "", label: "Allergènes UE étiquetés" },
  { value: 2, suffix: "", label: "Langues, IT / EN, dès le départ" },
  { value: 100, suffix: "%", label: "Données isolées par restaurant" },
  { value: 0, suffix: " €", label: "Matériel supplémentaire à acheter" },
];

const PLAN_FEATURES = [
  "QR codes et tables illimités",
  "Menu multilingue italien / anglais",
  "Étiquetage des 14 allergènes UE",
  "Commandes en temps réel, sans rechargement",
  "Comptes staff illimités (manager, serveur, cuisine)",
  "Aucun boîtier ni matériel à acheter",
];

const TRUST_BADGES = [
  { icon: <BoltIcon className="h-4 w-4" />, label: "Opérationnel en quelques minutes" },
  { icon: <CardIcon className="h-4 w-4" />, label: "Sans carte bancaire" },
  { icon: <StarIcon className="h-4 w-4" />, label: "14 jours d'essai gratuit" },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero -- light canvas + dot grid + soft halo behind the floating phone,
          per the design system: the whole marketing site stays light, only
          the dashboard goes dark (see src/app/dashboard/layout.tsx). */}
      <div className="relative overflow-hidden bg-dot-grid">
        <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <Logo />
          <div className="hidden items-center gap-7 text-sm font-medium sm:flex">
            <a href="#apercu" className="nav-link">
              Aperçu
            </a>
            <a href="#fonctionnalites" className="nav-link">
              Fonctionnalités
            </a>
            <a href="#tarifs" className="nav-link">
              Tarifs
            </a>
          </div>
          <Link href="/login" className="nav-link text-sm font-medium">
            Se connecter
          </Link>
        </nav>

        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-6 pb-8 pt-6 sm:grid-cols-2 sm:gap-4 sm:pb-16 sm:pt-12">
          <div className="flex flex-col items-start gap-6 text-left">
            <span className="eyebrow">Menu QR &amp; commande à table</span>
            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              Le <span className="bg-accent-gradient bg-clip-text text-transparent">QR</span> sur la table.
              <br />
              La commande en <span className="bg-accent-gradient bg-clip-text text-transparent">cuisine</span>.
            </h1>
            <p className="max-w-md text-lg text-slate-500">
              Menu multilingue, allergènes conformes, commandes en temps réel — sans matériel à installer, sans
              abonnement à un boîtier.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/signup" className="btn-primary px-6 py-3 text-base">
                Créer mon restaurant
              </Link>
              <a href="#apercu" className="btn-secondary px-6 py-3 text-base">
                Voir le produit
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
              {TRUST_BADGES.map((badge) => (
                <span key={badge.label} className="inline-flex items-center gap-1.5">
                  <span className="text-accent">{badge.icon}</span>
                  {badge.label}
                </span>
              ))}
            </div>
          </div>

          <HeroMockup />
        </div>

        <WaveDivider className="text-white" />
      </div>

      <section id="apercu" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal className="text-center">
            <span className="eyebrow">Aperçu du produit</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Voyez-le en <span className="bg-accent-gradient bg-clip-text text-transparent">action</span>
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
              Ce sont de vraies captures de l&apos;application — pas des maquettes.
            </p>
          </Reveal>
          <Reveal className="mt-10">
            <ProductPreview />
          </Reveal>
        </div>
      </section>

      <section id="comment-ca-marche" className="bg-dot-grid py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal className="text-center">
            <span className="eyebrow">Trois étapes</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Comment ça <span className="bg-accent-gradient bg-clip-text text-transparent">marche</span>
            </h2>
          </Reveal>
          <StaggerGroup className="mt-10 grid gap-6 sm:grid-cols-3">
            {STEPS.map((step) => (
              <StaggerItem key={step.n}>
                <div className="card h-full">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent-gradient text-sm font-bold text-white">
                    {step.n}
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-ink">{step.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{step.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section id="fonctionnalites" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal className="text-center">
            <span className="eyebrow">Fonctionnalités</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Fait pour l&apos;<span className="bg-accent-gradient bg-clip-text text-transparent">Italie</span>
            </h2>
          </Reveal>
          <StaggerGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <StaggerItem key={feature.title}>
                <div className="card h-full">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    {feature.icon}
                  </span>
                  <h3 className="mt-3 text-sm font-semibold text-ink">{feature.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{feature.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="bg-dot-grid py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal className="text-center">
            <span className="eyebrow">Concrètement</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Ce que le produit <span className="bg-accent-gradient bg-clip-text text-transparent">fait vraiment</span>
            </h2>
          </Reveal>
          <StaggerGroup className="mt-10 grid gap-6 sm:grid-cols-4">
            {STATS.map((stat) => (
              <StaggerItem key={stat.label} className="text-center">
                <p className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
                  <StatCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm text-slate-500">{stat.label}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section id="tarifs" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-6">
          <Reveal className="text-center">
            <span className="eyebrow">Tarifs</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Un seul plan. <span className="bg-accent-gradient bg-clip-text text-transparent">Tout inclus.</span>
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Pas d&apos;offre &laquo;&nbsp;Basique&nbsp;&raquo; vs &laquo;&nbsp;Pro&nbsp;&raquo; : chaque restaurant
              accède à toute la plateforme.
            </p>
          </Reveal>
          <Reveal className="mt-8 flex justify-center">
            <PricingToggle />
          </Reveal>
          <Reveal>
            <div className="mt-8 rounded-[1.75rem] border border-accent/20 bg-accent/5 p-8 shadow-soft">
              <div className="flex flex-wrap items-baseline justify-center gap-2">
                <span className="text-4xl font-extrabold text-ink">~33 €</span>
                <span className="text-sm text-slate-500">/ mois, facturé ~400 € / an</span>
              </div>
              <p className="mt-2 text-center text-sm text-slate-500">
                14 jours d&apos;essai gratuit, sans carte bancaire.
              </p>
              <ul className="mx-auto mt-6 flex max-w-sm flex-col gap-2.5">
                {PLAN_FEATURES.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex justify-center">
                <Link href="/signup" className="btn-primary px-6 py-3 text-base">
                  Commencer l&apos;essai gratuit
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <WaveDivider className="bg-white text-canvas" />

      <section className="bg-dot-grid py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <div className="rounded-[2rem] border border-accent/15 bg-gradient-to-br from-accent/10 via-white to-white p-10 text-center shadow-soft sm:p-16">
              <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                Prêt à <span className="bg-accent-gradient bg-clip-text text-transparent">digitaliser</span> vos
                tables ?
              </h2>
              <p className="mt-3 text-slate-500">Créez votre restaurant en quelques minutes, sans engagement.</p>
              <div className="mt-6 flex justify-center">
                <Link href="/signup" className="btn-primary px-6 py-3 text-base">
                  Créer mon restaurant
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} {APP_NAME} — nom de travail, non déposé.
      </footer>
    </main>
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
