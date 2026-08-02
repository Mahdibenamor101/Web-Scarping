import { NextRequest, NextResponse } from "next/server";
import { requireSession, requireRole, handleApiError, ApiError, requireRateLimit } from "@/lib/api";
import { MENU_MANAGEMENT_ROLES } from "@/lib/rbac";
import { generateFoodImage, buildFoodPrompt, isAiImageConfigured } from "@/lib/ai-image";
import { uploadImage, isStorageConfigured } from "@/lib/storage";
import { generatePhotoSchema } from "@/lib/validation";

// Not tied to an itemId, same reasoning as POST /api/menu/photo-upload:
// it just generates + uploads an image and hands back a URL that the
// item form writes into the same photoUrl field either upload path
// fills, so it works identically at create time (no itemId yet) and edit
// time.
export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    requireRole(session, MENU_MANAGEMENT_ROLES);

    // Real cost per call (image generation), bounded well below the
    // usual dashboard-action limits -- same order of magnitude as the
    // translation route.
    requireRateLimit(`ai-photo:org:${session.organizationId}`, { limit: 10, windowMs: 60 * 60 * 1000 });

    if (!isAiImageConfigured() || !isStorageConfigured()) {
      throw new ApiError(501, "ai_photo_not_configured");
    }

    const body = generatePhotoSchema.parse(await req.json());
    const { bytes, contentType } = await generateFoodImage(buildFoodPrompt(body.nameIt, body.descriptionIt));
    const url = await uploadImage({
      organizationId: session.organizationId,
      contentType,
      bytes,
      folder: "menu-items",
    });

    return NextResponse.json({ url });
  } catch (error) {
    return handleApiError(error);
  }
}
