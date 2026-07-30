import { NextRequest, NextResponse } from "next/server";
import { withTenant } from "@/lib/db";
import { resolveTableByQrToken } from "@/lib/qr-resolve";
import { handleApiError, requireRateLimit } from "@/lib/api";
import { getClientIp } from "@/lib/rate-limit";
import { sendPushNotifications } from "@/lib/push";

// Public: no session required, same reasoning as public order creation
// (src/app/api/public/orders/[qrToken]/route.ts) -- once the QR token
// resolves a table, inserting a staff_calls row is an ordinary
// RLS-scoped write, no SECURITY DEFINER bypass involved.
export async function POST(req: NextRequest, { params }: { params: { qrToken: string } }) {
  try {
    requireRateLimit(`staff-call:ip:${getClientIp(req)}`, { limit: 10, windowMs: 60 * 60 * 1000 });

    const table = await resolveTableByQrToken(params.qrToken);

    // One call per table every 2 minutes -- generous enough that a table
    // genuinely needing attention twice isn't blocked, tight enough that a
    // bored customer mashing the button doesn't flood the floor staff.
    requireRateLimit(`staff-call:table:${table.tableId}`, { limit: 1, windowMs: 2 * 60 * 1000 });

    await withTenant(table.organizationId, (tx) =>
      tx.staffCall.create({
        data: { organizationId: table.organizationId, tableId: table.tableId, status: "PENDING" },
      }),
    );

    // Same fire-and-forget reasoning as the order-creation trigger --
    // never let a push failure turn a successful call into a failed one.
    withTenant(table.organizationId, (tx) =>
      tx.pushToken.findMany({ where: { organizationId: table.organizationId }, select: { token: true } }),
    )
      .then((rows) =>
        sendPushNotifications(
          rows.map((r) => r.token),
          {
            title: `${table.tableLabel} appelle`,
            body: "Un client demande le serveur.",
            data: { kind: "staffCall", tableId: table.tableId },
          },
        ),
      )
      .catch((err) => console.error("[push] staff-call notification failed", err));

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
