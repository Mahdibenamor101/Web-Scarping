import { NextResponse } from "next/server";
import { withTenant } from "@/lib/db";
import { requireSession, requireRole, handleApiError } from "@/lib/api";
import { STAFF_MANAGEMENT_ROLES } from "@/lib/rbac";

// Lists staff + pending invitations for the caller's own organization only.
// The `where: { organizationId }` clauses below are redundant with the RLS
// policy (which would already exclude every other org's rows even without
// them) -- kept for query-plan clarity, not as the actual security boundary.
export async function GET() {
  try {
    const session = await requireSession();
    requireRole(session, STAFF_MANAGEMENT_ROLES);

    const [staff, invitations] = await withTenant(session.organizationId, (tx) =>
      Promise.all([
        tx.user.findMany({
          where: { organizationId: session.organizationId },
          select: { id: true, name: true, email: true, role: true, isActive: true, lastActiveAt: true, createdAt: true },
          orderBy: { createdAt: "asc" },
        }),
        tx.invitation.findMany({
          where: { organizationId: session.organizationId, acceptedAt: null },
          select: { id: true, email: true, role: true, token: true, expiresAt: true, createdAt: true },
          orderBy: { createdAt: "desc" },
        }),
      ]),
    );

    return NextResponse.json({ staff, invitations });
  } catch (error) {
    return handleApiError(error);
  }
}
