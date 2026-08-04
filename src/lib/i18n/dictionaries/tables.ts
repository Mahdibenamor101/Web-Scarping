import type { LanguageCode } from "@/lib/i18n/languages";

// UI chrome for src/app/dashboard/tables/page.tsx. qr-code.tsx renders no
// text of its own (just a <canvas>), so it needs no dictionary entry.
export interface TablesDict {
  title: string;
  help: {
    intro: string;
    qrUnique: string;
    afterQr: string;
    tableSuffix: string;
    counterSuffix: string;
    pickupSuffix: string;
    displayOnlySuffix: string;
  };
  newLink: { heading: string; add: string };
  modes: {
    table: { label: string; hint: string };
    counter: { label: string; hint: string };
    pickup: { label: string; hint: string };
    displayOnly: { label: string; hint: string };
  };
  genericError: string;
  deleteHasOrders: string;
  deleteGenericError: string;
  noTablesYet: string;
  occupied: string;
  free: string;
  delete: string;
  confirmDelete: { title: string; body: string; confirm: string };
}

export const TABLES_DICT: Record<LanguageCode, TablesDict> = {
  fr: {
    title: "Tables",
    help: {
      intro: "Chaque lien a son propre ",
      qrUnique: "QR code unique",
      afterQr: ". ",
      tableSuffix: " identifie une table précise ; ",
      counterSuffix: " donne un numéro de commande au lieu d'une table ; ",
      pickupSuffix: " demande le nom du client ; ",
      displayOnlySuffix: " montre le menu sans permettre de commander (vitrine, réseaux sociaux).",
    },
    newLink: { heading: "Nouveau lien de commande", add: "Ajouter" },
    modes: {
      table: { label: "Table", hint: "Une table physique, service à table classique." },
      counter: { label: "Comptoir", hint: "Un seul QR pour tout le comptoir, numéro de commande." },
      pickup: { label: "Retrait", hint: "Le client indique son nom, pas de table." },
      displayOnly: { label: "Affichage seul", hint: "Menu consultable, pas de commande possible." },
    },
    genericError: "Erreur inconnue",
    deleteHasOrders: "Cette table a déjà des commandes, suppression impossible.",
    deleteGenericError: "Erreur",
    noTablesYet: "Aucune table pour l'instant — ajoutez-en une pour obtenir un QR.",
    occupied: "Occupée",
    free: "Libre",
    delete: "Supprimer",
    confirmDelete: {
      title: "Supprimer cette table ?",
      body: "Le QR associé cessera de fonctionner immédiatement.",
      confirm: "Supprimer",
    },
  },
  it: {
    title: "Tavoli",
    help: {
      intro: "Ogni link ha il proprio ",
      qrUnique: "QR code unico",
      afterQr: ". ",
      tableSuffix: " identifica un tavolo preciso; ",
      counterSuffix: " assegna un numero d'ordine invece di un tavolo; ",
      pickupSuffix: " chiede il nome del cliente; ",
      displayOnlySuffix: " mostra il menu senza permettere di ordinare (vetrina, social media).",
    },
    newLink: { heading: "Nuovo link d'ordine", add: "Aggiungi" },
    modes: {
      table: { label: "Tavolo", hint: "Un tavolo fisico, servizio al tavolo classico." },
      counter: { label: "Banco", hint: "Un solo QR per tutto il banco, numero d'ordine." },
      pickup: { label: "Ritiro", hint: "Il cliente indica il proprio nome, nessun tavolo." },
      displayOnly: { label: "Solo visualizzazione", hint: "Menu consultabile, nessun ordine possibile." },
    },
    genericError: "Errore sconosciuto",
    deleteHasOrders: "Questo tavolo ha già degli ordini, impossibile eliminarlo.",
    deleteGenericError: "Errore",
    noTablesYet: "Nessun tavolo per ora — aggiungine uno per ottenere un QR.",
    occupied: "Occupato",
    free: "Libero",
    delete: "Elimina",
    confirmDelete: {
      title: "Eliminare questo tavolo?",
      body: "Il QR associato smetterà di funzionare immediatamente.",
      confirm: "Elimina",
    },
  },
  en: {
    title: "Tables",
    help: {
      intro: "Each link has its own ",
      qrUnique: "unique QR code",
      afterQr: ". ",
      tableSuffix: " identifies a specific table; ",
      counterSuffix: " gives an order number instead of a table; ",
      pickupSuffix: " asks for the customer's name; ",
      displayOnlySuffix: " shows the menu without allowing orders (window display, social media).",
    },
    newLink: { heading: "New order link", add: "Add" },
    modes: {
      table: { label: "Table", hint: "A physical table, classic table service." },
      counter: { label: "Counter", hint: "A single QR code for the whole counter, order number." },
      pickup: { label: "Pickup", hint: "The customer enters their name, no table." },
      displayOnly: { label: "Display only", hint: "Menu can be viewed, no ordering possible." },
    },
    genericError: "Unknown error",
    deleteHasOrders: "This table already has orders, deletion not possible.",
    deleteGenericError: "Error",
    noTablesYet: "No tables yet — add one to get a QR code.",
    occupied: "Occupied",
    free: "Free",
    delete: "Delete",
    confirmDelete: {
      title: "Delete this table?",
      body: "The associated QR code will stop working immediately.",
      confirm: "Delete",
    },
  },
  es: {
    title: "Mesas",
    help: {
      intro: "Cada enlace tiene su propio ",
      qrUnique: "código QR único",
      afterQr: ". ",
      tableSuffix: " identifica una mesa concreta; ",
      counterSuffix: " da un número de pedido en lugar de una mesa; ",
      pickupSuffix: " pide el nombre del cliente; ",
      displayOnlySuffix: " muestra el menú sin permitir pedir (escaparate, redes sociales).",
    },
    newLink: { heading: "Nuevo enlace de pedido", add: "Añadir" },
    modes: {
      table: { label: "Mesa", hint: "Una mesa física, servicio de mesa clásico." },
      counter: { label: "Mostrador", hint: "Un único QR para todo el mostrador, número de pedido." },
      pickup: { label: "Recogida", hint: "El cliente indica su nombre, sin mesa." },
      displayOnly: { label: "Solo visualización", hint: "Menú consultable, sin posibilidad de pedir." },
    },
    genericError: "Error desconocido",
    deleteHasOrders: "Esta mesa ya tiene pedidos, no se puede eliminar.",
    deleteGenericError: "Error",
    noTablesYet: "Todavía no hay mesas — añade una para obtener un QR.",
    occupied: "Ocupada",
    free: "Libre",
    delete: "Eliminar",
    confirmDelete: {
      title: "¿Eliminar esta mesa?",
      body: "El QR asociado dejará de funcionar de inmediato.",
      confirm: "Eliminar",
    },
  },
  de: {
    title: "Tische",
    help: {
      intro: "Jeder Link hat seinen eigenen ",
      qrUnique: "eindeutigen QR-Code",
      afterQr: ". ",
      tableSuffix: " kennzeichnet einen bestimmten Tisch; ",
      counterSuffix: " vergibt eine Bestellnummer anstelle eines Tisches; ",
      pickupSuffix: " fragt nach dem Namen des Gasts; ",
      displayOnlySuffix: " zeigt die Speisekarte, ohne eine Bestellung zu ermöglichen (Schaufenster, soziale Medien).",
    },
    newLink: { heading: "Neuer Bestelllink", add: "Hinzufügen" },
    modes: {
      table: { label: "Tisch", hint: "Ein physischer Tisch, klassischer Tischservice." },
      counter: { label: "Theke", hint: "Ein einziger QR-Code für die gesamte Theke, Bestellnummer." },
      pickup: { label: "Abholung", hint: "Der Gast gibt seinen Namen an, kein Tisch." },
      displayOnly: { label: "Nur Anzeige", hint: "Speisekarte einsehbar, keine Bestellung möglich." },
    },
    genericError: "Unbekannter Fehler",
    deleteHasOrders: "Dieser Tisch hat bereits Bestellungen, Löschen nicht möglich.",
    deleteGenericError: "Fehler",
    noTablesYet: "Noch keine Tische — fügen Sie einen hinzu, um einen QR-Code zu erhalten.",
    occupied: "Besetzt",
    free: "Frei",
    delete: "Löschen",
    confirmDelete: {
      title: "Diesen Tisch löschen?",
      body: "Der zugehörige QR-Code funktioniert danach sofort nicht mehr.",
      confirm: "Löschen",
    },
  },
  ar: {
    title: "الطاولات",
    help: {
      intro: "لكل رابط ",
      qrUnique: "رمز QR فريد",
      afterQr: " خاص به. ",
      tableSuffix: " تعني طاولة محددة؛ ",
      counterSuffix: " يعطي رقم طلب بدل طاولة؛ ",
      pickupSuffix: " يطلب اسم العميل؛ ",
      displayOnlySuffix: " يعرض القائمة دون إمكانية الطلب (واجهة عرض، وسائل التواصل الاجتماعي).",
    },
    newLink: { heading: "رابط طلب جديد", add: "إضافة" },
    modes: {
      table: { label: "طاولة", hint: "طاولة فعلية، خدمة طاولة تقليدية." },
      counter: { label: "كاونتر", hint: "رمز QR واحد لكل الكاونتر، برقم طلب." },
      pickup: { label: "استلام", hint: "يذكر العميل اسمه، بدون طاولة." },
      displayOnly: { label: "عرض فقط", hint: "قائمة قابلة للتصفح، دون إمكانية الطلب." },
    },
    genericError: "خطأ غير معروف",
    deleteHasOrders: "هذه الطاولة لديها طلبات بالفعل، يتعذّر حذفها.",
    deleteGenericError: "خطأ",
    noTablesYet: "لا توجد طاولات بعد — أضف واحدة للحصول على رمز QR.",
    occupied: "مشغولة",
    free: "متاحة",
    delete: "حذف",
    confirmDelete: {
      title: "حذف هذه الطاولة؟",
      body: "سيتوقف رمز QR المرتبط بها عن العمل فورًا.",
      confirm: "حذف",
    },
  },
};
