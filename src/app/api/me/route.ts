import { NextResponse } from "next/server";
import { withTenant } from "@/lib/db";
import { clearSessionCookie } from "@/lib/session";
import { requireSession, handleApiError, ApiError } from "@/lib/api";

// Re-reads the user row (scoped by RLS to their own org) on every call
// instead of trusting the JWT payload alone, so a revoked/deactivated
// account or a role change takes effect immediately rather than waiting
// out the 7-day token lifetime.
export async function GET() {
  try {
    const session = await requireSession();

    const user = await withTenant(session.organizationId, (tx) =>
      tx.user.findUnique({
        where: { id: session.userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          emailVerifiedAt: true,
          organization: { select: { id: true, name: true, slug: true } },
        },
      }),
    );

    if (!user || !user.isActive) {
      clearSessionCookie();
      throw new ApiError(401, "not_authenticated");
    }

    return NextResponse.json({ user });
  } catch (error) {
    return handleApiError(error);
  }
}
