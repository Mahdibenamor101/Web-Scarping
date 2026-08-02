import { NextResponse } from "next/server";
import { withTenant } from "@/lib/db";
import { requireSession, handleApiError } from "@/lib/api";

// Any authenticated staff member can see pending calls -- same reasoning
// as the order queue (src/app/api/orders/route.ts): whoever's on the
// floor needs to see this, not just management.
export async function GET() {
  try {
    const session = await requireSession();

    const calls = await withTenant(session.organizationId, (tx) =>
      tx.staffCall.findMany({
        where: { organizationId: session.organizationId, status: "PENDING" },
        include: { table: { select: { label: true } } },
        orderBy: { createdAt: "asc" },
      }),
    );

    return NextResponse.json({ calls });
  } catch (error) {
    return handleApiError(error);
  }
}
