"use client";

import { useEffect, useState } from "react";
import { isLanguageCode, LOCALE_COOKIE, type LanguageCode } from "@/lib/i18n/languages";

export const LOCALE_CHANGE_EVENT = "mbqr-locale-change";

function readCookieLocale(): LanguageCode | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]+)`));
  const value = match?.[1] ? decodeURIComponent(match[1]) : null;
  return isLanguageCode(value) ? value : null;
}

/**
 * Client-side locale read for pages that are entirely client components
 * (the auth pages -- see CONTEXT.md §12.30) and so have no server parent
 * around to call next/headers cookies() from directly. Same SSR-safe
 * two-phase pattern already used by useSafeReducedMotion: starts at
 * `defaultLocale` (whatever SSR rendered, no `document` access yet) and
 * flips to the real cookie value in an effect after mount, so hydration
 * never mismatches.
 */
export function useLocale(defaultLocale: LanguageCode): LanguageCode {
  const [locale, setLocale] = useState<LanguageCode>(defaultLocale);
  useEffect(() => {
    const fromCookie = readCookieLocale();
    if (fromCookie) setLocale(fromCookie);

    function onChange(e: Event) {
      const code = (e as CustomEvent<LanguageCode>).detail;
      if (isLanguageCode(code)) setLocale(code);
    }
    window.addEventListener(LOCALE_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(LOCALE_CHANGE_EVENT, onChange);
  }, []);
  return locale;
}
