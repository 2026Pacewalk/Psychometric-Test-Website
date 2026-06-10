"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LogoutButton from "@/components/LogoutButton";

export interface PriceRow { key: string; label: string; amount: number; }
export interface SessionRow {
  token: string; testType: string; status: string; paid: boolean;
  completedAt: string | null; amount: number | null;
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function IndividualAccount({
  name, prices, sessions,
}: {
  name: string; prices: PriceRow[]; sessions: SessionRow[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  async function buy(pkg: string) {
    setError("");
    setBusy(pkg);
    try {
      const res = await fetch("/api/individual/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ package: pkg }),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.error || "Could not start payment."); setBusy(""); return; }

      const ok = await loadRazorpay();
      if (!ok) { setError("Could not load the payment gateway."); setBusy(""); return; }

      const rzp = new (window as any).Razorpay({
        key: d.keyId,
        order_id: d.orderId,
        amount: d.amount,
        currency: d.currency,
        name: "TestPsychometric",
        description: d.label,
        prefill: { name: d.name, email: d.email, contact: d.contact },
        theme: { color: "#1d4ed8" },
        handler: async (resp: any) => {
          const v = await fetch("/api/individual/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...resp, paymentId: d.paymentId }),
          });
          const vd = await v.json();
          if (v.ok && vd.token) {
            router.push(`/test/${vd.token}`);
          } else {
            setError(vd.error || "Payment verification failed.");
            setBusy("");
          }
        },
        modal: { ondismiss: () => setBusy("") },
      });
      rzp.open();
    } catch {
      setError("Something went wrong.");
      setBusy("");
    }
  }

  return (
    <div className="container-page py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Account</h1>
          <p className="text-sm text-slate-500">Welcome, {name}</p>
        </div>
        <LogoutButton className="btn-outline text-sm" />
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {/* Take a new test */}
      <h2 className="mt-8 text-lg font-bold text-slate-900">Take a New Test</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {prices.map((p) => (
          <div key={p.key} className="card flex flex-col p-6 text-center">
            <h3 className="text-sm font-bold text-slate-900">{p.label}</h3>
            <p className="mt-3 text-3xl font-extrabold text-brand-700">₹{p.amount}</p>
            <button onClick={() => buy(p.key)} disabled={busy === p.key} className="btn-primary mt-5">
              {busy === p.key ? "Starting…" : "Pay & Start"}
            </button>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-400">
        Payments are processed securely by Razorpay. Your test unlocks immediately after a successful payment.
      </p>

      {/* History */}
      <h2 className="mt-10 text-lg font-bold text-slate-900">My Tests &amp; Reports</h2>
      <div className="card mt-4 overflow-x-auto p-4">
        {sessions.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">No tests yet. Choose a test above to begin.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-slate-400">
              <tr>
                <th className="py-2 font-semibold">Test</th>
                <th className="py-2 font-semibold">Status</th>
                <th className="py-2 font-semibold">Amount</th>
                <th className="py-2 font-semibold">Date</th>
                <th className="py-2 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.token} className="border-t border-slate-100">
                  <td className="py-2.5 capitalize text-slate-800">{s.testType} test</td>
                  <td className="py-2.5 capitalize text-slate-500">{s.status.replace("_", " ")}{!s.paid && " · unpaid"}</td>
                  <td className="py-2.5 text-slate-500">{s.amount ? `₹${s.amount}` : "—"}</td>
                  <td className="py-2.5 text-slate-500">{s.completedAt ? new Date(s.completedAt).toLocaleDateString("en-GB") : "—"}</td>
                  <td className="py-2.5 text-right">
                    {s.status === "completed" ? (
                      <Link href={`/report/${s.token}`} className="font-semibold text-brand-600">View Report</Link>
                    ) : s.paid ? (
                      <Link href={`/test/${s.token}`} className="font-semibold text-brand-600">Continue Test</Link>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
