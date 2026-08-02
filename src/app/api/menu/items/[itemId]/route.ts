import { NextRequest, NextResponse } from "next/server";
import type { MenuItem } from "@prisma/client";
import { withTenant } from "@/lib/db";
import { requireSession, requireRole, handleApiError, ApiError } from "@/lib/api";
import { MENU_MANAGEMENT_ROLES } from "@/lib/rbac";
import { updateMenuItemSchema } from "@/lib/validation";

function serialize(item: MenuItem) {
  return { ...item, price: Number(item.price) };
}

export async function PATCH(req: NextRequest, { params }: { params: { itemId: string } }) {
  try {
    const session = await requireSession();
    requireRole(session, MENU_MANAGEMENT_ROLES);

    const body = updateMenuItemSchema.parse(await req.json());

    const item = await withTenant(session.organizationId, async (tx) => {
      const existing = await tx.menuItem.findUnique({ where: { id: params.itemId } });
      if (!existing) throw new ApiError(404, "not_found");

      if (body.categoryId) {
        // Same reasoning as create: RLS makes this check sufficient on its own.
        const category = await tx.menuCategory.findUnique({ where: { id: body.categoryId } });
        if (!category) throw new ApiError(400, "invalid_category");
      }

      return tx.menuItem.update({ where: { id: params.itemId }, data: body });
    });

    return NextResponse.json({ item: serialize(item) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { itemId: string } }) {
  try {
    const session = await requireSession();
    requireRole(session, MENU_MANAGEMENT_ROLES);

    await withTenant(session.organizationId, async (tx) => {
      const existing = await tx.menuItem.findUnique({ where: { id: params.itemId } });
      if (!existing) throw new ApiError(404, "not_found");
      await tx.menuItem.delete({ where: { id: params.itemId } });
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
