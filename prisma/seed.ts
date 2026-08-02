// Creates one demo organization with an owner, a manager, a server and a
// kitchen account so a fresh `npm run setup` has something to log into.
// Deliberately goes through the same `create_organization_and_owner` +
// `accept_invitation`-shaped inserts the app itself uses (scoped by
// `withTenant`), rather than writing rows directly, so seeding can never
// drift from what Row-Level Security actually allows.
import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function withTenant<T>(organizationId: string, fn: (tx: PrismaClient) => Promise<T>): Promise<T> {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.current_org_id', ${organizationId}, true)`;
    return fn(tx as unknown as PrismaClient);
  });
}

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);

  // No tenant context is set yet at this point, so a plain `findUnique` on
  // organizations would run under Row-Level Security with no
  // `app.current_org_id` -- the policy filters that down to zero rows
  // every time, "existing" or not, making a pre-check unreliable. Instead,
  // just attempt the insert and treat a unique-violation on the slug as
  // "already seeded" -- makes re-running `npm run setup` idempotent.
  let result: { organization_id: string; user_id: string } | undefined;
  try {
    [result] = await prisma.$queryRaw<{ organization_id: string; user_id: string }[]>`
      SELECT * FROM create_organization_and_owner(
        'Trattoria Demo', 'trattoria-demo', 'Mario Rossi', 'owner@demo.local', ${passwordHash},
        ${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)}
      )
    `;
  } catch (err) {
    const meta = err instanceof Prisma.PrismaClientKnownRequestError ? (err.meta as { code?: string } | undefined) : undefined;
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2010" && meta?.code === "23505") {
      console.log("Seed org already exists (trattoria-demo), skipping.");
      return;
    }
    throw err;
  }
  if (!result) throw new Error("seed_failed");
  const orgId = result.organization_id;

  await withTenant(orgId, (tx) =>
    tx.user.createMany({
      data: [
        { organizationId: orgId, name: "Giulia Bianchi", email: "manager@demo.local", passwordHash, role: "MANAGER" },
        { organizationId: orgId, name: "Luca Ferrari", email: "server@demo.local", passwordHash, role: "SERVER" },
        { organizationId: orgId, name: "Ana Popescu", email: "kitchen@demo.local", passwordHash, role: "KITCHEN" },
      ],
    }),
  );

  console.log("Seeded 'Trattoria Demo'. Demo logins (password: password123):");
  console.log("  owner@demo.local   (OWNER)");
  console.log("  manager@demo.local (MANAGER)");
  console.log("  server@demo.local  (SERVER)");
  console.log("  kitchen@demo.local (KITCHEN)");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
