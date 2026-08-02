import { NextRequest, NextResponse } from "next/server";
import { requireSession, requireRole, requireRateLimit, handleApiError, ApiError } from "@/lib/api";
import { MENU_MANAGEMENT_ROLES } from "@/lib/rbac";
import { uploadImage } from "@/lib/storage";

// Uploads a logo or background image and hands back its public URL --
// doesn't touch the database itself. The branding settings form (see
// src/app/dashboard/branding/page.tsx) uploads first, then PATCHes
// /api/branding with the returned URL, same two-step shape as menu item
// photos (src/app/api/menu/photo-upload).
export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    requireRole(session, MENU_MANAGEMENT_ROLES);
    requireRateLimit(`branding-upload:org:${session.organizationId}`, { limit: 30, windowMs: 60 * 60 * 1000 });

    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      throw new ApiError(400, "missing_file");
    }

    const url = await uploadImage({
      organizationId: session.organizationId,
      contentType: file.type,
      bytes: new Uint8Array(await file.arrayBuffer()),
      folder: "branding",
    });

    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
