import Link from "next/link";
import Logo from "@/components/logo";
import Reveal from "@/components/reveal";
import ProductPreview from "@/components/product-preview";
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
      <div className="relative overflow-hidden bg-navy text-white">
        {/* Soft accent glows + faint grid texture -- self-contained CSS, no image assets */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="pointer-events-none absolute left-1/2 top-[-10rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-sky-500/30 blur-[110px] animate-float" />
        <div className="pointer-events-none absolute bottom-[-8rem] right-[-6rem] h-[20rem] w-[20rem] rounded-full bg-indigo-500/20 blur-[100px] animate-float-delayed" />

        <nav className="relative mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
          <Logo />
          <div className="hidden items-center gap-7 text-sm font-medium text-slate-300 sm:flex">
            <a href="#apercu" className="transition hover:text-white">
              Aperçu
            </a>
            <a href="#fonctionnalites" className="transition hover:text-white">
              Fonctionnalités
            </a>
            <a href="#tarifs" className="transition hover:text-white">
              Tarifs
            </a>
          </div>
          <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white">
            Se connecter
          </Link>
        </nav>

        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 pb-24 pt-10 text-center sm:pb-32 sm:pt-16">
          <span className="badge bg-sky-500/10 text-sky-300">Menu QR &amp; commande à table</span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Le QR sur la table.
            <br />
            La commande en cuisine.
          </h1>
          <p className="max-w-xl text-balance text-lg text-slate-300">
            Menu multilingue, allergènes conformes, commandes en temps réel — sans matériel à installer, sans
            abonnement à un boîtier.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <Link href="/signup" className="btn-primary px-6 py-3 text-base">
              Créer mon restaurant
            </Link>
            <a href="#apercu" className="btn-secondary border-white/20 bg-white/5 px-6 py-3 text-base text-white hover:bg-white/10">
              Voir le produit
            </a>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-400">
            {TRUST_BADGES.map((badge) => (
              <span key={badge.label} className="inline-flex items-center gap-1.5">
                <span className="text-sky-400">{badge.icon}</span>
                {badge.label}
              </span>
            ))}
          </div>
        </div>

        <svg
          className="relative block w-full text-slate-50"
          viewBox="0 0 1440 60"
          fill="currentColor"
          preserveAspectRatio="none"
        >
          <path d="M0,32 C320,72 1120,-8 1440,32 L1440,60 L0,60 Z" />
        </svg>
      </div>

      <section id="apercu" className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <Reveal className="text-center">
          <span className="badge">Aperçu du produit</span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">Voyez-le en action</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
            Ce sont de vraies captures de l&apos;application — pas des maquettes.
          </p>
        </Reveal>
        <Reveal delayMs={100} className="mt-10">
          <ProductPreview />
        </Reveal>
      </section>

      <section id="comment-ca-marche" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">Comment ça marche</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delayMs={i * 100}>
                <div className="card h-full transition hover:-translate-y-0.5 hover:shadow-md">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white">
                    {step.n}
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="fonctionnalites" className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">Fait pour l&apos;Italie</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, i) => (
              <Reveal key={feature.title} delayMs={i * 80}>
                <div className="card h-full transition hover:-translate-y-0.5 hover:shadow-md">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                    {feature.icon}
                  </span>
                  <h3 className="mt-3 text-sm font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{feature.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="tarifs" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-6">
          <Reveal className="text-center">
            <span className="badge">Tarifs</span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">Un seul plan. Tout inclus.</h2>
            <p className="mt-2 text-sm text-slate-500">
              Pas d&apos;offre &laquo;&nbsp;Basique&nbsp;&raquo; vs &laquo;&nbsp;Pro&nbsp;&raquo; : chaque restaurant
              accède à toute la plateforme.
            </p>
          </Reveal>
          <Reveal delayMs={100}>
            <div className="mt-8 rounded-3xl border border-sky-200 bg-sky-50/40 p-8 shadow-lg shadow-sky-500/10">
              <div className="flex flex-wrap items-baseline justify-center gap-2">
                <span className="text-4xl font-bold text-slate-900">~33 €</span>
                <span className="text-sm text-slate-500">/ mois, facturé ~400 € / an</span>
              </div>
              <p className="mt-2 text-center text-sm text-slate-500">
                14 jours d&apos;essai gratuit, sans carte bancaire.
              </p>
              <ul className="mx-auto mt-6 flex max-w-sm flex-col gap-2.5">
                {PLAN_FEATURES.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
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

      <section className="relative overflow-hidden bg-navy py-16 text-center text-white sm:py-20">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/20 blur-[100px]" />
        <Reveal className="relative mx-auto max-w-xl px-6">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Prêt à digitaliser vos tables ?</h2>
          <p className="mt-3 text-slate-300">Créez votre restaurant en quelques minutes, sans engagement.</p>
          <div className="mt-6">
            <Link href="/signup" className="btn-primary px-6 py-3 text-base">
              Créer mon restaurant
            </Link>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-400">
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
