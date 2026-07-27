import { NextResponse } from "next/server";
import { ZodError } from "zod";
import type { StaffRole } from "@prisma/client";
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
  // Postgres unique_violation, whether raised by a plain insert or one of
  // the SECURITY DEFINER functions (e.g. duplicate org slug or email).
  if (error instanceof Error && /duplicate key value violates unique constraint/.test(error.message)) {
    return NextResponse.json({ error: "already_exists" }, { status: 409 });
  }
  if (error instanceof Error && /invitation_invalid_or_expired/.test(error.message)) {
    return NextResponse.json({ error: "invitation_invalid_or_expired" }, { status: 410 });
  }
  console.error(error);
  return NextResponse.json({ error: "internal_error" }, { status: 500 });
}
