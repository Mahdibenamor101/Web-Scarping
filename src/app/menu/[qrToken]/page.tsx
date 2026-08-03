"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ALLERGEN_LABELS } from "@/lib/allergens";
import Skeleton from "@/components/skeleton";

type Category = { id: string; nameIt: string; nameEn: string | null; sortOrder: number };
type Translation = { name: string; description: string | null };
type Item = {
  id: string;
  categoryId: string;
  nameIt: string;
  nameEn: string | null;
  descriptionIt: string | null;
  descriptionEn: string | null;
  price: number;
  allergens: string[];
  translations: Record<string, Translation>;
};
type OrderingMode = "TABLE" | "COUNTER" | "PICKUP" | "DISPLAY_ONLY";
type MenuData = {
  organizationName: string;
  tableLabel: string;
  logoUrl: string | null;
  backgroundUrl: string | null;
  orderingMode: OrderingMode;
  onlinePaymentAvailable: boolean;
  // Only languages the owner has actually translated into (see
  // src/app/api/menu/translate/route.ts) -- absent entirely on a menu
  // that's never run a translation, so IT/EN stay the only options.
  extraLanguages: string[];
  categories: Category[];
  items: Item[];
};

// Extra languages beyond it/en are only ever offered here once the owner
// has actually run a translation for them (see POST /api/menu/translate,
// extraLanguages below) -- FR/DE/ES/PT, matching LANGUAGE_OPTIONS in
// src/lib/translate.ts (not imported here: that module pulls in
// next/server via src/lib/api.ts, server-only). The surrounding UI chrome
// (cart, buttons, confirmation copy) has its own T[lang] dictionary for
// each of those four so it matches the content language, not just item
// names/descriptions. Deliberately NOT Arabic or any other DeepL-supported
// language: src/lib/translate.ts's own comment explains why the menu-
// content feature stops at these four ("not '70+'", to avoid overclaiming
// what's actually been exercised) -- widening that is a product decision
// for the menu-content feature, separate from the site-wide UI language
// switcher this file's LanguagePills has nothing to do with.
type Lang = string;
const EXTRA_LANGUAGE_LABELS: Record<string, string> = { fr: "FR", de: "DE", es: "ES", pt: "PT" };

// Falls back to the Italian source whenever a translation is missing for
// the current language -- an item added after the last translation run,
// or a menu that's never been translated at all (extraLanguages then
// stays empty and these branches are simply never reached for lang !== it/en).
function itemName(item: Item, lang: Lang): string {
  if (lang === "it") return item.nameIt;
  if (lang === "en") return item.nameEn || item.nameIt;
  return item.translations[lang]?.name || item.nameIt;
}

function itemDescription(item: Item, lang: Lang): string | null {
  if (lang === "it") return item.descriptionIt;
  if (lang === "en") return item.descriptionEn;
  return item.translations[lang]?.description ?? null;
}

