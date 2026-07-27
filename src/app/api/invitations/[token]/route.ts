import { NextRequest, NextResponse } from "next/server";
import type { StaffRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { ApiError, handleApiError, requireRateLimit } from "@/lib/api";
import { getClientIp } from "@/lib/rate-limit";

type InvitationLookupRow = {
  organization_name: string;
  email: string;
  role: StaffRole;
  expires_at: Date;
  accepted_at: Date | null;
};

// Public route: the invitee has a token but no account yet, so this can't
// be a normal RLS-scoped read. See invitation_lookup_by_token in
// prisma/migrations/*_invitation_lookup.
export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  try {
    // Tokens are 32 random bytes (see POST /api/staff/invite) -- guessing
    // one is computationally infeasible regardless of rate limiting. This
    // is cheap insurance against casual scripted probing, not the actual
    // defense against enumeration.
    requireRateLimit(`invite-lookup:ip:${getClientIp(req)}`, { limit: 30, windowMs: 60 * 60 * 1000 });

    const [invitation] = await prisma.$queryRaw<InvitationLookupRow[]>`
      SELECT * FROM invitation_lookup_by_token(${params.token})
    `;

    if (!invitation) {
      throw new ApiError(404, "not_found");
    }
    if (invitation.accepted_at) {
      throw new ApiError(410, "already_accepted");
    }
    if (invitation.expires_at.getTime() < Date.now()) {
      throw new ApiError(410, "expired");
    }

    return NextResponse.json({
      organizationName: invitation.organization_name,
      email: invitation.email,
      role: invitation.role,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
