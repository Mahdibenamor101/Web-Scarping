import Link from "next/link";
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
  { title: "14 allergènes UE", body: "Étiquetage conforme au Règlement (UE) n°1169/2011, plat par plat." },
  { title: "IT / EN", body: "Menu bilingue dès le départ, pensé pour une clientèle touristique." },
  { title: "Temps réel", body: "La commande arrive en cuisine en quelques secondes, pas en rechargeant la page." },
  { title: "Isolation stricte", body: "Chaque restaurant ne voit que ses propres données — appliqué au niveau de la base." },
];

export default function HomePage() {
  return (
    <main>
      <div className="bg-navy text-white">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
          <span className="text-lg font-bold tracking-tight">{APP_NAME}</span>
          <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white">
            Se connecter
          </Link>
        </nav>

        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 pb-20 pt-10 text-center sm:pb-28 sm:pt-16">
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
            <Link href="/login" className="btn-secondary border-white/20 bg-white/5 px-6 py-3 text-base text-white hover:bg-white/10">
              Se connecter
            </Link>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">Comment ça marche</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.n} className="card">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white">
                {step.n}
              </span>
              <h3 className="mt-4 text-base font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">Fait pour l&apos;Italie</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="card">
                <h3 className="text-sm font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} {APP_NAME} — nom de travail, non déposé.
      </footer>
    </main>
  );
}
