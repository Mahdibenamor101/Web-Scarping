import type { LanguageCode } from "@/lib/i18n/languages";

// Full UI-chrome translation for the homepage (src/app/page.tsx) plus the
// nav/footer/pricing-toggle/product-preview components it always renders
// with. Structured to mirror the page's own section order so a missing
// key is easy to spot against page.tsx while editing either file.
//
// Deliberately NOT covering (yet, see CONTEXT.md): the standalone
// /prezzi, /chi-siamo, /contatti page bodies, or the dashboard's inner
// pages beyond its nav -- those are tracked as follow-up work, the nav/
// footer/switcher already work correctly on every page in the meantime.
export interface LandingDict {
  nav: {
    demo: string;
    overview: string;
    features: string;
    pricing: string;
    faq: string;
    login: string;
    signup: string;
    openMenu: string;
    closeMenu: string;
    menuLabel: string;
  };
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine1Highlight: string;
    titleLine2: string;
    titleLine2Highlight: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trustBadges: [string, string, string];
  };
  why: {
    eyebrow: string;
    titlePre: string;
    titleHighlight: string;
    pillars: { title: string; points: [string, string] }[];
  };
  demoSection: {
    eyebrow: string;
    titlePre: string;
    titleHighlight: string;
    subtitle: string;
  };
  preview: {
    eyebrow: string;
    titlePre: string;
    titleHighlight: string;
    subtitle: string;
    tabs: { menu: string; orders: string; tables: string };
    captions: { menu: string; orders: string; tables: string };
  };
  steps: {
    eyebrow: string;
    titlePre: string;
    titleHighlight: string;
    items: { title: string; body: string }[];
  };
  features: {
    eyebrow: string;
    titlePre: string;
    titleHighlight: string;
    items: { title: string; body: string }[];
  };
  branding: {
    eyebrow: string;
    titlePre: string;
    titleHighlight: string;
    titleRest: string;
    body: string;
    advantagesLabel: string;
    steps: { title: string; body: string }[];
  };
  kitchen: {
    eyebrow: string;
    titlePre: string;
    titleHighlight: string;
    body: string;
    advantagesLabel: string;
    points: [string, string, string];
  };
  personas: {
    eyebrow: string;
    titlePre: string;
    titleHighlight: string;
    items: { title: string; body: string }[];
  };
  stats: {
    eyebrow: string;
    titlePre: string;
    titleHighlight: string;
    labels: [string, string, string, string];
  };
  comparison: {
    eyebrow: string;
    titlePre: string;
    titleHighlight: string;
    titleRest: string;
    paperHeading: string;
    qrHeading: string;
    rows: { paper: string; qr: string }[];
  };
  pricing: {
    eyebrow: string;
    titlePre: string;
    titleHighlight: string;
    subtitle: string;
    periodLabels: { oneMonth: string; threeMonths: string; sixMonths: string; twelveMonths: string };
    periods: {
      monthly: { price: string; suffix: string };
      quarterly: { price: string; suffix: string };
      semiannual: { price: string; suffix: string };
      annual: { price: string; suffix: string };
    };
    trialNote: string;
    features: string[];
    ctaPrimary: string;
    ctaSecondary: string;
  };
  faq: {
    eyebrow: string;
    titlePre: string;
    titleHighlight: string;
    items: { question: string; answer: string }[];
  };
  finalCta: {
    title: string;
    subtitle: string;
    button: string;
  };
  footer: {
    tagline: string;
    productHeading: string;
    companyHeading: string;
    about: string;
    contact: string;
    copyrightSuffix: string;
  };
}

