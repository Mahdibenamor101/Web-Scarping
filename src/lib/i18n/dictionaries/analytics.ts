import type { LanguageCode } from "@/lib/i18n/languages";

// UI chrome for src/app/dashboard/analytics/page.tsx.
export interface AnalyticsDict {
  title: string;
  helpTip: string;
  kpis: { views: string; orders: string; revenue: string };
  salesByDay: string;
  viewsByDay: string;
  popularItems: string;
  noOrdersYet: string;
  viewSingular: string;
  viewPlural: string;
}

export const ANALYTICS_DICT: Record<LanguageCode, AnalyticsDict> = {
  fr: {
    title: "Analytics",
    helpTip:
      "Chiffres des 14 derniers jours (30 pour les plats populaires). Une vue est comptée à chaque ouverture du menu public — un même client qui recharge la page en compte plusieurs.",
    kpis: { views: "Vues du menu", orders: "Commandes", revenue: "Chiffre d'affaires" },
    salesByDay: "Ventes par jour (14 jours)",
    viewsByDay: "Vues du menu par jour (14 jours)",
    popularItems: "Plats les plus commandés (30 jours)",
    noOrdersYet: "Pas encore de commandes.",
    viewSingular: "vue",
    viewPlural: "vues",
  },
  it: {
    title: "Analytics",
    helpTip:
      "Dati degli ultimi 14 giorni (30 per i piatti più popolari). Una visualizzazione viene conteggiata a ogni apertura del menu pubblico — uno stesso cliente che ricarica la pagina ne genera più di una.",
    kpis: { views: "Visualizzazioni del menu", orders: "Ordini", revenue: "Fatturato" },
    salesByDay: "Vendite per giorno (14 giorni)",
    viewsByDay: "Visualizzazioni del menu per giorno (14 giorni)",
    popularItems: "Piatti più ordinati (30 giorni)",
    noOrdersYet: "Ancora nessun ordine.",
    viewSingular: "visualizzazione",
    viewPlural: "visualizzazioni",
  },
  en: {
    title: "Analytics",
    helpTip:
      "Figures from the last 14 days (30 for popular dishes). A view is counted every time the public menu is opened — the same customer reloading the page counts more than once.",
    kpis: { views: "Menu views", orders: "Orders", revenue: "Revenue" },
    salesByDay: "Sales by day (14 days)",
    viewsByDay: "Menu views by day (14 days)",
    popularItems: "Most ordered dishes (30 days)",
    noOrdersYet: "No orders yet.",
    viewSingular: "view",
    viewPlural: "views",
  },
  es: {
    title: "Analytics",
    helpTip:
      "Cifras de los últimos 14 días (30 para los platos populares). Se cuenta una vista cada vez que se abre el menú público — un mismo cliente que recarga la página cuenta varias veces.",
    kpis: { views: "Vistas del menú", orders: "Pedidos", revenue: "Facturación" },
    salesByDay: "Ventas por día (14 días)",
    viewsByDay: "Vistas del menú por día (14 días)",
    popularItems: "Platos más pedidos (30 días)",
    noOrdersYet: "Todavía no hay pedidos.",
    viewSingular: "vista",
    viewPlural: "vistas",
  },
  de: {
    title: "Analytics",
    helpTip:
      "Zahlen der letzten 14 Tage (30 für die beliebtesten Gerichte). Ein Aufruf wird bei jedem Öffnen der öffentlichen Speisekarte gezählt — derselbe Gast, der die Seite neu lädt, zählt mehrfach.",
    kpis: { views: "Speisekarten-Aufrufe", orders: "Bestellungen", revenue: "Umsatz" },
    salesByDay: "Umsatz pro Tag (14 Tage)",
    viewsByDay: "Speisekarten-Aufrufe pro Tag (14 Tage)",
    popularItems: "Meistbestellte Gerichte (30 Tage)",
    noOrdersYet: "Noch keine Bestellungen.",
    viewSingular: "Aufruf",
    viewPlural: "Aufrufe",
  },
  ar: {
    title: "التحليلات",
    helpTip:
      "أرقام آخر 14 يومًا (30 يومًا للأطباق الأكثر طلبًا). تُحتسب مشاهدة واحدة في كل مرة تُفتح فيها القائمة العامة — العميل نفسه الذي يعيد تحميل الصفحة يُحتسب أكثر من مرة.",
    kpis: { views: "مشاهدات القائمة", orders: "الطلبات", revenue: "الإيرادات" },
    salesByDay: "المبيعات حسب اليوم (14 يومًا)",
    viewsByDay: "مشاهدات القائمة حسب اليوم (14 يومًا)",
    popularItems: "الأطباق الأكثر طلبًا (30 يومًا)",
    noOrdersYet: "لا توجد طلبات بعد.",
    viewSingular: "مشاهدة",
    viewPlural: "مشاهدات",
  },
};
