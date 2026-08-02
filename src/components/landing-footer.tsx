import Link from "next/link";
import Logo from "@/components/logo";
import { APP_NAME, CONTACT_EMAIL } from "@/lib/brand";

/**
 * Structure takes the "logo + link columns + contact" shape from the
 * QonnectQR reference (design/refs/qonnectqr-footer-mobile.jpg) -- a
 * generic SaaS footer convention, not their content. No "Légal" column:
 * there's no privacy policy or terms yet, and a dead link is worse than
 * no link (per user's explicit choice). No social icons either, for the
 * same honesty reason -- no real social presence exists to point to yet.
 */
export default function LandingFooter() {
  return (
    <footer className="border-t border-ink/10 bg-white py-14">
      <div className="mx-auto grid max-w-5xl gap-10 px-6 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted">
            Il menu QR per chi serve ai tavoli — senza hardware, senza abbonamento a un dispositivo.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <p className="font-semibold text-ink">Prodotto</p>
          <a href="#demo" className="nav-link w-fit">
            Demo
          </a>
          <a href="#apercu" className="nav-link w-fit">
            Panoramica
          </a>
          <a href="#fonctionnalites" className="nav-link w-fit">
            Funzionalità
          </a>
          <a href="#tarifs" className="nav-link w-fit">
            Prezzi
          </a>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <p className="font-semibold text-ink">Account</p>
          <Link href="/login" className="nav-link w-fit">
            Accedi
          </Link>
          <Link href="/signup" className="nav-link w-fit">
            Iscriviti
          </Link>
          <a href={`mailto:${CONTACT_EMAIL}`} className="nav-link w-fit">
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-5xl border-t border-ink/10 px-6 pt-6 text-xs text-muted">
        © {new Date().getFullYear()} {APP_NAME} — nome di lavoro, non depositato.
      </div>
    </footer>
  );
}
