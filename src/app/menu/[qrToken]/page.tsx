"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ALLERGEN_LABELS } from "@/lib/allergens";

type Category = { id: string; nameIt: string; nameEn: string | null; sortOrder: number };
type Item = {
  id: string;
  categoryId: string;
  nameIt: string;
  nameEn: string | null;
  descriptionIt: string | null;
  descriptionEn: string | null;
  price: number;
  allergens: string[];
};
type MenuData = {
  organizationName: string;
  tableLabel: string;
  categories: Category[];
  items: Item[];
};

type Lang = "it" | "en";

const T = {
  it: {
    title: "Menu",
    table: "Tavolo",
    cart: "Ordine",
    total: "Totale",
    order: "Ordina",
    empty: "Il carrello è vuoto.",
    confirmed: "Ordine inviato!",
    confirmedBody: "La cucina l'ha ricevuto.",
    back: "Torna al menu",
    loadError: "QR non valido o tavolo non trovato.",
    rateLimited: "Troppi tentativi, riprova tra qualche minuto.",
  },
  en: {
    title: "Menu",
    table: "Table",
    cart: "Order",
    total: "Total",
    order: "Place order",
    empty: "Your cart is empty.",
    confirmed: "Order sent!",
    confirmedBody: "The kitchen has received it.",
    back: "Back to menu",
    loadError: "Invalid QR code or table not found.",
    rateLimited: "Too many attempts, please try again in a few minutes.",
  },
};

