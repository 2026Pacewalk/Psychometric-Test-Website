"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export interface EmployeeRow {
  id: string;
  name: string;
  designation: string | null;
  department: string | null;
  mobile: string | null;
  status: string;
  token: string | null;
}

const ADD_FIELDS = [
  ["name", "Employee Name *"],
  ["email", "Email"],
  ["mobile", "Mobile"],
  ["designation", "Designation"],
  ["department", "Department"],
  ["dob", "Date of Birth (dd/mm/yyyy)"],
] as const;

const STATUS_STYLE: Record<string, string> = {
  none: "bg-slate-100 text-slate-500",
  pending: "bg-amber-100 text-amber-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
};

export default function EmployeesClient({ initial }: { initial: EmployeeRow[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [linkModal, setLinkModal] = useState<{ name: string; url: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return initial;
    return initial.filter((e) =>
      [e.name, e.designation || "", e.department || "", e.mobile || ""].some((v) => v.toLowerCase().includes(q))
    );
  }, [initial, query]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name?.trim()) return setError("Employee name is required.");
    setSaving(true);
    const res = await fetch("/api/company/employees", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) { const d = await res.json().catch(() => ({})); return setError(d.error || "Could not add."); }
    setShowAdd(false); setForm({}); router.refresh();
  }

  async function startTest(emp: EmployeeRow) {
    const res = await fetch(`/api/company/employees/${emp.id}/start-test`, { method: "POST" });
    const d = await res.json();
    if (!res.ok) return alert(d.error || "Could not start test.");
    setLinkModal({ name: emp.name, url: `${window.location.origin}/test/${d.token}` });
    setCopied(false);
    router.refresh();
  }

  async function remove(emp: EmployeeRow) {
    if (!confirm(`Delete ${emp.name}?`)) return;
    const res = await fetch(`/api/company/employees/${emp.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Employees</h1>
          <p className="text-sm text-slate-500">Add employees, start the psychometric test and access reports.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary text-sm">+ Add Employee</button>
      </div>

      <div className="card p-4">
        <input className="input mb-4 max-w-sm" placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-400">
              <tr><th className="py-2 font-semibold">Name</th><th className="py-2 font-semibold">Designation</th><th className="py-2 font-semibold">Department</th><th className="py-2 font-semibold">Status</th><th className="py-2 font-semibold text-right">Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="py-10 text-center text-slate-400">No employees yet.</td></tr>
              ) : filtered.map((emp) => (
                <tr key={emp.id} className="border-t border-slate-100">
                  <td className="py-3 font-medium text-slate-800">{emp.name}</td>
                  <td className="py-3 text-slate-500">{emp.designation || "—"}</td>
                  <td className="py-3 text-slate-500">{emp.department || "—"}</td>
                  <td className="py-3"><span className={`badge ${STATUS_STYLE[emp.status] || STATUS_STYLE.none}`}>{emp.status === "none" ? "Not started" : emp.status.replace("_", " ")}</span></td>
                  <td className="py-3">
                    <div className="flex justify-end gap-2 text-xs font-semibold">
                      {emp.status === "completed" && emp.token ? (
                        <Link href={`/report/${emp.token}`} className="rounded-lg bg-brand-50 px-3 py-1.5 text-brand-700 hover:bg-brand-100">View Report</Link>
                      ) : (
                        <button onClick={() => startTest(emp)} className="rounded-lg bg-brand-600 px-3 py-1.5 text-white hover:bg-brand-700">{emp.status === "none" ? "Start Test" : "Get Link"}</button>
                      )}
                      <button onClick={() => remove(emp)} className="rounded-lg px-2 py-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <Modal title="Add Employee" onClose={() => setShowAdd(false)}>
          <form onSubmit={add} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {ADD_FIELDS.map(([k, label]) => (
              <div key={k}>
                <label className="label">{label}</label>
                <input className="input" value={form[k] || ""} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} />
              </div>
            ))}
            {error && <p className="sm:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <div className="sm:col-span-2 mt-2 flex justify-end gap-2">
              <button type="button" onClick={() => setShowAdd(false)} className="btn-outline text-sm">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary text-sm">{saving ? "Saving…" : "Add Employee"}</button>
            </div>
          </form>
        </Modal>
      )}

      {linkModal && (
        <Modal title="Test Link Ready" onClose={() => setLinkModal(null)}>
          <p className="text-sm text-slate-500">Share this secure link with <strong>{linkModal.name}</strong>.</p>
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
            <input readOnly value={linkModal.url} className="flex-1 bg-transparent px-2 text-sm text-slate-700 outline-none" />
            <button onClick={() => { navigator.clipboard.writeText(linkModal.url); setCopied(true); }} className="btn-primary px-3 py-1.5 text-xs">{copied ? "Copied!" : "Copy"}</button>
          </div>
          <div className="mt-4 flex justify-end"><a href={linkModal.url} target="_blank" className="btn-accent text-sm">Open Test →</a></div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="card max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
