import { NextRequest, NextResponse } from "next/server";
import { withTenant } from "@/lib/db";
import { requireSession, handleApiError, requireRateLimit } from "@/lib/api";
import { registerPushTokenSchema } from "@/lib/validation";

// Any authenticated staff member registers their own device -- no role
// gate, matching the live order board itself (visible to owner, manager,
// server, kitchen alike). Called once after login and again whenever the
// mobile app's push token rotates (Expo can reissue one).
export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    requireRateLimit(`push-token:user:${session.userId}`, { limit: 20, windowMs: 60 * 60 * 1000 });

    const body = registerPushTokenSchema.parse(await req.json());

    // Unique on token alone (see schema.prisma) -- reassigns a shared
    // device's token to whoever's logged in now rather than leaving a
    // stale row pointing at a previous account.
    await withTenant(session.organizationId, (tx) =>
      tx.pushToken.upsert({
        where: { token: body.token },
        create: {
          organizationId: session.organizationId,
          userId: session.userId,
          token: body.token,
          platform: body.platform,
        },
        update: { organizationId: session.organizationId, userId: session.userId, platform: body.platform },
      }),
    );

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

// Called on logout so a shared/handed-back device stops receiving this
// staff member's notifications immediately, instead of waiting for the
// next login to overwrite the row.
export async function DELETE(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = registerPushTokenSchema.pick({ token: true }).parse(await req.json());

    await withTenant(session.organizationId, (tx) =>
      tx.pushToken.deleteMany({ where: { token: body.token, userId: session.userId } }),
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
