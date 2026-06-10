"use client";

import Link from "next/link";
import { useState } from "react";
import { Section, PageHeader } from "@/components/site/ui";

const PAY_STYLE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700", approved: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700",
};

export default function CentreStatusPage() {
  const [form, setForm] = useState({ code: "", email: "" });
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function check(e: React.FormEvent) {
    e.preventDefault(); setError(""); setData(null); setLoading(true);
    const res = await fetch("/api/centre/status", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const d = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) return setError(d.error || "Not found.");
    setData(d);
  }

  return (
    <>
      <PageHeader eyebrow="Study Centre" title="Application Status" subtitle="Check the status of your study-centre application and joining-fee payment." />
      <Section>
        <div className="container-page max-w-xl">
          <form onSubmit={check} className="card space-y-4 p-6">
            <div><label className="label">Application Code</label><input className="input" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} placeholder="e.g. ACAB12" /></div>
            <div><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} /></div>
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary">{loading ? "Checking…" : "Check Status"}</button>
          </form>

          {data && (
            <div className="card mt-6 p-6">
              <h3 className="text-lg font-bold text-slate-900">{data.name} <span className="font-mono text-sm text-slate-400">{data.code}</span></h3>
              <p className="mt-2 text-sm">Application status: <span className="font-semibold text-brand-700">{data.statusLabel}</span></p>
              {data.payment && (
                <div className="mt-4 space-y-1 border-t border-slate-100 pt-4 text-sm">
                  <p>Joining fee: <strong>₹{data.payment.amount}</strong> · Mode: <strong className="uppercase">{data.payment.mode}</strong></p>
                  <p>Payment status: <span className={`badge ${PAY_STYLE[data.payment.status] || "bg-slate-100"}`}>{data.payment.status}</span></p>
                  {data.payment.reference && <p className="text-slate-500">Reference: {data.payment.reference}</p>}
                  {data.payment.hasProof && <p className="text-slate-500">✔ Payment proof uploaded</p>}
                  {data.payment.receiptNo && <p className="text-slate-500">Receipt No: <span className="font-mono">{data.payment.receiptNo}</span></p>}
                  {data.payment.remarks && <p className="text-slate-500">Admin remarks: {data.payment.remarks}</p>}
                </div>
              )}
              {data.canLogin ? (
                <Link href="/centre-login" className="btn-primary mt-5 text-sm">Login to your dashboard →</Link>
              ) : (
                <p className="mt-5 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">Your login will be activated once the admin approves your joining-fee payment.</p>
              )}
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
