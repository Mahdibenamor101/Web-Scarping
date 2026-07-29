"use client";

import Image from "next/image";
import { useState } from "react";

type Tab = {
  id: string;
  label: string;
  icon: React.ReactNode;
  src: string;
  alt: string;
  /** "phone" crops tighter and centers, "browser" shows a wide chrome bar. */
  frame: "phone" | "browser";
  caption: string;
};

const TABS: Tab[] = [
  {
    id: "menu",
    label: "Menu cliente",
    icon: <PhoneIcon />,
    src: "/screenshots/public-menu.png",
    alt: "Menu digitale aperto su un telefono, con carrello e pulsante per ordinare",
    frame: "phone",
    caption: "Il cliente scansiona, sfoglia il menu IT/EN e ordina dal telefono — senza installare nulla.",
  },
  {
    id: "orders",
    label: "Ordini in diretta",
    icon: <BoardIcon />,
    src: "/screenshots/dashboard-orders.png",
    alt: "Bacheca ordini in tre colonne: da fare, in corso, pronto",
    frame: "browser",
    caption: "Ogni ordine arriva in cucina in pochi secondi, aggiornato in diretta senza ricaricare la pagina.",
  },
  {
    id: "tables",
    label: "Tavoli & QR",
    icon: <QrIcon />,
    src: "/screenshots/dashboard-tables.png",
    alt: "Elenco dei tavoli del ristorante con il loro QR code e il loro stato",
    frame: "browser",
    caption: "Un QR per tavolo, generato con un clic — da stampare o esporre, nessun dispositivo da acquistare.",
  },
];

const FIRST_TAB = TABS[0]!;

export default function ProductPreview() {
  const [activeId, setActiveId] = useState(FIRST_TAB.id);
  const active = TABS.find((tab) => tab.id === activeId) ?? FIRST_TAB;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveId(tab.id)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 ${
              tab.id === activeId
                ? "border-brand bg-brand-gradient text-white shadow-soft"
                : "border-ink/10 bg-surface text-muted hover:border-ink/20 hover:text-ink"
            }`}
          >
            <span className={tab.id === activeId ? "text-white" : "text-brand"}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center gap-5">
        <div
          key={active.id}
          className="w-full animate-bump-in"
          style={{ maxWidth: active.frame === "phone" ? "22rem" : "56rem" }}
        >
          {active.frame === "phone" ? (
            <div className="mx-auto w-full max-w-[22rem] rounded-[2.5rem] border-8 border-ink bg-ink p-1.5 shadow-softLg">
              <div className="relative aspect-[9/17.5] w-full overflow-hidden rounded-[2rem] bg-surface">
                <div className="absolute left-1/2 top-0 z-10 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-ink" />
                <Image src={active.src} alt={active.alt} fill sizes="352px" className="object-cover object-top" priority={false} />
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-card border border-ink/10 bg-surface shadow-softLg">
              {/* Window-chrome dots are decorative (a browser-chrome convention), not
                  status indicators -- kept neutral so they don't borrow the app's
                  semantic colors for something that isn't information. */}
              <div className="flex items-center gap-1.5 border-b border-ink/5 bg-paper px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
              </div>
              <div className="relative aspect-[16/10] w-full">
                <Image src={active.src} alt={active.alt} fill sizes="896px" className="object-cover object-top" priority={false} />
              </div>
            </div>
          )}
        </div>
        <p className="max-w-md text-center text-sm text-muted">{active.caption}</p>
      </div>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="6" y="2" width="12" height="20" rx="2.5" />
      <path d="M11 18h2" strokeLinecap="round" />
    </svg>
  );
}

function BoardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16M15 4v16" />
    </svg>
  );
}

function QrIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20v.01" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
