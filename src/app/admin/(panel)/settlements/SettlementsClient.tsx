"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export interface SettlementRow {
  id: string; centre: string; code: string; amount: number; status: string;
  reference: string; note: string; createdAt: string; processedAt: string | null;
}

const STATUS_STYLE: Record<string, string> = {
  requested: "bg-amber-100 text-amber-700", approved: "bg-blue-100 text-blue-700",
  paid: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700",
};

export default function SettlementsClient({ rows }: { rows: SettlementRow[] }) {
  const router = useRouter();
  const [pay, setPay] = useState<SettlementRow | null>(null);
  const [reference, setReference] = useState("");
  const [busy, setBusy] = useState(false);

  async function update(id: string, body: Record<string, unknown>) {
    setBusy(true);
    await fetch(`/api/admin/settlements/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setBusy(false); setPay(null); setReference(""); router.refresh();
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-extrabold text-slate-900">Settlement Requests</h1><p className="text-sm text-slate-500">Approve, reject or mark centre settlements as paid.</p></div>

      <div className="card overflow-x-auto p-4">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400"><tr><th className="py-2 font-semibold">Date</th><th className="py-2 font-semibold">Centre</th><th className="py-2 font-semibold">Amount</th><th className="py-2 font-semibold">Status</th><th className="py-2 font-semibold">Reference</th><th className="py-2 font-semibold text-right">Actions</th></tr></thead>
          <tbody>
            {rows.length === 0 ? <tr><td colSpan={6} className="py-10 text-center text-slate-400">No settlement requests.</td></tr> : rows.map((s) => (
              <tr key={s.id} className="border-t border-slate-100">
                <td className="py-2.5 text-slate-500">{new Date(s.createdAt).toLocaleDateString("en-GB")}</td>
                <td className="py-2.5"><p className="font-medium text-slate-800">{s.centre}</p><p className="text-xs text-slate-400">{s.code}</p></td>
                <td className="py-2.5 font-semibold text-slate-700">₹{s.amount}</td>
                <td className="py-2.5"><span className={`badge ${STATUS_STYLE[s.status] || "bg-slate-100"}`}>{s.status}</span></td>
                <td className="py-2.5 text-slate-500">{s.reference || "—"}</td>
                <td className="py-2.5">
                  <div className="flex justify-end gap-2 text-xs font-semibold">
                    {s.status === "requested" && (
                      <>
                        <button onClick={() => update(s.id, { status: "approved" })} className="rounded-lg bg-blue-50 px-3 py-1.5 text-blue-700 hover:bg-blue-100">Approve</button>
                        <button onClick={() => update(s.id, { status: "rejected" })} className="rounded-lg px-2 py-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600">Reject</button>
                      </>
                    )}
                    {(s.status === "approved" || s.status === "requested") && (
                      <button onClick={() => { setPay(s); setReference(""); }} className="rounded-lg bg-green-600 px-3 py-1.5 text-white hover:bg-green-700">Mark Paid</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setPay(null)}>
          <div className="card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-900">Mark Settlement Paid</h3>
            <p className="mt-1 text-sm text-slate-500">{pay.centre} · ₹{pay.amount}</p>
            <div className="mt-4"><label className="label">Payment Reference No.</label><input className="input" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="UTR / cheque / txn id" /></div>
            <div className="mt-4 flex justify-end gap-2"><button onClick={() => setPay(null)} className="btn-outline text-sm">Cancel</button><button onClick={() => update(pay.id, { status: "paid", reference })} disabled={busy} className="btn-primary text-sm">{busy ? "Saving…" : "Confirm Paid"}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
