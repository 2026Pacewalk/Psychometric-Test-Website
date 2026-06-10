import { redirect } from "next/navigation";
import { getSession, isAdmin, SessionPayload } from "./auth";
import { prisma } from "./db";
import { effectivePermissions, Permission } from "./permissions";

// For server components.
export async function requireSchool(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session || session.role !== "school") redirect("/school-login");
  return session;
}

export async function requireCompany(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session || session.role !== "company") redirect("/company-login");
  return session;
}

export async function requireCentre(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session || session.role !== "centre") redirect("/centre-login");
  return session;
}

// For pages that require an APPROVED/ACTIVE centre (e.g. conduct test, wallet).
// Pre-active centres are redirected to billing to complete the joining fee.
export async function requireActiveCentre(): Promise<SessionPayload> {
  const session = await requireCentre();
  const centre = await prisma.studyCentre.findUnique({ where: { id: session.sub }, select: { status: true } });
  if (!centre || !["approved", "active"].includes(centre.status)) redirect("/centre/billing");
  return session;
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session || !isAdmin(session.role)) redirect("/admin/login");
  return session;
}

export async function getAdminWithPermissions() {
  const session = await requireAdmin();
  if (session.role === "superadmin") {
    return { session, permissions: effectivePermissions("superadmin", null) };
  }
  const user = await prisma.adminUser.findUnique({ where: { id: session.sub } });
  return {
    session,
    permissions: effectivePermissions(session.role, user?.permissions),
  };
}

export function hasPermission(perms: Permission[], key: Permission) {
  return perms.includes(key);
}
