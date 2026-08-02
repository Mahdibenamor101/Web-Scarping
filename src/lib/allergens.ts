import type { Allergen } from "@prisma/client";

// The 14 EU-regulated allergens (Regulation (EU) No 1169/2011, Annex II).
// Labels are Italian first (default_language on organizations is "it") with
// the French gloss for whoever's reading this in the dashboard during dev.
export const ALLERGEN_LABELS: Record<Allergen, string> = {
  GLUTEN: "Glutine",
  CRUSTACEANS: "Crostacei",
  EGGS: "Uova",
  FISH: "Pesce",
  PEANUTS: "Arachidi",
  SOYBEANS: "Soia",
  MILK: "Latte (lattosio)",
  NUTS: "Frutta a guscio",
  CELERY: "Sedano",
  MUSTARD: "Senape",
  SESAME: "Semi di sesamo",
  SULPHITES: "Solfiti",
  LUPIN: "Lupini",
  MOLLUSCS: "Molluschi",
};

export const ALL_ALLERGENS = Object.keys(ALLERGEN_LABELS) as Allergen[];
