import { NextRequest, NextResponse } from "next/server";
import type { MenuItem } from "@prisma/client";
import { withTenant } from "@/lib/db";
import { resolveTableByQrToken } from "@/lib/qr-resolve";
import { handleApiError, requireRateLimit } from "@/lib/api";
import { getClientIp } from "@/lib/rate-limit";

function serialize(item: MenuItem) {
  return { ...item, price: Number(item.price) };
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

    const [categories, items] = await withTenant(table.organizationId, (tx) =>
      Promise.all([
        tx.menuCategory.findMany({
          where: { organizationId: table.organizationId },
          orderBy: { sortOrder: "asc" },
        }),
        tx.menuItem.findMany({
          where: { organizationId: table.organizationId, isAvailable: true },
          orderBy: { sortOrder: "asc" },
        }),
      ]),
    );

    return NextResponse.json({
      organizationName: table.organizationName,
      tableLabel: table.tableLabel,
      defaultLanguage: table.defaultLanguage,
      categories,
      items: items.map(serialize),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
