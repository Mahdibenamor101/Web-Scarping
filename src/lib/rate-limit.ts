type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Piggybacks a periodic sweep on normal calls instead of running a
// dedicated timer, so idle buckets from one-off visitors don't grow the
// map forever.
let lastCleanup = Date.now();
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

function cleanup(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult = { allowed: true } | { allowed: false; retryAfterSeconds: number };

/**
 * Fixed-window rate limiter, in-process memory only. This makes the same
 * assumption src/lib/realtime.ts already makes explicit: `next dev` /
 * `next start` are one long-lived Node process. A multi-instance
 * deployment would need a shared store (Redis) instead -- each instance
 * would otherwise enforce its own separate limit, effectively multiplying
 * the real ceiling by the instance count. See CONTEXT.md §13.
 */
export function rateLimit(key: string, { limit, windowMs }: { limit: number; windowMs: number }): RateLimitResult {
  const now = Date.now();
  cleanup(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
  }

  bucket.count += 1;
  return { allowed: true };
}

/**
 * Best-effort client IP from proxy headers. Trustworthy behind a real
 * reverse proxy (Vercel, nginx, etc. -- whatever sets these headers
 * itself, stripping any client-supplied copy first); in local dev without
 * a proxy in front, this falls back to a single shared "unknown" bucket,
 * which is fine for testing the mechanism but not a real per-visitor limit.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

/**
 * Best-effort public origin for building absolute URLs (OAuth redirect_uri,
 * Stripe success/cancel URLs, invite/verification email links). Same
 * "trust the proxy's own headers" reasoning as getClientIp above --
 * `req.url`/`req.nextUrl.origin` reflect the raw incoming request, which
 * behind a reverse proxy that terminates TLS and forwards to a plain-HTTP
 * container (Railway, Fly, most self-hosted setups) can be the container's
 * own internal bind address rather than the public domain. `x-forwarded-*`
 * is what the proxy itself sets on the way in, so it's what a self-hosted
 * Next.js app has to trust instead.
 */
export function getRequestOrigin(req: Request): string {
  const forwardedProto = req.headers.get("x-forwarded-proto") ?? "https";
  const forwardedHost = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (forwardedHost) return `${forwardedProto}://${forwardedHost}`;
  return new URL(req.url).origin;
}
