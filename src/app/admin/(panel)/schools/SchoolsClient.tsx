"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export interface SchoolRow {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  address: string;
  principal: string;
  status: string;
  students: number;
}

const STATUSES = ["pending", "approved", "rejected", "suspended", "active", "inactive"];
const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  active: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  suspended: "bg-orange-100 text-orange-700",
  inactive: "bg-slate-200 text-slate-600",
};

const empty = { name: "", code: "", email: "", password: "", phone: "", city: "", state: "", address: "", principal: "", status: "approved" };

export default function SchoolsClient({ rows, initialStatus }: { rows: SchoolRow[]; initialStatus: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [modal, setModal] = useState<null | "add" | SchoolRow>(null);
  const [form, setForm] = useState<Record<string, string>>(empty);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        if (statusFilter && r.status !== statusFilter) return false;
        if (q) {
          const t = q.toLowerCase();
          return (
            r.name.toLowerCase().includes(t) ||
            r.code.toLowerCase().includes(t) ||
            r.city.toLowerCase().includes(t) ||
            r.email.toLowerCase().includes(t)
          );
        }
        return true;
      }),
    [rows, q, statusFilter]
  );

  function openAdd() {
    setForm(empty);
    setErr("");
    setModal("add");
  }
  function openEdit(s: SchoolRow) {
    setForm({ ...s, password: "" } as unknown as Record<string, string>);
    setErr("");
    setModal(s);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setSaving(true);
    const isAdd = modal === "add";
    const url = isAdd ? "/api/admin/schools" : `/api/admin/schools/${(modal as SchoolRow).id}`;
    const res = await fetch(url, {
      method: isAdd ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    const d = await res.json().catch(() => ({}));
    if (!res.ok) return setErr(d.error || "Could not save.");
    setModal(null);
    router.refresh();
  }

  async function setStatus(s: SchoolRow, status: string) {
    await fetch(`/api/admin/schools/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function remove(s: SchoolRow) {
    if (!confirm(`Delete ${s.name}? This removes all its students, tests and reports.`)) return;
    await fetch(`/api/admin/schools/${s.id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Schools</h1>
          <p className="text-sm text-slate-500">Add, edit, approve or suspend school accounts.</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm">+ Add School</button>
      </div>

      <div className="card p-4">
        <div className="mb-4 flex flex-wrap gap-3">
          <input className="input max-w-xs" placeholder="Search name, code, city…" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="input max-w-[180px]" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-400">
              <tr>
                <th className="py-2 font-semibold">School</th>
                <th className="py-2 font-semibold">Code</th>
                <th className="py-2 font-semibold">City</th>
                <th className="py-2 font-semibold">Students</th>
                <th className="py-2 font-semibold">Status</th>
                <th className="py-2 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-10 text-center text-slate-400">No schools found.</td></tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="border-t border-slate-100">
                    <td className="py-3">
                      <p className="font-medium text-slate-800">{s.name}</p>
                      <p className="text-xs text-slate-400">{s.email}</p>
                    </td>
                    <td className="py-3 font-mono text-xs text-slate-500">{s.code}</td>
                    <td className="py-3 text-slate-500">{s.city || "—"}</td>
                    <td className="py-3 text-slate-500">{s.students}</td>
                    <td className="py-3">
                      <select
                        value={s.status}
                        onChange={(e) => setStatus(s, e.target.value)}
                        className={`badge cursor-pointer border-0 ${STATUS_STYLE[s.status] || "bg-slate-100"}`}
                      >
                        {STATUSES.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3">
                      <div className="flex justify-end gap-2 text-xs font-semibold">
                        <button onClick={() => openEdit(s)} className="rounded-lg bg-slate-100 px-3 py-1.5 text-slate-600 hover:bg-slate-200">Edit</button>
                        <button onClick={() => remove(s)} className="rounded-lg px-2 py-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setModal(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={save} className="card max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">{modal === "add" ? "Add School" : "Edit School"}</h3>
              <button type="button" onClick={() => setModal(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="School Name *" k="name" form={form} setForm={setForm} />
              <Field label="School Code *" k="code" form={form} setForm={setForm} disabled={modal !== "add"} />
              <Field label="Email *" k="email" form={form} setForm={setForm} disabled={modal !== "add"} />
              <Field label={modal === "add" ? "Password *" : "Reset Password"} k="password" type="password" form={form} setForm={setForm} />
              <Field label="Principal" k="principal" form={form} setForm={setForm} />
              <Field label="Phone" k="phone" form={form} setForm={setForm} />
              <Field label="City" k="city" form={form} setForm={setForm} />
              <Field label="State" k="state" form={form} setForm={setForm} />
              <div className="sm:col-span-2">
                <Field label="Address" k="address" form={form} setForm={setForm} />
              </div>
              <div>
                <label className="label">Status</label>
                <select className="input" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            {err && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setModal(null)} className="btn-outline text-sm">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary text-sm">{saving ? "Saving…" : "Save"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Field({
  label, k, form, setForm, type = "text", disabled = false,
}: {
  label: string; k: string; form: Record<string, string>; setForm: (f: (p: Record<string, string>) => Record<string, string>) => void; type?: string; disabled?: boolean;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        className={`input ${disabled ? "bg-slate-50" : ""}`}
        type={type}
        value={form[k] || ""}
        disabled={disabled}
        onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
      />
    </div>
  );
}
