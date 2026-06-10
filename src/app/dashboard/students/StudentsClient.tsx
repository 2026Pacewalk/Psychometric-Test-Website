"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export interface StudentRow {
  id: string;
  name: string;
  classCourse: string | null;
  mobile: string | null;
  category: string | null;
  status: string;
  token: string | null;
  score: number | null;
}

const ADD_FIELDS = [
  ["name", "Student Name *"],
  ["fatherName", "Father Name"],
  ["motherName", "Mother Name"],
  ["mobile", "Mobile Number"],
  ["otherMobile", "Other Mobile"],
  ["dob", "Date of Birth (dd/mm/yyyy)"],
  ["classCourse", "Class / Course"],
  ["qualification", "Qualification"],
  ["aim", "Aim / Career Goal"],
  ["venue", "Venue / Test Location"],
] as const;

const STATUS_STYLE: Record<string, string> = {
  none: "bg-slate-100 text-slate-500",
  pending: "bg-amber-100 text-amber-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
};

export default function StudentsClient({ initial }: { initial: StudentRow[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({ category: "GEN" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [linkModal, setLinkModal] = useState<{ name: string; url: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return initial;
    return initial.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.classCourse || "").toLowerCase().includes(q) ||
        (s.mobile || "").includes(q)
    );
  }, [initial, query]);

  async function addStudent(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name?.trim()) return setError("Student name is required.");
    setSaving(true);
    const res = await fetch("/api/school/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      return setError(d.error || "Could not add student.");
    }
    setShowAdd(false);
    setForm({ category: "GEN" });
    router.refresh();
  }

  async function startTest(s: StudentRow) {
    const res = await fetch(`/api/school/students/${s.id}/start-test`, { method: "POST" });
    const d = await res.json();
    if (!res.ok) return alert(d.error || "Could not start test.");
    const url = `${window.location.origin}/test/${d.token}`;
    setLinkModal({ name: s.name, url });
    setCopied(false);
    router.refresh();
  }

  async function remove(s: StudentRow) {
    if (!confirm(`Delete ${s.name}? This removes their tests and reports.`)) return;
    const res = await fetch(`/api/school/students/${s.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Students</h1>
          <p className="text-sm text-slate-500">Add students, start tests and access reports.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary text-sm">
          + Add Student
        </button>
      </div>

      <div className="card p-4">
        <input
          className="input mb-4 max-w-sm"
          placeholder="Search by name, class or mobile…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-400">
              <tr>
                <th className="py-2 font-semibold">Name</th>
                <th className="py-2 font-semibold">Class</th>
                <th className="py-2 font-semibold">Mobile</th>
                <th className="py-2 font-semibold">Status</th>
                <th className="py-2 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400">
                    No students found. Click “Add Student” to begin.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="border-t border-slate-100">
                    <td className="py-3 font-medium text-slate-800">{s.name}</td>
                    <td className="py-3 text-slate-500">{s.classCourse || "—"}</td>
                    <td className="py-3 text-slate-500">{s.mobile || "—"}</td>
                    <td className="py-3">
                      <span className={`badge ${STATUS_STYLE[s.status] || STATUS_STYLE.none}`}>
                        {s.status === "none" ? "Not started" : s.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex justify-end gap-2 text-xs font-semibold">
                        {s.status === "completed" && s.token ? (
                          <Link href={`/report/${s.token}`} className="rounded-lg bg-brand-50 px-3 py-1.5 text-brand-700 hover:bg-brand-100">
                            View Report
                          </Link>
                        ) : (
                          <button onClick={() => startTest(s)} className="rounded-lg bg-brand-600 px-3 py-1.5 text-white hover:bg-brand-700">
                            {s.status === "none" ? "Start Test" : "Get Link"}
                          </button>
                        )}
                        <button onClick={() => remove(s)} className="rounded-lg px-2 py-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add modal */}
      {showAdd && (
        <Modal onClose={() => setShowAdd(false)} title="Add Student">
          <form onSubmit={addStudent} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {ADD_FIELDS.map(([key, label]) => (
              <div key={key}>
                <label className="label">{label}</label>
                <input
                  className="input"
                  value={form[key] || ""}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                />
              </div>
            ))}
            <div>
              <label className="label">Category</label>
              <select className="input" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {["GEN", "OBC", "SC", "OTHER"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            {error && <p className="sm:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <div className="sm:col-span-2 mt-2 flex justify-end gap-2">
              <button type="button" onClick={() => setShowAdd(false)} className="btn-outline text-sm">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary text-sm">
                {saving ? "Saving…" : "Add Student"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Link modal */}
      {linkModal && (
        <Modal onClose={() => setLinkModal(null)} title="Test Link Ready">
          <p className="text-sm text-slate-500">
            Share this secure link with <strong>{linkModal.name}</strong>, or open it now to start the test.
          </p>
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
            <input readOnly value={linkModal.url} className="flex-1 bg-transparent px-2 text-sm text-slate-700 outline-none" />
            <button
              onClick={() => {
                navigator.clipboard.writeText(linkModal.url);
                setCopied(true);
              }}
              className="btn-primary px-3 py-1.5 text-xs"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <a href={linkModal.url} target="_blank" className="btn-accent text-sm">
              Open Test →
            </a>
          </div>
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