const T = {
  it: {
    title: "Menu",
    welcome: "Benvenuti! Sfogliate il menu e ordinate direttamente da qui.",
    table: "Tavolo",
    counter: "Ordina al banco",
    pickup: "Ritiro",
    displayOnly: "Solo consultazione",
    yourName: "Il tuo nome",
    yourNamePlaceholder: "Come ti chiami?",
    orderNumber: "Il tuo numero",
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
    payOnline: "Paga online ora",
    payAtTable: "Pagherò sul posto",
    paying: "Un attimo…",
    paySuccess: "Pagamento ricevuto, grazie!",
    payCancelled: "Pagamento annullato — puoi pagare sul posto.",
  },
  en: {
    title: "Menu",
    welcome: "Welcome! Browse the menu and order directly from here.",
    table: "Table",
    counter: "Order at the counter",
    pickup: "Pickup",
    displayOnly: "Browse only",
    yourName: "Your name",
    yourNamePlaceholder: "What's your name?",
    orderNumber: "Your number",
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
    payOnline: "Pay online now",
    payAtTable: "I'll pay at the table",
    paying: "One moment…",
    paySuccess: "Payment received, thank you!",
    payCancelled: "Payment cancelled — you can still pay in person.",
  },
  fr: {
    title: "Menu",
    welcome: "Bienvenue ! Parcourez le menu et commandez directement d'ici.",
    table: "Table",
    counter: "Commander au comptoir",
    pickup: "À emporter",
    displayOnly: "Consultation uniquement",
    yourName: "Votre nom",
    yourNamePlaceholder: "Comment vous appelez-vous ?",
    orderNumber: "Votre numéro",
    cart: "Commande",
    total: "Total",
    order: "Commander",
    empty: "Votre panier est vide.",
    confirmed: "Commande envoyée !",
    confirmedBody: "La cuisine l'a reçue.",
    back: "Retour au menu",
    loadError: "QR invalide ou table introuvable.",
    rateLimited: "Trop de tentatives, réessayez dans quelques minutes.",
    callWaiter: "Appeler le serveur",
    called: "Appel envoyé",
    payOnline: "Payer en ligne maintenant",
    payAtTable: "Je paierai sur place",
    paying: "Un instant…",
    paySuccess: "Paiement reçu, merci !",
    payCancelled: "Paiement annulé — vous pouvez toujours payer sur place.",
  },
  de: {
    title: "Speisekarte",
    welcome: "Willkommen! Stöbern Sie in der Karte und bestellen Sie direkt von hier.",
    table: "Tisch",
    counter: "An der Theke bestellen",
    pickup: "Abholung",
    displayOnly: "Nur zum Ansehen",
    yourName: "Ihr Name",
    yourNamePlaceholder: "Wie heißen Sie?",
    orderNumber: "Ihre Nummer",
    cart: "Bestellung",
    total: "Gesamt",
    order: "Bestellen",
    empty: "Ihr Warenkorb ist leer.",
    confirmed: "Bestellung gesendet!",
    confirmedBody: "Die Küche hat sie erhalten.",
    back: "Zurück zur Karte",
    loadError: "Ungültiger QR-Code oder Tisch nicht gefunden.",
    rateLimited: "Zu viele Versuche, bitte versuchen Sie es in ein paar Minuten erneut.",
    callWaiter: "Kellner rufen",
    called: "Anruf gesendet",
    payOnline: "Jetzt online bezahlen",
    payAtTable: "Ich zahle am Tisch",
    paying: "Einen Moment…",
    paySuccess: "Zahlung erhalten, danke!",
    payCancelled: "Zahlung storniert — Sie können trotzdem vor Ort bezahlen.",
  },
  es: {
    title: "Menú",
    welcome: "¡Bienvenido! Explora el menú y pide directamente desde aquí.",
    table: "Mesa",
    counter: "Pedir en el mostrador",
    pickup: "Recogida",
    displayOnly: "Solo consulta",
    yourName: "Tu nombre",
    yourNamePlaceholder: "¿Cómo te llamas?",
    orderNumber: "Tu número",
    cart: "Pedido",
    total: "Total",
    order: "Pedir",
    empty: "Tu carrito está vacío.",
    confirmed: "¡Pedido enviado!",
    confirmedBody: "La cocina lo ha recibido.",
    back: "Volver al menú",
    loadError: "Código QR no válido o mesa no encontrada.",
    rateLimited: "Demasiados intentos, inténtalo de nuevo en unos minutos.",
    callWaiter: "Llamar al camarero",
    called: "Llamada enviada",
    payOnline: "Pagar en línea ahora",
    payAtTable: "Pagaré en la mesa",
    paying: "Un momento…",
    paySuccess: "¡Pago recibido, gracias!",
    payCancelled: "Pago cancelado — todavía puedes pagar en persona.",
  },
  pt: {
    title: "Menu",
    welcome: "Bem-vindo! Navegue pelo menu e peça diretamente daqui.",
    table: "Mesa",
    counter: "Pedir ao balcão",
    pickup: "Levantamento",
    displayOnly: "Apenas consulta",
    yourName: "O seu nome",
    yourNamePlaceholder: "Como se chama?",
    orderNumber: "O seu número",
    cart: "Pedido",
    total: "Total",
    order: "Pedir",
    empty: "O seu carrinho está vazio.",
    confirmed: "Pedido enviado!",
    confirmedBody: "A cozinha já o recebeu.",
    back: "Voltar ao menu",
    loadError: "Código QR inválido ou mesa não encontrada.",
    rateLimited: "Demasiadas tentativas, tente novamente dentro de alguns minutos.",
    callWaiter: "Chamar o empregado",
    called: "Chamada enviada",
    payOnline: "Pagar online agora",
    payAtTable: "Vou pagar na mesa",
    paying: "Um momento…",
    paySuccess: "Pagamento recebido, obrigado!",
    payCancelled: "Pagamento cancelado — ainda pode pagar no local.",
  },
};

// Mirrors the server's per-table rate limit (2 min, see
// src/app/api/public/staff-calls/[qrToken]/route.ts) so the button doesn't
// re-enable and immediately 429 on a second tap.
const CALL_COOLDOWN_MS = 2 * 60 * 1000;

