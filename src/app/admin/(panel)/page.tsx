import Link from "next/link";
import { getAdminWithPermissions } from "@/lib/session-helpers";
import { prisma } from "@/lib/db";
import StatCard from "@/components/dashboard/StatCard";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const { session } = await getAdminWithPermissions();

  const [schools, companies, individuals, pendingSchools, students, reports, paidAgg, centres, pendingSettlements, newLeads, recentLeads, recentReports] =
    await Promise.all([
      prisma.school.count(),
      prisma.company.count(),
      prisma.individualUser.count(),
      prisma.school.count({ where: { status: "pending" } }),
      prisma.student.count(),
      prisma.report.count(),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "paid" } }),
      prisma.studyCentre.count(),
      prisma.settlement.count({ where: { status: "requested" } }),
      prisma.lead.count({ where: { read: false } }),
      prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.testSession.findMany({
        where: { status: "completed" },
        include: {
          student: { include: { school: true } },
          employee: { include: { company: true } },
          individualUser: true,
        },
        orderBy: { completedAt: "desc" },
        take: 5,
      }),
    ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Welcome, {session.name}</h1>
        <p className="text-sm text-slate-500">Platform-wide overview and recent activity.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Schools" value={schools} icon="🏫" tone="brand" />
        <StatCard label="Companies" value={companies} icon="🏢" tone="green" />
        <StatCard label="Individual Users" value={individuals} icon="👤" tone="violet" />
        <StatCard label="Reports Generated" value={reports} icon="📄" tone="amber" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Study Centres" value={centres} icon="🏬" tone="brand" />
        <StatCard label="Individual Revenue" value={`₹${paidAgg._sum.amount ?? 0}`} icon="💰" tone="green" />
        <StatCard label="Settlement Requests" value={pendingSettlements} icon="🤝" tone="amber" />
        <StatCard label="New Inquiries" value={newLeads} icon="📥" tone="violet" />
      </div>

      {pendingSchools > 0 && (
        <Link
          href="/admin/schools?status=pending"
          className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800 hover:bg-amber-100"
        >
          <span>⚠ {pendingSchools} school(s) awaiting approval</span>
          <span className="font-semibold">Review →</span>
        </Link>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent Inquiries</h2>
            <Link href="/admin/leads" className="text-sm font-semibold text-brand-600">View all →</Link>
          </div>
          <ul className="space-y-3">
            {recentLeads.length === 0 && <li className="text-sm text-slate-400">No inquiries yet.</li>}
            {recentLeads.map((l) => (
              <li key={l.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-slate-800">{l.name}</p>
                  <p className="text-xs text-slate-400">
                    {l.type === "enroll" ? "Enrollment" : "Contact"} · {l.city || "—"}
                  </p>
                </div>
                {!l.read && <span className="badge bg-amber-100 text-amber-700">New</span>}
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent Reports</h2>
            <Link href="/admin/results" className="text-sm font-semibold text-brand-600">View all →</Link>
          </div>
          <ul className="space-y-3">
            {recentReports.length === 0 && <li className="text-sm text-slate-400">No reports yet.</li>}
            {recentReports.map((r) => (
              <li key={r.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-slate-800">{r.student?.name || r.employee?.name || r.takerName || "Candidate"}</p>
                  <p className="text-xs text-slate-400">{r.student?.school.name || r.employee?.company.name || "Individual"}</p>
                </div>
                <Link href={`/report/${r.token}`} className="font-semibold text-brand-600">View</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
