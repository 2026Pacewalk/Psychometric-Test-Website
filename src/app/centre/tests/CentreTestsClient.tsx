"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface PriceRow { student: number; employee: number; }
export interface SessionRow {
  token: string; takerName: string; testType: string; status: string; paid: boolean;
  fee: number | null; mode: string | null; paymentStatus: string | null;
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true); s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700", in_progress: "bg-blue-100 text-blue-700", completed: "bg-green-100 text-green-700",
};

export default function CentreTestsClient({ prices, sessions }: { prices: PriceRow; sessions: SessionRow[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ takerName: "", testType: "student", fee: String(prices.student), paymentMode: "offline" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [link, setLink] = useState<{ name: string; url: string } | null>(null);
  const [copied, setCopied] = useState(false);

  function setType(t: string) {
    setForm((f) => ({ ...f, testType: t, fee: String(t === "student" ? prices.student : prices.employee) }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      const res = await fetch("/api/centre/create-test", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.error || "Could not create test."); setBusy(false); return; }

      if (d.online) {
        const ok = await loadRazorpay();
        if (!ok) { setError("Could not load the payment gateway."); setBusy(false); return; }
        const rzp = new (window as any).Razorpay({
          key: d.keyId, order_id: d.orderId, amount: d.amount, currency: d.currency,
          name: "TestPsychometric", description: `${form.testType} test`,
          prefill: { name: d.name }, theme: { color: "#1d4ed8" },
          handler: async (resp: any) => {
            const v = await fetch("/api/centre/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...resp, txnId: d.txnId }) });
            const vd = await v.json();
            if (v.ok && vd.token) { finish(d.name, vd.token); } else { setError(vd.error || "Verification failed."); setBusy(false); }
          },
          modal: { ondismiss: () => setBusy(false) },
        });
        rzp.open();
      } else {
        finish(form.takerName, d.token);
      }
    } catch { setError("Something went wrong."); setBusy(false); }
  }

  function finish(name: string, token: string) {
    setOpen(false); setBusy(false);
    setForm({ takerName: "", testType: "student", fee: String(prices.student), paymentMode: "offline" });
    setLink({ name, url: `${window.location.origin}/test/${token}` });
    setCopied(false);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-extrabold text-slate-900">Conduct Test</h1><p className="text-sm text-slate-500">Create a test, collect payment, and share the secure link.</p></div>
        <button onClick={() => setOpen(true)} className="btn-primary text-sm">+ Conduct New Test</button>
      </div>

      <div className="card overflow-x-auto p-4">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400"><tr><th className="py-2 font-semibold">User</th><th className="py-2 font-semibold">Test</th><th className="py-2 font-semibold">Fee</th><th className="py-2 font-semibold">Mode</th><th className="py-2 font-semibold">Status</th><th className="py-2 font-semibold text-right">Action</th></tr></thead>
          <tbody>
            {sessions.length === 0 ? <tr><td colSpan={6} className="py-10 text-center text-slate-400">No tests yet.</td></tr> : sessions.map((s) => (
              <tr key={s.token} className="border-t border-slate-100">
                <td className="py-2.5 font-medium text-slate-800">{s.takerName}</td>
                <td className="py-2.5 capitalize text-slate-500">{s.testType}</td>
                <td className="py-2.5 text-slate-500">{s.fee ? `₹${s.fee}` : "—"}</td>
                <td className="py-2.5 capitalize text-slate-500">{s.mode || "—"}{s.paymentStatus && s.paymentStatus !== "paid" ? ` (${s.paymentStatus})` : ""}</td>
                <td className="py-2.5"><span className={`badge ${STATUS_STYLE[s.status] || "bg-slate-100 text-slate-500"}`}>{s.status.replace("_", " ")}</span></td>
                <td className="py-2.5 text-right">
                  {s.status === "completed" ? <Link href={`/report/${s.token}`} className="font-semibold text-brand-600">View Report</Link>
                    : s.paid ? <Link href={`/test/${s.token}`} className="font-semibold text-brand-600">Open Test</Link>
                    : <span className="text-slate-300">unpaid</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setOpen(false)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="card w-full max-w-lg p-6">
            <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-bold text-slate-900">Conduct New Test</h3><button type="button" onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button></div>
            <div className="space-y-3">
              <div><label className="label">User / Student Name *</label><input className="input" value={form.takerName} onChange={(e) => setForm((f) => ({ ...f, takerName: e.target.value }))} /></div>
              <div><label className="label">Test Type</label>
                <select className="input" value={form.testType} onChange={(e) => setType(e.target.value)}>
                  <option value="student">Student Test (Class 9–10, Multiple Intelligence)</option>
                  <option value="employee">Employee / Self Assessment Test</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Fee (₹)</label><input className="input" type="number" value={form.fee} onChange={(e) => setForm((f) => ({ ...f, fee: e.target.value }))} /></div>
                <div><label className="label">Payment Mode</label>
                  <select className="input" value={form.paymentMode} onChange={(e) => setForm((f) => ({ ...f, paymentMode: e.target.value }))}>
                    <option value="offline">Offline (cash collected)</option>
                    <option value="manual">Manual entry</option>
                    <option value="online">Online (Razorpay)</option>
                  </select>
                </div>
              </div>
              <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
                Offline/Manual: test unlocks immediately and you owe AMG its share. Online: user pays via Razorpay and the split is recorded automatically.
              </p>
            </div>
            {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <div className="mt-4 flex justify-end gap-2"><button type="button" onClick={() => setOpen(false)} className="btn-outline text-sm">Cancel</button><button type="submit" disabled={busy} className="btn-primary text-sm">{busy ? "Processing…" : "Create Test"}</button></div>
          </form>
        </div>
      )}

      {link && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setLink(null)}>
          <div className="card w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex items-center justify-between"><h3 className="text-lg font-bold text-slate-900">Test Link Ready</h3><button onClick={() => setLink(null)} className="text-slate-400 hover:text-slate-600">✕</button></div>
            <p className="text-sm text-slate-500">Share this secure link with <strong>{link.name}</strong>.</p>
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
              <input readOnly value={link.url} className="flex-1 bg-transparent px-2 text-sm text-slate-700 outline-none" />
              <button onClick={() => { navigator.clipboard.writeText(link.url); setCopied(true); }} className="btn-primary px-3 py-1.5 text-xs">{copied ? "Copied!" : "Copy"}</button>
            </div>
            <div className="mt-4 flex justify-end"><a href={link.url} target="_blank" className="btn-accent text-sm">Open Test →</a></div>
          </div>
        </div>
      )}
    </div>
  );
}
