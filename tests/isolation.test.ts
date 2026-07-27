import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma, withTenant } from "../src/lib/db";

// Proves the multi-tenant guarantee at the level that actually matters: the
// database. Every assertion here uses the same `app_user` connection and
// the same `withTenant` helper the running app uses -- if any of these
// failed, real HTTP requests would leak data between restaurants regardless
// of what the API route code happens to remember to filter on.

type OrgAndOwner = { organizationId: string; userId: string };

async function createOrgWithOwner(name: string, email: string): Promise<OrgAndOwner> {
  const [row] = await prisma.$queryRaw<{ organization_id: string; user_id: string }[]>`
    SELECT * FROM create_organization_and_owner(
      ${name}, ${`${name}-${Math.random().toString(36).slice(2, 8)}`},
      'Owner', ${email}, 'not-a-real-hash', ${new Date(Date.now() + 86400000)}
    )
  `;
  if (!row) throw new Error("createOrgWithOwner failed");
  return { organizationId: row.organization_id, userId: row.user_id };
}

let orgA: OrgAndOwner;
let orgB: OrgAndOwner;

beforeAll(async () => {
  orgA = await createOrgWithOwner("Isolation Test Org A", `owner-a-${Date.now()}@test.local`);
  orgB = await createOrgWithOwner("Isolation Test Org B", `owner-b-${Date.now()}@test.local`);
});

afterAll(async () => {
  // Deleting each organization from within its own tenant context cascades
  // to everything created under it during the tests.
  await withTenant(orgA.organizationId, (tx) => tx.organization.delete({ where: { id: orgA.organizationId } }));
  await withTenant(orgB.organizationId, (tx) => tx.organization.delete({ where: { id: orgB.organizationId } }));
  await prisma.$disconnect();
});

describe("tenant isolation (Row-Level Security)", () => {
  it("a session with no organization context sees nothing, anywhere", async () => {
    // No withTenant() wrapper here on purpose: this simulates a connection
    // that never set app.current_org_id, which should never happen in the
    // real app but must still fail closed if it ever does.
    const orgs = await prisma.organization.findMany({
      where: { id: { in: [orgA.organizationId, orgB.organizationId] } },
    });
    expect(orgs).toHaveLength(0);
  });

  it("org A's session only ever sees org A's organization row", async () => {
    const orgs = await withTenant(orgA.organizationId, (tx) =>
      tx.organization.findMany({ where: { id: { in: [orgA.organizationId, orgB.organizationId] } } }),
    );
    expect(orgs.map((o) => o.id)).toEqual([orgA.organizationId]);
  });

  it("org A's session cannot read org B's staff, even scoped to org A", async () => {
    const users = await withTenant(orgA.organizationId, (tx) =>
      tx.user.findMany({ where: { id: orgB.userId } }),
    );
    expect(users).toHaveLength(0);
  });

  it("a lookup by ID for another tenant's row returns null, not the row", async () => {
    const category = await withTenant(orgB.organizationId, (tx) =>
      tx.menuCategory.create({ data: { organizationId: orgB.organizationId, nameIt: "Antipasti" } }),
    );

    // Realistic bug scenario: an API route does `findUnique({ where: { id } })`
    // without also filtering by organizationId, while scoped to the WRONG
    // org's session. RLS must still hide the row.
    const fromWrongTenant = await withTenant(orgA.organizationId, (tx) =>
      tx.menuCategory.findUnique({ where: { id: category.id } }),
    );
    expect(fromWrongTenant).toBeNull();
  });

  it("rejects an INSERT into org B while scoped to org A, even with org B's id in the payload", async () => {
    await expect(
      withTenant(orgA.organizationId, (tx) =>
        tx.menuCategory.create({ data: { organizationId: orgB.organizationId, nameIt: "Intrusion" } }),
      ),
    ).rejects.toThrow();
  });

  it("rejects an UPDATE that would move a row into another tenant", async () => {
    const category = await withTenant(orgA.organizationId, (tx) =>
      tx.menuCategory.create({ data: { organizationId: orgA.organizationId, nameIt: "Dolci" } }),
    );

    await expect(
      withTenant(orgA.organizationId, (tx) =>
        tx.menuCategory.update({ where: { id: category.id }, data: { organizationId: orgB.organizationId } }),
      ),
    ).rejects.toThrow();
  });

  it("scoping to org B never returns org A's rows across staff, menu, or org tables", async () => {
    const [orgs, users, categories] = await withTenant(orgB.organizationId, (tx) =>
      Promise.all([
        tx.organization.findMany(),
        tx.user.findMany(),
        tx.menuCategory.findMany(),
      ]),
    );
    expect(orgs.every((o) => o.id === orgB.organizationId)).toBe(true);
    expect(users.every((u) => u.organizationId === orgB.organizationId)).toBe(true);
    expect(categories.every((c) => c.organizationId === orgB.organizationId)).toBe(true);
  });

  it("an order can never point at another organization's table, even naming the row directly", async () => {
    // Composite FK on Order.table (tableId, organizationId) -> (id, organizationId),
    // see prisma/migrations/*_composite_tenant_foreign_keys. This is a plain
    // referential-integrity guarantee, not RLS -- it holds even for a write
    // that (hypothetically) got the right organization_id but the wrong
    // table_id, which RLS's WITH CHECK alone would not have caught.
    const tableB = await withTenant(orgB.organizationId, (tx) =>
      tx.restaurantTable.create({
        data: { organizationId: orgB.organizationId, label: "Table B1", qrToken: `qr-${Date.now()}` },
      }),
    );

    await expect(
      withTenant(orgA.organizationId, (tx) =>
        tx.order.create({
          data: { organizationId: orgA.organizationId, tableId: tableB.id, status: "PENDING", totalAmount: 10 },
        }),
      ),
    ).rejects.toThrow();
  });

  it("resolve_table_by_qr_token only ever resolves to the table's own organization", async () => {
    const qrToken = `qr-resolve-${Date.now()}`;
    const table = await withTenant(orgA.organizationId, (tx) =>
      tx.restaurantTable.create({ data: { organizationId: orgA.organizationId, label: "Resolve Test", qrToken } }),
    );

    const [resolved] = await prisma.$queryRaw<{ organization_id: string; table_id: string }[]>`
      SELECT * FROM resolve_table_by_qr_token(${qrToken})
    `;
    expect(resolved?.organization_id).toBe(orgA.organizationId);
    expect(resolved?.table_id).toBe(table.id);

    const [notFound] = await prisma.$queryRaw<unknown[]>`
      SELECT * FROM resolve_table_by_qr_token(${"no-such-token"})
    `;
    expect(notFound).toBeUndefined();
  });
});
