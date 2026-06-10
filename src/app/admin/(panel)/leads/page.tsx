import { getAdminWithPermissions } from "@/lib/session-helpers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import LeadsClient, { LeadRow } from "./LeadsClient";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const { permissions } = await getAdminWithPermissions();
  if (!permissions.includes("leads")) redirect("/admin");

  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
  const rows: LeadRow[] = leads.map((l) => ({
    id: l.id,
    type: l.type,
    name: l.name,
    email: l.email || "",
    phone: l.phone || "",
    school: l.school || "",
    city: l.city || "",
    message: l.message || "",
    status: l.status,
    read: l.read,
    createdAt: l.createdAt.toISOString(),
  }));
  return <LeadsClient rows={rows} />;
}
