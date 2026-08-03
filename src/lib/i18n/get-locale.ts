import { cookies } from "next/headers";
import { isLanguageCode, LOCALE_COOKIE, type LanguageCode } from "@/lib/i18n/languages";

// Server-side read of the visitor's chosen UI language. Falls back to
// `defaultLocale` (per call site: "it" for the landing pages, "fr" for
// auth/dashboard -- the two languages this codebase was originally written
// in, see CONTEXT.md) so a first-time visitor sees exactly what they saw
// before this feature existed, until they actively pick something else.
export function getLocale(defaultLocale: LanguageCode): LanguageCode {
  const raw = cookies().get(LOCALE_COOKIE)?.value;
  return isLanguageCode(raw) ? raw : defaultLocale;
}
