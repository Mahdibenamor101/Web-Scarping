import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import type { StaffRole } from "@prisma/client";

const COOKIE_NAME = "session";
const ALG = "HS256";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export type SessionPayload = {
  userId: string;
  organizationId: string;
  role: StaffRole;
  email: string;
  name: string;
};

function secretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be set to a random string of at least 32 characters");
  }
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (
      typeof payload.userId !== "string" ||
      typeof payload.organizationId !== "string" ||
      typeof payload.role !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string"
    ) {
      return null;
    }
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Server Component / Route Handler helper: reads + verifies the session,
 * from either source a caller might use. Browsers (the web dashboard) send
 * the httpOnly cookie automatically; the mobile app (no cookie jar wired
 * to its fetch client) sends `Authorization: Bearer <token>` instead --
 * same JWT, same verifySessionToken(), just a different envelope. Checking
 * the header here rather than threading a request object through means
 * every existing requireSession()-gated route (there are dozens) works
 * for both clients with zero per-route changes. `headers()` from
 * next/headers reads the current request's headers the same
 * request-scoped way `cookies()` already does, so no signature change
 * was needed to add this.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const authHeader = headers().get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return verifySessionToken(authHeader.slice("Bearer ".length));
  }
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function setSessionCookie(payload: SessionPayload) {
  const token = await signSessionToken(payload);
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie() {
  cookies().set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
