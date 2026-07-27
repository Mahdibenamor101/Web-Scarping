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
  // Raw SQL errors from the SECURITY DEFINER functions (create_organization_and_owner,
  // accept_invitation, ...) surface as the plain Postgres error message, not
  // through Prisma's own error codes below -- $queryRaw doesn't translate them.
  if (error instanceof Error && /duplicate key value violates unique constraint/.test(error.message)) {
    return NextResponse.json({ error: "already_exists" }, { status: 409 });
  }
  if (error instanceof Error && /invitation_invalid_or_expired/.test(error.message)) {
    return NextResponse.json({ error: "invitation_invalid_or_expired" }, { status: 410 });
  }
  // Same two constraint violations, but raised by an ordinary Prisma Client
  // call (e.g. tx.restaurantTable.create / .delete) -- Prisma translates
  // these into its own error codes instead of the raw Postgres message.
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "already_exists" }, { status: 409 });
    }
    if (error.code === "P2003") {
      return NextResponse.json({ error: "referenced_by_other_records" }, { status: 409 });
    }
  }
  console.error(error);
  return NextResponse.json({ error: "internal_error" }, { status: 500 });
}