export const LANDING_DICT: Record<LanguageCode, LandingDict> = {
  it: {
    nav: {
      demo: "Demo",
      overview: "Panoramica",
      features: "Funzionalità",
      pricing: "Prezzi",
      faq: "FAQ",
      login: "Accedi",
      signup: "Iscriviti",
      openMenu: "Apri il menu",
      closeMenu: "Chiudi il menu",
      menuLabel: "Menu",
    },
    hero: {
      eyebrow: "Menu QR e ordini al tavolo",
      titleLine1: "Il menu",
      titleLine1Highlight: "parla",
      titleLine2: "La cucina",
      titleLine2Highlight: "ascolta",
      subtitle:
        "Ogni ordine diventa una comanda digitale che viaggia dal tavolo alla cucina in tempo reale — senza hardware da installare, senza abbonamento a un dispositivo.",
      ctaPrimary: "Crea il tuo ristorante",
      ctaSecondary: "Guarda il prodotto",
      trustBadges: ["Operativo in pochi minuti", "Senza carta di credito", "14 giorni di prova gratuita"],
    },
    why: {
      eyebrow: "Perché mbQr",
      titlePre: "Cosa cambia per il tuo",
      titleHighlight: "locale",
      pillars: [
        {
          title: "Efficienza operativa",
          points: [
            "L'ordine arriva in cucina in pochi secondi, senza passare dal cameriere",
            "Nessuna ristampa: un prezzo o un piatto si aggiorna in un clic",
          ],
        },
        {
          title: "Esperienza cliente",
          points: [
            "Il menu si apre subito nel browser, senza installare nulla",
            "Sempre aggiornato: nessun piatto esaurito segnato ancora disponibile",
          ],
        },
        {
          title: "Meno carta",
          points: [
            "Un solo menu digitale al posto di ristampe ad ogni cambio di stagione",
            "Il QR si stampa una volta sola, per tavolo, non ad ogni modifica",
          ],
        },
      ],
    },
    demoSection: {
      eyebrow: "Demo",
      titlePre: "Guardalo",
      titleHighlight: "funzionare",
      subtitle: "Una vera registrazione dell'applicazione — scansione, menu, carrello, ordine inviato.",
    },
    preview: {
      eyebrow: "Anteprima del prodotto",
      titlePre: "Guardalo in",
      titleHighlight: "azione",
      subtitle: "Sono vere schermate dell'applicazione — non dei mockup.",
      tabs: { menu: "Menu cliente", orders: "Ordini in diretta", tables: "Tavoli & QR" },
      captions: {
        menu: "Il cliente scansiona, sfoglia il menu IT/EN e ordina dal telefono — senza installare nulla.",
        orders: "Ogni ordine arriva in cucina in pochi secondi, aggiornato in diretta senza ricaricare la pagina.",
        tables: "Un QR per tavolo, generato con un clic — da stampare o esporre, nessun dispositivo da acquistare.",
      },
    },
    steps: {
      eyebrow: "Tre passaggi",
      titlePre: "Come",
      titleHighlight: "funziona",
      items: [
        { title: "Il cliente scansiona", body: "Un QR per tavolo. Niente da installare, il menu si apre nel browser." },
        { title: "Ordina dal telefono", body: "Menu in italiano e inglese, allergeni indicati su ogni piatto." },
        { title: "Arriva in cucina, in diretta", body: "Da fare, in corso, pronto — aggiornato senza ricaricare la pagina." },
      ],
    },
    features: {
      eyebrow: "Funzionalità",
      titlePre: "Pensato per l'",
      titleHighlight: "Italia",
      items: [
        { title: "14 allergeni UE", body: "Etichettatura conforme al Regolamento (UE) n. 1169/2011, piatto per piatto." },
        { title: "IT / EN", body: "Menu bilingue fin dall'inizio, pensato per una clientela turistica." },
        { title: "Tempo reale", body: "L'ordine arriva in cucina in pochi secondi, senza ricaricare la pagina." },
        { title: "Isolamento rigoroso", body: "Ogni ristorante vede solo i propri dati — applicato a livello di database." },
      ],
    },
    branding: {
      eyebrow: "Il tuo marchio",
      titlePre: "Il menu porta il",
      titleHighlight: "tuo",
      titleRest: "nome, non il nostro.",
      body: "Carica il logo e un'immagine di sfondo del tuo locale dal pannello. Quando un cliente scansiona il QR, arriva su un menu che sembra il tuo — mbQr resta dietro le quinte.",
      advantagesLabel: "Vantaggi",
      steps: [
        { title: "Carica il tuo logo", body: "Sostituisce il logo mbQr in cima al menu del cliente." },
        { title: "Scegli uno sfondo", body: "Una foto del locale, dei piatti, o una tinta — quello che preferisci." },
        { title: "Il tuo nome resta protagonista", body: "mbQr resta invisibile: il cliente vede il tuo locale, non noi." },
      ],
    },
    kitchen: {
      eyebrow: "Cucina",
      titlePre: "Ogni ordine arriva",
      titleHighlight: "in diretta",
      body: "Nessuna carta, nessuna corsa in sala: l'ordine appare in cucina pochi secondi dopo l'invio, aggiornato in tempo reale senza ricaricare la pagina.",
      advantagesLabel: "Vantaggi",
      points: [
        "Da fare, in corso, pronto: tre colonne aggiornate senza ricaricare",
        "Ogni membro dello staff vede la stessa bacheca, in diretta",
        "Nessun ordine scritto a mano, nessun malinteso in cucina",
      ],
    },
    personas: {
      eyebrow: "Per ogni tipo di locale",
      titlePre: "Pensato per il tuo",
      titleHighlight: "locale",
      items: [
        { title: "Trattoria & ristorante", body: "Menu strutturato in categorie, allergeni su ogni piatto, ordini gestiti in cucina in diretta." },
        { title: "Pizzeria", body: "Impasti e stagionali che cambiano spesso: si aggiornano dal pannello, senza ristampare nulla." },
        { title: "Bar & enoteca", body: "Carta vini o cocktail, ordini rapidi al tavolo, aggiornati al volo quando qualcosa finisce." },
      ],
    },
    stats: {
      eyebrow: "In concreto",
      titlePre: "Quello che il prodotto",
      titleHighlight: "fa davvero",
      labels: [
        "Allergeni UE etichettati",
        "Lingue, IT / EN, fin dall'inizio",
        "Dati isolati per ristorante",
        "Hardware aggiuntivo da acquistare",
      ],
    },
    comparison: {
      eyebrow: "Perché passare al digitale",
      titlePre: "Carta o",
      titleHighlight: "QR",
      titleRest: "?",
      paperHeading: "Menu di carta",
      qrHeading: "Menu QR mbQr",
      rows: [
        { paper: "Cambiare un prezzo: bisogna ristampare tutto", qr: "Si aggiorna in un clic, subito visibile" },
        { paper: "Allergeni scritti a mano, facili da dimenticare", qr: "Etichettati su ogni piatto, sempre aggiornati" },
        { paper: "Una stampa diversa per ogni lingua", qr: "Italiano e inglese nello stesso menu" },
        { paper: "Un piatto finito? Il cameriere lo dice a voce, tavolo per tavolo", qr: "Segnato non disponibile in un tap, sparisce ovunque" },
        { paper: "L'ordine arriva in cucina scritto a mano", qr: "Arriva in diretta, aggiornato in tempo reale" },
      ],
    },
    pricing: {
      eyebrow: "Prezzi",
      titlePre: "Un solo piano.",
      titleHighlight: "Tutto incluso.",
      subtitle: "Nessuna offerta «Base» contro «Pro»: ogni ristorante accede a tutta la piattaforma.",
      periodLabels: { oneMonth: "1 mese", threeMonths: "3 mesi", sixMonths: "6 mesi", twelveMonths: "12 mesi" },
      periods: {
        monthly: { price: "50 €", suffix: "/ mese" },
        quarterly: { price: "42 €", suffix: "/ mese, fatturato 126 € ogni 3 mesi" },
        semiannual: { price: "36 €", suffix: "/ mese, fatturato 216 € ogni 6 mesi" },
        annual: { price: "~33 €", suffix: "/ mese, fatturato ~400 € / anno" },
      },
      trialNote: "14 giorni di prova gratuita, senza carta di credito.",
      features: [
        "QR code e tavoli illimitati",
        "Menu multilingue italiano / inglese",
        "Etichettatura dei 14 allergeni UE",
        "Ordini in tempo reale, senza ricaricare",
        "Account staff illimitati (manager, cameriere, cucina)",
        "Nessun dispositivo né hardware da acquistare",
      ],
      ctaPrimary: "Inizia la prova gratuita",
      ctaSecondary: "Vedi tutti i dettagli →",
    },
    faq: {
      eyebrow: "Domande frequenti",
      titlePre: "Le domande più",
      titleHighlight: "comuni",
      items: [
        {
          question: "Serve un hardware particolare?",
          answer:
            "No. Il cliente usa il proprio telefono, in sala/cucina basta un telefono, un tablet o un computer già esistente. Il QR si stampa o si espone su ogni tavolo.",
        },
        {
          question: "Il menu è conforme al regolamento UE sugli allergeni?",
          answer: "Sì. I 14 allergeni previsti dal Regolamento (UE) n. 1169/2011 sono etichettati piatto per piatto, direttamente dal pannello.",
        },
        {
          question: "Posso modificare il menu da solo, senza assistenza?",
          answer: "Sì. Categorie, piatti, prezzi e disponibilità si gestiscono dal pannello, in autonomia, in qualsiasi momento.",
        },
        {
          question: "I dati del mio ristorante sono isolati da quelli degli altri clienti?",
          answer:
            "Sì, l'isolamento è applicato a livello di database, non solo lato applicazione — vedi la funzionalità \"Isolamento rigoroso\" più sopra.",
        },
        {
          question: "Posso mettere il mio logo al posto del vostro?",
          answer: "Sì. Logo e sfondo del menu pubblico sono personalizzabili dal pannello — vedi \"Il tuo marchio, non il nostro\" più sopra.",
        },
        {
          question: "Il menu funziona su tutti gli smartphone?",
          answer: "Sì, si apre direttamente nel browser dopo la scansione del QR — nessuna app da installare.",
        },
        {
          question: "Posso disdire quando voglio?",
          answer: "Sì, l'abbonamento si gestisce dal pannello (sezione Abbonamento), in autonomia, in qualsiasi momento.",
        },
      ],
    },
    finalCta: {
      title: "Pronto a digitalizzare i tuoi tavoli?",
      subtitle: "Crea il tuo ristorante in pochi minuti, senza impegno.",
      button: "Crea il tuo ristorante",
    },
    footer: {
      tagline: "Il menu QR per chi serve ai tavoli — senza hardware, senza abbonamento a un dispositivo.",
      productHeading: "Prodotto",
      companyHeading: "Azienda",
      about: "Chi siamo",
      contact: "Contatti",
      copyrightSuffix: " — nome di lavoro, non depositato.",
    },
  },

  en: {
    nav: {
      demo: "Demo",
      overview: "Overview",
      features: "Features",
      pricing: "Pricing",
      faq: "FAQ",
      login: "Log in",
      signup: "Sign up",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      menuLabel: "Menu",
    },
    hero: {
      eyebrow: "QR menu and table ordering",
      titleLine1: "The menu",
      titleLine1Highlight: "speaks",
      titleLine2: "The kitchen",
      titleLine2Highlight: "listens",
      subtitle:
        "Every order becomes a digital ticket that travels from the table to the kitchen in real time — no hardware to install, no device subscription.",
      ctaPrimary: "Create your restaurant",
      ctaSecondary: "See the product",
      trustBadges: ["Up and running in minutes", "No credit card required", "14-day free trial"],
    },
    why: {
      eyebrow: "Why mbQr",
      titlePre: "What changes for your",
      titleHighlight: "restaurant",
      pillars: [
        {
          title: "Operational efficiency",
          points: [
            "The order reaches the kitchen in seconds, without going through a server",
            "No reprinting: a price or dish updates in one click",
          ],
        },
        {
          title: "Customer experience",
          points: [
            "The menu opens instantly in the browser, nothing to install",
            "Always up to date: no dish marked available once it's sold out",
          ],
        },
        {
          title: "Less paper",
          points: [
            "One digital menu instead of reprinting every season",
            "The QR code is printed once, per table, not for every change",
          ],
        },
      ],
    },
    demoSection: {
      eyebrow: "Demo",
      titlePre: "Watch it",
      titleHighlight: "in action",
      subtitle: "A real recording of the app — scan, menu, cart, order sent.",
    },
    preview: {
      eyebrow: "Product preview",
      titlePre: "See it",
      titleHighlight: "in action",
      subtitle: "These are real screens from the app — not mockups.",
      tabs: { menu: "Customer menu", orders: "Live orders", tables: "Tables & QR" },
      captions: {
        menu: "The customer scans, browses the menu in IT/EN and orders from their phone — nothing to install.",
        orders: "Every order reaches the kitchen in seconds, updated live without reloading the page.",
        tables: "One QR code per table, generated in a click — print it or display it, no device to buy.",
      },
    },
    steps: {
      eyebrow: "Three steps",
      titlePre: "How it",
      titleHighlight: "works",
      items: [
        { title: "The customer scans", body: "One QR per table. Nothing to install, the menu opens in the browser." },
        { title: "Orders from their phone", body: "Menu in Italian and English, allergens shown on every dish." },
        { title: "Reaches the kitchen live", body: "To do, in progress, ready — updated without reloading the page." },
      ],
    },
    features: {
      eyebrow: "Features",
      titlePre: "Built for",
      titleHighlight: "Italy",
      items: [
        { title: "14 EU allergens", body: "Labelling compliant with EU Regulation No 1169/2011, dish by dish." },
        { title: "IT / EN", body: "Bilingual menu from day one, built for tourist customers." },
        { title: "Real time", body: "The order reaches the kitchen in seconds, without reloading the page." },
        { title: "Strict isolation", body: "Every restaurant only ever sees its own data — enforced at the database level." },
      ],
    },
    branding: {
      eyebrow: "Your brand",
      titlePre: "The menu carries",
      titleHighlight: "your",
      titleRest: "name, not ours.",
      body: "Upload your logo and a background image of your place from the dashboard. When a customer scans the QR code, they land on a menu that looks like yours — mbQr stays behind the scenes.",
      advantagesLabel: "Benefits",
      steps: [
        { title: "Upload your logo", body: "Replaces the mbQr logo at the top of the customer menu." },
        { title: "Choose a background", body: "A photo of your place, your dishes, or a plain color — whatever you prefer." },
        { title: "Your name stays front and center", body: "mbQr stays invisible: the customer sees your place, not us." },
      ],
    },
    kitchen: {
      eyebrow: "Kitchen",
      titlePre: "Every order arrives",
      titleHighlight: "live",
      body: "No paper, no running back and forth: the order appears in the kitchen seconds after it's sent, updated in real time without reloading the page.",
      advantagesLabel: "Benefits",
      points: [
        "To do, in progress, ready: three columns updated without reloading",
        "Every staff member sees the same board, live",
        "No handwritten orders, no mix-ups in the kitchen",
      ],
    },
    personas: {
      eyebrow: "For every kind of place",
      titlePre: "Built for your",
      titleHighlight: "restaurant",
      items: [
        { title: "Trattoria & restaurant", body: "Menu organized in categories, allergens on every dish, orders managed live in the kitchen." },
        { title: "Pizzeria", body: "Doughs and seasonal specials that change often: update them from the dashboard, no reprinting." },
        { title: "Bar & wine bar", body: "Wine or cocktail list, quick table orders, updated on the fly the moment something runs out." },
      ],
    },
    stats: {
      eyebrow: "In practice",
      titlePre: "What the product",
      titleHighlight: "actually does",
      labels: [
        "EU allergens labelled",
        "Languages, IT / EN, from day one",
        "Data isolated per restaurant",
        "Extra hardware to buy",
      ],
    },
    comparison: {
      eyebrow: "Why go digital",
      titlePre: "Paper or",
      titleHighlight: "QR",
      titleRest: "?",
      paperHeading: "Paper menu",
      qrHeading: "mbQr QR menu",
      rows: [
        { paper: "Changing a price means reprinting everything", qr: "Updates in one click, instantly visible" },
        { paper: "Allergens written by hand, easy to forget", qr: "Labelled on every dish, always up to date" },
        { paper: "A different print for every language", qr: "Italian and English in the same menu" },
        { paper: "A dish is out? The server says so out loud, table by table", qr: "Marked unavailable in one tap, disappears everywhere" },
        { paper: "The order reaches the kitchen handwritten", qr: "Arrives live, updated in real time" },
      ],
    },
    pricing: {
      eyebrow: "Pricing",
      titlePre: "One plan.",
      titleHighlight: "Everything included.",
      subtitle: "No \"Basic\" vs \"Pro\" tiers: every restaurant gets the whole platform.",
      periodLabels: { oneMonth: "1 month", threeMonths: "3 months", sixMonths: "6 months", twelveMonths: "12 months" },
      periods: {
        monthly: { price: "€50", suffix: "/ month" },
        quarterly: { price: "€42", suffix: "/ month, billed €126 every 3 months" },
        semiannual: { price: "€36", suffix: "/ month, billed €216 every 6 months" },
        annual: { price: "~€33", suffix: "/ month, billed ~€400 / year" },
      },
      trialNote: "14-day free trial, no credit card required.",
      features: [
        "Unlimited QR codes and tables",
        "Italian / English multilingual menu",
        "14 EU allergens labelling",
        "Real-time orders, no reloading",
        "Unlimited staff accounts (manager, server, kitchen)",
        "No device or hardware to buy",
      ],
      ctaPrimary: "Start your free trial",
      ctaSecondary: "See all the details →",
    },
    faq: {
      eyebrow: "Frequently asked questions",
      titlePre: "The most",
      titleHighlight: "common questions",
      items: [
        {
          question: "Do I need any special hardware?",
          answer:
            "No. The customer uses their own phone, and the floor/kitchen just needs a phone, tablet, or computer you already have. The QR code is printed or displayed on each table.",
        },
        {
          question: "Is the menu compliant with the EU allergen regulation?",
          answer: "Yes. The 14 allergens required by EU Regulation No 1169/2011 are labelled dish by dish, directly from the dashboard.",
        },
        {
          question: "Can I edit the menu myself, without support?",
          answer: "Yes. Categories, dishes, prices and availability are all managed from the dashboard, on your own, any time.",
        },
        {
          question: "Is my restaurant's data isolated from other customers'?",
          answer:
            "Yes, isolation is enforced at the database level, not just the application layer — see the \"Strict isolation\" feature above.",
        },
        {
          question: "Can I put my own logo instead of yours?",
          answer: "Yes. The public menu's logo and background are customizable from the dashboard — see \"Your brand, not ours\" above.",
        },
        {
          question: "Does the menu work on every smartphone?",
          answer: "Yes, it opens directly in the browser after scanning the QR code — no app to install.",
        },
        {
          question: "Can I cancel whenever I want?",
          answer: "Yes, the subscription is managed from the dashboard (Billing section), on your own, any time.",
        },
      ],
    },
    finalCta: {
      title: "Ready to go digital at your tables?",
      subtitle: "Create your restaurant in minutes, no commitment.",
      button: "Create your restaurant",
    },
    footer: {
      tagline: "The QR menu for people who serve tables — no hardware, no device subscription.",
      productHeading: "Product",
      companyHeading: "Company",
      about: "About",
      contact: "Contact",
      copyrightSuffix: " — working name, not registered.",
    },
  },

  fr: {
    nav: {
      demo: "Démo",
      overview: "Aperçu",
      features: "Fonctionnalités",
      pricing: "Tarifs",
      faq: "FAQ",
      login: "Connexion",
      signup: "Inscription",
      openMenu: "Ouvrir le menu",
      closeMenu: "Fermer le menu",
      menuLabel: "Menu",
    },
    hero: {
      eyebrow: "Menu QR et commandes à table",
      titleLine1: "Le menu",
      titleLine1Highlight: "parle",
      titleLine2: "La cuisine",
      titleLine2Highlight: "écoute",
      subtitle:
        "Chaque commande devient un ticket numérique qui voyage de la table à la cuisine en temps réel — sans matériel à installer, sans abonnement à un appareil.",
      ctaPrimary: "Créez votre restaurant",
      ctaSecondary: "Voir le produit",
      trustBadges: ["Opérationnel en quelques minutes", "Sans carte bancaire", "14 jours d'essai gratuit"],
    },
    why: {
      eyebrow: "Pourquoi mbQr",
      titlePre: "Ce qui change pour votre",
      titleHighlight: "établissement",
      pillars: [
        {
          title: "Efficacité opérationnelle",
          points: [
            "La commande arrive en cuisine en quelques secondes, sans passer par le serveur",
            "Aucune réimpression : un prix ou un plat se met à jour en un clic",
          ],
        },
        {
          title: "Expérience client",
          points: [
            "Le menu s'ouvre immédiatement dans le navigateur, rien à installer",
            "Toujours à jour : aucun plat épuisé encore marqué disponible",
          ],
        },
        {
          title: "Moins de papier",
          points: [
            "Un seul menu numérique au lieu d'une réimpression à chaque saison",
            "Le QR s'imprime une seule fois, par table, pas à chaque changement",
          ],
        },
      ],
    },
    demoSection: {
      eyebrow: "Démo",
      titlePre: "Voyez-le",
      titleHighlight: "fonctionner",
      subtitle: "Un véritable enregistrement de l'application — scan, menu, panier, commande envoyée.",
    },
    preview: {
      eyebrow: "Aperçu du produit",
      titlePre: "Voyez-le",
      titleHighlight: "en action",
      subtitle: "Ce sont de vraies captures de l'application — pas des maquettes.",
      tabs: { menu: "Menu client", orders: "Commandes en direct", tables: "Tables & QR" },
      captions: {
        menu: "Le client scanne, parcourt le menu IT/EN et commande depuis son téléphone — sans rien installer.",
        orders: "Chaque commande arrive en cuisine en quelques secondes, mise à jour en direct sans recharger la page.",
        tables: "Un QR par table, généré en un clic — à imprimer ou à afficher, aucun appareil à acheter.",
      },
    },
    steps: {
      eyebrow: "Trois étapes",
      titlePre: "Comment ça",
      titleHighlight: "marche",
      items: [
        { title: "Le client scanne", body: "Un QR par table. Rien à installer, le menu s'ouvre dans le navigateur." },
        { title: "Il commande depuis son téléphone", body: "Menu en italien et en anglais, allergènes indiqués sur chaque plat." },
        { title: "Ça arrive en cuisine, en direct", body: "À faire, en cours, prêt — mis à jour sans recharger la page." },
      ],
    },
    features: {
      eyebrow: "Fonctionnalités",
      titlePre: "Pensé pour l'",
      titleHighlight: "Italie",
      items: [
        { title: "14 allergènes UE", body: "Étiquetage conforme au Règlement (UE) n° 1169/2011, plat par plat." },
        { title: "IT / EN", body: "Menu bilingue dès le départ, pensé pour une clientèle touristique." },
        { title: "Temps réel", body: "La commande arrive en cuisine en quelques secondes, sans recharger la page." },
        { title: "Isolation stricte", body: "Chaque restaurant ne voit que ses propres données — appliqué au niveau de la base de données." },
      ],
    },
    branding: {
      eyebrow: "Votre marque",
      titlePre: "Le menu porte",
      titleHighlight: "votre",
      titleRest: "nom, pas le nôtre.",
      body: "Chargez votre logo et une image de fond de votre établissement depuis le tableau de bord. Quand un client scanne le QR, il arrive sur un menu qui semble être le vôtre — mbQr reste en coulisses.",
      advantagesLabel: "Avantages",
      steps: [
        { title: "Chargez votre logo", body: "Remplace le logo mbQr en haut du menu client." },
        { title: "Choisissez un fond", body: "Une photo de votre établissement, de vos plats, ou une couleur — comme vous préférez." },
        { title: "Votre nom reste au premier plan", body: "mbQr reste invisible : le client voit votre établissement, pas nous." },
      ],
    },
    kitchen: {
      eyebrow: "Cuisine",
      titlePre: "Chaque commande arrive",
      titleHighlight: "en direct",
      body: "Aucun papier, aucune course en salle : la commande apparaît en cuisine quelques secondes après l'envoi, mise à jour en temps réel sans recharger la page.",
      advantagesLabel: "Avantages",
      points: [
        "À faire, en cours, prêt : trois colonnes mises à jour sans recharger",
        "Chaque membre de l'équipe voit le même tableau, en direct",
        "Aucune commande écrite à la main, aucun malentendu en cuisine",
      ],
    },
    personas: {
      eyebrow: "Pour tout type d'établissement",
      titlePre: "Pensé pour votre",
      titleHighlight: "établissement",
      items: [
        { title: "Trattoria & restaurant", body: "Menu organisé en catégories, allergènes sur chaque plat, commandes gérées en cuisine en direct." },
        { title: "Pizzeria", body: "Pâtes et plats de saison qui changent souvent : mis à jour depuis le panneau, sans jamais réimprimer." },
        { title: "Bar & bar à vins", body: "Carte des vins ou des cocktails, commandes rapides à table, mises à jour à la volée dès qu'un produit manque." },
      ],
    },
    stats: {
      eyebrow: "Concrètement",
      titlePre: "Ce que le produit",
      titleHighlight: "fait vraiment",
      labels: [
        "Allergènes UE étiquetés",
        "Langues, IT / EN, dès le départ",
        "Données isolées par restaurant",
        "Matériel supplémentaire à acheter",
      ],
    },
    comparison: {
      eyebrow: "Pourquoi passer au numérique",
      titlePre: "Papier ou",
      titleHighlight: "QR",
      titleRest: " ?",
      paperHeading: "Menu papier",
      qrHeading: "Menu QR mbQr",
      rows: [
        { paper: "Changer un prix : il faut tout réimprimer", qr: "Se met à jour en un clic, visible immédiatement" },
        { paper: "Allergènes écrits à la main, faciles à oublier", qr: "Étiquetés sur chaque plat, toujours à jour" },
        { paper: "Une impression différente par langue", qr: "Italien et anglais dans le même menu" },
        { paper: "Un plat épuisé ? Le serveur le dit à voix haute, table par table", qr: "Marqué indisponible en un geste, disparaît partout" },
        { paper: "La commande arrive en cuisine écrite à la main", qr: "Arrive en direct, mise à jour en temps réel" },
      ],
    },
    pricing: {
      eyebrow: "Tarifs",
      titlePre: "Un seul forfait.",
      titleHighlight: "Tout inclus.",
      subtitle: "Pas d'offre « Basique » contre « Pro » : chaque restaurant accède à toute la plateforme.",
      periodLabels: { oneMonth: "1 mois", threeMonths: "3 mois", sixMonths: "6 mois", twelveMonths: "12 mois" },
      periods: {
        monthly: { price: "50 €", suffix: "/ mois" },
        quarterly: { price: "42 €", suffix: "/ mois, facturé 126 € tous les 3 mois" },
        semiannual: { price: "36 €", suffix: "/ mois, facturé 216 € tous les 6 mois" },
        annual: { price: "~33 €", suffix: "/ mois, facturé ~400 € / an" },
      },
      trialNote: "14 jours d'essai gratuit, sans carte bancaire.",
      features: [
        "QR codes et tables illimités",
        "Menu multilingue italien / anglais",
        "Étiquetage des 14 allergènes UE",
        "Commandes en temps réel, sans recharger",
        "Comptes staff illimités (manager, serveur, cuisine)",
        "Aucun appareil ni matériel à acheter",
      ],
      ctaPrimary: "Démarrer l'essai gratuit",
      ctaSecondary: "Voir tous les détails →",
    },
    faq: {
      eyebrow: "Questions fréquentes",
      titlePre: "Les questions les plus",
      titleHighlight: "courantes",
      items: [
        {
          question: "Faut-il un matériel particulier ?",
          answer:
            "Non. Le client utilise son propre téléphone, en salle/cuisine un téléphone, une tablette ou un ordinateur déjà existant suffit. Le QR s'imprime ou s'affiche sur chaque table.",
        },
        {
          question: "Le menu est-il conforme au règlement UE sur les allergènes ?",
          answer: "Oui. Les 14 allergènes prévus par le Règlement (UE) n° 1169/2011 sont étiquetés plat par plat, directement depuis le tableau de bord.",
        },
        {
          question: "Puis-je modifier le menu moi-même, sans assistance ?",
          answer: "Oui. Catégories, plats, prix et disponibilité se gèrent depuis le tableau de bord, en autonomie, à tout moment.",
        },
        {
          question: "Les données de mon restaurant sont-elles isolées de celles des autres clients ?",
          answer:
            "Oui, l'isolation est appliquée au niveau de la base de données, pas seulement côté application — voir la fonctionnalité « Isolation stricte » plus haut.",
        },
        {
          question: "Puis-je mettre mon propre logo à la place du vôtre ?",
          answer: "Oui. Le logo et le fond du menu public sont personnalisables depuis le tableau de bord — voir « Votre marque, pas la nôtre » plus haut.",
        },
        {
          question: "Le menu fonctionne-t-il sur tous les smartphones ?",
          answer: "Oui, il s'ouvre directement dans le navigateur après le scan du QR — aucune application à installer.",
        },
        {
          question: "Puis-je résilier quand je veux ?",
          answer: "Oui, l'abonnement se gère depuis le tableau de bord (section Abonnement), en autonomie, à tout moment.",
        },
      ],
    },
    finalCta: {
      title: "Prêt à digitaliser vos tables ?",
      subtitle: "Créez votre restaurant en quelques minutes, sans engagement.",
      button: "Créez votre restaurant",
    },
    footer: {
      tagline: "Le menu QR pour ceux qui servent à table — sans matériel, sans abonnement à un appareil.",
      productHeading: "Produit",
      companyHeading: "Entreprise",
      about: "À propos",
      contact: "Contact",
      copyrightSuffix: " — nom de travail, non déposé.",
    },
  },

  es: {
    nav: {
      demo: "Demo",
      overview: "Resumen",
      features: "Funciones",
      pricing: "Precios",
      faq: "Preguntas",
      login: "Acceder",
      signup: "Registrarse",
      openMenu: "Abrir el menú",
      closeMenu: "Cerrar el menú",
      menuLabel: "Menú",
    },
    hero: {
      eyebrow: "Menú QR y pedidos en mesa",
      titleLine1: "El menú",
      titleLine1Highlight: "habla",
      titleLine2: "La cocina",
      titleLine2Highlight: "escucha",
      subtitle:
        "Cada pedido se convierte en una comanda digital que viaja de la mesa a la cocina en tiempo real — sin hardware que instalar, sin suscripción a ningún dispositivo.",
      ctaPrimary: "Crea tu restaurante",
      ctaSecondary: "Ver el producto",
      trustBadges: ["Operativo en pocos minutos", "Sin tarjeta de crédito", "14 días de prueba gratuita"],
    },
    why: {
      eyebrow: "Por qué mbQr",
      titlePre: "Qué cambia para tu",
      titleHighlight: "local",
      pillars: [
        {
          title: "Eficiencia operativa",
          points: [
            "El pedido llega a cocina en segundos, sin pasar por el camarero",
            "Sin reimpresiones: un precio o un plato se actualiza en un clic",
          ],
        },
        {
          title: "Experiencia del cliente",
          points: [
            "El menú se abre al instante en el navegador, nada que instalar",
            "Siempre actualizado: ningún plato agotado aparece como disponible",
          ],
        },
        {
          title: "Menos papel",
          points: [
            "Un único menú digital en lugar de reimprimir en cada temporada",
            "El QR se imprime una sola vez, por mesa, no en cada cambio",
          ],
        },
      ],
    },
    demoSection: {
      eyebrow: "Demo",
      titlePre: "Míralo",
      titleHighlight: "funcionar",
      subtitle: "Una grabación real de la aplicación — escaneo, menú, carrito, pedido enviado.",
    },
    preview: {
      eyebrow: "Vista previa del producto",
      titlePre: "Míralo",
      titleHighlight: "en acción",
      subtitle: "Son capturas reales de la aplicación — no maquetas.",
      tabs: { menu: "Menú del cliente", orders: "Pedidos en directo", tables: "Mesas y QR" },
      captions: {
        menu: "El cliente escanea, navega el menú en IT/EN y pide desde su teléfono — sin instalar nada.",
        orders: "Cada pedido llega a cocina en segundos, actualizado en directo sin recargar la página.",
        tables: "Un QR por mesa, generado con un clic — para imprimir o exponer, sin dispositivo que comprar.",
      },
    },
    steps: {
      eyebrow: "Tres pasos",
      titlePre: "Cómo",
      titleHighlight: "funciona",
      items: [
        { title: "El cliente escanea", body: "Un QR por mesa. Nada que instalar, el menú se abre en el navegador." },
        { title: "Pide desde su teléfono", body: "Menú en italiano e inglés, alérgenos indicados en cada plato." },
        { title: "Llega a cocina, en directo", body: "Por hacer, en curso, listo — actualizado sin recargar la página." },
      ],
    },
    features: {
      eyebrow: "Funciones",
      titlePre: "Pensado para",
      titleHighlight: "Italia",
      items: [
        { title: "14 alérgenos UE", body: "Etiquetado conforme al Reglamento (UE) n.º 1169/2011, plato por plato." },
        { title: "IT / EN", body: "Menú bilingüe desde el principio, pensado para clientela turística." },
        { title: "Tiempo real", body: "El pedido llega a cocina en segundos, sin recargar la página." },
        { title: "Aislamiento estricto", body: "Cada restaurante solo ve sus propios datos — aplicado a nivel de base de datos." },
      ],
    },
    branding: {
      eyebrow: "Tu marca",
      titlePre: "El menú lleva",
      titleHighlight: "tu",
      titleRest: "nombre, no el nuestro.",
      body: "Sube tu logo y una imagen de fondo de tu local desde el panel. Cuando un cliente escanea el QR, llega a un menú que parece el tuyo — mbQr queda entre bastidores.",
      advantagesLabel: "Ventajas",
      steps: [
        { title: "Sube tu logo", body: "Sustituye el logo de mbQr en la parte superior del menú del cliente." },
        { title: "Elige un fondo", body: "Una foto de tu local, de tus platos, o un color — lo que prefieras." },
        { title: "Tu nombre sigue siendo el protagonista", body: "mbQr queda invisible: el cliente ve tu local, no a nosotros." },
      ],
    },
    kitchen: {
      eyebrow: "Cocina",
      titlePre: "Cada pedido llega",
      titleHighlight: "en directo",
      body: "Sin papel, sin carreras en el salón: el pedido aparece en cocina segundos después de enviarse, actualizado en tiempo real sin recargar la página.",
      advantagesLabel: "Ventajas",
      points: [
        "Por hacer, en curso, listo: tres columnas actualizadas sin recargar",
        "Cada miembro del equipo ve el mismo panel, en directo",
        "Ningún pedido escrito a mano, ningún malentendido en cocina",
      ],
    },
    personas: {
      eyebrow: "Para cada tipo de local",
      titlePre: "Pensado para tu",
      titleHighlight: "local",
      items: [
        { title: "Trattoria y restaurante", body: "Menú organizado en categorías, alérgenos en cada plato, pedidos gestionados en cocina en directo." },
        { title: "Pizzería", body: "Masas y platos de temporada que cambian a menudo: se actualizan desde el panel, sin reimprimir nada." },
        { title: "Bar y vinoteca", body: "Carta de vinos o cócteles, pedidos rápidos en mesa, actualizados al instante cuando algo se agota." },
      ],
    },
    stats: {
      eyebrow: "En concreto",
      titlePre: "Lo que el producto",
      titleHighlight: "hace de verdad",
      labels: [
        "Alérgenos UE etiquetados",
        "Idiomas, IT / EN, desde el principio",
        "Datos aislados por restaurante",
        "Hardware adicional que comprar",
      ],
    },
    comparison: {
      eyebrow: "Por qué pasar a lo digital",
      titlePre: "¿Papel o",
      titleHighlight: "QR",
      titleRest: "?",
      paperHeading: "Menú de papel",
      qrHeading: "Menú QR mbQr",
      rows: [
        { paper: "Cambiar un precio: hay que reimprimir todo", qr: "Se actualiza en un clic, visible al instante" },
        { paper: "Alérgenos escritos a mano, fáciles de olvidar", qr: "Etiquetados en cada plato, siempre actualizados" },
        { paper: "Una impresión distinta por idioma", qr: "Italiano e inglés en el mismo menú" },
        { paper: "¿Un plato agotado? El camarero lo dice en voz alta, mesa por mesa", qr: "Marcado como no disponible con un toque, desaparece en todas partes" },
        { paper: "El pedido llega a cocina escrito a mano", qr: "Llega en directo, actualizado en tiempo real" },
      ],
    },
    pricing: {
      eyebrow: "Precios",
      titlePre: "Un solo plan.",
      titleHighlight: "Todo incluido.",
      subtitle: "Sin oferta «Básico» frente a «Pro»: cada restaurante accede a toda la plataforma.",
      periodLabels: { oneMonth: "1 mes", threeMonths: "3 meses", sixMonths: "6 meses", twelveMonths: "12 meses" },
      periods: {
        monthly: { price: "50 €", suffix: "/ mes" },
        quarterly: { price: "42 €", suffix: "/ mes, facturado 126 € cada 3 meses" },
        semiannual: { price: "36 €", suffix: "/ mes, facturado 216 € cada 6 meses" },
        annual: { price: "~33 €", suffix: "/ mes, facturado ~400 € / año" },
      },
      trialNote: "14 días de prueba gratuita, sin tarjeta de crédito.",
      features: [
        "Códigos QR y mesas ilimitados",
        "Menú multilingüe italiano / inglés",
        "Etiquetado de los 14 alérgenos UE",
        "Pedidos en tiempo real, sin recargar",
        "Cuentas de personal ilimitadas (encargado, camarero, cocina)",
        "Ningún dispositivo ni hardware que comprar",
      ],
      ctaPrimary: "Empieza la prueba gratuita",
      ctaSecondary: "Ver todos los detalles →",
    },
    faq: {
      eyebrow: "Preguntas frecuentes",
      titlePre: "Las preguntas más",
      titleHighlight: "comunes",
      items: [
        {
          question: "¿Necesito algún hardware especial?",
          answer:
            "No. El cliente usa su propio teléfono; en sala/cocina basta un teléfono, una tablet o un ordenador que ya tengas. El QR se imprime o se expone en cada mesa.",
        },
        {
          question: "¿El menú cumple el reglamento UE sobre alérgenos?",
          answer: "Sí. Los 14 alérgenos previstos por el Reglamento (UE) n.º 1169/2011 se etiquetan plato por plato, directamente desde el panel.",
        },
        {
          question: "¿Puedo modificar el menú yo mismo, sin asistencia?",
          answer: "Sí. Categorías, platos, precios y disponibilidad se gestionan desde el panel, de forma autónoma, en cualquier momento.",
        },
        {
          question: "¿Los datos de mi restaurante están aislados de los de otros clientes?",
          answer:
            "Sí, el aislamiento se aplica a nivel de base de datos, no solo en la aplicación — mira la función \"Aislamiento estricto\" más arriba.",
        },
        {
          question: "¿Puedo poner mi logo en lugar del vuestro?",
          answer: "Sí. El logo y el fondo del menú público son personalizables desde el panel — mira \"Tu marca, no la nuestra\" más arriba.",
        },
        {
          question: "¿El menú funciona en todos los smartphones?",
          answer: "Sí, se abre directamente en el navegador tras escanear el QR — ninguna app que instalar.",
        },
        {
          question: "¿Puedo cancelar cuando quiera?",
          answer: "Sí, la suscripción se gestiona desde el panel (sección Facturación), de forma autónoma, en cualquier momento.",
        },
      ],
    },
    finalCta: {
      title: "¿Listo para digitalizar tus mesas?",
      subtitle: "Crea tu restaurante en pocos minutos, sin compromiso.",
      button: "Crea tu restaurante",
    },
    footer: {
      tagline: "El menú QR para quienes sirven en mesa — sin hardware, sin suscripción a ningún dispositivo.",
      productHeading: "Producto",
      companyHeading: "Empresa",
      about: "Sobre nosotros",
      contact: "Contacto",
      copyrightSuffix: " — nombre provisional, no registrado.",
    },
  },

  de: {
    nav: {
      demo: "Demo",
      overview: "Überblick",
      features: "Funktionen",
      pricing: "Preise",
      faq: "FAQ",
      login: "Anmelden",
      signup: "Registrieren",
      openMenu: "Menü öffnen",
      closeMenu: "Menü schließen",
      menuLabel: "Menü",
    },
    hero: {
      eyebrow: "QR-Speisekarte und Tischbestellung",
      titleLine1: "Die Karte",
      titleLine1Highlight: "spricht",
      titleLine2: "Die Küche",
      titleLine2Highlight: "hört zu",
      subtitle:
        "Jede Bestellung wird zu einem digitalen Beleg, der in Echtzeit vom Tisch zur Küche wandert — ohne Hardware zu installieren, ohne Geräte-Abo.",
      ctaPrimary: "Restaurant erstellen",
      ctaSecondary: "Produkt ansehen",
      trustBadges: ["In wenigen Minuten startklar", "Keine Kreditkarte nötig", "14 Tage kostenlos testen"],
    },
    why: {
      eyebrow: "Warum mbQr",
      titlePre: "Was sich für Ihr",
      titleHighlight: "Lokal ändert",
      pillars: [
        {
          title: "Betriebliche Effizienz",
          points: [
            "Die Bestellung erreicht die Küche in Sekunden, ohne den Kellner",
            "Kein Neudruck: Preis oder Gericht wird mit einem Klick aktualisiert",
          ],
        },
        {
          title: "Kundenerlebnis",
          points: [
            "Die Karte öffnet sich sofort im Browser, nichts zu installieren",
            "Immer aktuell: kein ausverkauftes Gericht wird noch als verfügbar angezeigt",
          ],
        },
        {
          title: "Weniger Papier",
          points: [
            "Eine einzige digitale Karte statt Neudruck bei jedem Saisonwechsel",
            "Der QR-Code wird nur einmal pro Tisch gedruckt, nicht bei jeder Änderung",
          ],
        },
      ],
    },
    demoSection: {
      eyebrow: "Demo",
      titlePre: "Sehen Sie es",
      titleHighlight: "in Aktion",
      subtitle: "Eine echte Aufnahme der App — Scan, Karte, Warenkorb, Bestellung gesendet.",
    },
    preview: {
      eyebrow: "Produktvorschau",
      titlePre: "Sehen Sie es",
      titleHighlight: "in Aktion",
      subtitle: "Das sind echte Bildschirme der App — keine Mockups.",
      tabs: { menu: "Kundenkarte", orders: "Live-Bestellungen", tables: "Tische & QR" },
      captions: {
        menu: "Der Gast scannt, blättert durch die Karte auf IT/EN und bestellt vom Handy aus — nichts zu installieren.",
        orders: "Jede Bestellung erreicht die Küche in Sekunden, live aktualisiert, ohne die Seite neu zu laden.",
        tables: "Ein QR-Code pro Tisch, mit einem Klick erzeugt — zum Drucken oder Aufstellen, kein Gerät zu kaufen.",
      },
    },
    steps: {
      eyebrow: "Drei Schritte",
      titlePre: "So",
      titleHighlight: "funktioniert es",
      items: [
        { title: "Der Gast scannt", body: "Ein QR-Code pro Tisch. Nichts zu installieren, die Karte öffnet sich im Browser." },
        { title: "Bestellt vom Handy aus", body: "Karte auf Italienisch und Englisch, Allergene bei jedem Gericht angegeben." },
        { title: "Kommt live in der Küche an", body: "Zu tun, in Arbeit, fertig — aktualisiert, ohne die Seite neu zu laden." },
      ],
    },
    features: {
      eyebrow: "Funktionen",
      titlePre: "Gemacht für",
      titleHighlight: "Italien",
      items: [
        { title: "14 EU-Allergene", body: "Kennzeichnung gemäß EU-Verordnung Nr. 1169/2011, Gericht für Gericht." },
        { title: "IT / EN", body: "Zweisprachige Karte von Anfang an, für touristische Gäste gemacht." },
        { title: "Echtzeit", body: "Die Bestellung erreicht die Küche in Sekunden, ohne die Seite neu zu laden." },
        { title: "Strikte Isolation", body: "Jedes Restaurant sieht nur seine eigenen Daten — auf Datenbankebene durchgesetzt." },
      ],
    },
    branding: {
      eyebrow: "Ihre Marke",
      titlePre: "Die Karte trägt",
      titleHighlight: "Ihren",
      titleRest: "Namen, nicht unseren.",
      body: "Laden Sie Ihr Logo und ein Hintergrundbild Ihres Lokals über das Dashboard hoch. Scannt ein Gast den QR-Code, landet er auf einer Karte, die wie Ihre eigene aussieht — mbQr bleibt im Hintergrund.",
      advantagesLabel: "Vorteile",
      steps: [
        { title: "Logo hochladen", body: "Ersetzt das mbQr-Logo oben auf der Kundenkarte." },
        { title: "Hintergrund wählen", body: "Ein Foto Ihres Lokals, Ihrer Gerichte oder eine Farbe — ganz wie Sie möchten." },
        { title: "Ihr Name bleibt im Mittelpunkt", body: "mbQr bleibt unsichtbar: der Gast sieht Ihr Lokal, nicht uns." },
      ],
    },
    kitchen: {
      eyebrow: "Küche",
      titlePre: "Jede Bestellung kommt",
      titleHighlight: "live an",
      body: "Kein Papier, kein Hin- und Herlaufen: Die Bestellung erscheint Sekunden nach dem Senden in der Küche, in Echtzeit aktualisiert, ohne die Seite neu zu laden.",
      advantagesLabel: "Vorteile",
      points: [
        "Zu tun, in Arbeit, fertig: drei Spalten, aktualisiert ohne Neuladen",
        "Jedes Teammitglied sieht dieselbe Tafel, live",
        "Keine handgeschriebenen Bestellungen, keine Missverständnisse in der Küche",
      ],
    },
    personas: {
      eyebrow: "Für jede Art von Lokal",
      titlePre: "Gemacht für Ihr",
      titleHighlight: "Lokal",
      items: [
        { title: "Trattoria & Restaurant", body: "Karte in Kategorien gegliedert, Allergene bei jedem Gericht, Bestellungen live in der Küche verwaltet." },
        { title: "Pizzeria", body: "Teige und Saisonales, die sich oft ändern: über das Dashboard aktualisiert, ohne je neu zu drucken." },
        { title: "Bar & Weinbar", body: "Wein- oder Cocktailkarte, schnelle Tischbestellungen, sofort aktualisiert, sobald etwas ausgeht." },
      ],
    },
    stats: {
      eyebrow: "Ganz konkret",
      titlePre: "Was das Produkt",
      titleHighlight: "wirklich leistet",
      labels: [
        "Gekennzeichnete EU-Allergene",
        "Sprachen, IT / EN, von Anfang an",
        "Isolierte Daten pro Restaurant",
        "Zusätzliche Hardware zu kaufen",
      ],
    },
    comparison: {
      eyebrow: "Warum digital werden",
      titlePre: "Papier oder",
      titleHighlight: "QR",
      titleRest: "?",
      paperHeading: "Papierkarte",
      qrHeading: "mbQr QR-Karte",
      rows: [
        { paper: "Einen Preis ändern: alles muss neu gedruckt werden", qr: "Wird mit einem Klick aktualisiert, sofort sichtbar" },
        { paper: "Handgeschriebene Allergene, leicht zu vergessen", qr: "Bei jedem Gericht gekennzeichnet, immer aktuell" },
        { paper: "Ein eigener Druck für jede Sprache", qr: "Italienisch und Englisch auf derselben Karte" },
        { paper: "Ein Gericht ist aus? Der Kellner sagt es mündlich, Tisch für Tisch", qr: "Mit einem Tippen als nicht verfügbar markiert, verschwindet überall" },
        { paper: "Die Bestellung kommt handgeschrieben in der Küche an", qr: "Kommt live an, in Echtzeit aktualisiert" },
      ],
    },
    pricing: {
      eyebrow: "Preise",
      titlePre: "Nur ein Plan.",
      titleHighlight: "Alles inklusive.",
      subtitle: "Kein „Basic“ gegen „Pro“: Jedes Restaurant erhält die gesamte Plattform.",
      periodLabels: { oneMonth: "1 Monat", threeMonths: "3 Monate", sixMonths: "6 Monate", twelveMonths: "12 Monate" },
      periods: {
        monthly: { price: "50 €", suffix: "/ Monat" },
        quarterly: { price: "42 €", suffix: "/ Monat, alle 3 Monate 126 € abgerechnet" },
        semiannual: { price: "36 €", suffix: "/ Monat, alle 6 Monate 216 € abgerechnet" },
        annual: { price: "~33 €", suffix: "/ Monat, ~400 € / Jahr abgerechnet" },
      },
      trialNote: "14 Tage kostenlos testen, keine Kreditkarte nötig.",
      features: [
        "Unbegrenzte QR-Codes und Tische",
        "Mehrsprachige Karte Italienisch / Englisch",
        "Kennzeichnung der 14 EU-Allergene",
        "Echtzeit-Bestellungen, ohne Neuladen",
        "Unbegrenzte Mitarbeiterkonten (Manager, Service, Küche)",
        "Kein Gerät und keine Hardware zu kaufen",
      ],
      ctaPrimary: "Kostenlose Testphase starten",
      ctaSecondary: "Alle Details ansehen →",
    },
    faq: {
      eyebrow: "Häufige Fragen",
      titlePre: "Die häufigsten",
      titleHighlight: "Fragen",
      items: [
        {
          question: "Brauche ich spezielle Hardware?",
          answer:
            "Nein. Der Gast nutzt sein eigenes Handy, im Service/in der Küche genügt ein vorhandenes Handy, Tablet oder Computer. Der QR-Code wird gedruckt oder auf jedem Tisch aufgestellt.",
        },
        {
          question: "Erfüllt die Karte die EU-Allergenverordnung?",
          answer: "Ja. Die 14 Allergene gemäß EU-Verordnung Nr. 1169/2011 werden Gericht für Gericht direkt über das Dashboard gekennzeichnet.",
        },
        {
          question: "Kann ich die Karte selbst ändern, ohne Support?",
          answer: "Ja. Kategorien, Gerichte, Preise und Verfügbarkeit werden selbstständig, jederzeit, über das Dashboard verwaltet.",
        },
        {
          question: "Sind die Daten meines Restaurants von denen anderer Kunden isoliert?",
          answer:
            "Ja, die Isolation wird auf Datenbankebene durchgesetzt, nicht nur in der Anwendung — siehe die Funktion „Strikte Isolation“ weiter oben.",
        },
        {
          question: "Kann ich mein eigenes Logo statt eurem verwenden?",
          answer: "Ja. Logo und Hintergrund der öffentlichen Karte sind über das Dashboard anpassbar — siehe „Ihre Marke, nicht unsere“ weiter oben.",
        },
        {
          question: "Funktioniert die Karte auf jedem Smartphone?",
          answer: "Ja, sie öffnet sich nach dem Scannen des QR-Codes direkt im Browser — keine App zu installieren.",
        },
        {
          question: "Kann ich jederzeit kündigen?",
          answer: "Ja, das Abo wird selbstständig, jederzeit, über das Dashboard (Abschnitt Abrechnung) verwaltet.",
        },
      ],
    },
    finalCta: {
      title: "Bereit, Ihre Tische zu digitalisieren?",
      subtitle: "Erstellen Sie Ihr Restaurant in wenigen Minuten, ganz unverbindlich.",
      button: "Restaurant erstellen",
    },
    footer: {
      tagline: "Die QR-Karte für alle, die am Tisch servieren — ohne Hardware, ohne Geräte-Abo.",
      productHeading: "Produkt",
      companyHeading: "Unternehmen",
      about: "Über uns",
      contact: "Kontakt",
      copyrightSuffix: " — Arbeitsname, nicht eingetragen.",
    },
  },

  ar: {
    nav: {
      demo: "عرض تجريبي",
      overview: "نظرة عامة",
      features: "المزايا",
      pricing: "الأسعار",
      faq: "الأسئلة الشائعة",
      login: "تسجيل الدخول",
      signup: "إنشاء حساب",
      openMenu: "فتح القائمة",
      closeMenu: "إغلاق القائمة",
      menuLabel: "القائمة",
    },
    hero: {
      eyebrow: "قائمة رقمية عبر QR وطلبات من الطاولة",
      titleLine1: "القائمة",
      titleLine1Highlight: "تتحدث",
      titleLine2: "المطبخ",
      titleLine2Highlight: "يستمع",
      subtitle:
        "يتحول كل طلب إلى تذكرة رقمية تنتقل من الطاولة إلى المطبخ في الوقت الفعلي — دون أجهزة يجب تركيبها، ودون اشتراك في أي جهاز.",
      ctaPrimary: "أنشئ مطعمك",
      ctaSecondary: "شاهد المنتج",
      trustBadges: ["جاهز للعمل خلال دقائق", "دون الحاجة لبطاقة ائتمان", "١٤ يومًا تجربة مجانية"],
    },
    why: {
      eyebrow: "لماذا mbQr",
      titlePre: "ما الذي يتغيّر في",
      titleHighlight: "مطعمك",
      pillars: [
        {
          title: "كفاءة تشغيلية",
          points: [
            "يصل الطلب إلى المطبخ خلال ثوانٍ، دون المرور عبر النادل",
            "لا حاجة لإعادة الطباعة: يتم تحديث السعر أو الطبق بنقرة واحدة",
          ],
        },
        {
          title: "تجربة العميل",
          points: [
            "تُفتح القائمة فورًا في المتصفح، دون أي تثبيت",
            "محدّثة دائمًا: لا يظهر أي طبق نفد كمتوفر",
          ],
        },
        {
          title: "ورق أقل",
          points: [
            "قائمة رقمية واحدة بدلاً من إعادة الطباعة عند كل تغيير موسمي",
            "يُطبع رمز QR مرة واحدة فقط لكل طاولة، لا عند كل تعديل",
          ],
        },
      ],
    },
    demoSection: {
      eyebrow: "عرض تجريبي",
      titlePre: "شاهده",
      titleHighlight: "يعمل",
      subtitle: "تسجيل حقيقي للتطبيق — المسح، القائمة، السلة، إرسال الطلب.",
    },
    preview: {
      eyebrow: "معاينة المنتج",
      titlePre: "شاهده",
      titleHighlight: "أثناء العمل",
      subtitle: "هذه لقطات حقيقية من التطبيق — وليست نماذج تصميم.",
      tabs: { menu: "قائمة العميل", orders: "الطلبات المباشرة", tables: "الطاولات ورموز QR" },
      captions: {
        menu: "يقوم العميل بمسح الرمز، وتصفّح القائمة بالإيطالية/الإنجليزية، والطلب من هاتفه — دون تثبيت أي شيء.",
        orders: "يصل كل طلب إلى المطبخ خلال ثوانٍ، ويتم تحديثه مباشرة دون إعادة تحميل الصفحة.",
        tables: "رمز QR واحد لكل طاولة، يُنشأ بنقرة واحدة — للطباعة أو العرض، دون شراء أي جهاز.",
      },
    },
    steps: {
      eyebrow: "ثلاث خطوات",
      titlePre: "كيف",
      titleHighlight: "يعمل",
      items: [
        { title: "يمسح العميل الرمز", body: "رمز QR واحد لكل طاولة. لا شيء يُثبّت، تُفتح القائمة في المتصفح." },
        { title: "يطلب من هاتفه", body: "قائمة بالإيطالية والإنجليزية، مع بيان مسببات الحساسية على كل طبق." },
        { title: "يصل إلى المطبخ مباشرة", body: "قيد الانتظار، قيد التحضير، جاهز — يُحدَّث دون إعادة تحميل الصفحة." },
      ],
    },
    features: {
      eyebrow: "المزايا",
      titlePre: "مصمم من أجل",
      titleHighlight: "إيطاليا",
      items: [
        { title: "١٤ من مسببات الحساسية الأوروبية", body: "وسم مطابق للائحة الأوروبية رقم ١١٦٩/٢٠١١، طبقًا بطبق." },
        { title: "إيطالي / إنجليزي", body: "قائمة ثنائية اللغة منذ البداية، مصممة لعملاء السياحة." },
        { title: "الوقت الفعلي", body: "يصل الطلب إلى المطبخ خلال ثوانٍ، دون إعادة تحميل الصفحة." },
        { title: "عزل صارم", body: "لا يرى كل مطعم سوى بياناته الخاصة — مطبَّق على مستوى قاعدة البيانات." },
      ],
    },
    branding: {
      eyebrow: "علامتك التجارية",
      titlePre: "القائمة تحمل",
      titleHighlight: "اسمك",
      titleRest: "أنت، لا اسمنا.",
      body: "ارفع شعارك وصورة خلفية لمطعمك من لوحة التحكم. عندما يمسح العميل رمز QR، يصل إلى قائمة تبدو وكأنها قائمتك أنت — يبقى mbQr خلف الكواليس.",
      advantagesLabel: "المزايا",
      steps: [
        { title: "ارفع شعارك", body: "يحل محل شعار mbQr أعلى قائمة العميل." },
        { title: "اختر خلفية", body: "صورة لمطعمك، لأطباقك، أو لون بسيط — كما تفضل." },
        { title: "اسمك يبقى في الواجهة", body: "يبقى mbQr غير ظاهر: يرى العميل مطعمك، لا نحن." },
      ],
    },
    kitchen: {
      eyebrow: "المطبخ",
      titlePre: "يصل كل طلب",
      titleHighlight: "مباشرة",
      body: "دون ورق، ودون تنقل في الصالة: يظهر الطلب في المطبخ خلال ثوانٍ من إرساله، ويُحدَّث في الوقت الفعلي دون إعادة تحميل الصفحة.",
      advantagesLabel: "المزايا",
      points: [
        "قيد الانتظار، قيد التحضير، جاهز: ثلاثة أعمدة تُحدَّث دون إعادة تحميل",
        "يرى كل فرد من الطاقم اللوحة نفسها، مباشرة",
        "لا طلبات مكتوبة بخط اليد، ولا سوء فهم في المطبخ",
      ],
    },
    personas: {
      eyebrow: "لكل نوع من الأماكن",
      titlePre: "مصمم من أجل",
      titleHighlight: "مطعمك",
      items: [
        { title: "تراتوريا ومطعم", body: "قائمة منظمة في فئات، مع بيان مسببات الحساسية على كل طبق، وطلبات تُدار مباشرة في المطبخ." },
        { title: "بيتزيريا", body: "عجائن وأطباق موسمية تتغير كثيرًا: تُحدَّث من لوحة التحكم، دون إعادة طباعة أي شيء." },
        { title: "بار ومحل نبيذ", body: "قائمة نبيذ أو كوكتيلات، طلبات سريعة على الطاولة، تُحدَّث فور نفاد أي صنف." },
      ],
    },
    stats: {
      eyebrow: "بشكل ملموس",
      titlePre: "ما يقدمه المنتج",
      titleHighlight: "فعليًا",
      labels: [
        "مسببات حساسية أوروبية موسومة",
        "لغتان، إيطالي/إنجليزي، منذ البداية",
        "بيانات معزولة لكل مطعم",
        "أجهزة إضافية يجب شراؤها",
      ],
    },
    comparison: {
      eyebrow: "لماذا التحول للرقمنة",
      titlePre: "ورق أم",
      titleHighlight: "QR",
      titleRest: "؟",
      paperHeading: "قائمة ورقية",
      qrHeading: "قائمة QR من mbQr",
      rows: [
        { paper: "تغيير سعر: يجب إعادة طباعة كل شيء", qr: "يُحدَّث بنقرة واحدة، ويظهر فورًا" },
        { paper: "مسببات حساسية مكتوبة بخط اليد، يسهل نسيانها", qr: "موسومة على كل طبق، ومحدّثة دائمًا" },
        { paper: "طباعة مختلفة لكل لغة", qr: "الإيطالية والإنجليزية في القائمة نفسها" },
        { paper: "طبق نفد؟ يخبر النادل بذلك شفهيًا، طاولة بطاولة", qr: "يُعلَّم كغير متوفر بلمسة واحدة، ويختفي في كل مكان" },
        { paper: "يصل الطلب إلى المطبخ مكتوبًا بخط اليد", qr: "يصل مباشرة، ويُحدَّث في الوقت الفعلي" },
      ],
    },
    pricing: {
      eyebrow: "الأسعار",
      titlePre: "خطة واحدة.",
      titleHighlight: "كل شيء مُدرَج.",
      subtitle: "لا عروض «أساسية» مقابل «احترافية»: كل مطعم يصل إلى المنصة كاملة.",
      periodLabels: { oneMonth: "شهر واحد", threeMonths: "٣ أشهر", sixMonths: "٦ أشهر", twelveMonths: "١٢ شهرًا" },
      periods: {
        monthly: { price: "٥٠ €", suffix: "/ شهريًا" },
        quarterly: { price: "٤٢ €", suffix: "/ شهريًا، تُفوتَر ١٢٦ € كل ٣ أشهر" },
        semiannual: { price: "٣٦ €", suffix: "/ شهريًا، تُفوتَر ٢١٦ € كل ٦ أشهر" },
        annual: { price: "~٣٣ €", suffix: "/ شهريًا، تُفوتَر بحوالي ٤٠٠ € / سنويًا" },
      },
      trialNote: "١٤ يومًا تجربة مجانية، دون بطاقة ائتمان.",
      features: [
        "رموز QR وطاولات غير محدودة",
        "قائمة ثنائية اللغة إيطالي / إنجليزي",
        "وسم مسببات الحساسية الأوروبية الـ١٤",
        "طلبات في الوقت الفعلي، دون إعادة تحميل",
        "حسابات طاقم غير محدودة (مدير، نادل، مطبخ)",
        "لا جهاز ولا معدات يجب شراؤها",
      ],
      ctaPrimary: "ابدأ التجربة المجانية",
      ctaSecondary: "شاهد كل التفاصيل ←",
    },
    faq: {
      eyebrow: "الأسئلة الشائعة",
      titlePre: "الأسئلة",
      titleHighlight: "الأكثر شيوعًا",
      items: [
        {
          question: "هل أحتاج إلى أجهزة خاصة؟",
          answer:
            "لا. يستخدم العميل هاتفه الخاص، وفي الصالة/المطبخ يكفي هاتف أو جهاز لوحي أو حاسوب موجود بالفعل. يُطبع رمز QR أو يُعرض على كل طاولة.",
        },
        {
          question: "هل القائمة مطابقة للائحة الأوروبية بشأن مسببات الحساسية؟",
          answer: "نعم. تُوسَم مسببات الحساسية الـ١٤ المنصوص عليها في اللائحة الأوروبية رقم ١١٦٩/٢٠١١ طبقًا بطبق، مباشرة من لوحة التحكم.",
        },
        {
          question: "هل يمكنني تعديل القائمة بنفسي، دون مساعدة؟",
          answer: "نعم. تُدار الفئات والأطباق والأسعار والتوفر من لوحة التحكم، بشكل مستقل، في أي وقت.",
        },
        {
          question: "هل بيانات مطعمي معزولة عن بيانات العملاء الآخرين؟",
          answer:
            "نعم، يُطبَّق العزل على مستوى قاعدة البيانات، لا على مستوى التطبيق فقط — انظر ميزة «عزل صارم» أعلاه.",
        },
        {
          question: "هل يمكنني وضع شعاري بدلاً من شعاركم؟",
          answer: "نعم. يمكن تخصيص شعار وخلفية القائمة العامة من لوحة التحكم — انظر «علامتك التجارية، لا علامتنا» أعلاه.",
        },
        {
          question: "هل تعمل القائمة على جميع الهواتف الذكية؟",
          answer: "نعم، تُفتح مباشرة في المتصفح بعد مسح رمز QR — دون أي تطبيق يجب تثبيته.",
        },
        {
          question: "هل يمكنني الإلغاء متى شئت؟",
          answer: "نعم، يُدار الاشتراك من لوحة التحكم (قسم الفوترة)، بشكل مستقل، في أي وقت.",
        },
      ],
    },
    finalCta: {
      title: "هل أنت مستعد لرقمنة طاولاتك؟",
      subtitle: "أنشئ مطعمك خلال دقائق، دون أي التزام.",
      button: "أنشئ مطعمك",
    },
    footer: {
      tagline: "قائمة QR لكل من يقدّم الخدمة على الطاولات — دون أجهزة، ودون اشتراك في أي جهاز.",
      productHeading: "المنتج",
      companyHeading: "الشركة",
      about: "من نحن",
      contact: "تواصل معنا",
      copyrightSuffix: " — اسم عمل مؤقت، غير مسجَّل.",
    },
  },
};
