import Link from "next/link";
import { getAdminWithPermissions } from "@/lib/session-helpers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import StatCard from "@/components/dashboard/StatCard";

export const dynamic = "force-dynamic";

const PAY_STYLE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700", approved: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700",
};

export default async function JoiningPaymentsPage() {
  const { permissions } = await getAdminWithPermissions();
  if (!permissions.includes("centres")) redirect("/admin");

  const payments = await prisma.joiningFeePayment.findMany({
    include: { centre: { select: { id: true, name: true, code: true } } },
    orderBy: { createdAt: "desc" },
  });
  const collected = payments.filter((p) => p.status === "approved").reduce((t, p) => t + p.amount, 0);
  const pending = payments.filter((p) => p.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-extrabold text-slate-900">Joining Fee Payments</h1><p className="text-sm text-slate-500">All study-centre joining-fee payments.</p></div>
        <a href="/api/admin/joining-payments/export" className="btn-outline text-sm">⬇ Export Report</a>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Payments" value={payments.length} icon="🧾" tone="brand" />
        <StatCard label="Awaiting Verification" value={pending} icon="⏳" tone="amber" />
        <StatCard label="Fee Collected" value={`₹${collected}`} icon="💰" tone="green" />
      </div>

      <div className="card overflow-x-auto p-4">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400"><tr><th className="py-2 font-semibold">Date</th><th className="py-2 font-semibold">Centre</th><th className="py-2 font-semibold">Amount</th><th className="py-2 font-semibold">Mode</th><th className="py-2 font-semibold">Reference</th><th className="py-2 font-semibold">Status</th><th className="py-2 font-semibold">Receipt</th><th className="py-2 font-semibold text-right">Action</th></tr></thead>
          <tbody>
            {payments.length === 0 ? <tr><td colSpan={8} className="py-10 text-center text-slate-400">No payments yet.</td></tr> : payments.map((p) => (
              <tr key={p.id} className="border-t border-slate-100">
                <td className="py-2.5 text-slate-500">{new Date(p.createdAt).toLocaleDateString("en-GB")}</td>
                <td className="py-2.5"><p className="font-medium text-slate-800">{p.centre.name}</p><p className="text-xs text-slate-400">{p.centre.code}</p></td>
                <td className="py-2.5 font-semibold text-slate-700">₹{p.amount}</td>
                <td className="py-2.5 uppercase text-slate-500">{p.mode}</td>
                <td className="py-2.5 text-slate-500">{p.reference || "—"}</td>
                <td className="py-2.5"><span className={`badge ${PAY_STYLE[p.status] || "bg-slate-100"}`}>{p.status}</span></td>
                <td className="py-2.5">{p.receiptNo ? <Link href={`/admin/centres/${p.centre.id}/receipt`} className="font-semibold text-brand-600">{p.receiptNo}</Link> : "—"}</td>
                <td className="py-2.5 text-right"><Link href="/admin/centres" className="font-semibold text-brand-600">Review</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
