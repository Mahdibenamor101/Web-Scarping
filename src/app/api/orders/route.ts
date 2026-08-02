import { NextResponse } from "next/server";
import type { Order, OrderItem } from "@prisma/client";
import { withTenant } from "@/lib/db";
import { requireSession, handleApiError } from "@/lib/api";

type OrderWithItems = Order & {
  table: { label: string };
  items: (OrderItem & { menuItem: { nameIt: string; nameEn: string | null } })[];
};

function serialize(order: OrderWithItems) {
  return {
    ...order,
    totalAmount: Number(order.totalAmount),
    items: order.items.map((item) => ({ ...item, unitPrice: Number(item.unitPrice) })),
  };
}

// Any authenticated staff member -- owner, manager, server, or kitchen --
// needs to see the live order queue; there's no management-only gate here,
// unlike menu/staff/tables. RLS still scopes this to the caller's own org.
export async function GET() {
  try {
    const session = await requireSession();

    const orders = await withTenant(session.organizationId, (tx) =>
      tx.order.findMany({
        where: { organizationId: session.organizationId },
        include: {
          table: { select: { label: true } },
          items: { include: { menuItem: { select: { nameIt: true, nameEn: true } } } },
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
    );

    return NextResponse.json({ orders: orders.map(serialize) });
  } catch (error) {
    return handleApiError(error);
  }
}
