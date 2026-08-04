import Link from "next/link";
import Logo from "@/components/logo";
import ArabesquePattern from "@/components/arabesque-pattern";
import { APP_NAME } from "@/lib/brand";
import { getLocale } from "@/lib/i18n/get-locale";
import { LANDING_DICT } from "@/lib/i18n/dictionaries/landing";

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
  const locale = getLocale("it");
  const t = LANDING_DICT[locale];

  return (
    <footer className="relative overflow-hidden bg-brand-dark py-14">
      <ArabesquePattern className="pointer-events-none absolute inset-0 h-full w-full" color="#D4AF37" opacity={0.1} />
      <div className="relative mx-auto grid max-w-5xl gap-10 px-6 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="max-w-xs text-sm text-paper/60">{t.footer.tagline}</p>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <p className="font-semibold text-gold-light">{t.footer.productHeading}</p>
          <a href="/#demo" className="w-fit text-paper/70 transition hover:text-gold-light">
            {t.nav.demo}
          </a>
          <a href="/#apercu" className="w-fit text-paper/70 transition hover:text-gold-light">
            {t.nav.overview}
          </a>
          <a href="/#fonctionnalites" className="w-fit text-paper/70 transition hover:text-gold-light">
            {t.nav.features}
          </a>
          <Link href="/prezzi" className="w-fit text-paper/70 transition hover:text-gold-light">
            {t.nav.pricing}
          </Link>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <p className="font-semibold text-gold-light">{t.footer.companyHeading}</p>
          <Link href="/chi-siamo" className="w-fit text-paper/70 transition hover:text-gold-light">
            {t.footer.about}
          </Link>
          <Link href="/contatti" className="w-fit text-paper/70 transition hover:text-gold-light">
            {t.footer.contact}
          </Link>
          <Link href="/login" className="w-fit text-paper/70 transition hover:text-gold-light">
            {t.nav.login}
          </Link>
          <Link href="/signup" className="w-fit text-paper/70 transition hover:text-gold-light">
            {t.nav.signup}
          </Link>
        </div>
      </div>

      <div className="relative mx-auto mt-10 max-w-5xl border-t border-gold/20 px-6 pt-6 text-xs text-paper/50">
        © {new Date().getFullYear()} {APP_NAME}
        {t.footer.copyrightSuffix}
      </div>
    </footer>
  );
}
