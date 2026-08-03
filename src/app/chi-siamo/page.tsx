import Link from "next/link";
import Reveal, { StaggerGroup, StaggerItem } from "@/components/reveal";
import LandingNav from "@/components/landing-nav";
import LandingFooter from "@/components/landing-footer";
import { getLocale } from "@/lib/i18n/get-locale";

export const metadata = { title: "Chi siamo — mbQr" };

// Honest "about" page, product-focused rather than founder-biography --
// no invented founding story or personal history is asserted here, only
// what's genuinely true about the product and its current stage (same
// discipline as PILLARS/STATS on the landing page, see CONTEXT.md §12.22).
// The "stato attuale" section turns the project's real early stage into an
// explicit trust pitch instead of hiding it behind invented numbers.
const PRINCIPLES = [
  {
    title: "Il tuo locale resta protagonista",
    body: "Il menu che i clienti vedono porta il tuo logo e le tue foto — mbQr resta invisibile, non un marchio in più da spiegare.",
    icon: <StoreIcon />,
  },
  {
    title: "Isolamento dei dati",
    body: "Ogni ristorante vede solo i propri dati, applicato a livello di database — non solo nell'interfaccia.",
    icon: <LockIcon />,
  },
  {
    title: "Nessun hardware da comprare",
    body: "Funziona su qualunque smartphone, dal lato cliente e dal lato cucina. Un QR per tavolo, stampato una volta.",
    icon: <PhoneIcon />,
  },
  {
    title: "Un prezzo, tutto incluso",
    body: "Nessuna funzionalità bloccata dietro un piano superiore — l'abbonamento dà accesso all'intera piattaforma.",
    icon: <TagIcon />,
  },
];

export default function AboutPage() {
  const locale = getLocale("it");
  return (
    <div className="min-h-screen bg-paper">
      <LandingNav locale={locale} />
      <main className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
        <Reveal className="text-center">
          <span className="eyebrow">Chi siamo</span>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            Un menu digitale, <span className="bg-brand-gradient bg-clip-text text-transparent">pensato dalla cucina</span>{" "}
            in su.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted">
            mbQr nasce per dare a ogni ristorante un menu QR e un sistema di ordini in tempo reale, senza hardware
            dedicato né un abbonamento per dispositivo.
          </p>
        </Reveal>

        <StaggerGroup className="mt-14 grid gap-5 sm:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <StaggerItem key={p.title} className="card flex flex-col gap-2">
              <span className="text-brand">{p.icon}</span>
              <h2 className="font-display text-lg font-extrabold text-ink">{p.title}</h2>
              <p className="text-sm text-muted">{p.body}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <Reveal className="mt-16 rounded-container border border-ink/10 bg-surface p-8 text-center sm:p-10">
          <span className="eyebrow">Stato attuale</span>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted">
            mbQr è agli inizi: stiamo aprendo le prime collaborazioni con ristoranti reali. Non troverai qui numeri di
            clienti o di scansioni gonfiati — solo quello che il prodotto sa fare oggi, verificabile in prima persona
            con la prova gratuita di 14 giorni, senza carta di credito.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/signup" className="btn-primary px-6 py-3 text-base">
              Prova gratuita
            </Link>
            <Link href="/contatti" className="btn-secondary px-6 py-3 text-base">
              Contattaci
            </Link>
          </div>
        </Reveal>
      </main>
      <LandingFooter />
    </div>
  );
}

function StoreIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l1-5h16l1 5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 9a2 2 0 004 0 2 2 0 004 0 2 2 0 004 0 2 2 0 004 0" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 9v10h14V9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 19v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 018 0v4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="6" y="2" width="12" height="20" rx="2.5" />
      <path d="M11 18h2" strokeLinecap="round" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.59 13.41L11 3.83A2 2 0 009.53 3.2L3.2 3.2A1 1 0 002.2 4.2l0 6.33a2 2 0 00.59 1.42l9.59 9.58a2 2 0 002.82 0l5.39-5.39a2 2 0 000-2.82z" />
      <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
