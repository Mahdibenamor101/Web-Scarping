import { NextRequest, NextResponse } from "next/server";
import { withTenant } from "@/lib/db";
import { resolveTableByQrToken } from "@/lib/qr-resolve";
import { ApiError, handleApiError } from "@/lib/api";
import { createOrderSchema } from "@/lib/validation";

// Public: no session required (same reasoning as the menu route). Prices
// are never trusted from the client -- they're re-read from the database,
// inside the same tenant-scoped transaction that creates the order, so
// what gets billed is always what the menu actually says right now.
export async function POST(req: NextRequest, { params }: { params: { qrToken: string } }) {
  try {
    const table = await resolveTableByQrToken(params.qrToken);
    const body = createOrderSchema.parse(await req.json());

    const order = await withTenant(table.organizationId, async (tx) => {
      const menuItemIds = [...new Set(body.items.map((i) => i.menuItemId))];
      const menuItems = await tx.menuItem.findMany({
        where: { organizationId: table.organizationId, id: { in: menuItemIds } },
      });
      const byId = new Map(menuItems.map((m) => [m.id, m]));

      let totalAmount = 0;
      const orderItemsData = body.items.map((line) => {
        const menuItem = byId.get(line.menuItemId);
        if (!menuItem || !menuItem.isAvailable) {
          throw new ApiError(400, "menu_item_unavailable");
        }
        const unitPrice = Number(menuItem.price);
        totalAmount += unitPrice * line.quantity;
        return {
          // No organizationId here: OrderItem.order is now a composite FK
          // on (orderId, organizationId) (see the composite_tenant_foreign_keys
          // migration), so Prisma fills it in from the parent Order this
          // createMany is nested under -- passing it explicitly is rejected.
          menuItemId: menuItem.id,
          quantity: line.quantity,
          unitPrice,
          notes: line.notes,
        };
      });

      return tx.order.create({
        data: {
          organizationId: table.organizationId,
          tableId: table.tableId,
          status: "PENDING",
          totalAmount,
          items: { createMany: { data: orderItemsData } },
        },
        include: { items: true },
      });
    });

    return NextResponse.json(
      { orderId: order.id, status: order.status, totalAmount: Number(order.totalAmount) },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
