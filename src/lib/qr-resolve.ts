import type { OrderingMode } from "@prisma/client";
import { prisma } from "./db";
import { ApiError } from "./api";

type ResolvedTable = {
  tableId: string;
  organizationId: string;
  tableLabel: string;
  organizationName: string;
  defaultLanguage: string;
  logoUrl: string | null;
  backgroundUrl: string | null;
  orderingMode: OrderingMode;
};

type ResolveRow = {
  table_id: string;
  organization_id: string;
  table_label: string;
  organization_name: string;
  default_language: string;
  logo_url: string | null;
  background_url: string | null;
  ordering_mode: OrderingMode;
};

/**
 * The only cross-tenant lookup the public ordering flow needs: turning a
 * QR code's token into an organization + table. See
 * prisma/migrations/*_public_ordering -- everything downstream of this call
 * (reading the menu, inserting the order) goes through withTenant() like
 * any other RLS-scoped operation. Also hands back logo/background URLs
 * (prisma/migrations/*_organization_branding) since the public menu page
 * has no session and needs them for white-label rendering.
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
    logoUrl: row.logo_url,
    backgroundUrl: row.background_url,
    orderingMode: row.ordering_mode,
  };
}
