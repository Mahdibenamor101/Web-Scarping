import { NextRequest, NextResponse } from "next/server";
import { withTenant } from "@/lib/db";
import { requireSession, handleApiError, ApiError } from "@/lib/api";
import { updateOrderStatusSchema } from "@/lib/validation";
import { TERMINAL_ORDER_STATUSES } from "@/lib/orders";

// Any authenticated staff member can advance an order's status -- this is
// the day-to-day job of server/kitchen roles, not a management action.
export async function PATCH(req: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const session = await requireSession();
    const body = updateOrderStatusSchema.parse(await req.json());

    const order = await withTenant(session.organizationId, async (tx) => {
      const existing = await tx.order.findUnique({ where: { id: params.orderId } });
      if (!existing) throw new ApiError(404, "not_found");

      const updated = await tx.order.update({ where: { id: params.orderId }, data: { status: body.status } });

      if (TERMINAL_ORDER_STATUSES.includes(body.status)) {
        const stillActive = await tx.order.count({
          where: {
            tableId: updated.tableId,
            organizationId: session.organizationId,
            status: { notIn: TERMINAL_ORDER_STATUSES },
          },
        });
        if (stillActive === 0) {
          await tx.restaurantTable.update({ where: { id: updated.tableId }, data: { status: "FREE" } });
        }
      }

      return updated;
    });

    return NextResponse.json({ order: { ...order, totalAmount: Number(order.totalAmount) } });
  } catch (error) {
    return handleApiError(error);
  }
}
