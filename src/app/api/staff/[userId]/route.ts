import { NextRequest, NextResponse } from "next/server";
import { withTenant } from "@/lib/db";
import { requireSession, requireRole, handleApiError, ApiError } from "@/lib/api";
import { STAFF_MANAGEMENT_ROLES } from "@/lib/rbac";
import { updateStaffSchema } from "@/lib/validation";

export async function PATCH(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const session = await requireSession();
    requireRole(session, STAFF_MANAGEMENT_ROLES);

    const body = updateStaffSchema.parse(await req.json());

    const updated = await withTenant(session.organizationId, async (tx) => {
      const target = await tx.user.findUnique({ where: { id: params.userId } });
      if (!target) throw new ApiError(404, "not_found");

      const demotingOrDeactivatingOwner =
        target.role === "OWNER" &&
        ((body.role && body.role !== "OWNER") || body.isActive === false);

      if (demotingOrDeactivatingOwner) {
        const ownerCount = await tx.user.count({
          where: { organizationId: session.organizationId, role: "OWNER", isActive: true },
        });
        if (ownerCount <= 1) {
          throw new ApiError(409, "cannot_remove_last_owner");
        }
      }

      if (target.role === "OWNER" && session.role !== "OWNER") {
        throw new ApiError(403, "only_owner_can_modify_owner");
      }

      return tx.user.update({
        where: { id: params.userId },
        data: body,
        select: { id: true, name: true, email: true, role: true, isActive: true },
      });
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    return handleApiError(error);
  }
}
