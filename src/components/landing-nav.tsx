"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/logo";

/**
 * Sticky nav that stays transparent over the hero and picks up a
 * blurred white background + shadow once the page scrolls -- the
 * "does the nav bar stay put and adapt" pattern from apple.com. Lives
 * outside the hero's `overflow-hidden` wrapper (see page.tsx) so
 * `position: sticky` isn't clipped once the hero scrolls out of view.
 */
export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-40 border-b transition-all duration-300 ${
        scrolled ? "border-slate-200 bg-white/80 shadow-sm backdrop-blur-md" : "border-transparent bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-6 transition-[padding] duration-300 ${
          scrolled ? "py-3" : "py-6"
        }`}
      >
        <Logo />
        <div className="hidden items-center gap-7 text-sm font-medium sm:flex">
          <a href="#demo" className="nav-link">
            Démo
          </a>
          <a href="#apercu" className="nav-link">
            Aperçu
          </a>
          <a href="#fonctionnalites" className="nav-link">
            Fonctionnalités
          </a>
          <a href="#tarifs" className="nav-link">
            Tarifs
          </a>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="nav-link hidden text-sm font-medium sm:inline">
            Se connecter
          </Link>
          <Link href="/signup" className="btn-primary px-4 py-2 text-sm">
            S&apos;inscrire
          </Link>
        </div>
      </div>
    </nav>
  );
}
