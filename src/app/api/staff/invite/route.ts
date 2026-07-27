import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { withTenant } from "@/lib/db";
import { requireSession, requireRole, handleApiError, ApiError } from "@/lib/api";
import { STAFF_MANAGEMENT_ROLES, canInviteRole } from "@/lib/rbac";
import { inviteStaffSchema } from "@/lib/validation";

const INVITATION_TTL_DAYS = 7;

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    requireRole(session, STAFF_MANAGEMENT_ROLES);

    const body = inviteStaffSchema.parse(await req.json());

    if (!canInviteRole(session.role, body.role)) {
      throw new ApiError(403, "cannot_invite_that_role");
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + INVITATION_TTL_DAYS * 24 * 60 * 60 * 1000);

    const invitation = await withTenant(session.organizationId, (tx) =>
      tx.invitation.upsert({
        where: { organizationId_email: { organizationId: session.organizationId, email: body.email } },
        create: {
          organizationId: session.organizationId,
          email: body.email,
          role: body.role,
          token,
          invitedByUserId: session.userId,
          expiresAt,
        },
        update: {
          role: body.role,
          token,
          invitedByUserId: session.userId,
          expiresAt,
          acceptedAt: null,
        },
      }),
    );

    // No email provider is wired up yet (Phase 0 foundations only) -- the
    // invite link is returned directly and logged, so the owner/manager can
    // hand it to the new hire out-of-band until real delivery exists.
    const inviteUrl = `${req.nextUrl.origin}/invite/${invitation.token}`;
    console.info(`[staff-invite] ${body.email} -> ${inviteUrl}`);

    return NextResponse.json({ inviteUrl, expiresAt: invitation.expiresAt }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
