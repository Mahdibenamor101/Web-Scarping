import type { LanguageCode } from "@/lib/i18n/languages";

// UI chrome for src/app/dashboard/branding/page.tsx. `subtitleBeforeCode`/
// `subtitleAfterCode` bracket the literal "/menu/..." <code> snippet in the
// JSX, which never gets translated. "Tavolino" is the product's own name and
// stays as-is in every language, same treatment as e.g. "Stripe".
export interface BrandingDict {
  title: string;
  helpTip: string;
  subtitleBeforeCode: string;
  subtitleAfterCode: string;
  logoTitle: string;
  logoBody: string;
  backgroundTitle: string;
  backgroundBody: string;
  uploadNotConfigured: string;
  uploadFailed: string;
  saveFailed: string;
  genericError: string;
  noImage: string;
  uploading: string;
  replace: string;
  import: string;
  remove: string;
}

export const BRANDING_DICT: Record<LanguageCode, BrandingDict> = {
  fr: {
    title: "Marque",
    helpTip:
      "Formats acceptés : JPG, PNG, WebP. Un logo carré (ex. 512×512) et une image de fond au format portrait rendent le mieux sur le téléphone du client. Laissez un champ vide pour revenir à l'habillage Tavolino par défaut.",
    subtitleBeforeCode: "Logo et image de fond affichés sur le menu public de vos clients (",
    subtitleAfterCode:
      "). Le tableau de bord reste toujours Tavolino — cette personnalisation ne concerne que ce que vos clients voient après avoir scanné le QR.",
    logoTitle: "Logo",
    logoBody: "Remplace le logo Tavolino en haut du menu du client.",
    backgroundTitle: "Image de fond",
    backgroundBody: "Une photo du local, des plats, ou une couleur — visible derrière le menu.",
    uploadNotConfigured: "Upload non configuré sur cet environnement.",
    uploadFailed: "Échec de l'envoi",
    saveFailed: "Échec de l'enregistrement",
    genericError: "Erreur inconnue",
    noImage: "Aucune image",
    uploading: "Envoi…",
    replace: "Remplacer",
    import: "Importer",
    remove: "Retirer",
  },
  it: {
    title: "Marchio",
    helpTip:
      "Formati accettati: JPG, PNG, WebP. Un logo quadrato (es. 512×512) e un'immagine di sfondo in formato verticale rendono al meglio sullo smartphone del cliente. Lascia un campo vuoto per tornare alla veste grafica Tavolino predefinita.",
    subtitleBeforeCode: "Logo e immagine di sfondo mostrati sul menu pubblico dei tuoi clienti (",
    subtitleAfterCode:
      "). Il pannello di controllo resta sempre Tavolino — questa personalizzazione riguarda solo ciò che i tuoi clienti vedono dopo aver scansionato il QR.",
    logoTitle: "Logo",
    logoBody: "Sostituisce il logo Tavolino in cima al menu del cliente.",
    backgroundTitle: "Immagine di sfondo",
    backgroundBody: "Una foto del locale, dei piatti, o un colore — visibile dietro il menu.",
    uploadNotConfigured: "Upload non configurato su questo ambiente.",
    uploadFailed: "Invio non riuscito",
    saveFailed: "Salvataggio non riuscito",
    genericError: "Errore sconosciuto",
    noImage: "Nessuna immagine",
    uploading: "Invio…",
    replace: "Sostituisci",
    import: "Importa",
    remove: "Rimuovi",
  },
  en: {
    title: "Branding",
    helpTip:
      "Accepted formats: JPG, PNG, WebP. A square logo (e.g. 512×512) and a portrait-format background image work best on the customer's phone. Leave a field empty to revert to the default Tavolino styling.",
    subtitleBeforeCode: "Logo and background image shown on your customers' public menu (",
    subtitleAfterCode:
      "). The dashboard always stays Tavolino — this customization only affects what your customers see after scanning the QR code.",
    logoTitle: "Logo",
    logoBody: "Replaces the Tavolino logo at the top of the customer's menu.",
    backgroundTitle: "Background image",
    backgroundBody: "A photo of your venue, your dishes, or a color — shown behind the menu.",
    uploadNotConfigured: "Upload not configured in this environment.",
    uploadFailed: "Upload failed",
    saveFailed: "Save failed",
    genericError: "Unknown error",
    noImage: "No image",
    uploading: "Uploading…",
    replace: "Replace",
    import: "Upload",
    remove: "Remove",
  },
  es: {
    title: "Marca",
    helpTip:
      "Formatos aceptados: JPG, PNG, WebP. Un logo cuadrado (ej. 512×512) y una imagen de fondo en formato vertical se ven mejor en el teléfono del cliente. Deja un campo vacío para volver al estilo Tavolino por defecto.",
    subtitleBeforeCode: "Logo e imagen de fondo mostrados en el menú público de tus clientes (",
    subtitleAfterCode:
      "). El panel de control siempre sigue siendo Tavolino — esta personalización solo afecta a lo que ven tus clientes tras escanear el QR.",
    logoTitle: "Logo",
    logoBody: "Sustituye el logo de Tavolino en la parte superior del menú del cliente.",
    backgroundTitle: "Imagen de fondo",
    backgroundBody: "Una foto del local, de los platos, o un color — visible detrás del menú.",
    uploadNotConfigured: "Subida no configurada en este entorno.",
    uploadFailed: "Error al enviar",
    saveFailed: "Error al guardar",
    genericError: "Error desconocido",
    noImage: "Sin imagen",
    uploading: "Enviando…",
    replace: "Reemplazar",
    import: "Importar",
    remove: "Quitar",
  },
  de: {
    title: "Marke",
    helpTip:
      "Akzeptierte Formate: JPG, PNG, WebP. Ein quadratisches Logo (z. B. 512×512) und ein Hintergrundbild im Hochformat wirken auf dem Smartphone des Gasts am besten. Lassen Sie ein Feld leer, um zur Tavolino-Standardgestaltung zurückzukehren.",
    subtitleBeforeCode: "Logo und Hintergrundbild werden auf der öffentlichen Speisekarte Ihrer Gäste angezeigt (",
    subtitleAfterCode:
      "). Das Dashboard bleibt immer Tavolino — diese Anpassung betrifft nur das, was Ihre Gäste nach dem Scannen des QR-Codes sehen.",
    logoTitle: "Logo",
    logoBody: "Ersetzt das Tavolino-Logo oben auf der Speisekarte des Gasts.",
    backgroundTitle: "Hintergrundbild",
    backgroundBody: "Ein Foto des Lokals, der Gerichte, oder eine Farbe — sichtbar hinter der Speisekarte.",
    uploadNotConfigured: "Upload in dieser Umgebung nicht konfiguriert.",
    uploadFailed: "Senden fehlgeschlagen",
    saveFailed: "Speichern fehlgeschlagen",
    genericError: "Unbekannter Fehler",
    noImage: "Kein Bild",
    uploading: "Wird gesendet…",
    replace: "Ersetzen",
    import: "Hochladen",
    remove: "Entfernen",
  },
  ar: {
    title: "العلامة التجارية",
    helpTip:
      "الصيغ المقبولة: JPG وPNG وWebP. الشعار المربع (مثلاً 512×512) وصورة الخلفية بتنسيق عمودي يعطيان أفضل نتيجة على هاتف العميل. اترك الحقل فارغًا للعودة إلى مظهر Tavolino الافتراضي.",
    subtitleBeforeCode: "يظهر الشعار وصورة الخلفية في القائمة العامة لعملائك (",
    subtitleAfterCode: "). تبقى لوحة التحكم دائمًا بمظهر Tavolino — يخص هذا التخصيص فقط ما يراه عملاؤك بعد مسح رمز QR.",
    logoTitle: "الشعار",
    logoBody: "يستبدل شعار Tavolino أعلى قائمة العميل.",
    backgroundTitle: "صورة الخلفية",
    backgroundBody: "صورة للمكان، للأطباق، أو لون — تظهر خلف القائمة.",
    uploadNotConfigured: "الرفع غير مُهيأ في هذه البيئة.",
    uploadFailed: "فشل الإرسال",
    saveFailed: "فشل الحفظ",
    genericError: "خطأ غير معروف",
    noImage: "لا توجد صورة",
    uploading: "جارٍ الإرسال…",
    replace: "استبدال",
    import: "استيراد",
    remove: "إزالة",
  },
};
