"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ALLERGEN_LABELS } from "@/lib/allergens";
import Skeleton from "@/components/skeleton";

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
    callWaiter: "Chiama il cameriere",
    called: "Chiamata inviata",
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
    callWaiter: "Call waiter",
    called: "Waiter called",
  },
};

// Mirrors the server's per-table rate limit (2 min, see
// src/app/api/public/staff-calls/[qrToken]/route.ts) so the button doesn't
// re-enable and immediately 429 on a second tap.
const CALL_COOLDOWN_MS = 2 * 60 * 1000;

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
  const [callState, setCallState] = useState<"idle" | "calling" | "called">("idle");
  const [callError, setCallError] = useState<string | null>(null);

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

  async function callWaiter() {
    setCallState("calling");
    setCallError(null);
    try {
      const res = await fetch(`/api/public/staff-calls/${params.qrToken}`, { method: "POST" });
      if (!res.ok) {
        throw new Error(res.status === 429 ? T[lang].rateLimited : "error");
      }
      setCallState("called");
      setTimeout(() => setCallState("idle"), CALL_COOLDOWN_MS);
    } catch (err) {
      setCallState("idle");
      setCallError(err instanceof Error ? err.message : "error");
    }
  }

  if (loadError) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="text-signal">{loadError}</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="mx-auto min-h-screen max-w-md pb-24">
        <div className="sticky top-0 z-10 border-b border-ink/10 bg-white/90 px-4 py-3">
          <Skeleton tone="light" className="h-4 w-32" />
          <Skeleton tone="light" className="mt-2 h-3 w-20" />
        </div>
        <div className="flex flex-col gap-3 p-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} tone="light" className="h-20 w-full" />
          ))}
        </div>
      </main>
    );
  }

  if (confirmedOrderId) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center gap-3 px-6 text-center">
        <span className="flex h-14 w-14 animate-bump-in items-center justify-center rounded-full bg-brand-gradient text-2xl text-white shadow-soft">
          ✓
        </span>
        <h1 className="text-xl font-extrabold tracking-tight text-ink">{t.confirmed}</h1>
        <p className="text-muted">{t.confirmedBody}</p>
        <button onClick={() => setConfirmedOrderId(null)} className="btn-secondary mt-4">
          {t.back}
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-md pb-24">
      <header className="sticky top-0 z-10 border-b border-ink/10 bg-white/90 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-ink">{data.organizationName}</p>
            <p className="text-xs text-muted">
              {t.table} : {data.tableLabel}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={callWaiter}
              disabled={callState !== "idle"}
              aria-label={t.callWaiter}
              title={t.callWaiter}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition disabled:opacity-70 ${
                callState === "called"
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-ink/10 text-muted hover:border-ink/20 hover:text-ink"
              }`}
            >
              <BellIcon />
            </button>
            <div className="flex gap-1 text-xs">
              <button
                onClick={() => setLang("it")}
                className={`rounded-full px-2.5 py-1 font-semibold transition ${lang === "it" ? "bg-brand-gradient text-white shadow-soft" : "border border-ink/10 text-muted"}`}
              >
                IT
              </button>
              <button
                onClick={() => setLang("en")}
                className={`rounded-full px-2.5 py-1 font-semibold transition ${lang === "en" ? "bg-brand-gradient text-white shadow-soft" : "border border-ink/10 text-muted"}`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
        {callState === "called" && <p className="mt-1.5 text-xs font-medium text-brand">{t.called}</p>}
        {callError && <p className="mt-1.5 text-xs text-signal">{callError}</p>}
      </header>

      <div className="flex flex-col gap-6 p-4">
        {data.categories.map((category) => {
          const items = data.items.filter((i) => i.categoryId === category.id);
          if (items.length === 0) return null;
          return (
            <section key={category.id}>
              <h2 className="mb-2 text-base font-extrabold tracking-tight text-ink">
                {lang === "it" ? category.nameIt : category.nameEn || category.nameIt}
              </h2>
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="card flex items-start justify-between gap-3 transition hover:shadow-md"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-ink">
                        {lang === "it" ? item.nameIt : item.nameEn || item.nameIt}
                      </p>
                      {(lang === "it" ? item.descriptionIt : item.descriptionEn) && (
                        <p className="text-xs text-muted">
                          {lang === "it" ? item.descriptionIt : item.descriptionEn}
                        </p>
                      )}
                      {item.allergens.length > 0 && (
                        <p className="mt-1 text-[11px] text-muted">
                          {item.allergens.map((a) => ALLERGEN_LABELS[a as keyof typeof ALLERGEN_LABELS]).join(", ")}
                        </p>
                      )}
                      <p className="mt-1 text-sm font-bold text-ink">{item.price.toFixed(2)} €</p>
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
          className="fixed bottom-4 left-1/2 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 animate-bump-in items-center justify-between rounded-full bg-brand-gradient px-5 py-3.5 text-sm font-semibold text-white shadow-softLg"
        >
          <span>
            {t.cart} · {cartCount}
          </span>
          <span>{cartTotal.toFixed(2)} €</span>
        </button>
      )}

      {showCart && (
        <div className="fixed inset-0 z-20 flex flex-col justify-end bg-ink/40" onClick={() => setShowCart(false)}>
          <div
            className="flex max-h-[80vh] animate-bump-in flex-col gap-3 rounded-t-3xl bg-white p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-extrabold tracking-tight text-ink">{t.cart}</h2>
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
              {cartLines.length === 0 && <p className="text-sm text-muted">{t.empty}</p>}
            </ul>
            <div className="flex items-center justify-between border-t border-ink/5 pt-3 text-sm font-bold text-ink">
              <span>{t.total}</span>
              <span>{cartTotal.toFixed(2)} €</span>
            </div>
            {submitError && <p className="text-sm text-signal">{submitError}</p>}
            <button onClick={submitOrder} disabled={submitting || cartLines.length === 0} className="btn-primary w-full py-3">
              {submitting ? "…" : t.order}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function BellIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function QuantityStepper({ value, onChange }: { value: number; onChange: (qty: number) => void }) {
  if (value === 0) {
    return (
      <button
        onClick={() => onChange(1)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white shadow-soft transition hover:scale-105 active:scale-95"
      >
        +
      </button>
    );
  }
  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        onClick={() => onChange(value - 1)}
        className="h-8 w-8 rounded-full border border-ink/15 text-sm text-muted transition hover:scale-105 hover:border-ink/25 active:scale-95"
      >
        −
      </button>
      <span key={value} className="w-4 animate-bump-in text-center text-sm font-medium">
        {value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        className="h-8 w-8 rounded-full border border-ink/15 text-sm text-muted transition hover:scale-105 hover:border-ink/25 active:scale-95"
      >
        +
      </button>
    </div>
  );
}
