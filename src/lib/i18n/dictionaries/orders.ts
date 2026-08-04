import type { LanguageCode } from "@/lib/i18n/languages";

// UI chrome for the orders board (src/app/dashboard/orders/page.tsx).
//
// `help` is split into the same text/bold/text chunks the JSX already used
// before translation -- `columns` supplies the three bold words (reused for
// both the help tooltip and the column headers themselves) so they're
// never duplicated.
export interface OrdersDict {
  title: string;
  help: { intro: string; todoSuffix: string; progressSuffix: string; readySuffix: string };
  live: string;
  connecting: string;
  staffCallLabel: string;
  acknowledge: string;
  columns: { todo: string; progress: string; ready: string };
  emptyColumn: string;
  paid: string;
  actions: { start: string; ready: string; served: string; cancel: string };
}

export const ORDERS_DICT: Record<LanguageCode, OrdersDict> = {
  fr: {
    title: "Commandes",
    help: {
      intro: "Chaque commande passe par trois colonnes : ",
      todoSuffix: " dès qu'un client valide sa commande, ",
      progressSuffix: " une fois que la cuisine a démarré, ",
      readySuffix:
        " quand elle peut être servie. Cliquez sur le bouton d'une carte pour la faire avancer. La page se met à jour toute seule (badge « EN DIRECT ») — aucun rafraîchissement nécessaire.",
    },
    live: "EN DIRECT",
    connecting: "Connexion…",
    staffCallLabel: "appelle le serveur",
    acknowledge: "Marquer comme vu",
    columns: { todo: "À faire", progress: "En cours", ready: "Prêt" },
    emptyColumn: "Rien pour l'instant.",
    paid: "Payé",
    actions: { start: "Démarrer", ready: "Prêt", served: "Servi", cancel: "Annuler" },
  },
  it: {
    title: "Ordini",
    help: {
      intro: "Ogni ordine passa attraverso tre colonne: ",
      todoSuffix: " non appena un cliente conferma l'ordine, ",
      progressSuffix: " una volta che la cucina ha iniziato, ",
      readySuffix:
        " quando può essere servito. Clicca sul pulsante di una scheda per farla avanzare. La pagina si aggiorna da sola (badge « IN DIRETTA ») — nessun aggiornamento necessario.",
    },
    live: "IN DIRETTA",
    connecting: "Connessione…",
    staffCallLabel: "chiama il cameriere",
    acknowledge: "Segna come vista",
    columns: { todo: "Da fare", progress: "In corso", ready: "Pronto" },
    emptyColumn: "Niente per ora.",
    paid: "Pagato",
    actions: { start: "Avvia", ready: "Pronto", served: "Servito", cancel: "Annulla" },
  },
  en: {
    title: "Orders",
    help: {
      intro: "Each order moves through three columns: ",
      todoSuffix: " as soon as a customer places an order, ",
      progressSuffix: " once the kitchen has started on it, ",
      readySuffix:
        " when it can be served. Click a card's button to move it forward. The page updates itself (the « LIVE » badge) — no refresh needed.",
    },
    live: "LIVE",
    connecting: "Connecting…",
    staffCallLabel: "is calling the server",
    acknowledge: "Mark as seen",
    columns: { todo: "To do", progress: "In progress", ready: "Ready" },
    emptyColumn: "Nothing yet.",
    paid: "Paid",
    actions: { start: "Start", ready: "Ready", served: "Served", cancel: "Cancel" },
  },
  es: {
    title: "Pedidos",
    help: {
      intro: "Cada pedido pasa por tres columnas: ",
      todoSuffix: " en cuanto un cliente confirma su pedido, ",
      progressSuffix: " una vez que la cocina lo ha empezado, ",
      readySuffix:
        " cuando puede servirse. Haz clic en el botón de una tarjeta para avanzarla. La página se actualiza sola (insignia « EN DIRECTO ») — sin necesidad de refrescar.",
    },
    live: "EN DIRECTO",
    connecting: "Conectando…",
    staffCallLabel: "llama al camarero",
    acknowledge: "Marcar como visto",
    columns: { todo: "Por hacer", progress: "En curso", ready: "Listo" },
    emptyColumn: "Nada por ahora.",
    paid: "Pagado",
    actions: { start: "Iniciar", ready: "Listo", served: "Servido", cancel: "Cancelar" },
  },
  de: {
    title: "Bestellungen",
    help: {
      intro: "Jede Bestellung durchläuft drei Spalten: ",
      todoSuffix: " sobald ein Gast seine Bestellung aufgibt, ",
      progressSuffix: " sobald die Küche damit begonnen hat, ",
      readySuffix:
        " wenn sie serviert werden kann. Klicken Sie auf die Schaltfläche einer Karte, um sie weiterzuschalten. Die Seite aktualisiert sich von selbst (Badge « LIVE ») — kein Neuladen nötig.",
    },
    live: "LIVE",
    connecting: "Verbindung…",
    staffCallLabel: "ruft den Service",
    acknowledge: "Als gesehen markieren",
    columns: { todo: "Offen", progress: "In Arbeit", ready: "Fertig" },
    emptyColumn: "Noch nichts.",
    paid: "Bezahlt",
    actions: { start: "Starten", ready: "Fertig", served: "Serviert", cancel: "Stornieren" },
  },
  ar: {
    title: "الطلبات",
    help: {
      intro: "يمر كل طلب بثلاثة أعمدة: ",
      todoSuffix: " بمجرد أن يؤكد العميل طلبه، ",
      progressSuffix: " بمجرد أن يبدأ المطبخ التحضير، ",
      readySuffix:
        " عندما يصبح جاهزًا للتقديم. انقر على زر البطاقة لنقلها إلى المرحلة التالية. تتحدّث الصفحة نفسها تلقائيًا (شارة «مباشر») — دون الحاجة لإعادة التحميل.",
    },
    live: "مباشر",
    connecting: "جارٍ الاتصال…",
    staffCallLabel: "يستدعي النادل",
    acknowledge: "تمييز كمُشاهَد",
    columns: { todo: "قيد الانتظار", progress: "قيد التحضير", ready: "جاهز" },
    emptyColumn: "لا شيء الآن.",
    paid: "مدفوع",
    actions: { start: "بدء", ready: "جاهز", served: "تم التقديم", cancel: "إلغاء" },
  },
};
