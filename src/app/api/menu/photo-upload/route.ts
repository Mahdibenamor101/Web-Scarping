import { NextRequest, NextResponse } from "next/server";
import { requireSession, requireRole, requireRateLimit, handleApiError, ApiError } from "@/lib/api";
import { MENU_MANAGEMENT_ROLES } from "@/lib/rbac";
import { uploadImage } from "@/lib/storage";

// Not scoped to a specific menu item on purpose: item-form.tsx uses this
// for both "add a new dish" (no item id yet) and "edit an existing one."
// The route only uploads the file and hands back a public URL -- the
// caller stores it in the same photoUrl field the manual-URL input
// already wrote to (see src/lib/validation.ts), so nothing downstream
// needs to know whether a photo was uploaded or pasted as a link.
export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    requireRole(session, MENU_MANAGEMENT_ROLES);
    requireRateLimit(`photo-upload:org:${session.organizationId}`, { limit: 60, windowMs: 60 * 60 * 1000 });

    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      throw new ApiError(400, "missing_file");
    }

    const url = await uploadImage({
      organizationId: session.organizationId,
      contentType: file.type,
      bytes: new Uint8Array(await file.arrayBuffer()),
      folder: "menu-items",
    });

    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
