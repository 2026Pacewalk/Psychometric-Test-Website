import { getAdminWithPermissions } from "@/lib/session-helpers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import StatCard from "@/components/dashboard/StatCard";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  created: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-700",
};

export default async function PaymentsPage() {
  const { permissions } = await getAdminWithPermissions();
  if (!permissions.includes("payments")) redirect("/admin");

  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: { individualUser: true },
    take: 500,
  });
  const paid = payments.filter((p) => p.status === "paid");
  const revenue = paid.reduce((t, p) => t + p.amount, 0);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-extrabold text-slate-900">Payments</h1><p className="text-sm text-slate-500">Razorpay transactions from individual users.</p></div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Transactions" value={payments.length} icon="receipt" tone="brand" />
        <StatCard label="Successful Payments" value={paid.length} icon="check" tone="green" />
        <StatCard label="Revenue Collected" value={`₹${revenue}`} icon="revenue" tone="violet" />
      </div>

      <div className="card overflow-x-auto p-4">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400"><tr><th className="py-2 font-semibold">User</th><th className="py-2 font-semibold">Test</th><th className="py-2 font-semibold">Amount</th><th className="py-2 font-semibold">Status</th><th className="py-2 font-semibold">Order ID</th><th className="py-2 font-semibold">Payment ID</th><th className="py-2 font-semibold">Date</th></tr></thead>
          <tbody>
            {payments.length === 0 ? <tr><td colSpan={7} className="py-10 text-center text-slate-400">No payments yet.</td></tr> : payments.map((p) => (
              <tr key={p.id} className="border-t border-slate-100">
                <td className="py-2.5"><p className="font-medium text-slate-800">{p.individualUser.name}</p><p className="text-xs text-slate-400">{p.individualUser.email}</p></td>
                <td className="py-2.5 capitalize text-slate-500">{p.testType}</td>
                <td className="py-2.5 font-semibold text-slate-700">₹{p.amount}</td>
                <td className="py-2.5"><span className={`badge ${STATUS_STYLE[p.status] || "bg-slate-100"}`}>{p.status}</span></td>
                <td className="py-2.5 font-mono text-[11px] text-slate-400">{p.razorpayOrderId}</td>
                <td className="py-2.5 font-mono text-[11px] text-slate-400">{p.razorpayPaymentId || "—"}</td>
                <td className="py-2.5 text-slate-500">{new Date(p.createdAt).toLocaleDateString("en-GB")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
