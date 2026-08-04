import type { LanguageCode } from "@/lib/i18n/languages";

// Maps our six UI language codes to a concrete BCP 47 tag for
// Intl.DateTimeFormat/toLocaleTimeString/toLocaleDateString calls. Several
// dashboard pages used to hardcode "it-IT" for these regardless of the
// actual UI language chosen (see CONTEXT.md's dashboard-subpages i18n
// section) -- this is the small shared lookup that replaces that.
const INTL_LOCALE: Record<LanguageCode, string> = {
  fr: "fr-FR",
  it: "it-IT",
  en: "en-GB",
  es: "es-ES",
  de: "de-DE",
  ar: "ar",
};

export function toIntlLocale(code: LanguageCode): string {
  return INTL_LOCALE[code];
}