export default function PublicMenuPage() {
  const params = useParams<{ qrToken: string }>();
  const [lang, setLang] = useState<Lang>("it");
  const [data, setData] = useState<MenuData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [showCart, setShowCart] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  const t = T[lang];

  useEffect(() => {
    fetch(`/api/public/menu/${params.qrToken}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("not_found");
        return res.json();
      })
      .then(setData)
      .catch(() => setLoadError(t.loadError));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.qrToken]);

  const itemsById = useMemo(() => new Map((data?.items ?? []).map((i) => [i.id, i])), [data]);

  const cartLines = Object.entries(cart).filter(([, qty]) => qty > 0);
  const cartCount = cartLines.reduce((sum, [, qty]) => sum + qty, 0);
  const cartTotal = cartLines.reduce((sum, [id, qty]) => sum + (itemsById.get(id)?.price ?? 0) * qty, 0);

  function setQty(itemId: string, qty: number) {
    setCart((c) => ({ ...c, [itemId]: Math.max(0, qty) }));
  }

  async function submitOrder() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(`/api/public/orders/${params.qrToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartLines.map(([menuItemId, quantity]) => ({ menuItemId, quantity })),
        }),
      });
      if (res.status === 429) throw new Error(T[lang].rateLimited);
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "error");
      setConfirmedOrderId(body.orderId);
      setCart({});
      setShowCart(false);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "error");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadError) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="text-rose-600">{loadError}</p>
      </main>
    );
  }

  if (!data) return null;

  if (confirmedOrderId) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center gap-3 px-6 text-center">
        <span className="flex h-14 w-14 animate-bump-in items-center justify-center rounded-full bg-sky-500 text-2xl text-white">
          ✓
        </span>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">{t.confirmed}</h1>
        <p className="text-slate-500">{t.confirmedBody}</p>
        <button onClick={() => setConfirmedOrderId(null)} className="btn-secondary mt-4">
          {t.back}
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-md pb-24">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900">{data.organizationName}</p>
            <p className="text-xs text-slate-500">
              {t.table} : {data.tableLabel}
            </p>
          </div>
          <div className="flex gap-1 text-xs">
            <button
              onClick={() => setLang("it")}
              className={`rounded-full px-2.5 py-1 font-semibold transition ${lang === "it" ? "bg-sky-500 text-white" : "border border-slate-200 text-slate-500"}`}
            >
              IT
            </button>
            <button
              onClick={() => setLang("en")}
              className={`rounded-full px-2.5 py-1 font-semibold transition ${lang === "en" ? "bg-sky-500 text-white" : "border border-slate-200 text-slate-500"}`}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-6 p-4">
        {data.categories.map((category) => {
          const items = data.items.filter((i) => i.categoryId === category.id);
          if (items.length === 0) return null;
          return (
            <section key={category.id}>
              <h2 className="mb-2 text-base font-bold tracking-tight text-slate-900">
                {lang === "it" ? category.nameIt : category.nameEn || category.nameIt}
              </h2>
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="card flex items-start justify-between gap-3 transition hover:shadow-md"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {lang === "it" ? item.nameIt : item.nameEn || item.nameIt}
                      </p>
                      {(lang === "it" ? item.descriptionIt : item.descriptionEn) && (
                        <p className="text-xs text-slate-500">
                          {lang === "it" ? item.descriptionIt : item.descriptionEn}
                        </p>
                      )}
                      {item.allergens.length > 0 && (
                        <p className="mt-1 text-[11px] text-slate-400">
                          {item.allergens.map((a) => ALLERGEN_LABELS[a as keyof typeof ALLERGEN_LABELS]).join(", ")}
                        </p>
                      )}
                      <p className="mt-1 text-sm font-bold text-slate-900">{item.price.toFixed(2)} €</p>
                    </div>
                    <QuantityStepper value={cart[item.id] ?? 0} onChange={(qty) => setQty(item.id, qty)} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      {cartCount > 0 && !showCart && (
        <button
          key={cartCount}
          onClick={() => setShowCart(true)}
          className="fixed bottom-4 left-1/2 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 animate-bump-in items-center justify-between rounded-full bg-sky-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/40"
        >
          <span>
            {t.cart} · {cartCount}
          </span>
          <span>{cartTotal.toFixed(2)} €</span>
        </button>
      )}

      {showCart && (
        <div className="fixed inset-0 z-20 flex flex-col justify-end bg-slate-900/40" onClick={() => setShowCart(false)}>
          <div
            className="flex max-h-[80vh] animate-bump-in flex-col gap-3 rounded-t-3xl bg-white p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-bold tracking-tight text-slate-900">{t.cart}</h2>
            <ul className="flex flex-col gap-2 overflow-y-auto">
              {cartLines.map(([id, qty]) => {
                const item = itemsById.get(id);
                if (!item) return null;
                return (
                  <li key={id} className="flex items-center justify-between text-sm">
                    <span>
                      {qty} × {lang === "it" ? item.nameIt : item.nameEn || item.nameIt}
                    </span>
                    <span className="font-medium">{(item.price * qty).toFixed(2)} €</span>
                  </li>
                );
              })}
              {cartLines.length === 0 && <p className="text-sm text-slate-500">{t.empty}</p>}
            </ul>
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm font-bold text-slate-900">
              <span>{t.total}</span>
              <span>{cartTotal.toFixed(2)} €</span>
            </div>
            {submitError && <p className="text-sm text-rose-600">{submitError}</p>}
            <button onClick={submitOrder} disabled={submitting || cartLines.length === 0} className="btn-primary w-full py-3">
              {submitting ? "…" : t.order}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function QuantityStepper({ value, onChange }: { value: number; onChange: (qty: number) => void }) {
  if (value === 0) {
    return (
      <button
        onClick={() => onChange(1)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white shadow-sm shadow-sky-500/30 transition hover:scale-105 active:scale-95"
      >
        +
      </button>
    );
  }
  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        onClick={() => onChange(value - 1)}
        className="h-8 w-8 rounded-full border border-slate-300 text-sm text-slate-600 transition hover:scale-105 hover:border-slate-400 active:scale-95"
      >
        −
      </button>
      <span key={value} className="w-4 animate-bump-in text-center text-sm font-medium">
        {value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        className="h-8 w-8 rounded-full border border-slate-300 text-sm text-slate-600 transition hover:scale-105 hover:border-slate-400 active:scale-95"
      >
        +
      </button>
    </div>
  );
}
