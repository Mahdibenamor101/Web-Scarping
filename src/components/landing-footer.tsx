import Link from "next/link";
import Logo from "@/components/logo";
import ArabesquePattern from "@/components/arabesque-pattern";
import { APP_NAME } from "@/lib/brand";

/**
 * Structure takes the "logo + link columns + contact" shape from the
 * QonnectQR reference (design/refs/qonnectqr-footer-mobile.jpg) -- a
 * generic SaaS footer convention, not their content. No "Légal" column:
 * there's no privacy policy or terms yet, and a dead link is worse than
 * no link (per user's explicit choice). No social icons either, for the
 * same honesty reason -- no real social presence exists to point to yet.
 *
 * "Oriental Luxury" direction: dark emerald ground + gold geometric
 * watermark + cream/gold text, per the brief's footer spec -- the one
 * section of the page besides the final CTA that's allowed to break from
 * the ivory ground the rest of the site sits on.
 */
export default function LandingFooter() {
  return (
    <footer className="relative overflow-hidden bg-brand-dark py-14">
      <ArabesquePattern className="pointer-events-none absolute inset-0 h-full w-full" color="#D4AF37" opacity={0.1} />
      <div className="relative mx-auto grid max-w-5xl gap-10 px-6 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <Logo wordmarkClassName="font-display text-xl font-extrabold tracking-tight text-paper" />
          <p className="max-w-xs text-sm text-paper/60">
            Il menu QR per chi serve ai tavoli — senza hardware, senza abbonamento a un dispositivo.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <p className="font-semibold text-gold-light">Prodotto</p>
          <a href="/#demo" className="w-fit text-paper/70 transition hover:text-gold-light">
            Demo
          </a>
          <a href="/#apercu" className="w-fit text-paper/70 transition hover:text-gold-light">
            Panoramica
          </a>
          <a href="/#fonctionnalites" className="w-fit text-paper/70 transition hover:text-gold-light">
            Funzionalità
          </a>
          <Link href="/prezzi" className="w-fit text-paper/70 transition hover:text-gold-light">
            Prezzi
          </Link>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <p className="font-semibold text-gold-light">Azienda</p>
          <Link href="/chi-siamo" className="w-fit text-paper/70 transition hover:text-gold-light">
            Chi siamo
          </Link>
          <Link href="/contatti" className="w-fit text-paper/70 transition hover:text-gold-light">
            Contatti
          </Link>
          <Link href="/login" className="w-fit text-paper/70 transition hover:text-gold-light">
            Accedi
          </Link>
          <Link href="/signup" className="w-fit text-paper/70 transition hover:text-gold-light">
            Iscriviti
          </Link>
        </div>
      </div>

      <div className="relative mx-auto mt-10 max-w-5xl border-t border-gold/20 px-6 pt-6 text-xs text-paper/50">
        © {new Date().getFullYear()} {APP_NAME} — nome di lavoro, non depositato.
      </div>
    </footer>
  );
}
