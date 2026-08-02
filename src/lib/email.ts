// Real email delivery, optional. Same "unset env = graceful degrade"
// pattern as Stripe (src/app/api/billing/*): if RESEND_API_KEY isn't set,
// sendEmail() logs and returns { sent: false } instead of throwing, so
// `npm run setup` and every invite flow keep working fully without a real
// account -- see CONTEXT.md §13, "pas d'envoi d'email réel" was the first
// real gap this closes, but only when someone actually configures it.
//
// Plain fetch against Resend's HTTP API rather than their SDK: one HTTP
// call, no extra dependency to install for something that's off by
// default in every environment that doesn't set the key.
const RESEND_API_URL = "https://api.resend.com/emails";

export type SendEmailResult = { sent: boolean };

export async function sendEmail(opts: { to: string; subject: string; html: string }): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    console.info(`[email] not configured (RESEND_API_KEY/EMAIL_FROM unset) -- would have sent to ${opts.to}: ${opts.subject}`);
    return { sent: false };
  }

  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: opts.to, subject: opts.subject, html: opts.html }),
    });
    if (!res.ok) {
      console.error(`[email] send failed (${res.status}): ${await res.text()}`);
      return { sent: false };
    }
    return { sent: true };
  } catch (err) {
    console.error("[email] send failed", err);
    return { sent: false };
  }
}
