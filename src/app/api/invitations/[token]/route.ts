import { NextRequest, NextResponse } from "next/server";
import type { StaffRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { ApiError, handleApiError } from "@/lib/api";

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
export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  try {
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
