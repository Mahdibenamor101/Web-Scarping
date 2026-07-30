import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { withTenant } from "@/lib/db";
import { requireSession, requireRole, handleApiError } from "@/lib/api";
import { TABLE_MANAGEMENT_ROLES } from "@/lib/rbac";
import { createTableSchema } from "@/lib/validation";

// Any authenticated staff member can see the table list (server needs it to
// find which QR maps to which physical table); only owner/manager add or
// remove tables.
export async function GET() {
  try {
    const session = await requireSession();

    const tables = await withTenant(session.organizationId, (tx) =>
      tx.restaurantTable.findMany({
        where: { organizationId: session.organizationId },
        orderBy: { createdAt: "asc" },
      }),
    );

    return NextResponse.json({ tables });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    requireRole(session, TABLE_MANAGEMENT_ROLES);

    const body = createTableSchema.parse(await req.json());

    // 96 bits of entropy, URL-safe: unguessable enough that nobody can
    // enumerate other tables' QR codes, short enough to fit comfortably in
    // a QR code and a URL.
    const qrToken = crypto.randomBytes(12).toString("base64url");

    const table = await withTenant(session.organizationId, (tx) =>
      tx.restaurantTable.create({
        data: {
          organizationId: session.organizationId,
          label: body.label,
          qrToken,
          orderingMode: body.orderingMode ?? "TABLE",
        },
      }),
    );

    return NextResponse.json({ table }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
