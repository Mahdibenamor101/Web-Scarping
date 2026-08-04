"use client";

import { useState } from "react";
import { ALL_ALLERGENS, ALLERGEN_LABELS } from "@/lib/allergens";
import type { LanguageCode } from "@/lib/i18n/languages";
import { MENU_DICT } from "@/lib/i18n/dictionaries/menu";

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
  locale = "fr",
}: {
  initial?: Partial<ItemFormValues>;
  onSubmit: (values: ItemFormValues) => Promise<void>;
  onCancel?: () => void;
  submitLabel: string;
  locale?: LanguageCode;
}) {
  const dict = MENU_DICT[locale];
  const t = dict.form;
  const [values, setValues] = useState<ItemFormValues>({ ...EMPTY, ...initial });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // lets the same file be re-selected after an error
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/menu/photo-upload", { method: "POST", body: formData });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(res.status === 501 ? t.uploadNotConfigured : (body.error ?? t.uploadFailed));
      }
      setValues((v) => ({ ...v, photoUrl: body.url }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : t.uploadFailed);
    } finally {
      setUploading(false);
    }
  }

  async function handleGenerate() {
    if (!values.nameIt.trim()) {
      setUploadError(t.generateNeedsName);
      return;
    }
    setGenerating(true);
    setUploadError(null);
    try {
      const res = await fetch("/api/menu/generate-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nameIt: values.nameIt, descriptionIt: values.descriptionIt || undefined }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(res.status === 501 ? t.generateNotConfigured : (body.error ?? t.generateFailed));
      }
      setValues((v) => ({ ...v, photoUrl: body.url }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : t.generateFailed);
    } finally {
      setGenerating(false);
    }
  }

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
      setError(err instanceof Error ? err.message : dict.genericError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-white/60">{t.nameIt}</span>
          <input
            required
            value={values.nameIt}
            onChange={(e) => setValues((v) => ({ ...v, nameIt: e.target.value }))}
            className="input-dash"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-white/60">{t.nameEn}</span>
          <input
            value={values.nameEn}
            onChange={(e) => setValues((v) => ({ ...v, nameEn: e.target.value }))}
            className="input-dash"
          />
        </label>
      </div>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-white/60">{t.descriptionIt}</span>
        <textarea
          value={values.descriptionIt}
          onChange={(e) => setValues((v) => ({ ...v, descriptionIt: e.target.value }))}
          className="input-dash"
          rows={2}
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-white/60">{t.price}</span>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            value={values.price}
            onChange={(e) => setValues((v) => ({ ...v, price: e.target.value }))}
            className="input-dash"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-white/60">{t.photo}</span>
          <div className="flex items-center gap-2">
            {values.photoUrl && (
              // eslint-disable-next-line @next/next/no-img-element -- arbitrary external/uploaded URL, not a local asset
              <img src={values.photoUrl} alt="" className="h-9 w-9 shrink-0 rounded-lg object-cover" />
            )}
            <input
              value={values.photoUrl}
              onChange={(e) => setValues((v) => ({ ...v, photoUrl: e.target.value }))}
              className="input-dash"
              placeholder="https://…"
            />
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium">
            <label className="flex w-fit cursor-pointer items-center gap-1.5 text-brand-light transition hover:underline">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
              {uploading ? t.uploading : t.orUploadPhoto}
            </label>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              className="text-brand-light transition hover:underline disabled:pointer-events-none disabled:opacity-50"
            >
              {generating ? t.generating : t.orGenerateAi}
            </button>
          </div>
          {uploadError && <span className="text-xs text-danger">{uploadError}</span>}
        </label>
      </div>
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-white/60">{t.allergensLegend}</legend>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          {ALL_ALLERGENS.map((a) => (
            <label key={a} className="flex items-center gap-2 text-xs text-white/40">
              <input
                type="checkbox"
                checked={values.allergens.includes(a)}
                onChange={() => toggleAllergen(a)}
                className="accent-brand"
              />
              {ALLERGEN_LABELS[a]}
            </label>
          ))}
        </div>
      </fieldset>
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="flex items-center gap-4">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "…" : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-link-dash">
            {t.cancel}
          </button>
        )}
      </div>
    </form>
  );
}
