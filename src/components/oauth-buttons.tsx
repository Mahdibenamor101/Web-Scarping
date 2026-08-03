"use client";

import { AUTH_DICT } from "@/lib/i18n/dictionaries/auth";
import type { LanguageCode } from "@/lib/i18n/languages";

// Google/Apple sign-in entry points, shown on both /login and /signup --
// plain <a> links to the GET /api/auth/{provider}/start routes (no client
// JS needed for the redirect itself), matching each brand's real logo
// mark rather than a generic icon. Buttons always render, same as the
// billing "Gérer la facturation" button always rendering regardless of
// whether Stripe is configured (src/app/dashboard/billing/page.tsx) --
// clicking one when the provider isn't configured here just bounces back
// with the error message below instead of hiding the option entirely.
export default function OAuthButtons({
  from,
  error,
  locale = "fr",
}: {
  from: "login" | "signup";
  error?: string | null;
  locale?: LanguageCode;
}) {
  const t = AUTH_DICT[locale].oauth;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2.5">
        <a href={`/api/auth/google/start?from=${from}`} className="oauth-btn">
          <GoogleIcon />
          {t.google}
        </a>
        <a href={`/api/auth/apple/start?from=${from}`} className="oauth-btn oauth-btn-apple">
          <AppleIcon />
          {t.apple}
        </a>
      </div>
      {error && <p className="text-center text-xs text-danger">{oauthErrorMessage(error, locale)}</p>}
      <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-muted">
        <span className="h-px flex-1 bg-ink/10" />
        {t.or}
        <span className="h-px flex-1 bg-ink/10" />
      </div>
    </div>
  );
}

function oauthErrorMessage(code: string, locale: LanguageCode): string {
  const t = AUTH_DICT[locale].oauth;
  if (code === "google_not_configured" || code === "apple_not_configured") {
    return t.notConfigured;
  }
  return t.failed;
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.87-3.04.87-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
      />
      <path fill="#FBBC05" d="M3.97 10.73a5.4 5.4 0 0 1 0-3.46V4.94H.96a9 9 0 0 0 0 8.12l3.01-2.33Z" />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.94l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M13.15 9.55c-.02-2.13 1.74-3.15 1.82-3.2-.99-1.45-2.53-1.65-3.08-1.67-1.31-.13-2.56.77-3.23.77-.67 0-1.7-.75-2.8-.73-1.44.02-2.77.84-3.51 2.13-1.5 2.6-.38 6.44 1.08 8.55.71 1.03 1.56 2.18 2.68 2.14 1.08-.04 1.48-.7 2.78-.7 1.3 0 1.66.7 2.79.68 1.15-.02 1.88-1.05 2.58-2.09.82-1.2 1.15-2.36 1.17-2.42-.03-.01-2.24-.86-2.26-3.4l-.02-.06Z"
      />
      <path
        fill="currentColor"
        d="M11.1 3.15c.59-.71.99-1.7.88-2.68-.85.03-1.88.57-2.49 1.27-.55.63-1.03 1.63-.9 2.6.95.07 1.92-.48 2.5-1.19Z"
      />
    </svg>
  );
}
