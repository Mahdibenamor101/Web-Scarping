import { NextRequest, NextResponse } from "next/server";
import type { StaffRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { setSessionCookie, signSessionToken } from "@/lib/session";
import { acceptInvitationSchema } from "@/lib/validation";
import { handleApiError, requireRateLimit } from "@/lib/api";
import { getClientIp } from "@/lib/rate-limit";

type AcceptInvitationRow = {
  user_id: string;
  organization_id: string;
  role: StaffRole;
  email: string;
};

// `accept_invitation` validates the token (exists, unexpired, unused) and
// creates the user row atomically -- see
// prisma/migrations/*_invitation_lookup. If the token is bad it raises
// `invitation_invalid_or_expired`, mapped to a 410 by handleApiError.
export async function POST(req: NextRequest) {
  try {
    requireRateLimit(`invite-accept:ip:${getClientIp(req)}`, { limit: 20, windowMs: 60 * 60 * 1000 });

    const body = acceptInvitationSchema.parse(await req.json());
    const passwordHash = await hashPassword(body.password);

    const [result] = await prisma.$queryRaw<AcceptInvitationRow[]>`
      SELECT * FROM accept_invitation(${body.token}, ${body.name}, ${passwordHash})
    `;

    if (!result) {
      throw new Error("accept_invitation_failed");
    }

    const sessionPayload = {
      userId: result.user_id,
      organizationId: result.organization_id,
      role: result.role,
      email: result.email,
      name: body.name,
    };
    await setSessionCookie(sessionPayload);

    return NextResponse.json(
      { organizationId: result.organization_id, role: result.role, token: await signSessionToken(sessionPayload) },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
