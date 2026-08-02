import Link from "next/link";
import Reveal, { StaggerGroup, StaggerItem } from "@/components/reveal";
import ProductPreview from "@/components/product-preview";
import HeroMockup from "@/components/hero-mockup";
import DemoVideo from "@/components/demo-video";
import StatCounter from "@/components/stat-counter";
import PricingToggle from "@/components/pricing-toggle";
import LandingNav from "@/components/landing-nav";
import LandingFooter from "@/components/landing-footer";
import FaqAccordion from "@/components/faq-accordion";
import { PLAN_FEATURES } from "@/lib/landing-content";

// Landing copy is in Italian end to end (dashboard and auth stay in
// French -- see CONTEXT.md). The public menu page has its own separate
// IT/EN toggle and is unrelated to this.
const STEPS = [
  {
    n: "01",
    title: "Il cliente scansiona",
    body: "Un QR per tavolo. Niente da installare, il menu si apre nel browser.",
  },
  {
    n: "02",
    title: "Ordina dal telefono",
    body: "Menu in italiano e inglese, allergeni indicati su ogni piatto.",
  },
  {
    n: "03",
    title: "Arriva in cucina, in diretta",
    body: "Da fare, in corso, pronto — aggiornato senza ricaricare la pagina.",
  },
];

// Three-pillar "why" overview, positioned right after the hero -- a
// structural pattern noticed on a competitor's site (menuqrcode.tn,
// see CONTEXT.md), adapted with mbQr's own real product capabilities.
// Every bullet is a genuine, checkable feature (same discipline as
// STATS below), never a business-outcome claim ("+20% di vendite" etc.)
// that would need real customer data mbQr doesn't have yet.
const PILLARS = [
  {
    title: "Efficienza operativa",
    icon: <ClockIcon />,
    points: [
      "L'ordine arriva in cucina in pochi secondi, senza passare dal cameriere",
      "Nessuna ristampa: un prezzo o un piatto si aggiorna in un clic",
    ],
  },
  {
    title: "Esperienza cliente",
    icon: <PhoneIcon />,
    points: [
      "Il menu si apre subito nel browser, senza installare nulla",
      "Sempre aggiornato: nessun piatto esaurito segnato ancora disponibile",
    ],
  },
  {
    title: "Meno carta",
    icon: <LeafIcon />,
    points: [
      "Un solo menu digitale al posto di ristampe ad ogni cambio di stagione",
      "Il QR si stampa una volta sola, per tavolo, non ad ogni modifica",
    ],
  },
] as const;

const FEATURES = [
  {
    title: "14 allergeni UE",
    body: "Etichettatura conforme al Regolamento (UE) n. 1169/2011, piatto per piatto.",
    icon: <ShieldIcon />,
  },
  {
    title: "IT / EN",
    body: "Menu bilingue fin dall'inizio, pensato per una clientela turistica.",
    icon: <GlobeIcon />,
  },
  {
    title: "Tempo reale",
    body: "L'ordine arriva in cucina in pochi secondi, senza ricaricare la pagina.",
    icon: <BoltIcon />,
  },
  {
    title: "Isolamento rigoroso",
    body: "Ogni ristorante vede solo i propri dati — applicato a livello di database.",
    icon: <LockIcon />,
  },
];

// Genuine, checkable facts about the product itself -- not fabricated usage
// or customer numbers. No pilot has run yet (CONTEXT.md §9 Phase A), so
// there is no real "X restaurants" or "X ordini/mese" to show.
const STATS = [
  { value: 14, suffix: "", label: "Allergeni UE etichettati" },
  { value: 2, suffix: "", label: "Lingue, IT / EN, fin dall'inizio" },
  { value: 100, suffix: "%", label: "Dati isolati per ristorante" },
  { value: 0, suffix: " €", label: "Hardware aggiuntivo da acquistare" },
];

const TRUST_BADGES = [
  { icon: <BoltIcon className="h-4 w-4" />, label: "Operativo in pochi minuti" },
  { icon: <CardIcon className="h-4 w-4" />, label: "Senza carta di credito" },
  { icon: <StarIcon className="h-4 w-4" />, label: "14 giorni di prova gratuita" },
];

