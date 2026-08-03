"use server";

import { cookies } from "next/headers";
import { isLanguageCode, LOCALE_COOKIE } from "@/lib/i18n/languages";

export async function setLocaleAction(locale: string) {
  if (!isLanguageCode(locale)) return;
  cookies().set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
