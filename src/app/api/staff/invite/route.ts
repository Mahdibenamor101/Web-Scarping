import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { withTenant } from "@/lib/db";
import { requireSession, requireRole, handleApiError, ApiError, requireRateLimit } from "@/lib/api";
import { STAFF_MANAGEMENT_ROLES, canInviteRole } from "@/lib/rbac";
import { inviteStaffSchema } from "@/lib/validation";
import { sendEmail } from "@/lib/email";
import { getRequestOrigin } from "@/lib/rate-limit";

const INVITATION_TTL_DAYS = 7;

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    requireRole(session, STAFF_MANAGEMENT_ROLES);

    // Per-organization, not per-caller: an owner and a manager sending
    // invites at the same time share the same budget on purpose -- what's
    // being bounded is "how many invite links can this restaurant generate
    // per hour," not one person's activity.
    requireRateLimit(`staff-invite:org:${session.organizationId}`, { limit: 20, windowMs: 60 * 60 * 1000 });

    const body = inviteStaffSchema.parse(await req.json());

    if (!canInviteRole(session.role, body.role)) {
      throw new ApiError(403, "cannot_invite_that_role");
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + INVITATION_TTL_DAYS * 24 * 60 * 60 * 1000);

    const { invitation, organizationName } = await withTenant(session.organizationId, async (tx) => {
      const invitation = await tx.invitation.upsert({
        where: { organizationId_email: { organizationId: session.organizationId, email: body.email } },
        create: {
          organizationId: session.organizationId,
          email: body.email,
          role: body.role,
          token,
          invitedByUserId: session.userId,
          expiresAt,
        },
        update: {
          role: body.role,
          token,
          invitedByUserId: session.userId,
          expiresAt,
          acceptedAt: null,
        },
      });
      const organization = await tx.organization.findUnique({
        where: { id: session.organizationId },
        select: { name: true },
      });
      return { invitation, organizationName: organization?.name ?? "" };
    });

    // The link always works and is always logged, regardless of whether
    // an email provider is configured -- see src/lib/email.ts. That keeps
    // this route's core behavior (an invite link the owner/manager can
    // hand over manually) working exactly as before if RESEND_API_KEY
    // isn't set, with real delivery as a bonus when it is.
    const inviteUrl = `${getRequestOrigin(req)}/invite/${invitation.token}`;
    console.info(`[staff-invite] ${body.email} -> ${inviteUrl}`);

    const { sent } = await sendEmail({
      to: body.email,
      subject: `Invitation à rejoindre ${organizationName} sur mbQr`,
      html: `
        <p>Vous avez été invité·e à rejoindre <strong>${organizationName}</strong> sur mbQr, en tant que ${body.role}.</p>
        <p><a href="${inviteUrl}">Activer mon compte</a></p>
        <p>Ce lien expire le ${expiresAt.toLocaleDateString("fr-FR")}.</p>
      `,
    });

    return NextResponse.json({ inviteUrl, expiresAt: invitation.expiresAt, emailSent: sent }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
