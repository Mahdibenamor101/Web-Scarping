// Site-wide language list for the language switcher (nav icon on landing,
// dashboard, and auth pages). Distinct from the public menu page's own
// content-translation system (menu item names/descriptions per language,
// see src/app/menu/[qrToken]/page.tsx) -- this one translates the app's own
// UI chrome, that one translates a restaurant's menu content.
export type LanguageCode = "fr" | "it" | "en" | "es" | "de" | "ar";

export interface LanguageMeta {
  code: LanguageCode;
  /** Name of the language, written in that language itself. */
  nativeLabel: string;
  rtl?: boolean;
}

export const LANGUAGES: LanguageMeta[] = [
  { code: "fr", nativeLabel: "Français" },
  { code: "it", nativeLabel: "Italiano" },
  { code: "en", nativeLabel: "English" },
  { code: "es", nativeLabel: "Español" },
  { code: "de", nativeLabel: "Deutsch" },
  { code: "ar", nativeLabel: "العربية", rtl: true },
];

export const LOCALE_COOKIE = "mbqr_locale";

export function isLanguageCode(value: string | undefined | null): value is LanguageCode {
  return !!value && LANGUAGES.some((entry) => entry.code === value);
}

export function isRtl(code: LanguageCode): boolean {
  return LANGUAGES.find((entry) => entry.code === code)?.rtl ?? false;
}
