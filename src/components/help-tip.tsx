"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Small stamped "?" trigger + dashed ticket-style popover, used to give
 * restaurant owners contextual explanations inline in the dashboard
 * without cluttering the page with permanent help text.
 */
export default function HelpTip({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Aide"
        className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-[3px] border-[1.5px] border-white/20
          font-mono text-[10px] font-bold text-white/50 transition hover:border-brand-light hover:text-brand-light"
      >
        ?
      </button>
      {open && (
        <div
          role="tooltip"
          className="absolute left-0 top-full z-30 mt-2 w-64 animate-bump-in rounded-card border border-dashed
            border-white/15 bg-dash-card p-3 text-xs leading-relaxed text-white/70 shadow-dark"
        >
          {children}
        </div>
      )}
    </div>
  );
}
