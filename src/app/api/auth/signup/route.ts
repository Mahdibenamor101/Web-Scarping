import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { setSessionCookie } from "@/lib/session";
import { signupSchema } from "@/lib/validation";
import { uniqueSlug } from "@/lib/slug";
import { handleApiError, requireRateLimit } from "@/lib/api";
import { getClientIp } from "@/lib/rate-limit";

const TRIAL_DAYS = 14;

// Restaurant owner self-service signup: creates the organization (tenant)
// and its first OWNER user atomically via the `create_organization_and_owner`
// SECURITY DEFINER function -- see prisma/migrations/*_row_level_security.
// There is no tenant context yet at this point (the org doesn't exist until
// this call creates it), so this is one of the few places that legitimately
// bypasses Row-Level Security, narrowly and on the database's terms.
export async function POST(req: NextRequest) {
  try {
    requireRateLimit(`signup:ip:${getClientIp(req)}`, { limit: 5, windowMs: 60 * 60 * 1000 });

    const body = signupSchema.parse(await req.json());
    const passwordHash = await hashPassword(body.password);
    const slug = uniqueSlug(body.organizationName);
    const trialEndsAt = new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000);

    const [result] = await prisma.$queryRaw<{ organization_id: string; user_id: string }[]>`
      SELECT * FROM create_organization_and_owner(
        ${body.organizationName},
        ${slug},
        ${body.ownerName},
        ${body.email},
        ${passwordHash},
        ${trialEndsAt}
      )
    `;

    if (!result) {
      throw new Error("signup_failed");
    }

    await setSessionCookie({
      userId: result.user_id,
      organizationId: result.organization_id,
      role: "OWNER",
      email: body.email,
      name: body.ownerName,
    });

    return NextResponse.json({ organizationId: result.organization_id }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
