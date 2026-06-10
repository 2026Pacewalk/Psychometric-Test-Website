"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export interface PayRow {
  id: string; user: string; email: string; phone: string; testType: string;
  amount: number; mode: string; reference: string; hasProof: boolean; remarks: string; date: string;
}

export default function PaymentVerifyClient({ rows }: { rows: PayRow[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState("");

  async function act(id: string, action: "approve" | "reject") {
    let remarks = "";
    if (action === "reject") { remarks = prompt("Reason for rejection (optional):") || ""; }
    setBusy(id); setMsg("");
    const res = await fetch(`/api/admin/payments/${id}/verify`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, remarks }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy("");
    if (!res.ok) { setMsg(d.error || "Action failed."); return; }
    if (action === "approve") setMsg(`Approved — test unlocked. Receipt ${d.receiptNo}.`);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Payment Verification</h1>
        <p className="text-sm text-slate-500">Pending QR/UPI and Cash payments from individual users. Approving unlocks the test, issues a receipt and notifies the user.</p>
      </div>
      {msg && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{msg}</p>}

      <div className="card overflow-x-auto p-4">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400"><tr><th className="py-2 font-semibold">Date</th><th className="py-2 font-semibold">User</th><th className="py-2 font-semibold">Test</th><th className="py-2 font-semibold">Amount</th><th className="py-2 font-semibold">Mode</th><th className="py-2 font-semibold">Reference</th><th className="py-2 font-semibold">Proof</th><th className="py-2 font-semibold text-right">Action</th></tr></thead>
          <tbody>
            {rows.length === 0 ? <tr><td colSpan={8} className="py-10 text-center text-slate-400">No payments awaiting verification. 🎉</td></tr> : rows.map((p) => (
              <tr key={p.id} className="border-t border-slate-100">
                <td className="py-2.5 text-slate-500">{new Date(p.date).toLocaleDateString("en-GB")}</td>
                <td className="py-2.5"><p className="font-medium text-slate-800">{p.user}</p><p className="text-xs text-slate-400">{p.phone || p.email}</p></td>
                <td className="py-2.5 capitalize text-slate-500">{p.testType}</td>
                <td className="py-2.5 font-semibold text-slate-700">₹{p.amount}</td>
                <td className="py-2.5 uppercase text-slate-500">{p.mode}</td>
                <td className="py-2.5 text-slate-500">{p.reference || "—"}</td>
                <td className="py-2.5">{p.hasProof ? <a href={`/api/admin/payments/${p.id}/proof`} target="_blank" className="font-semibold text-brand-600">View</a> : "—"}</td>
                <td className="py-2.5">
                  <div className="flex justify-end gap-2 text-xs font-semibold">
                    <button onClick={() => act(p.id, "approve")} disabled={busy === p.id} className="rounded-lg bg-green-600 px-3 py-1.5 text-white hover:bg-green-700">Approve &amp; Unlock</button>
                    <button onClick={() => act(p.id, "reject")} disabled={busy === p.id} className="rounded-lg border border-slate-200 px-3 py-1.5 text-red-600 hover:bg-red-50">Reject</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
