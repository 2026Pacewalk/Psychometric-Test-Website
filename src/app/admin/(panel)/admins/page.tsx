import { getAdminWithPermissions } from "@/lib/session-helpers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import AdminsClient, { AdminRow } from "./AdminsClient";

export const dynamic = "force-dynamic";

export default async function AdminsPage() {
  const { permissions, session } = await getAdminWithPermissions();
  if (!permissions.includes("admins")) redirect("/admin");

  const users = await prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } });
  const rows: AdminRow[] = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    permissions: JSON.parse(u.permissions || "[]"),
    active: u.active,
    isSelf: u.id === session.sub,
  }));
  return <AdminsClient rows={rows} />;
}
