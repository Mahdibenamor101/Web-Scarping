import crypto from "node:crypto";
import type { Prisma } from "@prisma/client";
import { sendEmail } from "./email";
import { wrapEmailHtml } from "./email-template";

const VERIFICATION_TTL_HOURS = 24;

/**
 * Creates a fresh single-use token and emails it, inside the caller's own
 * withTenant() transaction (the organization already exists by the time
 * this runs, so there's nothing pre-tenant about it -- unlike login/signup
 * itself, this needs no SECURITY DEFINER escape hatch). Deletes any
 * existing tokens for this user first so an old link can't be replayed
 * after a "resend" -- only the newest one is ever valid.
 */
export async function sendVerificationEmail(
  tx: Prisma.TransactionClient,
  opts: { organizationId: string; userId: string; email: string; origin: string },
): Promise<{ sent: boolean }> {
  await tx.emailVerificationToken.deleteMany({ where: { userId: opts.userId } });

  const token = crypto.randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + VERIFICATION_TTL_HOURS * 60 * 60 * 1000);

  await tx.emailVerificationToken.create({
    data: { organizationId: opts.organizationId, userId: opts.userId, token, expiresAt },
  });

  const verifyUrl = `${opts.origin}/api/auth/verify-email?token=${token}`;
  console.info(`[email-verification] ${opts.email} -> ${verifyUrl}`);

  return sendEmail({
    to: opts.email,
    subject: "Confirmez votre adresse email — Tavolino",
    html: wrapEmailHtml(`
      <p>Bienvenue sur Tavolino ! Confirmez votre adresse email pour activer pleinement votre compte.</p>
      <p><a href="${verifyUrl}">Confirmer mon email</a></p>
      <p>Ce lien expire dans ${VERIFICATION_TTL_HOURS}h. Si vous n'êtes pas à l'origine de cette création de compte, ignorez cet email.</p>
    `),
  });
}
