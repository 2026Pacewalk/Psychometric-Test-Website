import { getAdminWithPermissions } from "@/lib/session-helpers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import CompaniesClient, { CompanyRow } from "./CompaniesClient";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const { permissions } = await getAdminWithPermissions();
  if (!permissions.includes("companies")) redirect("/admin");

  const companies = await prisma.company.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { employees: true } } },
  });

  const rows: CompanyRow[] = companies.map((c) => ({
    id: c.id, name: c.name, code: c.code, email: c.email, phone: c.phone || "",
    city: c.city || "", state: c.state || "", contactPerson: c.contactPerson || "",
    industry: c.industry || "", status: c.status, employees: c._count.employees,
  }));

  return <CompaniesClient rows={rows} />;
}
