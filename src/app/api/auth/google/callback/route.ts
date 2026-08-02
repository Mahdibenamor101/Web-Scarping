import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { completeOAuthSignIn, googleExchangeCode, isGoogleConfigured } from "@/lib/oauth";
import { requireRateLimit } from "@/lib/api";
import { getClientIp } from "@/lib/rate-limit";

const STATE_COOKIE = "oauth_state";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const from = state?.split(".")[1] === "signup" ? "signup" : "login";
  const expectedState = cookies().get(STATE_COOKIE)?.value;
  cookies().set(STATE_COOKIE, "", { path: "/", maxAge: 0 });

  try {
    requireRateLimit(`oauth:ip:${getClientIp(req)}`, { limit: 20, windowMs: 15 * 60 * 1000 });

    if (!isGoogleConfigured() || !code || !state || state !== expectedState) {
      throw new Error("invalid_oauth_callback");
    }

    const profile = await googleExchangeCode(code, url.origin);
    await completeOAuthSignIn("GOOGLE", profile);

    return NextResponse.redirect(new URL("/dashboard", req.url));
  } catch (error) {
    console.error("[oauth:google]", error);
    return NextResponse.redirect(new URL(`/${from}?oauth_error=google_failed`, req.url));
  }
}
