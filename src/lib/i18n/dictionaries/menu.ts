import type { LanguageCode } from "@/lib/i18n/languages";

// UI chrome for src/app/dashboard/menu/page.tsx, item-form.tsx and
// translations-panel.tsx. Allergen labels (src/lib/allergens.ts) are a
// separate, out-of-scope system (see CONTEXT.md) and stay untouched here.
// `newCategory.placeholder` is deliberately kept identical across
// languages -- it's a sample of actual Italian menu category names
// (Antipasti/Primi/Dolci), not app chrome, so it doesn't get translated
// any more than a restaurant's own dish names would.
export interface MenuDict {
  title: string;
  help: { before: string; bold: string; after: string };
  newCategory: { heading: string; placeholder: string; add: string };
  genericError: string;
  noCategoriesYet: string;
  addItem: string;
  deleteCategory: string;
  unavailableBadge: string;
  allergensPrefix: string;
  markUnavailable: string;
  markAvailable: string;
  edit: string;
  delete: string;
  noItemsInCategory: string;
  confirmDeleteCategory: { title: string; body: string; confirm: string };
  confirmDeleteItem: { title: string; body: string; confirm: string };
  form: {
    save: string;
    addDish: string;
    nameIt: string;
    nameEn: string;
    descriptionIt: string;
    price: string;
    photo: string;
    uploading: string;
    orUploadPhoto: string;
    generating: string;
    orGenerateAi: string;
    uploadNotConfigured: string;
    uploadFailed: string;
    generateNeedsName: string;
    generateNotConfigured: string;
    generateFailed: string;
    allergensLegend: string;
    cancel: string;
  };
  translations: {
    heading: string;
    description: string;
    notConfigured: string;
    failed: string;
    genericError: string;
    translatedPrefix: string;
    languageSingular: string;
    languagePlural: string;
    button: string;
    running: string;
  };
}

