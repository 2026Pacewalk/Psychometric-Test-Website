import Link from "next/link";
import { requireCentre } from "@/lib/session-helpers";
import { prisma } from "@/lib/db";
import { walletSummary } from "@/lib/centre";
import StatCard from "@/components/dashboard/StatCard";

export const dynamic = "force-dynamic";

export default async function CentreHome() {
  const session = await requireCentre();
  const centreId = session.sub;

  const [centre, txns, reports, recent] = await Promise.all([
    prisma.studyCentre.findUnique({ where: { id: centreId }, include: { joiningPayment: true } }),
    prisma.centreTransaction.findMany({ where: { centreId } }),
    prisma.report.count({ where: { session: { studyCentreId: centreId } } }),
    prisma.testSession.findMany({
      where: { studyCentreId: centreId, status: "completed" },
      include: { report: true },
      orderBy: { completedAt: "desc" },
      take: 6,
    }),
  ]);
  const w = walletSummary(txns);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Welcome, {session.name}</h1>
          <p className="text-sm text-slate-500">Commission: {centre?.commissionPercent}% AMG · {100 - (centre?.commissionPercent ?? 30)}% you · Code {centre?.code}</p>
        </div>
        <Link href="/centre/tests" className="btn-primary text-sm">+ Conduct Test</Link>
      </div>

      {centre?.joiningPayment && (
        <div className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-sm ${centre.joiningPayment.status === "approved" ? "border-green-200 bg-green-50 text-green-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
          <span>
            Joining fee ₹{centre.joiningPayment.amount} ({centre.joiningPayment.mode.toUpperCase()}) —{" "}
            <strong className="capitalize">{centre.joiningPayment.status}</strong>
            {centre.joiningPayment.receiptNo && <> · Receipt {centre.joiningPayment.receiptNo}</>}
          </span>
          {centre.joiningPayment.status === "approved" && centre.joiningPayment.receiptNo && (
            <Link href="/centre/receipt" className="font-semibold underline">View / Print Receipt →</Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Collected" value={`₹${w.totalCollected}`} icon="cash" tone="brand" />
        <StatCard label="Your Earnings (Net)" value={`₹${w.centreShare}`} icon="revenue" tone="green" />
        <StatCard label="AMG Share" value={`₹${w.amgShare}`} icon="bank" tone="violet" />
        <StatCard label="Reports Generated" value={reports} icon="report" tone="amber" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Pending Settlement" value={`₹${w.pendingSettlement}`} icon="pending" tone="amber" />
        <StatCard label="Settled" value={`₹${w.settled}`} icon="check" tone="green" />
        <StatCard label="AMG Due (Offline)" value={`₹${w.amgDueFromCentre}`} icon="pin" tone="violet" />
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Reports</h2>
          <Link href="/centre/tests" className="text-sm font-semibold text-brand-600">View all →</Link>
        </div>
        {recent.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">No completed tests yet. Conduct your first test.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-slate-400"><tr><th className="py-2 font-semibold">User</th><th className="py-2 font-semibold">Test</th><th className="py-2 font-semibold">Date</th><th className="py-2 font-semibold text-right">Report</th></tr></thead>
            <tbody>
              {recent.map((s) => (
                <tr key={s.id} className="border-t border-slate-100">
                  <td className="py-2.5 font-medium text-slate-800">{s.takerName}</td>
                  <td className="py-2.5 capitalize text-slate-500">{s.testType}</td>
                  <td className="py-2.5 text-slate-500">{s.completedAt ? new Date(s.completedAt).toLocaleDateString("en-GB") : "—"}</td>
                  <td className="py-2.5 text-right"><Link href={`/report/${s.token}`} className="font-semibold text-brand-600">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
