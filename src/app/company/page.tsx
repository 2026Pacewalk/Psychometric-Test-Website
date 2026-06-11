import Link from "next/link";
import { requireCompany } from "@/lib/session-helpers";
import { prisma } from "@/lib/db";
import StatCard from "@/components/dashboard/StatCard";

export const dynamic = "force-dynamic";

export default async function CompanyHome() {
  const session = await requireCompany();
  const companyId = session.sub;
  const where = { employee: { companyId } };

  const [totalEmployees, completed, pending, recent] = await Promise.all([
    prisma.employee.count({ where: { companyId } }),
    prisma.testSession.count({ where: { ...where, status: "completed" } }),
    prisma.testSession.count({ where: { ...where, status: { in: ["pending", "in_progress"] } } }),
    prisma.testSession.findMany({
      where: { ...where, status: "completed" },
      include: { employee: true, report: true },
      orderBy: { completedAt: "desc" },
      take: 6,
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Welcome, {session.name}</h1>
          <p className="text-sm text-slate-500">Overview of your employee assessments.</p>
        </div>
        <Link href="/company/employees" className="btn-primary text-sm">+ Add Employee</Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Employees" value={totalEmployees} icon="users" tone="brand" />
        <StatCard label="Tests Completed" value={completed} icon="check" tone="green" />
        <StatCard label="Pending Tests" value={pending} icon="pending" tone="amber" />
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Reports</h2>
          <Link href="/company/reports" className="text-sm font-semibold text-brand-600">View all →</Link>
        </div>
        {recent.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">No completed tests yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-400">
                <tr><th className="py-2 font-semibold">Employee</th><th className="py-2 font-semibold">Designation</th><th className="py-2 font-semibold">Date</th><th className="py-2 font-semibold text-right">Report</th></tr>
              </thead>
              <tbody>
                {recent.map((s) => (
                  <tr key={s.id} className="border-t border-slate-100">
                    <td className="py-2.5 font-medium text-slate-800">{s.employee?.name}</td>
                    <td className="py-2.5 text-slate-500">{s.employee?.designation || "—"}</td>
                    <td className="py-2.5 text-slate-500">{s.completedAt ? new Date(s.completedAt).toLocaleDateString("en-GB") : "—"}</td>
                    <td className="py-2.5 text-right"><Link href={`/report/${s.token}`} className="font-semibold text-brand-600">View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
