import { NextRequest, NextResponse } from "next/server";
import { withTenant } from "@/lib/db";
import { requireSession, requireRole, handleApiError, ApiError } from "@/lib/api";
import { MENU_MANAGEMENT_ROLES } from "@/lib/rbac";
import { updateMenuCategorySchema } from "@/lib/validation";

export async function PATCH(req: NextRequest, { params }: { params: { categoryId: string } }) {
  try {
    const session = await requireSession();
    requireRole(session, MENU_MANAGEMENT_ROLES);

    const body = updateMenuCategorySchema.parse(await req.json());

    const category = await withTenant(session.organizationId, async (tx) => {
      const existing = await tx.menuCategory.findUnique({ where: { id: params.categoryId } });
      if (!existing) throw new ApiError(404, "not_found");
      return tx.menuCategory.update({ where: { id: params.categoryId }, data: body });
    });

    return NextResponse.json({ category });
  } catch (error) {
    return handleApiError(error);
  }
}

// Deleting a category cascades to its menu items (see prisma/schema.prisma:
// MenuItem.category onDelete: Cascade) -- confirmed with the caller in the UI
// before this is called, not re-confirmed here.
export async function DELETE(_req: NextRequest, { params }: { params: { categoryId: string } }) {
  try {
    const session = await requireSession();
    requireRole(session, MENU_MANAGEMENT_ROLES);

    await withTenant(session.organizationId, async (tx) => {
      const existing = await tx.menuCategory.findUnique({ where: { id: params.categoryId } });
      if (!existing) throw new ApiError(404, "not_found");
      await tx.menuCategory.delete({ where: { id: params.categoryId } });
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
