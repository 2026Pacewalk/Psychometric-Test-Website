"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface P {
  name: string; code: string; email: string; phone: string; city: string;
  state: string; contactPerson: string; industry: string; status: string;
}

export default function CompanyProfileClient({ company }: { company: P }) {
  const router = useRouter();
  const [form, setForm] = useState(company);
  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "" });
  const [msg, setMsg] = useState(""); const [err, setErr] = useState(""); const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault(); setMsg(""); setErr(""); setSaving(true);
    const res = await fetch("/api/company/profile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, ...pwd }) });
    setSaving(false);
    const d = await res.json().catch(() => ({}));
    if (!res.ok) return setErr(d.error || "Could not save.");
    setMsg("Profile saved."); setPwd({ currentPassword: "", newPassword: "" }); router.refresh();
  }
  const set = (k: keyof P) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="max-w-3xl space-y-6">
      <div><h1 className="text-2xl font-extrabold text-slate-900">Company Profile</h1><p className="text-sm text-slate-500">Manage your company details and password.</p></div>
      <form onSubmit={save} className="card space-y-5 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div><label className="label">Company Name</label><input className="input" value={form.name} onChange={set("name")} /></div>
          <div><label className="label">Company Code</label><input className="input bg-slate-50" value={form.code} readOnly /></div>
          <div><label className="label">Email</label><input className="input bg-slate-50" value={form.email} readOnly /></div>
          <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={set("phone")} /></div>
          <div><label className="label">Contact Person</label><input className="input" value={form.contactPerson} onChange={set("contactPerson")} /></div>
          <div><label className="label">Industry</label><input className="input" value={form.industry} onChange={set("industry")} /></div>
          <div><label className="label">City</label><input className="input" value={form.city} onChange={set("city")} /></div>
          <div><label className="label">State</label><input className="input" value={form.state} onChange={set("state")} /></div>
        </div>
        <div className="border-t border-slate-100 pt-5">
          <h3 className="mb-3 font-bold text-slate-800">Change Password</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div><label className="label">Current Password</label><input className="input" type="password" value={pwd.currentPassword} onChange={(e) => setPwd((p) => ({ ...p, currentPassword: e.target.value }))} /></div>
            <div><label className="label">New Password</label><input className="input" type="password" value={pwd.newPassword} onChange={(e) => setPwd((p) => ({ ...p, newPassword: e.target.value }))} /></div>
          </div>
        </div>
        {msg && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{msg}</p>}
        {err && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
        <button type="submit" disabled={saving} className="btn-primary text-sm">{saving ? "Saving…" : "Save Changes"}</button>
      </form>
    </div>
  );
}
