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
import LanguageSwitcher from "@/components/language-switcher";
import { getLocale } from "@/lib/i18n/get-locale";
import { isRtl } from "@/lib/i18n/languages";
import { DASHBOARD_SHELL_DICT } from "@/lib/i18n/dictionaries/dashboard-shell";
import { AUTH_DICT } from "@/lib/i18n/dictionaries/auth";

// Nav labels + role label are translated (see CONTEXT.md §12.30); the
// dashboard's inner pages are not yet -- this shell is the one part of the
// dashboard the language switcher currently covers end to end.
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const locale = getLocale("fr");
  const t = DASHBOARD_SHELL_DICT[locale];
  const roleLabel = AUTH_DICT[locale].roles;

  const organization = await withTenant(session.organizationId, (tx) =>
    tx.organization.findUnique({ where: { id: session.organizationId }, select: { name: true } }),
  );

  return (
    <div dir={isRtl(locale) ? "rtl" : "ltr"} className="flex min-h-screen bg-dash-bg">
      <aside className="flex w-60 shrink-0 flex-col justify-between border-r border-white/5 bg-dash-card px-4 py-6 text-white">
        <div>
          <div className="flex items-center justify-between px-2">
            <Logo />
          </div>
          <div className="mt-4 px-2">
            <LanguageSwitcher current={locale} variant="dark" />
          </div>
          <nav className="mt-6 flex flex-col gap-1">
            <NavLink href="/dashboard/orders">{t.nav.orders}</NavLink>
            {canManageStaff(session.role) && <NavLink href="/dashboard/analytics">{t.nav.analytics}</NavLink>}
            {canManageStaff(session.role) && <NavLink href="/dashboard/staff">{t.nav.staff}</NavLink>}
            {MENU_MANAGEMENT_ROLES.includes(session.role) && <NavLink href="/dashboard/menu">{t.nav.menu}</NavLink>}
            {TABLE_MANAGEMENT_ROLES.includes(session.role) && <NavLink href="/dashboard/tables">{t.nav.tables}</NavLink>}
            {MENU_MANAGEMENT_ROLES.includes(session.role) && <NavLink href="/dashboard/branding">{t.nav.branding}</NavLink>}
            {BILLING_MANAGEMENT_ROLES.includes(session.role) && (
              <NavLink href="/dashboard/billing">{t.nav.billing}</NavLink>
            )}
          </nav>
        </div>
        <div className="border-t border-white/10 px-2 pt-4">
          <p className="truncate text-sm font-semibold text-white">{organization?.name ?? "—"}</p>
          <p className="truncate text-xs text-white/40">
            {session.name} · {roleLabel[session.role as keyof typeof roleLabel] ?? session.role}
          </p>
          <div className="mt-3">
            <LogoutButton label={t.logout} />
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
