import { NextResponse } from "next/server";
import { withTenant } from "@/lib/db";
import { requireSession, handleApiError, ApiError } from "@/lib/api";

// Any authenticated staff member can acknowledge a call -- same reasoning
// as advancing an order's status (src/app/api/orders/[orderId]/route.ts).
// There's only one transition (PENDING -> ACKNOWLEDGED), so this doesn't
// take a body: acknowledging is the only thing this endpoint does.
export async function PATCH(_req: Request, { params }: { params: { callId: string } }) {
  try {
    const session = await requireSession();

    const call = await withTenant(session.organizationId, async (tx) => {
      const existing = await tx.staffCall.findUnique({ where: { id: params.callId } });
      if (!existing) throw new ApiError(404, "not_found");
      return tx.staffCall.update({ where: { id: params.callId }, data: { status: "ACKNOWLEDGED" } });
    });

    return NextResponse.json({ call });
  } catch (error) {
    return handleApiError(error);
  }
}
