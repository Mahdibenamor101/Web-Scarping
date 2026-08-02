import { NextRequest, NextResponse } from "next/server";
import type { StaffRole } from "@prisma/client";
import { prisma, withTenant } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { setSessionCookie, signSessionToken } from "@/lib/session";
import { loginSchema } from "@/lib/validation";
import { ApiError, handleApiError, requireRateLimit } from "@/lib/api";
import { getClientIp } from "@/lib/rate-limit";

type AuthLookupRow = {
  id: string;
  organization_id: string;
  role: StaffRole;
  // Null for an account created purely through Google/Apple sign-in
  // (see oauth_authenticate() in the growth_features migration) -- it
  // never set a password, so password login for it always fails below
  // rather than ever calling bcrypt.compare against a missing hash.
  password_hash: string | null;
  name: string;
  is_active: boolean;
};

// Login looks a staff member up by email before we know which organization
// they belong to, so it can't run inside a tenant-scoped transaction --
// there is no tenant to scope it to yet. `auth_lookup_user` is a narrow
// SECURITY DEFINER function that exists for exactly this query and nothing
// else (see prisma/migrations/*_row_level_security).
export async function POST(req: NextRequest) {
  try {
    // Two independent limits: by IP (one source hammering many accounts)
    // and by email (many sources -- or one persistent one -- hammering a
    // single account). Checked before the bcrypt compare below, which is
    // deliberately slow and shouldn't be what a brute-force loop pays for.
    requireRateLimit(`login:ip:${getClientIp(req)}`, { limit: 10, windowMs: 15 * 60 * 1000 });

    const body = loginSchema.parse(await req.json());

    requireRateLimit(`login:email:${body.email}`, { limit: 5, windowMs: 15 * 60 * 1000 });

    const [user] = await prisma.$queryRaw<AuthLookupRow[]>`
      SELECT * FROM auth_lookup_user(${body.email})
    `;

    if (!user || !user.is_active || !user.password_hash) {
      throw new ApiError(401, "invalid_credentials");
    }

    const passwordOk = await verifyPassword(body.password, user.password_hash);
    if (!passwordOk) {
      throw new ApiError(401, "invalid_credentials");
    }

    const sessionPayload = {
      userId: user.id,
      organizationId: user.organization_id,
      role: user.role,
      email: body.email,
      name: user.name,
    };
    await setSessionCookie(sessionPayload);

    // Now that we're inside a known tenant, this update is a normal
    // RLS-scoped write like any other -- no special-casing needed.
    await withTenant(user.organization_id, (tx) =>
      tx.user.update({ where: { id: user.id }, data: { lastActiveAt: new Date() } }),
    );

    // The cookie is what the web dashboard actually uses; `token` here is
    // for the mobile app, which has no cookie jar wired to its fetch
    // client and instead stores this and sends it back as
    // `Authorization: Bearer <token>` (see src/lib/session.ts::getSession).
    // Harmless for the browser client to receive and ignore.
    return NextResponse.json({ role: user.role, token: await signSessionToken(sessionPayload) });
  } catch (error) {
    return handleApiError(error);
  }
}
