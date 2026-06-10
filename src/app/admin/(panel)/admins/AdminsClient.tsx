"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PERMISSIONS, PERMISSION_LABELS, Permission } from "@/lib/permissions";

export interface AdminRow {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  active: boolean;
  isSelf: boolean;
}

const ROLES = ["superadmin", "admin", "viewer"];

export default function AdminsClient({ rows }: { rows: AdminRow[] }) {
  const router = useRouter();
  const [modal, setModal] = useState<null | "add" | AdminRow>(null);
  const [form, setForm] = useState<any>({ role: "admin", permissions: [] });
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  function openAdd() {
    setForm({ name: "", email: "", password: "", role: "admin", permissions: [] });
    setErr("");
    setModal("add");
  }
  function openEdit(u: AdminRow) {
    setForm({ ...u, password: "" });
    setErr("");
    setModal(u);
  }

  function togglePerm(p: Permission) {
    setForm((f: any) => ({
      ...f,
      permissions: f.permissions.includes(p)
        ? f.permissions.filter((x: string) => x !== p)
        : [...f.permissions, p],
    }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setSaving(true);
    const isAdd = modal === "add";
    const res = await fetch(isAdd ? "/api/admin/admins" : `/api/admin/admins/${(modal as AdminRow).id}`, {
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

  async function toggleActive(u: AdminRow) {
    await fetch(`/api/admin/admins/${u.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !u.active }),
    });
    router.refresh();
  }
  async function remove(u: AdminRow) {
    if (!confirm(`Delete admin ${u.name}?`)) return;
    const res = await fetch(`/api/admin/admins/${u.id}`, { method: "DELETE" });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) return alert(d.error || "Could not delete.");
    router.refresh();
  }

  const isSuper = form.role === "superadmin";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Admin Users</h1>
          <p className="text-sm text-slate-500">Manage administrators, roles and permissions.</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm">+ Add Admin</button>
      </div>

      <div className="card overflow-x-auto p-4">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400">
            <tr>
              <th className="py-2 font-semibold">Name</th>
              <th className="py-2 font-semibold">Email</th>
              <th className="py-2 font-semibold">Role</th>
              <th className="py-2 font-semibold">Active</th>
              <th className="py-2 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} className="border-t border-slate-100">
                <td className="py-3 font-medium text-slate-800">
                  {u.name} {u.isSelf && <span className="text-xs text-slate-400">(you)</span>}
                </td>
                <td className="py-3 text-slate-500">{u.email}</td>
                <td className="py-3"><span className="badge bg-brand-50 capitalize text-brand-700">{u.role}</span></td>
                <td className="py-3">
                  <button onClick={() => toggleActive(u)} className={`badge ${u.active ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-500"}`}>
                    {u.active ? "Active" : "Suspended"}
                  </button>
                </td>
                <td className="py-3">
                  <div className="flex justify-end gap-2 text-xs font-semibold">
                    <button onClick={() => openEdit(u)} className="rounded-lg bg-slate-100 px-3 py-1.5 text-slate-600 hover:bg-slate-200">Edit</button>
                    {!u.isSelf && (
                      <button onClick={() => remove(u)} className="rounded-lg px-2 py-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600">Delete</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setModal(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={save} className="card max-h-[90vh] w-full max-w-xl overflow-y-auto p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">{modal === "add" ? "Add Admin" : "Edit Admin"}</h3>
              <button type="button" onClick={() => setModal(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Name</label>
                  <input className="input" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input className="input" type="email" disabled={modal !== "add"} value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className="label">{modal === "add" ? "Password" : "Reset Password"}</label>
                  <input className="input" type="password" value={form.password || ""} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                </div>
                <div>
                  <label className="label">Role</label>
                  <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                    {ROLES.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Permissions</label>
                {isSuper ? (
                  <p className="rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-700">Super admins have all permissions.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {PERMISSIONS.map((p) => (
                      <label key={p} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm">
                        <input type="checkbox" checked={form.permissions?.includes(p)} onChange={() => togglePerm(p)} />
                        {PERMISSION_LABELS[p]}
                      </label>
                    ))}
                  </div>
                )}
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
