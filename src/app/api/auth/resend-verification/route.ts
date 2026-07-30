import { NextRequest, NextResponse } from "next/server";
import { withTenant } from "@/lib/db";
import { requireSession, handleApiError, ApiError, requireRateLimit } from "@/lib/api";
import { sendVerificationEmail } from "@/lib/verification";

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    requireRateLimit(`resend-verification:user:${session.userId}`, { limit: 3, windowMs: 15 * 60 * 1000 });

    const alreadyVerified = await withTenant(session.organizationId, (tx) =>
      tx.user.findUnique({ where: { id: session.userId }, select: { emailVerifiedAt: true } }),
    );
    if (alreadyVerified?.emailVerifiedAt) {
      throw new ApiError(409, "already_verified");
    }

    const { sent } = await withTenant(session.organizationId, (tx) =>
      sendVerificationEmail(tx, {
        organizationId: session.organizationId,
        userId: session.userId,
        email: session.email,
        origin: req.nextUrl.origin,
      }),
    );

    return NextResponse.json({ sent });
  } catch (error) {
    return handleApiError(error);
  }
}
