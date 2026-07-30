import { SignJWT, importPKCS8, createRemoteJWKSet, jwtVerify } from "jose";
import type { StaffRole } from "@prisma/client";
import { prisma } from "./db";
import { setSessionCookie } from "./session";
import { uniqueSlug } from "./slug";

// Google + Apple sign-in, same "unset env = graceful degrade" pattern as
// Stripe/email/S3 (src/lib/stripe.ts, email.ts, storage.ts): the routes
// under /api/auth/google and /api/auth/apple check isGoogleConfigured()/
// isAppleConfigured() before redirecting anywhere, and the login/signup
// pages show the buttons regardless (consistent with how the billing page
// always shows its button and explains itself if Stripe isn't configured)
// -- clicking one without real credentials here lands back on the page
// with a clear "indisponible sur cet environnement" message, never a
// crash. Neither provider has been exercised against a real app
// registration in this environment; see CONTEXT.md.

export type OAuthProfile = { providerAccountId: string; email: string; name: string };

export function isGoogleConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function isAppleConfigured(): boolean {
  return Boolean(
    process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID && process.env.APPLE_KEY_ID && process.env.APPLE_PRIVATE_KEY,
  );
}

// --- Google -----------------------------------------------------------

export function googleAuthorizeUrl(state: string, origin: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${origin}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "online",
    prompt: "select_account",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function googleExchangeCode(code: string, origin: string): Promise<OAuthProfile> {
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      code,
      grant_type: "authorization_code",
      redirect_uri: `${origin}/api/auth/google/callback`,
    }),
  });
  if (!tokenRes.ok) throw new Error(`google_token_exchange_failed: ${await tokenRes.text()}`);
  const tokenBody = (await tokenRes.json()) as { access_token: string };

  const userRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${tokenBody.access_token}` },
  });
  if (!userRes.ok) throw new Error("google_userinfo_failed");
  const profile = (await userRes.json()) as { sub: string; email: string; name?: string };

  return {
    providerAccountId: profile.sub,
    email: profile.email,
    name: profile.name ?? profile.email.split("@")[0] ?? profile.email,
  };
}

// --- Apple --------------------------------------------------------------
//
// Sign in with Apple always posts its callback (response_mode=form_post),
// includes the user's name only on the very first authorization ever
// (as a JSON `user` form field, never again after that), and requires the
// client "secret" to be a short-lived ES256 JWT signed with a private key
// downloaded once from the Apple Developer portal -- not a static string
// like Google's.

export function appleAuthorizeUrl(state: string, origin: string): string {
  const params = new URLSearchParams({
    client_id: process.env.APPLE_CLIENT_ID!,
    redirect_uri: `${origin}/api/auth/apple/callback`,
    response_type: "code",
    scope: "name email",
    state,
    response_mode: "form_post",
  });
  return `https://appleid.apple.com/auth/authorize?${params.toString()}`;
}

async function appleClientSecret(): Promise<string> {
  const privateKeyPem = process.env.APPLE_PRIVATE_KEY!.replace(/\\n/g, "\n");
  const key = await importPKCS8(privateKeyPem, "ES256");
  return new SignJWT({})
    .setProtectedHeader({ alg: "ES256", kid: process.env.APPLE_KEY_ID! })
    .setIssuer(process.env.APPLE_TEAM_ID!)
    .setIssuedAt()
    .setExpirationTime("5m")
    .setAudience("https://appleid.apple.com")
    .setSubject(process.env.APPLE_CLIENT_ID!)
    .sign(key);
}

const appleJwks = createRemoteJWKSet(new URL("https://appleid.apple.com/auth/keys"));

/** `formUserField` is Apple's one-time-only `user` POST field (JSON string), when present. */
export async function appleExchangeCode(code: string, origin: string, formUserField?: string): Promise<OAuthProfile> {
  const clientSecret = await appleClientSecret();
  const tokenRes = await fetch("https://appleid.apple.com/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.APPLE_CLIENT_ID!,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: `${origin}/api/auth/apple/callback`,
    }),
  });
  if (!tokenRes.ok) throw new Error(`apple_token_exchange_failed: ${await tokenRes.text()}`);
  const tokenBody = (await tokenRes.json()) as { id_token: string };

  const { payload } = await jwtVerify(tokenBody.id_token, appleJwks, {
    issuer: "https://appleid.apple.com",
    audience: process.env.APPLE_CLIENT_ID!,
  });

  const email = payload.email as string;
  let name = email.split("@")[0] ?? email;
  if (formUserField) {
    try {
      const parsed = JSON.parse(formUserField) as { name?: { firstName?: string; lastName?: string } };
      if (parsed.name?.firstName) name = [parsed.name.firstName, parsed.name.lastName].filter(Boolean).join(" ");
    } catch {
      // Malformed/absent -- fall back to the email-derived name above.
    }
  }

  return { providerAccountId: payload.sub as string, email, name };
}

const TRIAL_DAYS = 14;

type OAuthAuthenticateRow = {
  user_id: string;
  organization_id: string;
  role: StaffRole;
  name: string;
  is_new_user: boolean;
};

/**
 * Shared tail end of both provider callbacks: looks up/links/creates the
 * user via oauth_authenticate() (see the growth_features migration) and
 * sets the session cookie. A brand-new sign-in gets a placeholder
 * organization name -- OAuth never collects a restaurant name -- there's
 * no dashboard field to rename it yet either; see CONTEXT.md.
 */
export async function completeOAuthSignIn(
  provider: "GOOGLE" | "APPLE",
  profile: OAuthProfile,
): Promise<{ isNewUser: boolean }> {
  const orgName = `Restaurant de ${profile.name}`;
  const trialEndsAt = new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000);

  const [result] = await prisma.$queryRaw<OAuthAuthenticateRow[]>`
    SELECT * FROM oauth_authenticate(
      ${provider}::oauth_provider,
      ${profile.providerAccountId},
      ${profile.email},
      ${profile.name},
      ${orgName},
      ${uniqueSlug(orgName)},
      ${trialEndsAt}
    )
  `;

  if (!result) throw new Error("oauth_authenticate_failed");

  await setSessionCookie({
    userId: result.user_id,
    organizationId: result.organization_id,
    role: result.role,
    email: profile.email,
    name: result.name,
  });

  return { isNewUser: result.is_new_user };
}
