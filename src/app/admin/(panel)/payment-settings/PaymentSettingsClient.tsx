"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface S { joiningFee: number; upiId: string; upiName: string; hasQr: boolean; }

export default function PaymentSettingsClient({ settings }: { settings: S }) {
  const router = useRouter();
  const [msg, setMsg] = useState(""); const [err, setErr] = useState(""); const [saving, setSaving] = useState(false);
  const [bust, setBust] = useState(0);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setMsg(""); setErr(""); setSaving(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/settings", { method: "POST", body: fd });
    setSaving(false);
    const d = await res.json().catch(() => ({}));
    if (!res.ok) return setErr(d.error || "Could not save.");
    setMsg("Settings saved."); setBust(Date.now()); router.refresh();
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div><h1 className="text-2xl font-extrabold text-slate-900">Joining Fee &amp; Payment Settings</h1><p className="text-sm text-slate-500">Set the study-centre joining fee, UPI details and payment QR code.</p></div>
      <form onSubmit={save} className="card space-y-5 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div><label className="label">Joining Fee (₹)</label><input name="joiningFee" type="number" defaultValue={settings.joiningFee} className="input" /></div>
          <div><label className="label">UPI ID</label><input name="upiId" defaultValue={settings.upiId} className="input" placeholder="name@bank" /></div>
          <div className="sm:col-span-2"><label className="label">UPI / Payee Name</label><input name="upiName" defaultValue={settings.upiName} className="input" /></div>
        </div>
        <div className="border-t border-slate-100 pt-5">
          <label className="label">Payment QR Code</label>
          <div className="flex items-center gap-4">
            <div className="flex h-32 w-32 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
              {settings.hasQr ? <img src={`/api/centre/qr?v=${bust}`} alt="QR" className="h-28 w-28 object-contain" /> : <span className="text-xs text-slate-400">No QR</span>}
            </div>
            <div>
              <input name="qr" type="file" accept=".png,.jpg,.jpeg" className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-700" />
              <p className="mt-1 text-xs text-slate-400">PNG/JPG, max 3 MB. Shown to applicants on the public page.</p>
            </div>
          </div>
        </div>
        {msg && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{msg}</p>}
        {err && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
        <button type="submit" disabled={saving} className="btn-primary text-sm">{saving ? "Saving…" : "Save Settings"}</button>
      </form>
    </div>
  );
}
