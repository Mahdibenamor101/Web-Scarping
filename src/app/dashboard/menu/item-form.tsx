"use client";

import { useState } from "react";
import { ALL_ALLERGENS, ALLERGEN_LABELS } from "@/lib/allergens";

export type ItemFormValues = {
  nameIt: string;
  nameEn: string;
  descriptionIt: string;
  price: string;
  photoUrl: string;
  allergens: string[];
};

const EMPTY: ItemFormValues = {
  nameIt: "",
  nameEn: "",
  descriptionIt: "",
  price: "",
  photoUrl: "",
  allergens: [],
};

export default function ItemForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  initial?: Partial<ItemFormValues>;
  onSubmit: (values: ItemFormValues) => Promise<void>;
  onCancel?: () => void;
  submitLabel: string;
}) {
  const [values, setValues] = useState<ItemFormValues>({ ...EMPTY, ...initial });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function toggleAllergen(a: string) {
    setValues((v) => ({
      ...v,
      allergens: v.allergens.includes(a) ? v.allergens.filter((x) => x !== a) : [...v.allergens, a],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-md border border-slate-200 bg-slate-50 p-4">
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-600">Nom (IT)</span>
          <input
            required
            value={values.nameIt}
            onChange={(e) => setValues((v) => ({ ...v, nameIt: e.target.value }))}
            className="input"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-600">Nom (EN)</span>
          <input
            value={values.nameEn}
            onChange={(e) => setValues((v) => ({ ...v, nameEn: e.target.value }))}
            className="input"
          />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-slate-600">Description (IT)</span>
        <textarea
          value={values.descriptionIt}
          onChange={(e) => setValues((v) => ({ ...v, descriptionIt: e.target.value }))}
          className="input"
          rows={2}
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-600">Prix (€)</span>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            value={values.price}
            onChange={(e) => setValues((v) => ({ ...v, price: e.target.value }))}
            className="input"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-600">Photo (URL, optionnel)</span>
          <input
            value={values.photoUrl}
            onChange={(e) => setValues((v) => ({ ...v, photoUrl: e.target.value }))}
            className="input"
            placeholder="https://…"
          />
        </label>
      </div>
      <fieldset>
        <legend className="mb-1 text-sm text-slate-600">Allergènes (Règlement UE n°1169/2011)</legend>
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
          {ALL_ALLERGENS.map((a) => (
            <label key={a} className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={values.allergens.includes(a)} onChange={() => toggleAllergen(a)} />
              {ALLERGEN_LABELS[a]}
            </label>
          ))}
        </div>
      </fieldset>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {loading ? "…" : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-sm text-slate-500 hover:text-slate-900">
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}
