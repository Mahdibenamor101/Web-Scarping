import { Prisma, PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Reused across hot reloads in dev so we don't open a new pool per edit.
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * Every read/write that touches a tenant-scoped table must go through this.
 * It opens a transaction and sets the `app.current_org_id` session variable
 * (via `set_config(..., is_local = true)`) before running `fn`, which is what
 * every Row-Level Security policy in the database checks against -- see
 * prisma/migrations/*_row_level_security. Because it's `SET LOCAL` (not a
 * plain `SET`), the value is scoped to this one transaction and can't leak
 * onto a different request that later reuses the same pooled connection.
 *
 * Prisma Client connects to Postgres as `app_user`, a role with no table
 * ownership and NOBYPASSRLS, so skipping this helper doesn't just risk a
 * bug -- the database itself will refuse to return or accept rows for a
 * transaction that never set an organization context.
 */
export async function withTenant<T>(
  organizationId: string,
  fn: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.current_org_id', ${organizationId}, true)`;
    return fn(tx);
  });
}
