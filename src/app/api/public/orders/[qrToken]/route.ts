import { NextRequest, NextResponse } from "next/server";
import { withTenant } from "@/lib/db";
import { resolveTableByQrToken } from "@/lib/qr-resolve";
import { ApiError, handleApiError, requireRateLimit } from "@/lib/api";
import { getClientIp } from "@/lib/rate-limit";
import { createOrderSchema } from "@/lib/validation";
import { sendPushNotifications } from "@/lib/push";

// Public: no session required (same reasoning as the menu route). Prices
// are never trusted from the client -- they're re-read from the database,
// inside the same tenant-scoped transaction that creates the order, so
// what gets billed is always what the menu actually says right now.
export async function POST(req: NextRequest, { params }: { params: { qrToken: string } }) {
  try {
    // By IP first (covers invalid/guessed tokens too, before any DB
    // lookup), then by table once resolved -- one customer mashing
    // "commander" doesn't get blocked, a script hammering one table does.
    requireRateLimit(`order:ip:${getClientIp(req)}`, { limit: 30, windowMs: 60 * 60 * 1000 });

    const table = await resolveTableByQrToken(params.qrToken);

    requireRateLimit(`order:table:${table.tableId}`, { limit: 20, windowMs: 5 * 60 * 1000 });

    if (table.orderingMode === "DISPLAY_ONLY") {
      throw new ApiError(403, "ordering_disabled");
    }

    const body = createOrderSchema.parse(await req.json());

    if (table.orderingMode === "PICKUP" && !body.pickupName) {
      throw new ApiError(400, "pickup_name_required");
    }

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

      const created = await tx.order.create({
        data: {
          organizationId: table.organizationId,
          tableId: table.tableId,
          status: "PENDING",
          totalAmount,
          // Snapshot, not a live join -- see Order.orderingMode in schema.prisma.
          orderingMode: table.orderingMode,
          pickupName: table.orderingMode === "PICKUP" ? body.pickupName : undefined,
          items: { createMany: { data: orderItemsData } },
        },
        include: { items: true },
      });

      // "Occupied" only means something for a physical dine-in table --
      // COUNTER/PICKUP links have no FREE/OCCUPIED concept for the
      // dashboard tables view to show.
      if (table.orderingMode === "TABLE") {
        await tx.restaurantTable.update({ where: { id: table.tableId }, data: { status: "OCCUPIED" } });
      }

      return created;
    });

    // Fire-and-forget, after the transaction has committed -- a push
    // failure (or Expo being unreachable) must never turn a successful
    // order into a failed response. Every staff push token in the org
    // gets it, same reach as the live order board itself (visible to
    // owner, manager, server, and kitchen alike, no role filter).
    withTenant(table.organizationId, (tx) =>
      tx.pushToken.findMany({ where: { organizationId: table.organizationId }, select: { token: true } }),
    )
      .then((rows) =>
        sendPushNotifications(
          rows.map((r) => r.token),
          {
            title: order.orderingMode === "TABLE" ? `Nouvelle commande — ${table.tableLabel}` : `Nouvelle commande #${order.orderNumber}`,
            body: `${order.items.length} article${order.items.length > 1 ? "s" : ""} — ${Number(order.totalAmount).toFixed(2)} €`,
            data: { kind: "order", orderId: order.id },
          },
        ),
      )
      .catch((err) => console.error("[push] order notification failed", err));

    return NextResponse.json(
      {
        orderId: order.id,
        status: order.status,
        totalAmount: Number(order.totalAmount),
        orderNumber: order.orderNumber,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
