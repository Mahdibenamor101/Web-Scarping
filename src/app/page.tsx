import Link from "next/link";
import { APP_NAME } from "@/lib/brand";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-2xl font-semibold">{APP_NAME}</h1>
      <p className="text-slate-600">
        Menu QR digital et commande à table. Phase 0 — fondations en cours.
      </p>
      <div className="flex gap-3">
        <Link
          href="/signup"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Créer mon restaurant
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100"
        >
          Se connecter
        </Link>
      </div>
    </main>
  );
}