function PublicMenuPageInner() {
  const params = useParams<{ qrToken: string }>();
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<Lang>("it");
  const [data, setData] = useState<MenuData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [showCart, setShowCart] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<number | null>(null);
  const [callState, setCallState] = useState<"idle" | "calling" | "called">("idle");
  const [callError, setCallError] = useState<string | null>(null);
  const [pickupName, setPickupName] = useState("");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const paymentResult = searchParams.get("payment");

  const t = T[lang as keyof typeof T] ?? T.en;

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
          pickupName: data?.orderingMode === "PICKUP" ? pickupName : undefined,
        }),
      });
      if (res.status === 429) throw new Error(t.rateLimited);
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "error");
      setConfirmedOrderId(body.orderId);
      setConfirmedOrderNumber(body.orderNumber ?? null);
      setCart({});
      setShowCart(false);
      setPickupName("");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function payOnline() {
    if (!confirmedOrderId) return;
    setPaying(true);
    setPayError(null);
    try {
      const res = await fetch(`/api/public/orders/${params.qrToken}/${confirmedOrderId}/pay`, { method: "POST" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "error");
      // Full navigation to Stripe Checkout -- the component unmounts here,
      // there is no "after" state to update in this render.
      window.location.href = body.url;
    } catch (err) {
      setPayError(err instanceof Error ? err.message : "error");
      setPaying(false);
    }
  }

  async function callWaiter() {
    setCallState("calling");
    setCallError(null);
    try {
      const res = await fetch(`/api/public/staff-calls/${params.qrToken}`, { method: "POST" });
      if (!res.ok) {
        throw new Error(res.status === 429 ? t.rateLimited : "error");
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
        <p className="text-danger">{loadError}</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="mx-auto min-h-screen max-w-md bg-paper pb-24">
        <Skeleton tone="light" className="h-36 w-full rounded-none" />
        <div className="-mt-10 px-4">
          <Skeleton tone="light" className="h-20 w-20 rounded-2xl border-4 border-white" />
          <Skeleton tone="light" className="mt-3 h-4 w-40" />
        </div>
        <div className="mt-6 flex flex-col gap-3 p-4">
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
        {confirmedOrderNumber !== null && (
          <div className="ticket mt-2 flex flex-col items-center gap-1">
            <span className="font-mono text-[11px] uppercase tracking-wide text-muted">{t.orderNumber}</span>
            <span className="font-mono text-3xl font-extrabold text-ink">#{confirmedOrderNumber}</span>
          </div>
        )}
        {data?.onlinePaymentAvailable && (
          <div className="mt-2 flex w-full flex-col items-center gap-2">
            <button onClick={payOnline} disabled={paying} className="btn-primary w-full py-3">
              {paying ? t.paying : t.payOnline}
            </button>
            {payError && <p className="text-xs text-danger">{payError}</p>}
          </div>
        )}
        <button
          onClick={() => {
            setConfirmedOrderId(null);
            setConfirmedOrderNumber(null);
          }}
          className="btn-secondary mt-2"
        >
          {data?.onlinePaymentAvailable ? t.payAtTable : t.back}
        </button>
      </main>
    );
  }

  const initial = data.organizationName.trim().charAt(0).toUpperCase() || "?";

  return (
    <main className="relative mx-auto min-h-screen max-w-md bg-paper pb-24">
      {/* Cover photo + logo avatar, à la Uber Eats/Deliveroo restaurant page --
          a real welcome even for an org that hasn't uploaded anything: the
          brand gradient fills both slots so the header never looks empty. */}
      <div className="relative h-36 w-full overflow-hidden bg-brand-gradient">
        {data.backgroundUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary owner-uploaded URL
          <img src={data.backgroundUrl} alt="" className="h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
      </div>

      <div className="relative -mt-10 px-4">
        <div className="flex items-end gap-3">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-brand-gradient shadow-softLg">
            {data.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- arbitrary owner-uploaded URL
              <img src={data.logoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center font-display text-2xl font-extrabold text-white">
                {initial}
              </span>
            )}
          </div>
          <h1 className="pb-1 font-display text-xl font-extrabold leading-tight tracking-tight text-ink">
            {data.organizationName}
          </h1>
        </div>
        <p className="mt-3 text-sm text-muted">{t.welcome}</p>
      </div>

      <header className="sticky top-0 z-10 mt-4 border-y border-ink/10 bg-white/90 px-4 py-2.5 backdrop-blur">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted">
            {data.orderingMode === "TABLE" && `${t.table} : ${data.tableLabel}`}
            {data.orderingMode === "COUNTER" && t.counter}
            {data.orderingMode === "PICKUP" && t.pickup}
            {data.orderingMode === "DISPLAY_ONLY" && t.displayOnly}
          </p>
          <div className="flex items-center gap-2">
            {data.orderingMode === "TABLE" && (
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
            )}
            {/* No extra languages (the common case): IT/EN fit inline next to
                the bell with no risk of cramping the row. Once a menu has
                been translated, the same two buttons move to their own
                horizontally-scrollable row below instead of wrapping onto a
                second line. */}
            {data.extraLanguages.length === 0 && <LanguagePills lang={lang} setLang={setLang} extraLanguages={[]} />}
          </div>
        </div>
        {callState === "called" && <p className="mt-1.5 text-xs font-medium text-brand">{t.called}</p>}
        {callError && <p className="mt-1.5 text-xs text-danger">{callError}</p>}
        {data.extraLanguages.length > 0 && (
          <div className="mt-2 -mb-1 overflow-x-auto">
            <LanguagePills lang={lang} setLang={setLang} extraLanguages={data.extraLanguages} />
          </div>
        )}
      </header>

      {paymentResult && (
        <div className="relative px-4 pt-4">
          <p
            className={`rounded-card border px-3 py-2.5 text-sm ${
              paymentResult === "success"
                ? "border-ready/30 bg-ready/10 text-ready"
                : "border-ink/10 bg-ink/[0.03] text-muted"
            }`}
          >
            {paymentResult === "success" ? t.paySuccess : t.payCancelled}
          </p>
        </div>
      )}

      <div className="relative flex flex-col gap-6 p-4">
        {data.categories.map((category) => {
          const items = data.items.filter((i) => i.categoryId === category.id);
          if (items.length === 0) return null;
          return (
            <section key={category.id}>
              <h2 className="mb-2 text-base font-extrabold tracking-tight text-ink">
                {/* Categories aren't translated (see POST /api/menu/translate) -- any
                    language beyond it/en falls back to Italian, same as an item with
                    no translation row yet. */}
                {lang === "en" ? category.nameEn || category.nameIt : category.nameIt}
              </h2>
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="card flex items-start justify-between gap-3 transition hover:shadow-md"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-ink">{itemName(item, lang)}</p>
                      {itemDescription(item, lang) && <p className="text-xs text-muted">{itemDescription(item, lang)}</p>}
                      {item.allergens.length > 0 && (
                        <p className="mt-1 text-[11px] text-muted">
                          {item.allergens.map((a) => ALLERGEN_LABELS[a as keyof typeof ALLERGEN_LABELS]).join(", ")}
                        </p>
                      )}
                      <p className="mt-1 font-mono text-sm font-bold text-ink">{item.price.toFixed(2)} €</p>
                    </div>
                    {data.orderingMode !== "DISPLAY_ONLY" && (
                      <QuantityStepper value={cart[item.id] ?? 0} onChange={(qty) => setQty(item.id, qty)} />
                    )}
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
          <span className="font-mono">{cartTotal.toFixed(2)} €</span>
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
                      {qty} × {itemName(item, lang)}
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
            {data.orderingMode === "PICKUP" && (
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-ink/70">{t.yourName}</span>
                <input
                  required
                  value={pickupName}
                  onChange={(e) => setPickupName(e.target.value)}
                  placeholder={t.yourNamePlaceholder}
                  className="input"
                />
              </label>
            )}
            {submitError && <p className="text-sm text-danger">{submitError}</p>}
            <button
              onClick={submitOrder}
              disabled={
                submitting || cartLines.length === 0 || (data.orderingMode === "PICKUP" && !pickupName.trim())
              }
              className="btn-primary w-full py-3"
            >
              {submitting ? "…" : t.order}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default function PublicMenuPage() {
  return (
    <Suspense fallback={null}>
      <PublicMenuPageInner />
    </Suspense>
  );
}

function LanguagePills({
  lang,
  setLang,
  extraLanguages,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  extraLanguages: string[];
}) {
  const codes = ["it", "en", ...extraLanguages];
  return (
    <div className="flex w-max gap-1 text-xs">
      {codes.map((code) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          className={`shrink-0 rounded-full px-2.5 py-1 font-semibold transition ${
            lang === code ? "bg-brand-gradient text-white shadow-soft" : "border border-ink/10 text-muted"
          }`}
        >
          {code === "it" ? "IT" : code === "en" ? "EN" : (EXTRA_LANGUAGE_LABELS[code] ?? code.toUpperCase())}
        </button>
      ))}
    </div>
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
