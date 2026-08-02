// Push delivery via Expo's push service -- a single HTTP endpoint that
// fans out to real APNs/FCM using Expo's own credentials, so this app
// never has to hold Apple/Google push keys itself. Needs no API key of
// its own for the HTTP call; what it DOES need to actually reach a real
// device is the mobile app built with a real Expo project id and (for a
// production/standalone build, not Expo Go) EAS push credentials
// configured -- none of that exists in this environment, so this is
// "wired but never exercised against a real device," the same honesty
// pattern as Stripe/email/S3/OAuth/DeepL/OpenAI elsewhere in this
// codebase. See CONTEXT.md.
const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
const CHUNK_SIZE = 100; // Expo's documented per-request limit.

type PushMessage = {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
};

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

/**
 * Best-effort, non-blocking: a push failure never breaks the request that
 * triggered it (a new order/staff call being created). Callers should
 * await this only to log completion, never let it gate the response --
 * see the try/catch wrapping every call site.
 */
export async function sendPushNotifications(
  tokens: string[],
  notification: { title: string; body: string; data?: Record<string, unknown> },
): Promise<void> {
  const uniqueTokens = [...new Set(tokens)].filter((t) => t.startsWith("ExponentPushToken"));
  if (uniqueTokens.length === 0) return;

  const messages: PushMessage[] = uniqueTokens.map((to) => ({ to, ...notification }));

  for (const batch of chunk(messages, CHUNK_SIZE)) {
    try {
      const res = await fetch(EXPO_PUSH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(batch),
      });
      if (!res.ok) {
        console.error(`[push] Expo push service returned ${res.status}: ${await res.text()}`);
      }
    } catch (err) {
      console.error("[push] send failed", err);
    }
  }
}
