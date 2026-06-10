import Link from "next/link";
import { requireSchool } from "@/lib/session-helpers";
import { prisma } from "@/lib/db";
import StatCard from "@/components/dashboard/StatCard";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  const session = await requireSchool();
  const schoolId = session.sub;
  const where = { student: { schoolId } };

  const [totalStudents, completed, pending, reports, recent] = await Promise.all([
    prisma.student.count({ where: { schoolId } }),
    prisma.testSession.count({ where: { ...where, status: "completed" } }),
    prisma.testSession.count({ where: { ...where, status: { in: ["pending", "in_progress"] } } }),
    prisma.report.count({ where: { session: where } }),
    prisma.testSession.findMany({
      where: { ...where, status: "completed" },
      include: { student: true, report: true },
      orderBy: { completedAt: "desc" },
      take: 6,
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Welcome, {session.name}</h1>
          <p className="text-sm text-slate-500">Here is an overview of your assessment activity.</p>
        </div>
        <Link href="/dashboard/students" className="btn-primary text-sm">
          + Add Student
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Students" value={totalStudents} icon="👥" tone="brand" />
        <StatCard label="Tests Completed" value={completed} icon="✅" tone="green" />
        <StatCard label="Pending Tests" value={pending} icon="⏳" tone="amber" />
        <StatCard label="Reports Generated" value={reports} icon="📄" tone="violet" />
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Reports</h2>
          <Link href="/dashboard/reports" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            No completed tests yet. Add a student and start a test to generate the first report.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-400">
                <tr>
                  <th className="py-2 font-semibold">Student</th>
                  <th className="py-2 font-semibold">Class</th>
                  <th className="py-2 font-semibold">Score</th>
                  <th className="py-2 font-semibold">Date</th>
                  <th className="py-2 font-semibold text-right">Report</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((s) => (
                  <tr key={s.id} className="border-t border-slate-100">
                    <td className="py-2.5 font-medium text-slate-800">{s.student?.name || "—"}</td>
                    <td className="py-2.5 text-slate-500">{s.student?.classCourse || "—"}</td>
                    <td className="py-2.5 text-slate-500">{s.report?.totalScore ?? "—"}</td>
                    <td className="py-2.5 text-slate-500">
                      {s.completedAt ? new Date(s.completedAt).toLocaleDateString("en-GB") : "—"}
                    </td>
                    <td className="py-2.5 text-right">
                      <Link href={`/report/${s.token}`} className="font-semibold text-brand-600 hover:text-brand-700">
                        View
                      </Link>
                    </td>
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
