import type { LanguageCode } from "@/lib/i18n/languages";

// Sidebar nav labels + logout button for the dashboard shell
// (src/app/dashboard/layout.tsx). Role labels are shared with the invite
// page's own dictionary (AUTH_DICT.roles, src/lib/i18n/dictionaries/auth.ts)
// rather than duplicated here.
//
// The dashboard's inner pages (orders board, menu editor, tables, staff,
// billing, branding, analytics) are NOT yet translated -- see CONTEXT.md
// §12.30. This dictionary only covers the shell that wraps them.
export interface DashboardShellDict {
  nav: {
    orders: string;
    analytics: string;
    staff: string;
    menu: string;
    tables: string;
    branding: string;
    billing: string;
  };
  logout: string;
}

export const DASHBOARD_SHELL_DICT: Record<LanguageCode, DashboardShellDict> = {
  fr: {
    nav: { orders: "Commandes", analytics: "Analytics", staff: "Staff", menu: "Menu", tables: "Tables", branding: "Marque", billing: "Abonnement" },
    logout: "Se déconnecter",
  },
  it: {
    nav: { orders: "Ordini", analytics: "Analytics", staff: "Staff", menu: "Menu", tables: "Tavoli", branding: "Marchio", billing: "Abbonamento" },
    logout: "Esci",
  },
  en: {
    nav: { orders: "Orders", analytics: "Analytics", staff: "Staff", menu: "Menu", tables: "Tables", branding: "Branding", billing: "Billing" },
    logout: "Log out",
  },
  es: {
    nav: { orders: "Pedidos", analytics: "Analíticas", staff: "Personal", menu: "Menú", tables: "Mesas", branding: "Marca", billing: "Facturación" },
    logout: "Cerrar sesión",
  },
  de: {
    nav: { orders: "Bestellungen", analytics: "Analytics", staff: "Personal", menu: "Speisekarte", tables: "Tische", branding: "Marke", billing: "Abrechnung" },
    logout: "Abmelden",
  },
  ar: {
    nav: { orders: "الطلبات", analytics: "التحليلات", staff: "الطاقم", menu: "القائمة", tables: "الطاولات", branding: "العلامة التجارية", billing: "الفوترة" },
    logout: "تسجيل الخروج",
  },
};
