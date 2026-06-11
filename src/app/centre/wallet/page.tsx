import { requireActiveCentre as requireCentre } from "@/lib/session-helpers";
import { prisma } from "@/lib/db";
import { walletSummary } from "@/lib/centre";
import StatCard from "@/components/dashboard/StatCard";
import SettlementButton from "./SettlementButton";

export const dynamic = "force-dynamic";

const TXN_STATUS: Record<string, string> = {
  paid: "bg-green-100 text-green-700", pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-700", refunded: "bg-slate-200 text-slate-600",
};
const SETTLE_STATUS: Record<string, string> = {
  requested: "bg-amber-100 text-amber-700", approved: "bg-blue-100 text-blue-700",
  paid: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700",
  unsettled: "bg-slate-100 text-slate-500", settled: "bg-green-100 text-green-700",
};

export default async function CentreWalletPage() {
  const session = await requireCentre();
  const centreId = session.sub;

  const [txns, settlements] = await Promise.all([
    prisma.centreTransaction.findMany({ where: { centreId }, orderBy: { createdAt: "desc" } }),
    prisma.settlement.findMany({ where: { centreId }, orderBy: { createdAt: "desc" } }),
  ]);
  const w = walletSummary(txns);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-900">Wallet &amp; Settlements</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Collected" value={`₹${w.totalCollected}`} icon="cash" tone="brand" />
        <StatCard label="Your Profit (70%)" value={`₹${w.centreShare}`} icon="revenue" tone="green" />
        <StatCard label="AMG Share (30%)" value={`₹${w.amgShare}`} icon="bank" tone="violet" />
        <StatCard label="Online Collected" value={`₹${w.onlineTotal}`} icon="card" tone="brand" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending Settlement" value={`₹${w.pendingSettlement}`} icon="pending" tone="amber" />
        <StatCard label="Settled" value={`₹${w.settled}`} icon="check" tone="green" />
        <StatCard label="AMG Due (Offline)" value={`₹${w.amgDueFromCentre}`} icon="pin" tone="violet" />
        <StatCard label="Refunded" value={`₹${w.refunded}`} icon="refund" tone="amber" />
      </div>

      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Settlement</h2>
            <p className="text-sm text-slate-500">Request withdrawal of your online earnings. Offline earnings are already with you (you owe AMG ₹{w.amgDueFromCentre}).</p>
          </div>
          <SettlementButton pending={w.pendingSettlement} />
        </div>
        {settlements.length > 0 && (
          <table className="mt-4 w-full text-sm">
            <thead className="text-left text-slate-400"><tr><th className="py-2 font-semibold">Date</th><th className="py-2 font-semibold">Amount</th><th className="py-2 font-semibold">Status</th><th className="py-2 font-semibold">Reference</th></tr></thead>
            <tbody>
              {settlements.map((s) => (
                <tr key={s.id} className="border-t border-slate-100">
                  <td className="py-2.5 text-slate-500">{new Date(s.createdAt).toLocaleDateString("en-GB")}</td>
                  <td className="py-2.5 font-semibold text-slate-700">₹{s.amount}</td>
                  <td className="py-2.5"><span className={`badge ${SETTLE_STATUS[s.status] || "bg-slate-100"}`}>{s.status}</span></td>
                  <td className="py-2.5 text-slate-500">{s.reference || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card overflow-x-auto p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Transactions</h2>
          <span className="text-sm text-slate-400">{txns.length} record(s)</span>
        </div>
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400"><tr><th className="py-2 font-semibold">Date</th><th className="py-2 font-semibold">User</th><th className="py-2 font-semibold">Test</th><th className="py-2 font-semibold">Fee</th><th className="py-2 font-semibold">Mode</th><th className="py-2 font-semibold">AMG</th><th className="py-2 font-semibold">Yours</th><th className="py-2 font-semibold">Payment</th><th className="py-2 font-semibold">Settlement</th></tr></thead>
          <tbody>
            {txns.length === 0 ? <tr><td colSpan={9} className="py-10 text-center text-slate-400">No transactions yet.</td></tr> : txns.map((t) => (
              <tr key={t.id} className="border-t border-slate-100">
                <td className="py-2.5 text-slate-500">{new Date(t.createdAt).toLocaleDateString("en-GB")}</td>
                <td className="py-2.5 font-medium text-slate-800">{t.takerName}</td>
                <td className="py-2.5 capitalize text-slate-500">{t.testType}</td>
                <td className="py-2.5 text-slate-700">₹{t.totalFee}</td>
                <td className="py-2.5 capitalize text-slate-500">{t.paymentMode}</td>
                <td className="py-2.5 text-slate-500">₹{t.amgShare}</td>
                <td className="py-2.5 font-semibold text-green-700">₹{t.centreShare}</td>
                <td className="py-2.5"><span className={`badge ${TXN_STATUS[t.paymentStatus] || "bg-slate-100"}`}>{t.paymentStatus}</span></td>
                <td className="py-2.5"><span className={`badge ${SETTLE_STATUS[t.settlementStatus] || "bg-slate-100"}`}>{t.settlementStatus}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
