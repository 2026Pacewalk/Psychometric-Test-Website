import { requireCompany } from "@/lib/session-helpers";
import { prisma } from "@/lib/db";
import CompanyProfileClient from "./CompanyProfileClient";

export const dynamic = "force-dynamic";

export default async function CompanyProfilePage() {
  const session = await requireCompany();
  const c = await prisma.company.findUnique({ where: { id: session.sub } });
  if (!c) return null;
  return (
    <CompanyProfileClient
      company={{
        name: c.name, code: c.code, email: c.email, phone: c.phone || "", city: c.city || "",
        state: c.state || "", contactPerson: c.contactPerson || "", industry: c.industry || "", status: c.status,
      }}
    />
  );
}
