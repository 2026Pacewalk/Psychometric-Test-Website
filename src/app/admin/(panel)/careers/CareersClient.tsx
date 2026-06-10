"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface CRow {
  type: string;
  label: string;
  fields: string;
  traits: string;
  formula: string;
}

export default function CareersClient({ rows }: { rows: CRow[] }) {
  const router = useRouter();
  const [forms, setForms] = useState<Record<string, CRow>>(
    Object.fromEntries(rows.map((r) => [r.type, r]))
  );
  const [savingType, setSavingType] = useState("");
  const [savedType, setSavedType] = useState("");

  async function save(type: string) {
    setSavingType(type);
    await fetch(`/api/admin/careers/${type}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(forms[type]),
    });
    setSavingType("");
    setSavedType(type);
    setTimeout(() => setSavedType(""), 1500);
    router.refresh();
  }

  const set = (type: string, k: keyof CRow, v: string) =>
    setForms((f) => ({ ...f, [type]: { ...f[type], [k]: v } }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">RIASEC Career Suggestions</h1>
        <p className="text-sm text-slate-500">Edit the career fields, traits and skill formula shown in every report.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {rows.map((r) => {
          const f = forms[r.type];
          return (
            <div key={r.type} className="card space-y-3 p-5">
              <div className="flex items-center justify-between">
                <input
                  className="input max-w-[200px] font-bold"
                  value={f.label}
                  onChange={(e) => set(r.type, "label", e.target.value)}
                />
                <span className="text-xs uppercase text-slate-400">{r.type}</span>
              </div>
              <div>
                <label className="label">Career Fields</label>
                <textarea className="input" rows={2} value={f.fields} onChange={(e) => set(r.type, "fields", e.target.value)} />
              </div>
              <div>
                <label className="label">Typical Traits</label>
                <textarea className="input" rows={2} value={f.traits} onChange={(e) => set(r.type, "traits", e.target.value)} />
              </div>
              <div>
                <label className="label">Skill Formula</label>
                <input className="input" value={f.formula} onChange={(e) => set(r.type, "formula", e.target.value)} />
              </div>
              <button onClick={() => save(r.type)} disabled={savingType === r.type} className="btn-primary text-sm">
                {savingType === r.type ? "Saving…" : savedType === r.type ? "Saved ✓" : "Save"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
