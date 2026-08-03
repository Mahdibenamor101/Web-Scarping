"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/logo";

// Homepage-relative ("/#demo") rather than bare "#demo": this nav is also
// reused on the standalone /prezzi, /chi-siamo, /contatti pages (see
// LandingFooter), where a bare hash would just no-op instead of jumping to
// the homepage section. Shared between the desktop row and the mobile
// drawer below so the two can't drift out of sync.
const NAV_LINKS = [
  { href: "/#demo", label: "Demo" },
  { href: "/#apercu", label: "Panoramica" },
  { href: "/#fonctionnalites", label: "Funzionalità" },
  { href: "/prezzi", label: "Prezzi" },
  { href: "/#faq", label: "FAQ" },
];

/**
 * Sticky nav that stays transparent over the hero and picks up a
 * blurred white background + shadow once the page scrolls -- the
 * "does the nav bar stay put and adapt" pattern from apple.com. Lives
 * outside the hero's `overflow-hidden` wrapper (see page.tsx) so
 * `position: sticky` isn't clipped once the hero scrolls out of view.
 *
 * Below `sm`, the link row and "Accedi" both hide (no room) leaving only
 * "Iscriviti" -- a hamburger button opens a right-hand drawer with every
 * link plus both buttons instead.
 */
export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock background scroll while the drawer is open, same reasoning as the
  // cart sheet on the public menu page.
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  function renderLink(link: (typeof NAV_LINKS)[number], className: string, onClick?: () => void) {
    return link.href.startsWith("/#") ? (
      <a key={link.href} href={link.href} className={className} onClick={onClick}>
        {link.label}
      </a>
    ) : (
      <Link key={link.href} href={link.href} className={className} onClick={onClick}>
        {link.label}
      </Link>
    );
  }

  return (
    <nav
      className={`sticky top-0 z-40 border-b transition-all duration-300 ${
        scrolled ? "border-ink/10 bg-white/80 shadow-soft backdrop-blur-md" : "border-transparent bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-6 transition-[padding] duration-300 ${
          scrolled ? "py-3" : "py-6"
        }`}
      >
        <Logo />
        <div className="hidden items-center gap-7 text-sm font-medium sm:flex">
          {NAV_LINKS.map((link) => renderLink(link, "nav-link"))}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="nav-link hidden text-sm font-medium sm:inline">
            Accedi
          </Link>
          <Link href="/signup" className="btn-primary hidden px-4 py-2 text-sm sm:inline-block">
            Iscriviti
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Apri il menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink sm:hidden"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {/* Backdrop + right-hand drawer, always mounted (not conditionally
          rendered) so the transform transition has something to animate
          from on the very first open. */}
      <div
        className={`fixed inset-0 z-50 bg-ink/40 transition-opacity duration-300 sm:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-72 max-w-[85vw] flex-col bg-white p-6 shadow-softLg transition-transform duration-300 sm:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="flex items-center justify-between">
          <Logo />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Chiudi il menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="mt-8 flex flex-col gap-1 text-base font-medium">
          {NAV_LINKS.map((link) =>
            renderLink(link, "rounded-lg px-3 py-2.5 text-ink transition hover:bg-ink/5", () => setMenuOpen(false)),
          )}
        </div>
        <div className="mt-auto flex flex-col gap-3 border-t border-ink/10 pt-6">
          <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-secondary py-2.5 text-center text-sm">
            Accedi
          </Link>
          <Link href="/signup" onClick={() => setMenuOpen(false)} className="btn-primary py-2.5 text-center text-sm">
            Iscriviti
          </Link>
        </div>
      </div>
    </nav>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}
