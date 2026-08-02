import { NextRequest, NextResponse } from "next/server";
import type { MenuItem } from "@prisma/client";
import { withTenant } from "@/lib/db";
import { requireSession, requireRole, handleApiError, ApiError } from "@/lib/api";
import { MENU_MANAGEMENT_ROLES } from "@/lib/rbac";
import { createMenuItemSchema } from "@/lib/validation";

// Prisma's Decimal doesn't serialize to JSON as a plain number on its own.
function serialize(item: MenuItem) {
  return { ...item, price: Number(item.price) };
}

export async function GET() {
  try {
    const session = await requireSession();

    const items = await withTenant(session.organizationId, (tx) =>
      tx.menuItem.findMany({
        where: { organizationId: session.organizationId },
        orderBy: [{ categoryId: "asc" }, { sortOrder: "asc" }],
      }),
    );

    return NextResponse.json({ items: items.map(serialize) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    requireRole(session, MENU_MANAGEMENT_ROLES);

    const body = createMenuItemSchema.parse(await req.json());

    const item = await withTenant(session.organizationId, async (tx) => {
      // RLS already scopes this to the caller's org: if categoryId belongs
      // to a different organization, this returns null regardless of what
      // the client sent.
      const category = await tx.menuCategory.findUnique({ where: { id: body.categoryId } });
      if (!category) throw new ApiError(400, "invalid_category");

      return tx.menuItem.create({
        data: {
          organizationId: session.organizationId,
          categoryId: body.categoryId,
          nameIt: body.nameIt,
          nameEn: body.nameEn,
          descriptionIt: body.descriptionIt,
          descriptionEn: body.descriptionEn,
          price: body.price,
          photoUrl: body.photoUrl,
          isAvailable: body.isAvailable ?? true,
          sortOrder: body.sortOrder ?? 0,
          allergens: body.allergens ?? [],
        },
      });
    });

    return NextResponse.json({ item: serialize(item) }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
