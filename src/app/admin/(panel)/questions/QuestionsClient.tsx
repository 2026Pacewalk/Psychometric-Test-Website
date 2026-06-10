"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SKILLS } from "@/lib/skills";

export interface QRow {
  id: string;
  order: number;
  textEn: string;
  textPa: string;
  skill: string;
  reverse: boolean;
  active: boolean;
}

export default function QuestionsClient({ rows }: { rows: QRow[] }) {
  const router = useRouter();
  const [edit, setEdit] = useState<QRow | null>(null);
  const [form, setForm] = useState<QRow | null>(null);
  const [saving, setSaving] = useState(false);

  function open(q: QRow) {
    setEdit(q);
    setForm({ ...q });
  }

  async function save() {
    if (!form) return;
    setSaving(true);
    await fetch(`/api/admin/questions/${form.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setEdit(null);
    router.refresh();
  }

  async function toggle(q: QRow, field: "active" | "reverse") {
    await fetch(`/api/admin/questions/${q.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: !q[field] }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Questions & Scoring Logic</h1>
        <p className="text-sm text-slate-500">
          Edit statements (English & Punjabi), map each to a skill, mark reverse-scored items, and enable/disable.
        </p>
      </div>

      <div className="card overflow-x-auto p-4">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400">
            <tr>
              <th className="py-2 font-semibold">#</th>
              <th className="py-2 font-semibold">Statement (EN)</th>
              <th className="py-2 font-semibold">Skill</th>
              <th className="py-2 font-semibold">Reverse</th>
              <th className="py-2 font-semibold">Active</th>
              <th className="py-2 font-semibold text-right">Edit</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((q) => (
              <tr key={q.id} className="border-t border-slate-100 align-top">
                <td className="py-2.5 text-slate-400">{q.order}</td>
                <td className="py-2.5 max-w-md text-slate-700">{q.textEn}</td>
                <td className="py-2.5">
                  <span className="badge bg-brand-50 capitalize text-brand-700">{q.skill}</span>
                </td>
                <td className="py-2.5">
                  <button onClick={() => toggle(q, "reverse")} className={`badge ${q.reverse ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-400"}`}>
                    {q.reverse ? "Yes" : "No"}
                  </button>
                </td>
                <td className="py-2.5">
                  <button onClick={() => toggle(q, "active")} className={`badge ${q.active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"}`}>
                    {q.active ? "Active" : "Off"}
                  </button>
                </td>
                <td className="py-2.5 text-right">
                  <button onClick={() => open(q)} className="font-semibold text-brand-600">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {edit && form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setEdit(null)}>
          <div className="card w-full max-w-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Edit Statement #{form.order}</h3>
              <button onClick={() => setEdit(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="label">English</label>
                <textarea className="input" rows={2} value={form.textEn} onChange={(e) => setForm({ ...form, textEn: e.target.value })} />
              </div>
              <div>
                <label className="label">Punjabi</label>
                <textarea className="input font-pa" rows={2} value={form.textPa} onChange={(e) => setForm({ ...form, textPa: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Skill</label>
                  <select className="input" value={form.skill} onChange={(e) => setForm({ ...form, skill: e.target.value })}>
                    {SKILLS.map((s) => (
                      <option key={s.key} value={s.key}>{s.en}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end gap-4 pb-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.reverse} onChange={(e) => setForm({ ...form, reverse: e.target.checked })} />
                    Reverse scored
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
                    Active
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setEdit(null)} className="btn-outline text-sm">Cancel</button>
              <button onClick={save} disabled={saving} className="btn-primary text-sm">{saving ? "Saving…" : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
