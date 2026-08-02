import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { getRequestOrigin } from "@/lib/rate-limit";

// Public: the link is opened from an email client, which never carries
// this app's session cookie. verify_email_token() (growth_features
// migration) is a SECURITY DEFINER function for exactly that reason --
// same pre-tenant-context shape as accept_invitation.
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  const origin = getRequestOrigin(req);
  if (!token) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  try {
    const [result] = await prisma.$queryRaw<{ user_id: string; organization_id: string }[]>`
      SELECT * FROM verify_email_token(${token})
    `;
    if (!result) throw new Error("verification_failed");

    // If the browser opening the link is already signed in as that same
    // user, send them straight back into the dashboard; otherwise (the
    // common case -- clicked from a mail app) land on /login.
    const session = await getSession();
    const destination = session?.userId === result.user_id ? "/dashboard" : "/login";
    return NextResponse.redirect(new URL(`${destination}?email_verified=1`, origin));
  } catch {
    return NextResponse.redirect(new URL("/login?email_verified=0", origin));
  }
}
