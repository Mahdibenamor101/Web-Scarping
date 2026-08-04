import type { LanguageCode } from "@/lib/i18n/languages";

// UI chrome for src/app/dashboard/billing/page.tsx (a server component --
// reads locale via get-locale.ts like the dashboard shell does, then
// passes it down as a prop to the client actions.tsx buttons) and
// actions.tsx (client, reads its own `locale` prop). `trialDaysLeftTemplate`
// carries a literal "{n}" placeholder swapped in with String.replace at the
// call site -- simplest way to keep the day count in the middle of a
// translated sentence without pulling in an i18n templating library.
export interface BillingDict {
  title: string;
  help: string;
  checkoutSuccess: string;
  checkoutCancelled: string;
  statusPrefix: string;
  engagementLabel: string;
  trialDaysLeftTemplate: string;
  trialEnded: string;
  stripeNotConfigured: { before: string; betweenVars: string; beforeEnvExample: string; afterEnvExample: string };
  footerNote: string;
  statusLabels: {
    trialing: string;
    active: string;
    past_due: string;
    canceled: string;
    unpaid: string;
    incomplete: string;
    incomplete_expired: string;
    paused: string;
  };
  planLabels: { monthly: string; quarterly: string; semiannual: string; annual: string };
  periods: { monthly: string; quarterly: string; semiannual: string; annual: string };
  chooseDuration: string;
  manageSubscription: string;
  genericError: string;
}

