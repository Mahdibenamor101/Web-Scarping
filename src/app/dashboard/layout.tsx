import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { withTenant } from "@/lib/db";
import { canManageStaff, MENU_MANAGEMENT_ROLES, TABLE_MANAGEMENT_ROLES, BILLING_MANAGEMENT_ROLES } from "@/lib/rbac";
import Logo from "@/components/logo";
import LogoutButton from "./logout-button";
import NavLink from "./nav-link";
import PageTransition from "./page-transition";
import EmailVerificationBanner from "@/components/email-verification-banner";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const organization = await withTenant(session.organizationId, (tx) =>
    tx.organization.findUnique({ where: { id: session.organizationId }, select: { name: true } }),
  );

  return (
    <div className="flex min-h-screen bg-dash-bg">
      <aside className="flex w-60 shrink-0 flex-col justify-between border-r border-white/5 bg-dash-card px-4 py-6 text-white">
        <div>
          <div className="px-2">
            <Logo wordmarkClassName="font-display text-xl font-extrabold tracking-tight text-white" />
          </div>
          <nav className="mt-8 flex flex-col gap-1">
            <NavLink href="/dashboard/orders">Commandes</NavLink>
            {canManageStaff(session.role) && <NavLink href="/dashboard/analytics">Analytics</NavLink>}
            {canManageStaff(session.role) && <NavLink href="/dashboard/staff">Staff</NavLink>}
            {MENU_MANAGEMENT_ROLES.includes(session.role) && <NavLink href="/dashboard/menu">Menu</NavLink>}
            {TABLE_MANAGEMENT_ROLES.includes(session.role) && <NavLink href="/dashboard/tables">Tables</NavLink>}
            {MENU_MANAGEMENT_ROLES.includes(session.role) && <NavLink href="/dashboard/branding">Marque</NavLink>}
            {BILLING_MANAGEMENT_ROLES.includes(session.role) && (
              <NavLink href="/dashboard/billing">Abonnement</NavLink>
            )}
          </nav>
        </div>
        <div className="border-t border-white/10 px-2 pt-4">
          <p className="truncate text-sm font-semibold text-white">{organization?.name ?? "—"}</p>
          <p className="truncate text-xs text-white/40">
            {session.name} · {ROLE_LABEL[session.role]}
          </p>
          <div className="mt-3">
            <LogoutButton />
          </div>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <Suspense fallback={null}>
          <EmailVerificationBanner />
        </Suspense>
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}

const ROLE_LABEL: Record<string, string> = {
  OWNER: "Propriétaire",
  MANAGER: "Manager",
  SERVER: "Serveur",
  KITCHEN: "Cuisine",
};
