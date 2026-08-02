import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { googleAuthorizeUrl, isGoogleConfigured } from "@/lib/oauth";
import { getRequestOrigin } from "@/lib/rate-limit";

const STATE_COOKIE = "oauth_state";

// GET so it can be a plain <a href> button, no client-side JS required.
// `from=login|signup` round-trips through `state` so the callback sends
// an unconfigured/failed attempt back to the page the user started from.
export async function GET(req: Request) {
  const from = new URL(req.url).searchParams.get("from") === "signup" ? "signup" : "login";

  const origin = getRequestOrigin(req);

  if (!isGoogleConfigured()) {
    return NextResponse.redirect(new URL(`/${from}?oauth_error=google_not_configured`, origin));
  }

  const state = `${crypto.randomBytes(24).toString("base64url")}.${from}`;
  cookies().set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 5 * 60,
  });

  return NextResponse.redirect(googleAuthorizeUrl(state, origin));
}
