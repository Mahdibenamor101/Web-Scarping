"use client";

import { useState } from "react";

const LANGUAGE_OPTIONS = [
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },
  { code: "pt", label: "Português" },
] as const;

/**
 * Triggers POST /api/menu/translate for the selected languages -- see
 * src/lib/translate.ts. Kept as its own component (not inlined in
 * dashboard/menu/page.tsx) since it owns a self-contained slice of state
 * (selection, in-flight, result) unrelated to category/item CRUD.
 */
export default function TranslationsPanel() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  function toggle(code: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }

  async function run() {
    setRunning(true);
    setResult(null);
    try {
      const res = await fetch("/api/menu/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ languageCodes: [...selected] }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setResult(
          res.status === 501
            ? "Traduction non configurée sur cet environnement."
            : (body.error ?? "Échec de la traduction"),
        );
        return;
      }
      setResult(`Menu traduit vers ${selected.size} langue${selected.size > 1 ? "s" : ""}.`);
    } catch {
      setResult("Erreur inconnue");
    } finally {
      setRunning(false);
    }
  }

  return (
    <section className="card-dash">
      <h2 className="mb-1 text-base font-semibold text-white">Traduction automatique</h2>
      <p className="mb-3 text-xs text-white/50">
        Traduit le nom et la description de chaque plat depuis l&apos;italien. Relancer écrase la traduction
        précédente -- utile après avoir modifié le menu.
      </p>
      <div className="flex flex-wrap gap-2">
        {LANGUAGE_OPTIONS.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => toggle(lang.code)}
            className={`badge-pill transition ${
              selected.has(lang.code)
                ? "border-brand-light/50 bg-brand-light/15 text-brand-light"
                : "border-white/15 text-white/40 hover:border-white/30 hover:text-white/70"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
      <button onClick={run} disabled={running || selected.size === 0} className="btn-primary mt-3">
        {running ? "Traduction…" : "Traduire le menu"}
      </button>
      {result && <p className="mt-2 text-sm text-white/70">{result}</p>}
    </section>
  );
}
