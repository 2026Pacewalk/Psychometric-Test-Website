"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export interface CompanyRow {
  id: string; name: string; code: string; email: string; phone: string;
  city: string; state: string; contactPerson: string; industry: string;
  status: string; employees: number;
}

const STATUSES = ["pending", "approved", "rejected", "suspended", "active", "inactive"];
const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700", approved: "bg-green-100 text-green-700",
  active: "bg-emerald-100 text-emerald-700", rejected: "bg-red-100 text-red-700",
  suspended: "bg-orange-100 text-orange-700", inactive: "bg-slate-200 text-slate-600",
};
const empty = { name: "", code: "", email: "", password: "", phone: "", city: "", state: "", contactPerson: "", industry: "", status: "approved" };

export default function CompaniesClient({ rows }: { rows: CompanyRow[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [modal, setModal] = useState<null | "add" | CompanyRow>(null);
  const [form, setForm] = useState<Record<string, string>>(empty);
  const [err, setErr] = useState(""); const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => rows.filter((r) => {
    if (!q) return true;
    const t = q.toLowerCase();
    return [r.name, r.code, r.city, r.email].some((v) => v.toLowerCase().includes(t));
  }), [rows, q]);

  function openAdd() { setForm(empty); setErr(""); setModal("add"); }
  function openEdit(c: CompanyRow) { setForm({ ...c, password: "" } as any); setErr(""); setModal(c); }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setSaving(true);
    const isAdd = modal === "add";
    const res = await fetch(isAdd ? "/api/admin/companies" : `/api/admin/companies/${(modal as CompanyRow).id}`, {
      method: isAdd ? "POST" : "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    setSaving(false);
    const d = await res.json().catch(() => ({}));
    if (!res.ok) return setErr(d.error || "Could not save.");
    setModal(null); router.refresh();
  }
  async function setStatus(c: CompanyRow, status: string) {
    await fetch(`/api/admin/companies/${c.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    router.refresh();
  }
  async function remove(c: CompanyRow) {
    if (!confirm(`Delete ${c.name}? This removes its employees and reports.`)) return;
    await fetch(`/api/admin/companies/${c.id}`, { method: "DELETE" }); router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-extrabold text-slate-900">Companies</h1><p className="text-sm text-slate-500">Add, edit, approve or suspend company accounts.</p></div>
        <button onClick={openAdd} className="btn-primary text-sm">+ Add Company</button>
      </div>

      <div className="card p-4">
        <input className="input mb-4 max-w-xs" placeholder="Search name, code, city…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-400"><tr><th className="py-2 font-semibold">Company</th><th className="py-2 font-semibold">Code</th><th className="py-2 font-semibold">City</th><th className="py-2 font-semibold">Employees</th><th className="py-2 font-semibold">Status</th><th className="py-2 font-semibold text-right">Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? <tr><td colSpan={6} className="py-10 text-center text-slate-400">No companies found.</td></tr> : filtered.map((c) => (
                <tr key={c.id} className="border-t border-slate-100">
                  <td className="py-3"><p className="font-medium text-slate-800">{c.name}</p><p className="text-xs text-slate-400">{c.email}</p></td>
                  <td className="py-3 font-mono text-xs text-slate-500">{c.code}</td>
                  <td className="py-3 text-slate-500">{c.city || "—"}</td>
                  <td className="py-3 text-slate-500">{c.employees}</td>
                  <td className="py-3"><select value={c.status} onChange={(e) => setStatus(c, e.target.value)} className={`badge cursor-pointer border-0 ${STATUS_STYLE[c.status] || "bg-slate-100"}`}>{STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select></td>
                  <td className="py-3"><div className="flex justify-end gap-2 text-xs font-semibold"><button onClick={() => openEdit(c)} className="rounded-lg bg-slate-100 px-3 py-1.5 text-slate-600 hover:bg-slate-200">Edit</button><button onClick={() => remove(c)} className="rounded-lg px-2 py-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600">Delete</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setModal(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={save} className="card max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6">
            <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-bold text-slate-900">{modal === "add" ? "Add Company" : "Edit Company"}</h3><button type="button" onClick={() => setModal(null)} className="text-slate-400 hover:text-slate-600">✕</button></div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <F label="Company Name *" k="name" form={form} setForm={setForm} />
              <F label="Company Code *" k="code" form={form} setForm={setForm} disabled={modal !== "add"} />
              <F label="Email *" k="email" form={form} setForm={setForm} disabled={modal !== "add"} />
              <F label={modal === "add" ? "Password *" : "Reset Password"} k="password" type="password" form={form} setForm={setForm} />
              <F label="Contact Person" k="contactPerson" form={form} setForm={setForm} />
              <F label="Industry" k="industry" form={form} setForm={setForm} />
              <F label="Phone" k="phone" form={form} setForm={setForm} />
              <F label="City" k="city" form={form} setForm={setForm} />
              <F label="State" k="state" form={form} setForm={setForm} />
              <div><label className="label">Status</label><select className="input" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
            </div>
            {err && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
            <div className="mt-4 flex justify-end gap-2"><button type="button" onClick={() => setModal(null)} className="btn-outline text-sm">Cancel</button><button type="submit" disabled={saving} className="btn-primary text-sm">{saving ? "Saving…" : "Save"}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}

function F({ label, k, form, setForm, type = "text", disabled = false }: { label: string; k: string; form: Record<string, string>; setForm: (f: (p: Record<string, string>) => Record<string, string>) => void; type?: string; disabled?: boolean; }) {
  return (
    <div><label className="label">{label}</label><input className={`input ${disabled ? "bg-slate-50" : ""}`} type={type} value={form[k] || ""} disabled={disabled} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} /></div>
  );
}