export const BILLING_DICT: Record<LanguageCode, BillingDict> = {
  fr: {
    title: "Abonnement",
    help:
      "Réservé au propriétaire. L'abonnement débloque les tables et commandes illimitées. Le paiement et les factures sont gérés par Stripe : cliquez sur « Gérer la facturation » pour changer de carte, télécharger une facture ou annuler à tout moment.",
    checkoutSuccess:
      "Paiement en cours de confirmation — le statut ci-dessous se mettra à jour automatiquement dès que Stripe nous aura notifiés.",
    checkoutCancelled: "Paiement annulé, rien n'a été débité.",
    statusPrefix: "Statut : ",
    engagementLabel: "engagement",
    trialDaysLeftTemplate: "{n} jour(s) restant(s) d'essai gratuit.",
    trialEnded: "Essai gratuit terminé.",
    stripeNotConfigured: {
      before: "Stripe n'est pas configuré sur cet environnement (variable ",
      betweenVars: " et/ou les variables ",
      beforeEnvExample: " absentes) — normal en local sans compte Stripe. Voir ",
      afterEnvExample: ".",
    },
    footerNote:
      "Abonnement prépayé, au choix mensuel, 3 mois, 6 mois ou 12 mois. Gérable à tout moment depuis Stripe : moyen de paiement, factures, résiliation.",
    statusLabels: {
      trialing: "essai gratuit",
      active: "actif",
      past_due: "paiement en retard",
      canceled: "annulé",
      unpaid: "impayé",
      incomplete: "incomplet",
      incomplete_expired: "expiré",
      paused: "en pause",
    },
    planLabels: { monthly: "mensuel", quarterly: "3 mois", semiannual: "6 mois", annual: "12 mois" },
    periods: { monthly: "Mensuel", quarterly: "3 mois", semiannual: "6 mois", annual: "12 mois" },
    chooseDuration: "Choisissez la durée d'engagement :",
    manageSubscription: "Gérer mon abonnement",
    genericError: "Erreur inconnue",
  },
  it: {
    title: "Abbonamento",
    help:
      "Riservato al proprietario. L'abbonamento sblocca tavoli e ordini illimitati. Il pagamento e le fatture sono gestiti da Stripe: clicca su « Gestisci la fatturazione » per cambiare carta, scaricare una fattura o annullare in qualsiasi momento.",
    checkoutSuccess:
      "Pagamento in fase di conferma — lo stato qui sotto si aggiornerà automaticamente non appena Stripe ci avrà notificato.",
    checkoutCancelled: "Pagamento annullato, nessun addebito effettuato.",
    statusPrefix: "Stato: ",
    engagementLabel: "impegno",
    trialDaysLeftTemplate: "{n} giorno/i rimanente/i di prova gratuita.",
    trialEnded: "Prova gratuita terminata.",
    stripeNotConfigured: {
      before: "Stripe non è configurato su questo ambiente (variabile ",
      betweenVars: " e/o le variabili ",
      beforeEnvExample: " assenti) — normale in locale senza un account Stripe. Vedi ",
      afterEnvExample: ".",
    },
    footerNote:
      "Abbonamento prepagato, a scelta mensile, 3 mesi, 6 mesi o 12 mesi. Gestibile in qualsiasi momento da Stripe: metodo di pagamento, fatture, disdetta.",
    statusLabels: {
      trialing: "prova gratuita",
      active: "attivo",
      past_due: "pagamento in ritardo",
      canceled: "annullato",
      unpaid: "non pagato",
      incomplete: "incompleto",
      incomplete_expired: "scaduto",
      paused: "in pausa",
    },
    planLabels: { monthly: "mensile", quarterly: "3 mesi", semiannual: "6 mesi", annual: "12 mesi" },
    periods: { monthly: "Mensile", quarterly: "3 mesi", semiannual: "6 mesi", annual: "12 mesi" },
    chooseDuration: "Scegli la durata dell'impegno:",
    manageSubscription: "Gestisci il mio abbonamento",
    genericError: "Errore sconosciuto",
  },
  en: {
    title: "Billing",
    help:
      "Owner-only. The subscription unlocks unlimited tables and orders. Payment and invoices are handled by Stripe: click « Manage billing » to change your card, download an invoice or cancel at any time.",
    checkoutSuccess: "Payment is being confirmed — the status below will update automatically once Stripe notifies us.",
    checkoutCancelled: "Payment cancelled, nothing was charged.",
    statusPrefix: "Status: ",
    engagementLabel: "commitment",
    trialDaysLeftTemplate: "{n} day(s) left of your free trial.",
    trialEnded: "Free trial ended.",
    stripeNotConfigured: {
      before: "Stripe is not configured in this environment (the ",
      betweenVars: " variable and/or the ",
      beforeEnvExample: " variables are missing) — normal locally without a Stripe account. See ",
      afterEnvExample: ".",
    },
    footerNote:
      "Prepaid subscription, monthly, 3 months, 6 months or 12 months. Manageable at any time from Stripe: payment method, invoices, cancellation.",
    statusLabels: {
      trialing: "free trial",
      active: "active",
      past_due: "payment overdue",
      canceled: "cancelled",
      unpaid: "unpaid",
      incomplete: "incomplete",
      incomplete_expired: "expired",
      paused: "paused",
    },
    planLabels: { monthly: "monthly", quarterly: "3 months", semiannual: "6 months", annual: "12 months" },
    periods: { monthly: "Monthly", quarterly: "3 months", semiannual: "6 months", annual: "12 months" },
    chooseDuration: "Choose your commitment length:",
    manageSubscription: "Manage my subscription",
    genericError: "Unknown error",
  },
  es: {
    title: "Facturación",
    help:
      "Reservado al propietario. La suscripción desbloquea mesas y pedidos ilimitados. El pago y las facturas los gestiona Stripe: haz clic en « Gestionar facturación » para cambiar de tarjeta, descargar una factura o cancelar en cualquier momento.",
    checkoutSuccess:
      "Pago en proceso de confirmación — el estado de abajo se actualizará automáticamente en cuanto Stripe nos lo notifique.",
    checkoutCancelled: "Pago cancelado, no se ha cobrado nada.",
    statusPrefix: "Estado: ",
    engagementLabel: "compromiso",
    trialDaysLeftTemplate: "{n} día(s) restante(s) de prueba gratuita.",
    trialEnded: "Prueba gratuita finalizada.",
    stripeNotConfigured: {
      before: "Stripe no está configurado en este entorno (falta la variable ",
      betweenVars: " y/o las variables ",
      beforeEnvExample: ") — normal en local sin una cuenta de Stripe. Consulta ",
      afterEnvExample: ".",
    },
    footerNote:
      "Suscripción prepagada, a elegir entre mensual, 3 meses, 6 meses o 12 meses. Gestionable en cualquier momento desde Stripe: método de pago, facturas, cancelación.",
    statusLabels: {
      trialing: "prueba gratuita",
      active: "activo",
      past_due: "pago atrasado",
      canceled: "cancelado",
      unpaid: "impagado",
      incomplete: "incompleto",
      incomplete_expired: "caducado",
      paused: "en pausa",
    },
    planLabels: { monthly: "mensual", quarterly: "3 meses", semiannual: "6 meses", annual: "12 meses" },
    periods: { monthly: "Mensual", quarterly: "3 meses", semiannual: "6 meses", annual: "12 meses" },
    chooseDuration: "Elige la duración del compromiso:",
    manageSubscription: "Gestionar mi suscripción",
    genericError: "Error desconocido",
  },
  de: {
    title: "Abrechnung",
    help:
      "Nur für den Inhaber. Das Abonnement schaltet unbegrenzte Tische und Bestellungen frei. Zahlung und Rechnungen werden über Stripe abgewickelt: Klicken Sie auf « Abrechnung verwalten », um die Karte zu ändern, eine Rechnung herunterzuladen oder jederzeit zu kündigen.",
    checkoutSuccess:
      "Zahlung wird bestätigt — der Status unten aktualisiert sich automatisch, sobald Stripe uns benachrichtigt hat.",
    checkoutCancelled: "Zahlung abgebrochen, es wurde nichts abgebucht.",
    statusPrefix: "Status: ",
    engagementLabel: "Laufzeit",
    trialDaysLeftTemplate: "Noch {n} Tag(e) der kostenlosen Testphase.",
    trialEnded: "Kostenlose Testphase beendet.",
    stripeNotConfigured: {
      before: "Stripe ist in dieser Umgebung nicht konfiguriert (Variable ",
      betweenVars: " und/oder die Variablen ",
      beforeEnvExample: " fehlen) — lokal ohne Stripe-Konto normal. Siehe ",
      afterEnvExample: ".",
    },
    footerNote:
      "Vorausbezahltes Abonnement, wählbar monatlich, 3 Monate, 6 Monate oder 12 Monate. Jederzeit über Stripe verwaltbar: Zahlungsmethode, Rechnungen, Kündigung.",
    statusLabels: {
      trialing: "kostenlose Testphase",
      active: "aktiv",
      past_due: "Zahlung überfällig",
      canceled: "gekündigt",
      unpaid: "unbezahlt",
      incomplete: "unvollständig",
      incomplete_expired: "abgelaufen",
      paused: "pausiert",
    },
    planLabels: { monthly: "monatlich", quarterly: "3 Monate", semiannual: "6 Monate", annual: "12 Monate" },
    periods: { monthly: "Monatlich", quarterly: "3 Monate", semiannual: "6 Monate", annual: "12 Monate" },
    chooseDuration: "Wählen Sie die Vertragsdauer:",
    manageSubscription: "Mein Abonnement verwalten",
    genericError: "Unbekannter Fehler",
  },
  ar: {
    title: "الفوترة",
    help:
      "مخصص للمالك فقط. يفتح الاشتراك طاولات وطلبات غير محدودة. تُدار المدفوعات والفواتير عبر Stripe: انقر على « إدارة الفوترة » لتغيير البطاقة أو تنزيل فاتورة أو الإلغاء في أي وقت.",
    checkoutSuccess: "الدفع قيد التأكيد — ستتحدّث الحالة أدناه تلقائيًا بمجرد أن يُخطرنا Stripe.",
    checkoutCancelled: "تم إلغاء الدفع، لم يتم خصم أي مبلغ.",
    statusPrefix: "الحالة: ",
    engagementLabel: "الالتزام",
    trialDaysLeftTemplate: "تبقّى {n} يوم/أيام من الفترة التجريبية المجانية.",
    trialEnded: "انتهت الفترة التجريبية المجانية.",
    stripeNotConfigured: {
      before: "لم تتم تهيئة Stripe في هذه البيئة (متغيّر ",
      betweenVars: " و/أو المتغيرات ",
      beforeEnvExample: " مفقودة) — أمر طبيعي محليًا دون حساب Stripe. راجع ",
      afterEnvExample: ".",
    },
    footerNote:
      "اشتراك مدفوع مسبقًا، بالاختيار بين شهري أو 3 أشهر أو 6 أشهر أو 12 شهرًا. قابل للإدارة في أي وقت عبر Stripe: وسيلة الدفع، الفواتير، الإلغاء.",
    statusLabels: {
      trialing: "فترة تجريبية مجانية",
      active: "نشط",
      past_due: "دفعة متأخرة",
      canceled: "ملغى",
      unpaid: "غير مدفوع",
      incomplete: "غير مكتمل",
      incomplete_expired: "منتهي الصلاحية",
      paused: "متوقف مؤقتًا",
    },
    planLabels: { monthly: "شهري", quarterly: "3 أشهر", semiannual: "6 أشهر", annual: "12 شهرًا" },
    periods: { monthly: "شهري", quarterly: "3 أشهر", semiannual: "6 أشهر", annual: "12 شهرًا" },
    chooseDuration: "اختر مدة الالتزام:",
    manageSubscription: "إدارة اشتراكي",
    genericError: "خطأ غير معروف",
  },
};
