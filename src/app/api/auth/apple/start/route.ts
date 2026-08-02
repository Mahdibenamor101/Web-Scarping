import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { appleAuthorizeUrl, isAppleConfigured } from "@/lib/oauth";
import { getRequestOrigin } from "@/lib/rate-limit";

const STATE_COOKIE = "oauth_state";

export async function GET(req: Request) {
  const from = new URL(req.url).searchParams.get("from") === "signup" ? "signup" : "login";

  const origin = getRequestOrigin(req);

  if (!isAppleConfigured()) {
    return NextResponse.redirect(new URL(`/${from}?oauth_error=apple_not_configured`, origin));
  }

  const state = `${crypto.randomBytes(24).toString("base64url")}.${from}`;
  cookies().set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 5 * 60,
  });

  return NextResponse.redirect(appleAuthorizeUrl(state, origin));
}