const PERSONAS = [
  {
    title: "Trattoria & ristorante",
    body: "Menu strutturato in categorie, allergeni su ogni piatto, ordini gestiti in cucina in diretta.",
    icon: <UtensilsIcon />,
  },
  {
    title: "Pizzeria",
    body: "Impasti e stagionali che cambiano spesso: si aggiornano dal pannello, senza ristampare nulla.",
    icon: <PizzaIcon />,
  },
  {
    title: "Bar & enoteca",
    body: "Carta vini o cocktail, ordini rapidi al tavolo, aggiornati al volo quando qualcosa finisce.",
    icon: <WineIcon />,
  },
];

// White-label: what the owner controls, in the order they'd set it up.
const BRANDING_STEPS = [
  { title: "Carica il tuo logo", body: "Sostituisce il logo mbQr in cima al menu del cliente." },
  { title: "Scegli uno sfondo", body: "Una foto del locale, dei piatti, o una tinta — quello che preferisci." },
  { title: "Il tuo nome resta protagonista", body: "mbQr resta invisibile: il cliente vede il tuo locale, non noi." },
];

// Real, checkable differences -- not marketing exaggeration. Every line on
// the "menu di carta" side is a genuine limitation of a printed menu, every
// line on the QR side is a feature that actually exists in the product.
const COMPARISON = [
  { paper: "Cambiare un prezzo: bisogna ristampare tutto", qr: "Si aggiorna in un clic, subito visibile" },
  { paper: "Allergeni scritti a mano, facili da dimenticare", qr: "Etichettati su ogni piatto, sempre aggiornati" },
  { paper: "Una stampa diversa per ogni lingua", qr: "Italiano e inglese nello stesso menu" },
  { paper: "Un piatto finito? Il cameriere lo dice a voce, tavolo per tavolo", qr: "Segnato non disponibile in un tap, sparisce ovunque" },
  { paper: "L'ordine arriva in cucina scritto a mano", qr: "Arriva in diretta, aggiornato in tempo reale" },
];

const FAQ_ITEMS = [
  {
    question: "Serve un hardware particolare?",
    answer:
      "No. Il cliente usa il proprio telefono, in sala/cucina basta un telefono, un tablet o un computer già esistente. Il QR si stampa o si espone su ogni tavolo.",
  },
  {
    question: "Il menu è conforme al regolamento UE sugli allergeni?",
    answer:
      "Sì. I 14 allergeni previsti dal Regolamento (UE) n. 1169/2011 sono etichettati piatto per piatto, direttamente dal pannello.",
  },
  {
    question: "Posso modificare il menu da solo, senza assistenza?",
    answer: "Sì. Categorie, piatti, prezzi e disponibilità si gestiscono dal pannello, in autonomia, in qualsiasi momento.",
  },
  {
    question: "I dati del mio ristorante sono isolati da quelli degli altri clienti?",
    answer: "Sì, l'isolamento è applicato a livello di database, non solo lato applicazione — vedi la funzionalità \"Isolamento rigoroso\" più sopra.",
  },
  {
    question: "Posso mettere il mio logo al posto del vostro?",
    answer: "Sì. Logo e sfondo del menu pubblico sono personalizzabili dal pannello — vedi \"Il tuo marchio, non il nostro\" più sopra.",
  },
  {
    question: "Il menu funziona su tutti gli smartphone?",
    answer: "Sì, si apre direttamente nel browser dopo la scansione del QR — nessuna app da installare.",
  },
  {
    question: "Posso disdire quando voglio?",
    answer: "Sì, l'abbonamento si gestisce dal pannello (sezione Abbonamento), in autonomia, in qualsiasi momento.",
  },
];

