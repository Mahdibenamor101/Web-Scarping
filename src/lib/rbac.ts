import type { StaffRole } from "@prisma/client";

/** Where each role lands after login -- also what middleware treats as "theirs". */
export const ROLE_HOME: Record<StaffRole, string> = {
  OWNER: "/dashboard/staff",
  MANAGER: "/dashboard/staff",
  SERVER: "/dashboard/floor",
  KITCHEN: "/dashboard/kitchen",
};

/** Roles allowed to view/manage staff and organization settings. */
export const STAFF_MANAGEMENT_ROLES: StaffRole[] = ["OWNER", "MANAGER"];

/**
 * Roles allowed to edit the menu. Currently the same set as staff
 * management, kept as a separate list because the two are different
 * concerns that happen to share an answer today -- a future role (e.g. a
 * head chef who edits the menu but not staff) shouldn't require touching
 * staff permissions to add.
 */
export const MENU_MANAGEMENT_ROLES: StaffRole[] = ["OWNER", "MANAGER"];

/**
 * Who is allowed to invite whom. An OWNER can bring in any role, including
 * another OWNER (co-founders, handing off the account). A MANAGER can only
 * bring in front-of-house/kitchen staff -- not peers or owners. This is an
 * application-level business rule, not a tenant-isolation guarantee, so it
 * lives in code rather than in a database policy.
 */
export function canInviteRole(inviterRole: StaffRole, targetRole: StaffRole): boolean {
  if (inviterRole === "OWNER") return true;
  if (inviterRole === "MANAGER") return targetRole === "SERVER" || targetRole === "KITCHEN";
  return false;
}

export function canManageStaff(role: StaffRole): boolean {
  return STAFF_MANAGEMENT_ROLES.includes(role);
}
