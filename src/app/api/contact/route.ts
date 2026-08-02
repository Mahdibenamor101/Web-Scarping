import { NextRequest, NextResponse } from "next/server";
import { contactMessageSchema } from "@/lib/validation";
import { handleApiError, requireRateLimit } from "@/lib/api";
import { getClientIp } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";

// Public, no session: a prospective restaurant owner filling out /contatti
// has no account yet. Destination is CONTACT_EMAIL if set, falling back to
// EMAIL_FROM's own inbox -- sendEmail() itself already no-ops cleanly when
// neither RESEND_API_KEY nor EMAIL_FROM is configured (see src/lib/email.ts),
// same graceful-degrade family as every other optional integration in this
// app. Always answers 201 regardless of actual delivery: whether the email
// left the building is an infra detail for us to check in logs, not
// something to expose to a visitor filling out a contact form.
export async function POST(req: NextRequest) {
  try {
    requireRateLimit(`contact:ip:${getClientIp(req)}`, { limit: 5, windowMs: 60 * 60 * 1000 });

    const body = contactMessageSchema.parse(await req.json());
    const destination = process.env.CONTACT_EMAIL || process.env.EMAIL_FROM;

    if (destination) {
      await sendEmail({
        to: destination,
        subject: `Nuovo messaggio da ${body.name}${body.restaurantName ? ` (${body.restaurantName})` : ""}`,
        html: `
          <p><strong>Nome:</strong> ${body.name}</p>
          <p><strong>Email:</strong> ${body.email}</p>
          ${body.restaurantName ? `<p><strong>Locale:</strong> ${body.restaurantName}</p>` : ""}
          <p><strong>Messaggio:</strong></p>
          <p>${body.message.replace(/\n/g, "<br>")}</p>
        `,
      });
    } else {
      console.info(`[contact] no destination configured -- message from ${body.email} logged only`, body);
    }

    return NextResponse.json({ received: true }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
