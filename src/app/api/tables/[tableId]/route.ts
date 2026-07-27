import { NextRequest, NextResponse } from "next/server";
import { withTenant } from "@/lib/db";
import { requireSession, requireRole, handleApiError, ApiError } from "@/lib/api";
import { TABLE_MANAGEMENT_ROLES } from "@/lib/rbac";
import { updateTableSchema } from "@/lib/validation";

export async function PATCH(req: NextRequest, { params }: { params: { tableId: string } }) {
  try {
    const session = await requireSession();
    requireRole(session, TABLE_MANAGEMENT_ROLES);

    const body = updateTableSchema.parse(await req.json());

    const table = await withTenant(session.organizationId, async (tx) => {
      const existing = await tx.restaurantTable.findUnique({ where: { id: params.tableId } });
      if (!existing) throw new ApiError(404, "not_found");
      return tx.restaurantTable.update({ where: { id: params.tableId }, data: body });
    });

    return NextResponse.json({ table });
  } catch (error) {
    return handleApiError(error);
  }
}

// Blocked if the table has orders (onDelete: Restrict on Order.table --
// see prisma/schema.prisma) so history never silently disappears; the
// caller gets a 409 rather than a confusing 500.
export async function DELETE(_req: NextRequest, { params }: { params: { tableId: string } }) {
  try {
    const session = await requireSession();
    requireRole(session, TABLE_MANAGEMENT_ROLES);

    await withTenant(session.organizationId, async (tx) => {
      const existing = await tx.restaurantTable.findUnique({ where: { id: params.tableId } });
      if (!existing) throw new ApiError(404, "not_found");
      await tx.restaurantTable.delete({ where: { id: params.tableId } });
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
