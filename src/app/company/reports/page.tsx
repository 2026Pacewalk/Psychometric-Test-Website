import Link from "next/link";
import { requireCompany } from "@/lib/session-helpers";
import { prisma } from "@/lib/db";
import { ReportData } from "@/lib/scoring";

export const dynamic = "force-dynamic";

export default async function CompanyReportsPage() {
  const session = await requireCompany();
  const sessions = await prisma.testSession.findMany({
    where: { status: "completed", employee: { companyId: session.sub } },
    include: { employee: true, report: true },
    orderBy: { completedAt: "desc" },
  });

  const rows = sessions.map((s) => {
    const d = JSON.parse(s.report!.data) as ReportData;
    return {
      token: s.token,
      name: s.employee?.name || "—",
      designation: s.employee?.designation || "",
      overall: d.overallPercent,
      top: d.topRiasec[0] || "",
      date: s.completedAt ? new Date(s.completedAt).toLocaleDateString("en-GB") : "—",
    };
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-900">Employee Reports</h1>
      <div className="card overflow-x-auto p-4">
        <p className="mb-3 text-sm text-slate-500">{rows.length} report(s)</p>
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400">
            <tr><th className="py-2 font-semibold">Employee</th><th className="py-2 font-semibold">Designation</th><th className="py-2 font-semibold">Overall</th><th className="py-2 font-semibold">Top Interest</th><th className="py-2 font-semibold">Date</th><th className="py-2 font-semibold text-right">Report</th></tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={6} className="py-10 text-center text-slate-400">No reports yet.</td></tr>
            ) : rows.map((r) => (
              <tr key={r.token} className="border-t border-slate-100">
                <td className="py-2.5 font-medium text-slate-800">{r.name}</td>
                <td className="py-2.5 text-slate-500">{r.designation || "—"}</td>
                <td className="py-2.5 font-semibold text-brand-700">{r.overall}%</td>
                <td className="py-2.5 text-slate-500">{r.top}</td>
                <td className="py-2.5 text-slate-500">{r.date}</td>
                <td className="py-2.5 text-right"><Link href={`/report/${r.token}`} className="font-semibold text-brand-600">Open</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
