import { NextRequest, NextResponse } from "next/server";
import type { MenuItem, MenuItemTranslation } from "@prisma/client";
import { withTenant } from "@/lib/db";
import { resolveTableByQrToken } from "@/lib/qr-resolve";
import { handleApiError, requireRateLimit } from "@/lib/api";
import { getClientIp } from "@/lib/rate-limit";
import { getStripeClient } from "@/lib/stripe";

// Nests each item's translations (see the growth_features migration + POST
// /api/menu/translate) as { fr: { name, description }, ... } rather than a
// separate top-level array -- the client renders one item at a time and
// would otherwise need to re-index a flat list on every language switch.
function serialize(item: MenuItem, translationsByItem: Map<string, MenuItemTranslation[]>) {
  const byLanguage: Record<string, { name: string; description: string | null }> = {};
  for (const t of translationsByItem.get(item.id) ?? []) {
    byLanguage[t.languageCode] = { name: t.name, description: t.description };
  }
  return { ...item, price: Number(item.price), translations: byLanguage };
}

// Public: no session required. Once the QR token resolves to an
// organization (see resolveTableByQrToken), reading its available menu is
// an ordinary RLS-scoped read -- the same withTenant() every staff route
// uses, just without a logged-in user behind it.
export async function GET(req: NextRequest, { params }: { params: { qrToken: string } }) {
  try {
    // A generous limit -- a real customer might reload a few times while
    // deciding what to order; this is to block scraping/DoS, not normal use.
    requireRateLimit(`public-menu:ip:${getClientIp(req)}`, { limit: 120, windowMs: 60 * 60 * 1000 });

    const table = await resolveTableByQrToken(params.qrToken);

    const [categories, items, translations] = await withTenant(table.organizationId, async (tx) => {
      // Best-effort analytics (src/app/dashboard/analytics/page.tsx) --
      // an ordinary RLS-scoped insert now that resolveTableByQrToken has
      // already produced the organizationId, not a SECURITY DEFINER
      // bypass. Awaited (queries in an interactive transaction share one
      // connection, so a fire-and-forget insert here could still be
      // in flight when the transaction commits) but wrapped so a write
      // failure never breaks the actual menu response.
      try {
        await tx.menuView.create({ data: { organizationId: table.organizationId, tableId: table.tableId } });
      } catch (err) {
        console.error("[menu-view]", err);
      }

      return Promise.all([
        tx.menuCategory.findMany({
          where: { organizationId: table.organizationId },
          orderBy: { sortOrder: "asc" },
        }),
        tx.menuItem.findMany({
          where: { organizationId: table.organizationId, isAvailable: true },
          orderBy: { sortOrder: "asc" },
        }),
        tx.menuItemTranslation.findMany({ where: { organizationId: table.organizationId } }),
      ]);
    });

    const translationsByItem = new Map<string, typeof translations>();
    const extraLanguages = new Set<string>();
    for (const t of translations) {
      extraLanguages.add(t.languageCode);
      const list = translationsByItem.get(t.menuItemId) ?? [];
      list.push(t);
      translationsByItem.set(t.menuItemId, list);
    }

    return NextResponse.json({
      organizationName: table.organizationName,
      tableLabel: table.tableLabel,
      defaultLanguage: table.defaultLanguage,
      logoUrl: table.logoUrl,
      backgroundUrl: table.backgroundUrl,
      orderingMode: table.orderingMode,
      onlinePaymentAvailable: Boolean(getStripeClient()),
      // Only languages an owner has actually run a translation for --
      // never a fixed list, so a menu with no translations yet still
      // just shows IT/EN (see LANGUAGE_OPTIONS in src/lib/translate.ts).
      extraLanguages: [...extraLanguages],
      categories,
      items: items.map((item) => serialize(item, translationsByItem)),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