export const MENU_DICT: Record<LanguageCode, MenuDict> = {
  fr: {
    title: "Menu",
    help: {
      before: "Organisez vos plats par ",
      bold: "catégories",
      after:
        " (Antipasti, Primi…), dans l'ordre où elles doivent apparaître au client. Chaque plat peut avoir une photo, un prix, des allergènes et un interrupteur « disponible » pour le retirer temporairement sans le supprimer (rupture de stock, plat du jour épuisé…).",
    },
    newCategory: { heading: "Nouvelle catégorie", placeholder: "Antipasti, Primi, Dolci…", add: "Ajouter" },
    genericError: "Erreur inconnue",
    noCategoriesYet: "Aucune catégorie pour l'instant — commencez par en créer une.",
    addItem: "+ Ajouter un plat",
    deleteCategory: "Supprimer la catégorie",
    unavailableBadge: "indisponible",
    allergensPrefix: "Allergènes : ",
    markUnavailable: "Marquer indisponible",
    markAvailable: "Marquer disponible",
    edit: "Modifier",
    delete: "Supprimer",
    noItemsInCategory: "Aucun plat dans cette catégorie.",
    confirmDeleteCategory: {
      title: "Supprimer cette catégorie ?",
      body: "Tous les plats qu'elle contient seront supprimés avec elle.",
      confirm: "Supprimer",
    },
    confirmDeleteItem: { title: "Supprimer ce plat ?", body: "Cette action est définitive.", confirm: "Supprimer" },
    form: {
      save: "Enregistrer",
      addDish: "Ajouter le plat",
      nameIt: "Nom (IT)",
      nameEn: "Nom (EN)",
      descriptionIt: "Description (IT)",
      price: "Prix (€)",
      photo: "Photo (URL, optionnel)",
      uploading: "Envoi…",
      orUploadPhoto: "ou importer une photo",
      generating: "Génération…",
      orGenerateAi: "ou générer avec l'IA",
      uploadNotConfigured: "Upload non configuré sur cet environnement — collez une URL manuellement.",
      uploadFailed: "Échec de l'envoi",
      generateNeedsName: "Renseignez le nom du plat avant de générer une photo.",
      generateNotConfigured: "Génération IA non configurée sur cet environnement.",
      generateFailed: "Échec de la génération",
      allergensLegend: "Allergènes (Règlement UE n°1169/2011)",
      cancel: "Annuler",
    },
    translations: {
      heading: "Traduction automatique",
      description:
        "Traduit le nom et la description de chaque plat depuis l'italien. Relancer écrase la traduction précédente — utile après avoir modifié le menu.",
      notConfigured: "Traduction non configurée sur cet environnement.",
      failed: "Échec de la traduction",
      genericError: "Erreur inconnue",
      translatedPrefix: "Menu traduit vers ",
      languageSingular: "langue",
      languagePlural: "langues",
      button: "Traduire le menu",
      running: "Traduction…",
    },
  },
  it: {
    title: "Menu",
    help: {
      before: "Organizza i tuoi piatti per ",
      bold: "categorie",
      after:
        " (Antipasti, Primi…), nell'ordine in cui devono apparire al cliente. Ogni piatto può avere una foto, un prezzo, degli allergeni e un interruttore «disponibile» per rimuoverlo temporaneamente senza eliminarlo (esaurito, piatto del giorno finito…).",
    },
    newCategory: { heading: "Nuova categoria", placeholder: "Antipasti, Primi, Dolci…", add: "Aggiungi" },
    genericError: "Errore sconosciuto",
    noCategoriesYet: "Nessuna categoria per ora — inizia creandone una.",
    addItem: "+ Aggiungi un piatto",
    deleteCategory: "Elimina la categoria",
    unavailableBadge: "non disponibile",
    allergensPrefix: "Allergeni: ",
    markUnavailable: "Segna come non disponibile",
    markAvailable: "Segna come disponibile",
    edit: "Modifica",
    delete: "Elimina",
    noItemsInCategory: "Nessun piatto in questa categoria.",
    confirmDeleteCategory: {
      title: "Eliminare questa categoria?",
      body: "Tutti i piatti che contiene verranno eliminati con essa.",
      confirm: "Elimina",
    },
    confirmDeleteItem: { title: "Eliminare questo piatto?", body: "Questa azione è definitiva.", confirm: "Elimina" },
    form: {
      save: "Salva",
      addDish: "Aggiungi il piatto",
      nameIt: "Nome (IT)",
      nameEn: "Nome (EN)",
      descriptionIt: "Descrizione (IT)",
      price: "Prezzo (€)",
      photo: "Foto (URL, opzionale)",
      uploading: "Invio…",
      orUploadPhoto: "oppure importa una foto",
      generating: "Generazione…",
      orGenerateAi: "oppure genera con l'IA",
      uploadNotConfigured: "Upload non configurato su questo ambiente — incolla un URL manualmente.",
      uploadFailed: "Invio non riuscito",
      generateNeedsName: "Inserisci il nome del piatto prima di generare una foto.",
      generateNotConfigured: "Generazione IA non configurata su questo ambiente.",
      generateFailed: "Generazione non riuscita",
      allergensLegend: "Allergeni (Regolamento UE n. 1169/2011)",
      cancel: "Annulla",
    },
    translations: {
      heading: "Traduzione automatica",
      description:
        "Traduce il nome e la descrizione di ogni piatto dall'italiano. Rilanciarla sovrascrive la traduzione precedente — utile dopo aver modificato il menu.",
      notConfigured: "Traduzione non configurata su questo ambiente.",
      failed: "Traduzione non riuscita",
      genericError: "Errore sconosciuto",
      translatedPrefix: "Menu tradotto in ",
      languageSingular: "lingua",
      languagePlural: "lingue",
      button: "Traduci il menu",
      running: "Traduzione…",
    },
  },
  en: {
    title: "Menu",
    help: {
      before: "Organize your dishes into ",
      bold: "categories",
      after:
        " (Starters, Mains…), in the order they should appear to the customer. Each dish can have a photo, a price, allergens and an « available » toggle to temporarily remove it without deleting it (out of stock, today's special sold out…).",
    },
    newCategory: { heading: "New category", placeholder: "Antipasti, Primi, Dolci…", add: "Add" },
    genericError: "Unknown error",
    noCategoriesYet: "No categories yet — start by creating one.",
    addItem: "+ Add a dish",
    deleteCategory: "Delete category",
    unavailableBadge: "unavailable",
    allergensPrefix: "Allergens: ",
    markUnavailable: "Mark unavailable",
    markAvailable: "Mark available",
    edit: "Edit",
    delete: "Delete",
    noItemsInCategory: "No dishes in this category.",
    confirmDeleteCategory: {
      title: "Delete this category?",
      body: "All the dishes it contains will be deleted with it.",
      confirm: "Delete",
    },
    confirmDeleteItem: { title: "Delete this dish?", body: "This action is permanent.", confirm: "Delete" },
    form: {
      save: "Save",
      addDish: "Add dish",
      nameIt: "Name (IT)",
      nameEn: "Name (EN)",
      descriptionIt: "Description (IT)",
      price: "Price (€)",
      photo: "Photo (URL, optional)",
      uploading: "Uploading…",
      orUploadPhoto: "or upload a photo",
      generating: "Generating…",
      orGenerateAi: "or generate with AI",
      uploadNotConfigured: "Upload not configured in this environment — paste a URL manually.",
      uploadFailed: "Upload failed",
      generateNeedsName: "Enter the dish name before generating a photo.",
      generateNotConfigured: "AI generation not configured in this environment.",
      generateFailed: "Generation failed",
      allergensLegend: "Allergens (EU Regulation No. 1169/2011)",
      cancel: "Cancel",
    },
    translations: {
      heading: "Automatic translation",
      description:
        "Translates each dish's name and description from Italian. Running it again overwrites the previous translation — useful after editing the menu.",
      notConfigured: "Translation not configured in this environment.",
      failed: "Translation failed",
      genericError: "Unknown error",
      translatedPrefix: "Menu translated into ",
      languageSingular: "language",
      languagePlural: "languages",
      button: "Translate menu",
      running: "Translating…",
    },
  },
  es: {
    title: "Menú",
    help: {
      before: "Organiza tus platos por ",
      bold: "categorías",
      after:
        " (Antipasti, Primi…), en el orden en que deben aparecer al cliente. Cada plato puede tener una foto, un precio, alérgenos y un interruptor «disponible» para retirarlo temporalmente sin eliminarlo (agotado, plato del día terminado…).",
    },
    newCategory: { heading: "Nueva categoría", placeholder: "Antipasti, Primi, Dolci…", add: "Añadir" },
    genericError: "Error desconocido",
    noCategoriesYet: "Todavía no hay categorías — empieza creando una.",
    addItem: "+ Añadir un plato",
    deleteCategory: "Eliminar categoría",
    unavailableBadge: "no disponible",
    allergensPrefix: "Alérgenos: ",
    markUnavailable: "Marcar no disponible",
    markAvailable: "Marcar disponible",
    edit: "Editar",
    delete: "Eliminar",
    noItemsInCategory: "No hay platos en esta categoría.",
    confirmDeleteCategory: {
      title: "¿Eliminar esta categoría?",
      body: "Todos los platos que contiene se eliminarán con ella.",
      confirm: "Eliminar",
    },
    confirmDeleteItem: { title: "¿Eliminar este plato?", body: "Esta acción es definitiva.", confirm: "Eliminar" },
    form: {
      save: "Guardar",
      addDish: "Añadir plato",
      nameIt: "Nombre (IT)",
      nameEn: "Nombre (EN)",
      descriptionIt: "Descripción (IT)",
      price: "Precio (€)",
      photo: "Foto (URL, opcional)",
      uploading: "Enviando…",
      orUploadPhoto: "o subir una foto",
      generating: "Generando…",
      orGenerateAi: "o generar con IA",
      uploadNotConfigured: "Subida no configurada en este entorno — pega una URL manualmente.",
      uploadFailed: "Error al enviar",
      generateNeedsName: "Indica el nombre del plato antes de generar una foto.",
      generateNotConfigured: "Generación con IA no configurada en este entorno.",
      generateFailed: "Error al generar",
      allergensLegend: "Alérgenos (Reglamento UE n.º 1169/2011)",
      cancel: "Cancelar",
    },
    translations: {
      heading: "Traducción automática",
      description:
        "Traduce el nombre y la descripción de cada plato desde el italiano. Volver a ejecutarla sobrescribe la traducción anterior — útil tras modificar el menú.",
      notConfigured: "Traducción no configurada en este entorno.",
      failed: "Error al traducir",
      genericError: "Error desconocido",
      translatedPrefix: "Menú traducido a ",
      languageSingular: "idioma",
      languagePlural: "idiomas",
      button: "Traducir el menú",
      running: "Traduciendo…",
    },
  },
  de: {
    title: "Speisekarte",
    help: {
      before: "Ordnen Sie Ihre Gerichte in ",
      bold: "Kategorien",
      after:
        " (Antipasti, Primi…), in der Reihenfolge, in der sie dem Gast angezeigt werden sollen. Jedes Gericht kann ein Foto, einen Preis, Allergene und einen Schalter «verfügbar» haben, um es vorübergehend zu entfernen, ohne es zu löschen (nicht vorrätig, Tagesgericht ausverkauft…).",
    },
    newCategory: { heading: "Neue Kategorie", placeholder: "Antipasti, Primi, Dolci…", add: "Hinzufügen" },
    genericError: "Unbekannter Fehler",
    noCategoriesYet: "Noch keine Kategorien — legen Sie zunächst eine an.",
    addItem: "+ Gericht hinzufügen",
    deleteCategory: "Kategorie löschen",
    unavailableBadge: "nicht verfügbar",
    allergensPrefix: "Allergene: ",
    markUnavailable: "Als nicht verfügbar markieren",
    markAvailable: "Als verfügbar markieren",
    edit: "Bearbeiten",
    delete: "Löschen",
    noItemsInCategory: "Keine Gerichte in dieser Kategorie.",
    confirmDeleteCategory: {
      title: "Diese Kategorie löschen?",
      body: "Alle enthaltenen Gerichte werden mit ihr gelöscht.",
      confirm: "Löschen",
    },
    confirmDeleteItem: { title: "Dieses Gericht löschen?", body: "Diese Aktion ist endgültig.", confirm: "Löschen" },
    form: {
      save: "Speichern",
      addDish: "Gericht hinzufügen",
      nameIt: "Name (IT)",
      nameEn: "Name (EN)",
      descriptionIt: "Beschreibung (IT)",
      price: "Preis (€)",
      photo: "Foto (URL, optional)",
      uploading: "Wird gesendet…",
      orUploadPhoto: "oder Foto hochladen",
      generating: "Wird generiert…",
      orGenerateAi: "oder mit KI generieren",
      uploadNotConfigured: "Upload in dieser Umgebung nicht konfiguriert — fügen Sie eine URL manuell ein.",
      uploadFailed: "Senden fehlgeschlagen",
      generateNeedsName: "Geben Sie den Namen des Gerichts ein, bevor Sie ein Foto generieren.",
      generateNotConfigured: "KI-Generierung in dieser Umgebung nicht konfiguriert.",
      generateFailed: "Generierung fehlgeschlagen",
      allergensLegend: "Allergene (EU-Verordnung Nr. 1169/2011)",
      cancel: "Abbrechen",
    },
    translations: {
      heading: "Automatische Übersetzung",
      description:
        "Übersetzt Name und Beschreibung jedes Gerichts aus dem Italienischen. Erneutes Ausführen überschreibt die vorherige Übersetzung — nützlich nach Änderungen an der Speisekarte.",
      notConfigured: "Übersetzung in dieser Umgebung nicht konfiguriert.",
      failed: "Übersetzung fehlgeschlagen",
      genericError: "Unbekannter Fehler",
      translatedPrefix: "Speisekarte übersetzt in ",
      languageSingular: "Sprache",
      languagePlural: "Sprachen",
      button: "Speisekarte übersetzen",
      running: "Übersetzung…",
    },
  },
  ar: {
    title: "القائمة",
    help: {
      before: "نظّم أطباقك ضمن ",
      bold: "فئات",
      after:
        " (مقبلات، أطباق رئيسية…)، بالترتيب الذي يجب أن تظهر به للعميل. يمكن أن يحتوي كل طبق على صورة وسعر ومسببات حساسية ومفتاح «متاح» لإزالته مؤقتًا دون حذفه (نفاد المخزون، انتهاء طبق اليوم…).",
    },
    newCategory: { heading: "فئة جديدة", placeholder: "Antipasti, Primi, Dolci…", add: "إضافة" },
    genericError: "خطأ غير معروف",
    noCategoriesYet: "لا توجد فئات بعد — ابدأ بإنشاء واحدة.",
    addItem: "+ إضافة طبق",
    deleteCategory: "حذف الفئة",
    unavailableBadge: "غير متاح",
    allergensPrefix: "مسببات الحساسية: ",
    markUnavailable: "تمييز كغير متاح",
    markAvailable: "تمييز كمتاح",
    edit: "تعديل",
    delete: "حذف",
    noItemsInCategory: "لا توجد أطباق في هذه الفئة.",
    confirmDeleteCategory: {
      title: "حذف هذه الفئة؟",
      body: "سيتم حذف جميع الأطباق التي تحتوي عليها معها.",
      confirm: "حذف",
    },
    confirmDeleteItem: { title: "حذف هذا الطبق؟", body: "هذا الإجراء نهائي.", confirm: "حذف" },
    form: {
      save: "حفظ",
      addDish: "إضافة الطبق",
      nameIt: "الاسم (بالإيطالية)",
      nameEn: "الاسم (بالإنجليزية)",
      descriptionIt: "الوصف (بالإيطالية)",
      price: "السعر (€)",
      photo: "الصورة (رابط، اختياري)",
      uploading: "جارٍ الإرسال…",
      orUploadPhoto: "أو استيراد صورة",
      generating: "جارٍ التوليد…",
      orGenerateAi: "أو التوليد بالذكاء الاصطناعي",
      uploadNotConfigured: "الرفع غير مُهيأ في هذه البيئة — الصق رابطًا يدويًا.",
      uploadFailed: "فشل الإرسال",
      generateNeedsName: "أدخل اسم الطبق قبل توليد صورة.",
      generateNotConfigured: "التوليد بالذكاء الاصطناعي غير مُهيأ في هذه البيئة.",
      generateFailed: "فشل التوليد",
      allergensLegend: "مسببات الحساسية (لائحة الاتحاد الأوروبي رقم 1169/2011)",
      cancel: "إلغاء",
    },
    translations: {
      heading: "الترجمة التلقائية",
      description: "يترجم اسم ووصف كل طبق من الإيطالية. تشغيله مجددًا يستبدل الترجمة السابقة — مفيد بعد تعديل القائمة.",
      notConfigured: "الترجمة غير مُهيأة في هذه البيئة.",
      failed: "فشلت الترجمة",
      genericError: "خطأ غير معروف",
      translatedPrefix: "تمت ترجمة القائمة إلى ",
      languageSingular: "لغة",
      languagePlural: "لغات",
      button: "ترجمة القائمة",
      running: "جارٍ الترجمة…",
    },
  },
};
