"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Settings { joiningFee: number; upiId: string; upiName: string; hasQr: boolean; }
interface Payment { amount: number; mode: string; status: string; reference: string; paymentDate: string; hasProof: boolean; receiptNo: string; remarks: string; }

export default function BillingClient({
  status, commissionPercent, settings, payment,
}: {
  status: string; commissionPercent: number; settings: Settings; payment: Payment | null;
}) {
  const router = useRouter();
  const [mode, setMode] = useState("upi");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const approved = payment?.status === "approved";
  const verifying = payment?.status === "pending" && status === "payment_verification";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(""); setBusy(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/centre/pay", { method: "POST", body: fd });
    setBusy(false);
    const d = await res.json().catch(() => ({}));
    if (!res.ok) return setError(d.error || "Could not submit payment.");
    router.refresh();
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Billing &amp; Joining Fee</h1>
        <p className="text-sm text-slate-500">Complete your one-time joining fee to activate your study-centre account.</p>
      </div>

      {/* Status */}
      <div className={`rounded-2xl border px-5 py-4 ${approved ? "border-green-200 bg-green-50" : verifying ? "border-blue-200 bg-blue-50" : "border-amber-200 bg-amber-50"}`}>
        {approved ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-green-800">✓ Joining fee approved — your account is active. Receipt {payment?.receiptNo}</p>
            <Link href="/centre/receipt" className="btn-primary text-sm">View / Print Receipt</Link>
          </div>
        ) : verifying ? (
          <p className="text-sm font-semibold text-blue-800">⏳ Payment submitted — under verification by admin. You'll be activated once approved.</p>
        ) : (
          <p className="text-sm font-semibold text-amber-800">Your account is <strong>Payment Pending</strong>. Pay the joining fee below and submit the details for verification.</p>
        )}
        {payment?.remarks && <p className="mt-1 text-xs text-slate-500">Admin remarks: {payment.remarks}</p>}
      </div>

      {/* Pay form (hidden once approved) */}
      {!approved && (
        <div className="card p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-bold text-slate-900">Joining Fee</h2>
            <span className="text-2xl font-extrabold text-brand-700">₹{settings.joiningFee}/-</span>
          </div>
          <p className="mt-1 text-sm text-slate-500">Pay by Cash at our office, or by UPI / QR code, then submit the details below.</p>

          <div className="mt-4 flex gap-2">
            {["upi", "cash"].map((m) => (
              <button type="button" key={m} onClick={() => setMode(m)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium ${mode === m ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-600"}`}>
                {m === "upi" ? "UPI / QR Code" : "Cash"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-4">
            <input type="hidden" name="mode" value={mode} />
            {mode === "upi" ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4 text-center">
                  {settings.hasQr ? <img src="/api/centre/qr" alt="Payment QR" className="mx-auto h-44 w-44 object-contain" /> : <div className="flex h-44 items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-400">QR not available</div>}
                  <p className="mt-2 text-sm font-semibold text-slate-700">{settings.upiName}</p>
                  {settings.upiId && <p className="text-xs text-slate-500">UPI: {settings.upiId}</p>}
                  <p className="mt-1 text-xs text-slate-400">Scan &amp; pay ₹{settings.joiningFee}</p>
                </div>
                <div className="space-y-3">
                  <div><label className="label">Transaction ID / UTR *</label><input name="reference" className="input" required /></div>
                  <div><label className="label">Payment Date</label><input name="paymentDate" type="date" className="input" /></div>
                  <div><label className="label">Payment Screenshot</label>
                    <input name="proof" type="file" accept=".jpg,.jpeg,.png,.pdf" className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-700" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Pay ₹{settings.joiningFee} in cash at our office, then enter the receipt details for verification.</div>
                <div><label className="label">Cash Receipt No.</label><input name="reference" className="input" /></div>
                <div><label className="label">Collected By</label><input name="collectedBy" className="input" /></div>
                <div><label className="label">Payment Date</label><input name="paymentDate" type="date" className="input" /></div>
              </div>
            )}
            {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <button type="submit" disabled={busy} className="btn-primary mt-4 text-sm">
              {busy ? "Submitting…" : verifying ? "Update Payment Details" : "Submit Payment for Verification"}
            </button>
          </form>
        </div>
      )}

      {/* Commission / revenue sharing (visible inside dashboard only) */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-slate-900">Commission &amp; Revenue Sharing</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-green-50 p-4 text-center">
            <p className="text-2xl font-extrabold text-green-700">{100 - commissionPercent}%</p>
            <p className="text-xs text-slate-500">Your Centre Earns</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 text-center">
            <p className="text-2xl font-extrabold text-slate-700">{commissionPercent}%</p>
            <p className="text-xs text-slate-500">AMG Platform Fee</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-500">
          For every test you conduct, you keep {100 - commissionPercent}% of the fee and {commissionPercent}% goes to AMG.
          Track earnings, AMG share, profit and settlements in <Link href="/centre/wallet" className="font-semibold text-brand-600">Wallet &amp; Settlements</Link> (available after activation).
        </p>
      </div>
    </div>
  );
}
