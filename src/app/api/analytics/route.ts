import { NextResponse } from "next/server";
import { withTenant } from "@/lib/db";
import { requireSession, requireRole, handleApiError } from "@/lib/api";
import { STAFF_MANAGEMENT_ROLES } from "@/lib/rbac";

const TREND_DAYS = 14;
const POPULAR_ITEMS_DAYS = 30;
const POPULAR_ITEMS_LIMIT = 8;

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// OWNER/MANAGER only, same bar as billing/staff -- day-by-day traffic and
// revenue figures are business-sensitive in a way the live order board
// (visible to everyone on shift) isn't.
export async function GET() {
  try {
    const session = await requireSession();
    requireRole(session, STAFF_MANAGEMENT_ROLES);

    const since = new Date(Date.now() - TREND_DAYS * 24 * 60 * 60 * 1000);
    const popularSince = new Date(Date.now() - POPULAR_ITEMS_DAYS * 24 * 60 * 60 * 1000);

    // Small enough datasets (one restaurant's recent traffic) to bucket in
    // JS rather than reach for raw SQL date_trunc -- keeps this route on
    // the same plain-Prisma style as everything else, no new SECURITY
    // DEFINER-adjacent raw query to reason about.
    const [views, orders, orderItems] = await withTenant(session.organizationId, (tx) =>
      Promise.all([
        tx.menuView.findMany({
          where: { organizationId: session.organizationId, createdAt: { gte: since } },
          select: { createdAt: true },
        }),
        tx.order.findMany({
          where: { organizationId: session.organizationId, createdAt: { gte: since }, status: { not: "CANCELLED" } },
          select: { createdAt: true, totalAmount: true },
        }),
        tx.orderItem.findMany({
          where: { organizationId: session.organizationId, createdAt: { gte: popularSince } },
          select: { quantity: true, menuItem: { select: { nameIt: true } } },
        }),
      ]),
    );

    const days: string[] = [];
    for (let i = TREND_DAYS - 1; i >= 0; i--) {
      days.push(dayKey(new Date(Date.now() - i * 24 * 60 * 60 * 1000)));
    }

    const viewsByDay = new Map<string, number>(days.map((d) => [d, 0]));
    for (const v of views) {
      const key = dayKey(v.createdAt);
      viewsByDay.set(key, (viewsByDay.get(key) ?? 0) + 1);
    }

    const salesByDay = new Map<string, { total: number; orders: number }>(days.map((d) => [d, { total: 0, orders: 0 }]));
    for (const o of orders) {
      const key = dayKey(o.createdAt);
      const entry = salesByDay.get(key) ?? { total: 0, orders: 0 };
      entry.total += Number(o.totalAmount);
      entry.orders += 1;
      salesByDay.set(key, entry);
    }

    const popularMap = new Map<string, number>();
    for (const item of orderItems) {
      const name = item.menuItem.nameIt;
      popularMap.set(name, (popularMap.get(name) ?? 0) + item.quantity);
    }
    const popularItems = [...popularMap.entries()]
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, POPULAR_ITEMS_LIMIT);

    return NextResponse.json({
      viewsByDay: days.map((d) => ({ date: d, count: viewsByDay.get(d) ?? 0 })),
      salesByDay: days.map((d) => ({ date: d, ...(salesByDay.get(d) ?? { total: 0, orders: 0 }) })),
      popularItems,
      totals: {
        views: views.length,
        orders: orders.length,
        revenue: orders.reduce((sum, o) => sum + Number(o.totalAmount), 0),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
