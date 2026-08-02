import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { appleExchangeCode, completeOAuthSignIn, isAppleConfigured } from "@/lib/oauth";
import { requireRateLimit } from "@/lib/api";
import { getClientIp, getRequestOrigin } from "@/lib/rate-limit";

const STATE_COOKIE = "oauth_state";

// Apple always calls back with response_mode=form_post -- a real
// cross-site POST from appleid.apple.com, not a redirect the browser
// issues itself, hence GET is never used here.
export async function POST(req: Request) {
  const form = await req.formData();
  const code = form.get("code")?.toString();
  const state = form.get("state")?.toString();
  const userField = form.get("user")?.toString();
  const from = state?.split(".")[1] === "signup" ? "signup" : "login";
  const expectedState = cookies().get(STATE_COOKIE)?.value;
  cookies().set(STATE_COOKIE, "", { path: "/", maxAge: 0 });
  const origin = getRequestOrigin(req);

  try {
    requireRateLimit(`oauth:ip:${getClientIp(req)}`, { limit: 20, windowMs: 15 * 60 * 1000 });

    if (!isAppleConfigured() || !code || !state || state !== expectedState) {
      throw new Error("invalid_oauth_callback");
    }

    const profile = await appleExchangeCode(code, origin, userField);
    await completeOAuthSignIn("APPLE", profile);

    return NextResponse.redirect(new URL("/dashboard", origin));
  } catch (error) {
    console.error("[oauth:apple]", error);
    return NextResponse.redirect(new URL(`/${from}?oauth_error=apple_failed`, origin));
  }
}
