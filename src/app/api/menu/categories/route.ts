import { NextRequest, NextResponse } from "next/server";
import { withTenant } from "@/lib/db";
import { requireSession, requireRole, handleApiError } from "@/lib/api";
import { MENU_MANAGEMENT_ROLES } from "@/lib/rbac";
import { createMenuCategorySchema } from "@/lib/validation";

// Any authenticated staff member can read the menu (server/kitchen need it
// day-to-day); only owner/manager can change it.
export async function GET() {
  try {
    const session = await requireSession();

    const categories = await withTenant(session.organizationId, (tx) =>
      tx.menuCategory.findMany({
        where: { organizationId: session.organizationId },
        orderBy: { sortOrder: "asc" },
      }),
    );

    return NextResponse.json({ categories });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    requireRole(session, MENU_MANAGEMENT_ROLES);

    const body = createMenuCategorySchema.parse(await req.json());

    const category = await withTenant(session.organizationId, (tx) =>
      tx.menuCategory.create({
        data: {
          organizationId: session.organizationId,
          nameIt: body.nameIt,
          nameEn: body.nameEn,
          sortOrder: body.sortOrder ?? 0,
        },
      }),
    );

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
