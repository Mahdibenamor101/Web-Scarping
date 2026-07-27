// Creates one demo organization with an owner, a manager, a server and a
// kitchen account so a fresh `npm run setup` has something to log into.
// Deliberately goes through the same `create_organization_and_owner` +
// `accept_invitation`-shaped inserts the app itself uses (scoped by
// `withTenant`), rather than writing rows directly, so seeding can never
// drift from what Row-Level Security actually allows.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function withTenant<T>(organizationId: string, fn: (tx: PrismaClient) => Promise<T>): Promise<T> {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.current_org_id', ${organizationId}, true)`;
    return fn(tx as unknown as PrismaClient);
  });
}

async function main() {
  const existing = await prisma.organization.findUnique({ where: { slug: "trattoria-demo" } }).catch(() => null);
  if (existing) {
    console.log("Seed org already exists (trattoria-demo), skipping.");
    return;
  }

  const passwordHash = await bcrypt.hash("password123", 12);

  const [result] = await prisma.$queryRaw<{ organization_id: string; user_id: string }[]>`
    SELECT * FROM create_organization_and_owner(
      'Trattoria Demo', 'trattoria-demo', 'Mario Rossi', 'owner@demo.local', ${passwordHash},
      ${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)}
    )
  `;
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