export default function HomePage() {
  return (
    <main lang="it">
      <LandingNav />

      {/* Hero -- light steel-paper ground, dot texture + soft marigold halo
          behind the floating phone. No scroll-linked motion (explicit
          choice, see CONTEXT.md "pas de parallax") -- the continuous
          movement lives in the floating cards and the signature comanda
          inside HeroMockup instead. */}
      <div className="relative overflow-hidden bg-dot-grid">
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-6 pb-10 pt-6 sm:grid-cols-2 sm:gap-4 sm:pb-20 sm:pt-14">
          <div className="flex flex-col items-start gap-6 text-left">
            <span className="eyebrow">Menu QR e ordini al tavolo</span>
            <h1 className="font-display text-6xl font-extrabold leading-[0.98] tracking-tight text-ink sm:text-7xl lg:text-[5.5rem]">
              Il menu <span className="bg-brand-gradient bg-clip-text text-transparent">parla</span>.
              <br />
              La cucina <span className="bg-brand-gradient bg-clip-text text-transparent">ascolta</span>.
            </h1>
            <p className="max-w-md text-lg text-muted">
              Ogni ordine diventa una comanda digitale che viaggia dal tavolo alla cucina in tempo reale — senza
              hardware da installare, senza abbonamento a un dispositivo.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/signup" className="btn-primary px-6 py-3 text-base">
                Crea il tuo ristorante
              </Link>
              <a href="#apercu" className="btn-secondary px-6 py-3 text-base">
                Guarda il prodotto
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs font-medium text-muted">
              {TRUST_BADGES.map((badge) => (
                <span key={badge.label} className="inline-flex items-center gap-1.5">
                  <span className="text-brand">{badge.icon}</span>
                  {badge.label}
                </span>
              ))}
            </div>
          </div>

          <HeroMockup />
        </div>

        <div className="bg-rail-top h-px w-full" />
      </div>

      <section className="bg-dot-grid py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal className="text-center">
            <span className="eyebrow">Perché mbQr</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Cosa cambia per il tuo <span className="bg-brand-gradient bg-clip-text text-transparent">locale</span>
            </h2>
          </Reveal>
          <StaggerGroup className="mt-10 grid gap-6 sm:grid-cols-3">
            {PILLARS.map((pillar) => (
              <StaggerItem key={pillar.title}>
                <div className="card h-full">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    {pillar.icon}
                  </span>
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

      <section id="demo" className="bg-surface py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <span className="eyebrow">Demo</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Guardalo <span className="bg-brand-gradient bg-clip-text text-transparent">funzionare</span>
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted">
              Una vera registrazione dell&apos;applicazione — scansione, menu, carrello, ordine inviato.
            </p>
          </Reveal>
          <Reveal className="mt-12">
            <DemoVideo />
          </Reveal>
        </div>
      </section>

      <section id="apercu" className="bg-dot-grid py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal className="text-center">
            <span className="eyebrow">Anteprima del prodotto</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Guardalo in <span className="bg-brand-gradient bg-clip-text text-transparent">azione</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
              Sono vere schermate dell&apos;applicazione — non dei mockup.
            </p>
          </Reveal>
          <Reveal className="mt-10">
            <ProductPreview />
          </Reveal>
        </div>
      </section>

      <section id="comment-ca-marche" className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal className="text-center">
            <span className="eyebrow">Tre passaggi</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Come <span className="bg-brand-gradient bg-clip-text text-transparent">funziona</span>
            </h2>
          </Reveal>
          <StaggerGroup className="mt-10 grid gap-6 sm:grid-cols-3">
            {STEPS.map((step) => (
              <StaggerItem key={step.n}>
                <div className="ticket h-full !pt-7">
                  <span className="font-mono text-xs font-bold tracking-wide text-brand">{step.n}</span>
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
            <span className="eyebrow">Funzionalità</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Pensato per l&apos;<span className="bg-brand-gradient bg-clip-text text-transparent">Italia</span>
            </h2>
          </Reveal>
          <StaggerGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <StaggerItem key={feature.title}>
                <div className="card h-full">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    {feature.icon}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-extrabold text-ink">{feature.title}</h3>
                  <p className="mt-1 text-sm text-muted">{feature.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section id="marchio" className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-10 sm:grid-cols-[0.9fr_1.1fr] sm:items-center">
            <Reveal>
              <span className="eyebrow">Il tuo marchio</span>
              <h2 className="mt-4 font-display text-3xl font-extrabold leading-[1.02] tracking-tight text-ink sm:text-4xl">
                Il menu porta il <span className="bg-brand-gradient bg-clip-text text-transparent">tuo</span> nome,
                non il nostro.
              </h2>
              <p className="mt-3 max-w-md text-sm text-muted">
                Carica il logo e un&apos;immagine di sfondo del tuo locale dal pannello. Quando un cliente scansiona
                il QR, arriva su un menu che sembra il tuo — mbQr resta dietro le quinte.
              </p>
            </Reveal>
            <StaggerGroup className="grid gap-4">
              {BRANDING_STEPS.map((step, i) => (
                <StaggerItem key={step.title}>
                  <div className="ticket flex items-start gap-4 !pt-6">
                    <span className="font-mono text-xs font-bold text-brand">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="font-display text-base font-extrabold text-ink">{step.title}</h3>
                      <p className="mt-0.5 text-sm text-muted">{step.body}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </section>

      <section id="per-chi" className="bg-dot-grid py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal className="text-center">
            <span className="eyebrow">Per ogni tipo di locale</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Pensato per il tuo <span className="bg-brand-gradient bg-clip-text text-transparent">locale</span>
            </h2>
          </Reveal>
          <StaggerGroup className="mt-10 grid gap-6 sm:grid-cols-3">
            {PERSONAS.map((persona) => (
              <StaggerItem key={persona.title}>
                <div className="card h-full">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    {persona.icon}
                  </span>
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
            <span className="eyebrow">In concreto</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Quello che il prodotto <span className="bg-brand-gradient bg-clip-text text-transparent">fa davvero</span>
            </h2>
          </Reveal>
          <StaggerGroup className="mt-10 grid gap-6 sm:grid-cols-4">
            {STATS.map((stat) => (
              <StaggerItem key={stat.label} className="text-center">
                <p className="font-mono text-4xl font-extrabold tabular-nums tracking-tight text-ink sm:text-5xl">
                  <StatCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm text-muted">{stat.label}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="bg-dot-grid py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <Reveal className="text-center">
            <span className="eyebrow">Perché passare al digitale</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Carta o <span className="bg-brand-gradient bg-clip-text text-transparent">QR</span>?
            </h2>
          </Reveal>
          <Reveal className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-card border border-ink/10 bg-surface p-6 shadow-soft">
              <h3 className="font-display text-base font-extrabold text-muted">Menu di carta</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {COMPARISON.map((row) => (
                  <li key={row.paper} className="flex items-start gap-2 text-sm text-ink/70">
                    <MinusIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
                    {row.paper}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-card border border-brand/20 bg-brand/5 p-6 shadow-soft">
              <h3 className="font-display text-base font-extrabold text-brand-dark">Menu QR mbQr</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {COMPARISON.map((row) => (
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
            <span className="eyebrow">Prezzi</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Un solo piano. <span className="bg-brand-gradient bg-clip-text text-transparent">Tutto incluso.</span>
            </h2>
            <p className="mt-3 text-sm text-muted">
              Nessuna offerta &laquo;&nbsp;Base&nbsp;&raquo; contro &laquo;&nbsp;Pro&nbsp;&raquo;: ogni ristorante
              accede a tutta la piattaforma.
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
              <p className="mt-2 text-center text-sm text-muted">
                14 giorni di prova gratuita, senza carta di credito.
              </p>
              <ul className="mx-auto mt-6 flex max-w-sm flex-col gap-2.5">
                {PLAN_FEATURES.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink/80">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col items-center gap-3">
                <Link href="/signup" className="btn-primary px-6 py-3 text-base">
                  Inizia la prova gratuita
                </Link>
                <Link href="/prezzi" className="nav-link text-sm">
                  Vedi tutti i dettagli →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="faq" className="bg-dot-grid py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-6">
          <Reveal className="text-center">
            <span className="eyebrow">Domande frequenti</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Le domande più <span className="bg-brand-gradient bg-clip-text text-transparent">comuni</span>
            </h2>
          </Reveal>
          <Reveal className="mt-10">
            <FaqAccordion items={FAQ_ITEMS} />
          </Reveal>
        </div>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <div className="rounded-container border border-brand/15 bg-gradient-to-br from-brand/10 via-white to-white p-10 text-center shadow-soft sm:p-16">
              <h2 className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
                Pronto a <span className="bg-brand-gradient bg-clip-text text-transparent">digitalizzare</span> i
                tuoi tavoli?
              </h2>
              <p className="mt-3 text-muted">Crea il tuo ristorante in pochi minuti, senza impegno.</p>
              <div className="mt-6 flex justify-center">
                <Link href="/signup" className="btn-primary px-6 py-3 text-base">
                  Crea il tuo ristorante
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
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
