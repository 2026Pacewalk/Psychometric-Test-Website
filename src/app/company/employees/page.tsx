import { requireCompany } from "@/lib/session-helpers";
import { prisma } from "@/lib/db";
import EmployeesClient, { EmployeeRow } from "./EmployeesClient";

export const dynamic = "force-dynamic";

export default async function EmployeesPage() {
  const session = await requireCompany();
  const employees = await prisma.employee.findMany({
    where: { companyId: session.sub },
    orderBy: { createdAt: "desc" },
    include: { sessions: { orderBy: { createdAt: "desc" }, take: 1, include: { report: { select: { totalScore: true } } } } },
  });

  const rows: EmployeeRow[] = employees.map((e) => {
    const latest = e.sessions[0];
    return {
      id: e.id,
      name: e.name,
      designation: e.designation,
      department: e.department,
      mobile: e.mobile,
      status: latest?.status ?? "none",
      token: latest?.token ?? null,
    };
  });

  return <EmployeesClient initial={rows} />;
}
