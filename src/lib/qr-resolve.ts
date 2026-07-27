import { prisma } from "./db";
import { ApiError } from "./api";

type ResolvedTable = {
  tableId: string;
  organizationId: string;
  tableLabel: string;
  organizationName: string;
  defaultLanguage: string;
};

type ResolveRow = {
  table_id: string;
  organization_id: string;
  table_label: string;
  organization_name: string;
  default_language: string;
};

/**
 * The only cross-tenant lookup the public ordering flow needs: turning a
 * QR code's token into an organization + table. See
 * prisma/migrations/*_public_ordering -- everything downstream of this call
 * (reading the menu, inserting the order) goes through withTenant() like
 * any other RLS-scoped operation.
 */
export async function resolveTableByQrToken(qrToken: string): Promise<ResolvedTable> {
  const [row] = await prisma.$queryRaw<ResolveRow[]>`
    SELECT * FROM resolve_table_by_qr_token(${qrToken})
  `;
  if (!row) throw new ApiError(404, "table_not_found");
  return {
    tableId: row.table_id,
    organizationId: row.organization_id,
    tableLabel: row.table_label,
    organizationName: row.organization_name,
    defaultLanguage: row.default_language,
  };
}
