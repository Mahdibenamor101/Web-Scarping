import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma, type StaffRole } from "@prisma/client";
import { getSession, type SessionPayload } from "./session";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
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
    return NextResponse.json({ error: error.message }, { status: error.status });
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
