import Link from "next/link";
import Logo from "@/components/logo";
import LanguageSwitcher from "@/components/language-switcher";
import { isRtl, type LanguageCode } from "@/lib/i18n/languages";

export default function AuthShell({
  title,
  subtitle,
  children,
  locale = "fr",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  locale?: LanguageCode;
}) {
  return (
    <main dir={isRtl(locale) ? "rtl" : "ltr"} className="flex min-h-screen flex-col items-center justify-center gap-6 bg-dot-grid px-6 py-12">
      <div className="flex w-full max-w-sm items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
        <LanguageSwitcher current={locale} />
      </div>
      <div className="w-full max-w-sm animate-bump-in">
        <div className="card-static px-6 py-8">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </main>
  );
}
