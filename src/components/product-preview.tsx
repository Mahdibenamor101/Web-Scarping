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
    label: "Menu client",
    icon: <PhoneIcon />,
    src: "/screenshots/public-menu.png",
    alt: "Menu digital ouvert sur un téléphone, avec panier et bouton de commande",
    frame: "phone",
    caption: "Le client scanne, parcourt le menu IT/EN et commande depuis son téléphone -- sans rien installer.",
  },
  {
    id: "orders",
    label: "Commandes en direct",
    icon: <BoardIcon />,
    src: "/screenshots/dashboard-orders.png",
    alt: "Tableau de bord des commandes en trois colonnes : à faire, en cours, prêt",
    frame: "browser",
    caption: "Chaque commande arrive en cuisine en quelques secondes, mise à jour en direct sans recharger la page.",
  },
  {
    id: "tables",
    label: "Tables & QR",
    icon: <QrIcon />,
    src: "/screenshots/dashboard-tables.png",
    alt: "Liste des tables du restaurant avec leur QR code et leur statut",
    frame: "browser",
    caption: "Un QR par table, généré en un clic -- à imprimer ou à afficher, aucun matériel à acheter.",
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
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              tab.id === activeId
                ? "border-sky-500 bg-sky-500 text-white shadow-md shadow-sky-500/30"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
            }`}
          >
            <span className={tab.id === activeId ? "text-white" : "text-sky-500"}>{tab.icon}</span>
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
            <div className="mx-auto w-full max-w-[22rem] rounded-[2.5rem] border-8 border-navy bg-navy p-1.5 shadow-2xl shadow-slate-900/20">
              <div className="relative aspect-[9/17.5] w-full overflow-hidden rounded-[2rem] bg-white">
                <div className="absolute left-1/2 top-0 z-10 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-navy" />
                <Image src={active.src} alt={active.alt} fill sizes="352px" className="object-cover object-top" priority={false} />
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
              <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
              </div>
              <div className="relative aspect-[16/10] w-full">
                <Image src={active.src} alt={active.alt} fill sizes="896px" className="object-cover object-top" priority={false} />
              </div>
            </div>
          )}
        </div>
        <p className="max-w-md text-center text-sm text-slate-500">{active.caption}</p>
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
