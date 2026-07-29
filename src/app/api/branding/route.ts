import { NextRequest, NextResponse } from "next/server";
import { withTenant } from "@/lib/db";
import { requireSession, requireRole, handleApiError } from "@/lib/api";
import { MENU_MANAGEMENT_ROLES } from "@/lib/rbac";
import { updateBrandingSchema } from "@/lib/validation";

// Same role gate as menu editing: white-label is a customer-facing,
// visual concern, not a management/billing one -- owner or manager, not
// staff-only, not owner-only.
export async function GET() {
  try {
    const session = await requireSession();
    const org = await withTenant(session.organizationId, (tx) =>
      tx.organization.findUnique({
        where: { id: session.organizationId },
        select: { logoUrl: true, backgroundUrl: true },
      }),
    );
    return NextResponse.json({ logoUrl: org?.logoUrl ?? null, backgroundUrl: org?.backgroundUrl ?? null });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireSession();
    requireRole(session, MENU_MANAGEMENT_ROLES);

    const body = updateBrandingSchema.parse(await req.json());

    const org = await withTenant(session.organizationId, (tx) =>
      tx.organization.update({
        where: { id: session.organizationId },
        data: body,
        select: { logoUrl: true, backgroundUrl: true },
      }),
    );

    return NextResponse.json(org);
  } catch (error) {
    return handleApiError(error);
  }
}
