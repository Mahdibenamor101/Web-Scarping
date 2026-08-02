import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma, type StaffRole } from "@prisma/client";
import { getSession, type SessionPayload } from "./session";
import { rateLimit } from "./rate-limit";

export class ApiError extends Error {
  status: number;
  headers?: Record<string, string>;
  constructor(status: number, message: string, headers?: Record<string, string>) {
    super(message);
    this.status = status;
    this.headers = headers;
  }
}

/**
 * Throws a 429 (with a Retry-After header) once `key` has been called
 * `limit` times within `windowMs`. See src/lib/rate-limit.ts for the
 * mechanism and its single-process caveat.
 */
export function requireRateLimit(key: string, opts: { limit: number; windowMs: number }) {
  const result = rateLimit(key, opts);
  if (!result.allowed) {
    throw new ApiError(429, "rate_limited", { "Retry-After": String(result.retryAfterSeconds) });
  }
}

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new ApiError(401, "not_authenticated");
  return session;
}

export function requireRole(session: SessionPayload, allowed: StaffRole[]) {
  if (!allowed.includes(session.role)) {
    throw new ApiError(403, "forbidden");
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status, headers: error.headers });
  }
  if (error instanceof ZodError) {
    return NextResponse.json({ error: "invalid_input", issues: error.issues }, { status: 400 });
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Ordinary Prisma Client calls (e.g. tx.restaurantTable.create / .delete)
    // translate constraint violations into their own error codes.
    if (error.code === "P2002") {
      return NextResponse.json({ error: "already_exists" }, { status: 409 });
    }
    if (error.code === "P2003") {
      return NextResponse.json({ error: "referenced_by_other_records" }, { status: 409 });
    }
    // Raw SQL calls into the SECURITY DEFINER functions (create_organization_and_owner,
    // accept_invitation, ...) never get a P2002/P2003 -- $queryRaw/$executeRaw always
    // wrap the underlying Postgres error as P2010, with the real SQLSTATE and message
    // in `meta`, not in `error.message` itself (which is just "Raw query failed...").
    if (error.code === "P2010") {
      const meta = error.meta as { code?: string; message?: string } | undefined;
      if (meta?.code === "23505") {
        return NextResponse.json({ error: "already_exists" }, { status: 409 });
      }
      if (meta?.code === "23503") {
        return NextResponse.json({ error: "referenced_by_other_records" }, { status: 409 });
      }
      // Custom RAISE EXCEPTION 'invitation_invalid_or_expired' from accept_invitation /
      // invitation_lookup_by_token -- Postgres passes the raw message through in meta.
      if (meta?.message && /invitation_invalid_or_expired/.test(meta.message)) {
        return NextResponse.json({ error: "invitation_invalid_or_expired" }, { status: 410 });
      }
    }
  }
  console.error(error);
  return NextResponse.json({ error: "internal_error" }, { status: 500 });
}
