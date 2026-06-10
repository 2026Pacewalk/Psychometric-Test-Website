"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export interface CentreRow {
  id: string; name: string; code: string; email: string; ownerName: string; mobile: string;
  city: string; district: string; state: string; address: string; existingInstitute: string;
  registrationType: string; expectedStudents: number | null; message: string; hasDoc: boolean;
  commissionPercent: number; status: string; hasLogin: boolean;
  collected: number; amgShare: number; centreShare: number; amgDue: number; pending: number;
  jp: null | { amount: number; mode: string; status: string; reference: string; paymentDate: string; hasProof: boolean; receiptNo: string; remarks: string };
}

const STATUSES = ["pending", "approved", "active", "inactive", "rejected", "suspended"];
const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700", approved: "bg-green-100 text-green-700",
  active: "bg-emerald-100 text-emerald-700", inactive: "bg-slate-200 text-slate-600",
  rejected: "bg-red-100 text-red-700", suspended: "bg-orange-100 text-orange-700",
};

export default function CentresClient({ rows }: { rows: CentreRow[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [view, setView] = useState<CentreRow | null>(null);
  const [form, setForm] = useState<{ status: string; commissionPercent: number; password: string }>({ status: "", commissionPercent: 30, password: "" });
  const [err, setErr] = useState(""); const [saving, setSaving] = useState(false);
  const [remarks, setRemarks] = useState("");

  async function verifyPayment(action: "approve" | "reject") {
    if (!view) return;
    setSaving(true); setErr("");
    const res = await fetch(`/api/admin/centres/${view.id}/verify-payment`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, remarks, ...(form.password ? { password: form.password } : {}) }),
    });
    setSaving(false);
    const d = await res.json().catch(() => ({}));
    if (!res.ok) return setErr(d.error || "Could not update payment.");
    setView(null); router.refresh();
  }

  const filtered = useMemo(() => rows.filter((r) =>
    !q ? true : [r.name, r.code, r.city, r.email, r.ownerName].some((v) => v.toLowerCase().includes(q.toLowerCase()))
  ), [rows, q]);

  function open(c: CentreRow) { setView(c); setForm({ status: c.status, commissionPercent: c.commissionPercent, password: "" }); setRemarks(c.jp?.remarks || ""); setErr(""); }

  async function save() {
    if (!view) return;
    setSaving(true); setErr("");
    const res = await fetch(`/api/admin/centres/${view.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: form.status, commissionPercent: Number(form.commissionPercent), ...(form.password ? { password: form.password } : {}) }),
    });
    setSaving(false);
    const d = await res.json().catch(() => ({}));
    if (!res.ok) return setErr(d.error || "Could not save.");
    setView(null); router.refresh();
  }
  async function setStatus(c: CentreRow, status: string) {
    await fetch(`/api/admin/centres/${c.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    router.refresh();
  }
  async function remove(c: CentreRow) {
    if (!confirm(`Delete ${c.name}? This removes its tests, transactions and settlements.`)) return;
    await fetch(`/api/admin/centres/${c.id}`, { method: "DELETE" }); router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-extrabold text-slate-900">Study Centres</h1><p className="text-sm text-slate-500">Applications, approval, commission and revenue.</p></div>
        <a href="/api/admin/centre-transactions/export" className="btn-outline text-sm">⬇ Export Transactions</a>
      </div>

      <div className="card p-4">
        <input className="input mb-4 max-w-xs" placeholder="Search name, code, city…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-400"><tr><th className="py-2 font-semibold">Centre</th><th className="py-2 font-semibold">City</th><th className="py-2 font-semibold">Comm.</th><th className="py-2 font-semibold">Collected</th><th className="py-2 font-semibold">AMG Due</th><th className="py-2 font-semibold">Status</th><th className="py-2 font-semibold text-right">Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? <tr><td colSpan={7} className="py-10 text-center text-slate-400">No centres found.</td></tr> : filtered.map((c) => (
                <tr key={c.id} className="border-t border-slate-100">
                  <td className="py-3"><p className="font-medium text-slate-800">{c.name}</p><p className="text-xs text-slate-400">{c.code} · {c.email}{!c.hasLogin && " · no login"}</p></td>
                  <td className="py-3 text-slate-500">{c.city || "—"}</td>
                  <td className="py-3 text-slate-500">{c.commissionPercent}%</td>
                  <td className="py-3 text-slate-700">₹{c.collected}</td>
                  <td className="py-3 text-amber-700">₹{c.amgDue}</td>
                  <td className="py-3"><select value={c.status} onChange={(e) => setStatus(c, e.target.value)} className={`badge cursor-pointer border-0 ${STATUS_STYLE[c.status] || "bg-slate-100"}`}>{STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select></td>
                  <td className="py-3"><div className="flex justify-end gap-2 text-xs font-semibold"><button onClick={() => open(c)} className="rounded-lg bg-brand-50 px-3 py-1.5 text-brand-700 hover:bg-brand-100">Review</button><button onClick={() => remove(c)} className="rounded-lg px-2 py-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600">Delete</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {view && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setView(null)}>
          <div className="card max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-bold text-slate-900">{view.name}</h3><button onClick={() => setView(null)} className="text-slate-400 hover:text-slate-600">✕</button></div>

            <dl className="grid grid-cols-1 gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
              {([["Code", view.code], ["Email", view.email], ["Owner", view.ownerName], ["Mobile", view.mobile],
                 ["City / District", `${view.city} / ${view.district}`], ["State", view.state],
                 ["Existing Institute", view.existingInstitute], ["Registration Type", view.registrationType],
                 ["Expected Students/Month", view.expectedStudents != null ? String(view.expectedStudents) : "—"],
                 ["Address", view.address]] as [string, string][]).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-2 border-b border-slate-100 py-1.5"><dt className="text-slate-500">{k}</dt><dd className="text-right text-slate-800">{v || "—"}</dd></div>
              ))}
            </dl>
            {view.message && <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">{view.message}</p>}
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <span className="text-slate-500">Collected: <strong className="text-slate-800">₹{view.collected}</strong></span>
              <span className="text-slate-500">Centre share: <strong className="text-green-700">₹{view.centreShare}</strong></span>
              <span className="text-slate-500">AMG share: <strong>₹{view.amgShare}</strong></span>
              <span className="text-slate-500">Pending settlement: <strong className="text-amber-700">₹{view.pending}</strong></span>
              {view.hasDoc && <a href={`/api/admin/centres/${view.id}/doc`} target="_blank" className="font-semibold text-brand-600">View Document ↗</a>}
            </div>

            {/* Joining fee panel */}
            {view.jp && (
              <div className="mt-5 rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800">Joining Fee — ₹{view.jp.amount}</h4>
                  <span className={`badge ${view.jp.status === "approved" ? "bg-green-100 text-green-700" : view.jp.status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{view.jp.status}</span>
                </div>
                <div className="mt-2 grid grid-cols-1 gap-x-6 text-sm text-slate-600 sm:grid-cols-2">
                  <p>Mode: <strong className="uppercase">{view.jp.mode}</strong></p>
                  <p>Reference: {view.jp.reference || "—"}</p>
                  <p>Payment date: {view.jp.paymentDate || "—"}</p>
                  <p>{view.jp.hasProof ? <a href={`/api/admin/centres/${view.id}/doc`} className="font-semibold text-brand-600">View document ↗</a> : "No screenshot"}</p>
                </div>
                {view.jp.receiptNo ? (
                  <p className="mt-2 text-sm">Receipt: <a href={`/admin/centres/${view.id}/receipt`} target="_blank" className="font-mono font-semibold text-brand-700">{view.jp.receiptNo} ↗</a></p>
                ) : (
                  <>
                    <div className="mt-3"><label className="label">Remarks</label><input className="input" value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Optional note / reason" /></div>
                    <p className="mt-1 text-xs text-slate-400">Approving the payment activates the centre login (set a password below first if none exists) and issues a receipt.</p>
                    <div className="mt-2 flex gap-2">
                      <button type="button" onClick={() => verifyPayment("approve")} disabled={saving} className="rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700">Verify &amp; Approve Payment</button>
                      <button type="button" onClick={() => verifyPayment("reject")} disabled={saving} className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50">Reject Payment</button>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-3">
              <div><label className="label">Status</label><select className="input" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
              <div><label className="label">Commission % (AMG)</label><input className="input" type="number" value={form.commissionPercent} onChange={(e) => setForm((f) => ({ ...f, commissionPercent: Number(e.target.value) }))} /></div>
              <div><label className="label">{view.hasLogin ? "Reset Password" : "Set Login Password"}</label><input className="input" type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} /></div>
            </div>
            <p className="mt-1 text-xs text-slate-400">To create the centre login, set a password and mark status Approved/Active.</p>
            {err && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
            <div className="mt-4 flex justify-end gap-2"><button onClick={() => setView(null)} className="btn-outline text-sm">Close</button><button onClick={save} disabled={saving} className="btn-primary text-sm">{saving ? "Saving…" : "Save"}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
