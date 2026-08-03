"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LANGUAGES, type LanguageCode } from "@/lib/i18n/languages";
import { setLocaleAction } from "@/lib/i18n/set-locale-action";
import { LOCALE_CHANGE_EVENT } from "@/lib/i18n/use-locale";

/**
 * Globe icon + dropdown, used on the landing nav, auth pages, and dashboard
 * shell. Picking a language writes a cookie (setLocaleAction, server-side)
 * then refreshes the current route so every server component re-renders
 * with the new locale -- no client-side dictionary loading needed.
 *
 * `variant` follows the two color contexts the switcher lives in: "light"
 * for the white/ivory landing+auth chrome, "dark" for the dashboard's
 * near-black sidebar (src/app/dashboard/layout.tsx).
 */
export default function LanguageSwitcher({
  current,
  variant = "light",
}: {
  current: LanguageCode;
  variant?: "light" | "dark";
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function pick(code: LanguageCode) {
    setOpen(false);
    if (code === current) return;
    // Fires immediately so pages that are entirely client components (the
    // auth pages, see useLocale/CONTEXT.md §12.30) update right away --
    // router.refresh() below only re-renders server components, which is
    // all that's needed on server-rendered pages (landing, dashboard) but
    // does nothing on a page with no server component in its tree.
    window.dispatchEvent(new CustomEvent(LOCALE_CHANGE_EVENT, { detail: code }));
    startTransition(async () => {
      await setLocaleAction(code);
      router.refresh();
    });
  }

  const triggerClass =
    variant === "dark"
      ? "border-white/10 text-white/70 hover:border-white/20 hover:text-white"
      : "border-ink/10 text-ink/70 hover:border-ink/20 hover:text-ink";
  const menuClass =
    variant === "dark" ? "border-white/10 bg-dash-card text-white/80 shadow-dark" : "border-ink/10 bg-white text-ink shadow-softLg";

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Cambia lingua / Changer de langue"
        disabled={isPending}
        className={`flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold uppercase tracking-wide transition disabled:opacity-60 ${triggerClass}`}
      >
        <GlobeIcon />
        {current}
      </button>
      {open && (
        <div
          role="menu"
          className={`absolute right-0 top-full z-30 mt-2 w-44 animate-bump-in overflow-hidden rounded-card border py-1 text-sm ${menuClass}`}
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              role="menuitem"
              onClick={() => pick(lang.code)}
              className={`flex w-full items-center justify-between gap-3 px-3.5 py-2 text-left transition hover:bg-brand/10 ${
                lang.code === current ? "font-semibold text-brand" : ""
              }`}
            >
              <span dir={lang.rtl ? "rtl" : "ltr"}>{lang.nativeLabel}</span>
              {lang.code === current && <CheckIcon />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function GlobeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M4 12l6 6L20 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
