import { getAdminWithPermissions } from "@/lib/session-helpers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import LeadsClient, { LeadRow } from "./LeadsClient";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const { permissions } = await getAdminWithPermissions();
  if (!permissions.includes("leads")) redirect("/admin");

  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 1000 });
  const rows: LeadRow[] = leads.map((l) => ({
    id: l.id,
    type: l.type,
    source: l.source,
    name: l.name,
    email: l.email || "",
    phone: l.phone || "",
    school: l.school || "",
    city: l.city || "",
    state: l.state || "",
    message: l.message || "",
    status: l.status,
    assignedTo: l.assignedTo || "",
    notes: (() => { try { return JSON.parse(l.notes || "[]"); } catch { return []; } })(),
    convertedType: l.convertedType || "",
    createdAt: l.createdAt.toISOString(),
  }));

  return <LeadsClient rows={rows} />;
}
