"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LogoutButton from "@/components/LogoutButton";

export interface PriceRow { key: string; label: string; amount: number; }
export interface SessionRow {
  token: string; testType: string; status: string; paid: boolean;
  completedAt: string | null; amount: number | null;
  payMode: string | null; payStatus: string | null; receiptNo: string | null; paymentId: string | null;
}
interface PaySettings { upiId: string; upiName: string; hasQr: boolean; }

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true); s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function IndividualAccount({
  name, prices, sessions, razorpayActive, pay,
}: {
  name: string; prices: PriceRow[]; sessions: SessionRow[]; razorpayActive: boolean; pay: PaySettings;
}) {
  const router = useRouter();
  const [sel, setSel] = useState<PriceRow | null>(null);
  const [method, setMethod] = useState<"razorpay" | "qr" | "cash">(razorpayActive ? "razorpay" : "qr");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  function startBuy(p: PriceRow) {
    setSel(p); setMethod(razorpayActive ? "razorpay" : "qr"); setError(""); setDone("");
  }

  async function payRazorpay() {
    setError(""); setBusy(true);
    const res = await fetch("/api/individual/start", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ package: sel!.key }) });
    const d = await res.json();
    if (!res.ok) { setError(d.error || "Could not start payment."); setBusy(false); return; }
    const ok = await loadRazorpay();
    if (!ok) { setError("Could not load the payment gateway."); setBusy(false); return; }
    const rzp = new (window as any).Razorpay({
      key: d.keyId, order_id: d.orderId, amount: d.amount, currency: d.currency,
      name: "TestPsychometric", description: d.label, prefill: { name: d.name, email: d.email, contact: d.contact },
      theme: { color: "#1d4ed8" },
      handler: async (resp: any) => {
        const v = await fetch("/api/individual/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...resp, paymentId: d.paymentId }) });
        const vd = await v.json();
        if (v.ok && vd.token) router.push(`/test/${vd.token}`);
        else { setError(vd.error || "Verification failed."); setBusy(false); }
      },
      modal: { ondismiss: () => setBusy(false) },
    });
    rzp.open();
  }

  async function submitProof(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(""); setBusy(true);
    const fd = new FormData(e.currentTarget);
    fd.set("package", sel!.key);
    fd.set("mode", method);
    const res = await fetch("/api/individual/submit-proof", { method: "POST", body: fd });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setError(d.error || "Could not submit."); return; }
    setSel(null);
    setDone(method === "cash" ? "Cash payment request submitted — awaiting admin approval." : "Payment proof submitted — awaiting admin verification.");
    router.refresh();
  }

  const STATUS_LABEL: Record<string, string> = {
    pending: "Payment Under Verification", paid: "Payment Approved", failed: "Payment Failed", rejected: "Payment Rejected", created: "Payment Pending",
  };

  return (
    <div className="container-page py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-extrabold text-slate-900">My Account</h1><p className="text-sm text-slate-500">Welcome, {name}</p></div>
        <LogoutButton className="btn-outline text-sm" />
      </div>

      {done && <p className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{done}</p>}

      {/* Take a new test */}
      <h2 className="mt-8 text-lg font-bold text-slate-900">Take a New Test</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {prices.map((p) => (
          <div key={p.key} className="card flex flex-col p-6 text-center">
            <h3 className="text-sm font-bold text-slate-900">{p.label}</h3>
            <p className="mt-3 text-3xl font-extrabold text-brand-700">₹{p.amount}</p>
            <button onClick={() => startBuy(p)} className="btn-primary mt-5">Pay &amp; Start</button>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-400">Pay by UPI/QR or Cash (admin-verified){razorpayActive ? ", or online card via Razorpay" : ""}. Your test unlocks after the payment is confirmed.</p>

      {/* History */}
      <h2 className="mt-10 text-lg font-bold text-slate-900">My Tests &amp; Reports</h2>
      <div className="card mt-4 overflow-x-auto p-4">
        {sessions.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">No tests yet. Choose a test above to begin.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-slate-400"><tr><th className="py-2 font-semibold">Test</th><th className="py-2 font-semibold">Method</th><th className="py-2 font-semibold">Payment</th><th className="py-2 font-semibold">Receipt</th><th className="py-2 font-semibold text-right">Action</th></tr></thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.token} className="border-t border-slate-100">
                  <td className="py-2.5 capitalize text-slate-800">{s.testType} test{s.amount ? ` · ₹${s.amount}` : ""}</td>
                  <td className="py-2.5 uppercase text-slate-500">{s.payMode || "—"}</td>
                  <td className="py-2.5 text-slate-500">{STATUS_LABEL[s.payStatus || ""] || (s.paid ? "Approved" : "Pending")}</td>
                  <td className="py-2.5 text-slate-500">{s.receiptNo ? <Link href={`/individual/receipt/${s.paymentId}`} className="font-semibold text-brand-600">{s.receiptNo}</Link> : "—"}</td>
                  <td className="py-2.5 text-right">
                    {s.status === "completed" ? <Link href={`/report/${s.token}`} className="font-semibold text-brand-600">View Report</Link>
                      : s.paid ? <Link href={`/test/${s.token}`} className="font-semibold text-green-700">Start Test</Link>
                      : <span className="text-xs text-amber-600">Awaiting approval</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Payment method modal */}
      {sel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSel(null)}>
          <div className="card max-h-[90vh] w-full max-w-lg overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-1 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Choose Payment Method</h3>
              <button onClick={() => setSel(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <p className="text-sm text-slate-500">{sel.label} — <span className="font-bold text-brand-700">₹{sel.amount}</span></p>

            <div className="mt-4 flex flex-wrap gap-2">
              {razorpayActive && <MethodBtn active={method === "razorpay"} onClick={() => setMethod("razorpay")}>Pay Online</MethodBtn>}
              <MethodBtn active={method === "qr"} onClick={() => setMethod("qr")}>UPI / QR Code</MethodBtn>
              <MethodBtn active={method === "cash"} onClick={() => setMethod("cash")}>Cash</MethodBtn>
            </div>

            {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

            {method === "razorpay" && (
              <div className="mt-4">
                <p className="text-sm text-slate-600">Pay securely by card / netbanking / UPI via Razorpay. Your test unlocks instantly.</p>
                <button onClick={payRazorpay} disabled={busy} className="btn-primary mt-3">{busy ? "Starting…" : `Pay ₹${sel.amount} Online`}</button>
              </div>
            )}

            {method === "qr" && (
              <form onSubmit={submitProof} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4 text-center">
                  {pay.hasQr ? <img src="/api/centre/qr" alt="Payment QR" className="mx-auto h-40 w-40 object-contain" /> : <div className="flex h-40 items-center justify-center rounded-lg bg-slate-50 text-xs text-slate-400">QR not available</div>}
                  <p className="mt-2 text-sm font-semibold text-slate-700">{pay.upiName}</p>
                  {pay.upiId && <p className="text-xs text-slate-500">UPI: {pay.upiId}</p>}
                  <p className="mt-1 text-xs text-slate-400">Scan &amp; pay ₹{sel.amount}</p>
                </div>
                <div className="space-y-3">
                  <div><label className="label">Transaction ID / UTR *</label><input name="reference" required className="input" /></div>
                  <div><label className="label">Payment Screenshot</label><input name="proof" type="file" accept=".jpg,.jpeg,.png,.pdf" className="block w-full text-xs text-slate-600 file:mr-2 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:font-semibold file:text-brand-700" /></div>
                  <button type="submit" disabled={busy} className="btn-primary w-full text-sm">{busy ? "Submitting…" : "Submit Payment Proof"}</button>
                </div>
              </form>
            )}

            {method === "cash" && (
              <form onSubmit={submitProof} className="mt-4 space-y-3">
                <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Request cash payment approval. Our team will confirm your cash payment and unlock the test.</div>
                <input type="hidden" name="reference" value="" />
                <div><label className="label">Remarks (optional)</label><textarea name="remarks" rows={2} className="input" placeholder="When/where you will pay cash, or any note" /></div>
                <button type="submit" disabled={busy} className="btn-primary text-sm">{busy ? "Submitting…" : "Request Cash Payment Approval"}</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MethodBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className={`rounded-lg border px-4 py-2 text-sm font-medium ${active ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-600"}`}>
      {children}
    </button>
  );
}
