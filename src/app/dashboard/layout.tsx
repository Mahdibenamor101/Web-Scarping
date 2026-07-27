import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { withTenant } from "@/lib/db";
import { canManageStaff, MENU_MANAGEMENT_ROLES, TABLE_MANAGEMENT_ROLES } from "@/lib/rbac";
import LogoutButton from "./logout-button";
import NavLink from "./nav-link";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const organization = await withTenant(session.organizationId, (tx) =>
    tx.organization.findUnique({ where: { id: session.organizationId }, select: { name: true } }),
  );

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
        <div>
          <p className="text-sm font-semibold">{organization?.name ?? "—"}</p>
          <p className="text-xs text-slate-500">
            {session.name} · {ROLE_LABEL[session.role]}
          </p>
        </div>
        <LogoutButton />
      </header>
      <div className="flex">
        <nav className="flex w-48 shrink-0 flex-col gap-1 border-r border-slate-200 bg-white p-4">
          {canManageStaff(session.role) && <NavLink href="/dashboard/staff">Staff</NavLink>}
          {MENU_MANAGEMENT_ROLES.includes(session.role) && <NavLink href="/dashboard/menu">Menu</NavLink>}
          {TABLE_MANAGEMENT_ROLES.includes(session.role) && <NavLink href="/dashboard/tables">Tables</NavLink>}
          {session.role === "SERVER" && <NavLink href="/dashboard/floor">Salle</NavLink>}
          {session.role === "KITCHEN" && <NavLink href="/dashboard/kitchen">Cuisine</NavLink>}
        </nav>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

const ROLE_LABEL: Record<string, string> = {
  OWNER: "Propriétaire",
  MANAGER: "Manager",
  SERVER: "Serveur",
  KITCHEN: "Cuisine",
};
