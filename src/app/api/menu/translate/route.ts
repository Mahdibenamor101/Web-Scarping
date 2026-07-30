import { NextRequest, NextResponse } from "next/server";
import { withTenant } from "@/lib/db";
import { requireSession, requireRole, handleApiError, requireRateLimit } from "@/lib/api";
import { MENU_MANAGEMENT_ROLES } from "@/lib/rbac";
import { translateMenuSchema } from "@/lib/validation";
import { translateBatch, type LanguageCode } from "@/lib/translate";

// Translates every menu item's name + description into the requested
// languages and upserts menu_item_translations (see the growth_features
// migration) -- re-running for a language already translated overwrites
// its rows rather than erroring, so editing the Italian source and
// re-translating is the expected workflow, not a one-time action.
export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    requireRole(session, MENU_MANAGEMENT_ROLES);

    // Real cost per call (a paid API, unlike most routes here) -- bounded
    // tighter than the usual dashboard-action limits.
    requireRateLimit(`menu-translate:org:${session.organizationId}`, { limit: 10, windowMs: 60 * 60 * 1000 });

    const body = translateMenuSchema.parse(await req.json());

    const items = await withTenant(session.organizationId, (tx) =>
      tx.menuItem.findMany({
        where: { organizationId: session.organizationId },
        select: { id: true, nameIt: true, descriptionIt: true },
      }),
    );

    let translatedCount = 0;

    for (const languageCode of body.languageCodes as LanguageCode[]) {
      const names = await translateBatch(
        items.map((i) => i.nameIt),
        languageCode,
      );
      const descriptions = await translateBatch(
        items.map((i) => i.descriptionIt ?? ""),
        languageCode,
      );

      await withTenant(session.organizationId, async (tx) => {
        for (const [i, item] of items.entries()) {
          const name = names[i] ?? item.nameIt;
          const description = descriptions[i] || null;
          await tx.menuItemTranslation.upsert({
            where: { menuItemId_languageCode: { menuItemId: item.id, languageCode } },
            create: {
              organizationId: session.organizationId,
              menuItemId: item.id,
              languageCode,
              name,
              description,
            },
            update: { name, description },
          });
        }
      });

      translatedCount += items.length;
    }

    return NextResponse.json({ translatedItems: translatedCount, languages: body.languageCodes });
  } catch (error) {
    return handleApiError(error);
  }
}
