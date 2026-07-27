import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session";
import { ROLE_HOME, STAFF_MANAGEMENT_ROLES, MENU_MANAGEMENT_ROLES, TABLE_MANAGEMENT_ROLES } from "@/lib/rbac";

// Defense in depth: this only decides which *page* a role can land on.
// The real, unbypassable boundary is Row-Level Security in Postgres (see
// prisma/migrations/*_row_level_security) plus the requireRole() checks in
// each API route. A bug here would misroute a request, not leak data.
const ROLE_ONLY_PREFIXES: { prefix: string; roles: string[] }[] = [
  { prefix: "/dashboard/staff", roles: STAFF_MANAGEMENT_ROLES },
  { prefix: "/dashboard/menu", roles: MENU_MANAGEMENT_ROLES },
  { prefix: "/dashboard/tables", roles: TABLE_MANAGEMENT_ROLES },
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const restriction = ROLE_ONLY_PREFIXES.find((r) => pathname.startsWith(r.prefix));
  if (restriction && !restriction.roles.includes(session.role)) {
    return NextResponse.redirect(new URL(ROLE_HOME[session.role], req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
