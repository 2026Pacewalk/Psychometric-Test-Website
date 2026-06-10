"use client";

import { useState } from "react";

export interface Tpl { key: string; category: string; subject: string; body: string }

export default function EmailTemplatesClient({ rows }: { rows: Tpl[] }) {
  const [state, setState] = useState<Record<string, Tpl>>(Object.fromEntries(rows.map((r) => [r.key, r])));
  const [openKey, setOpenKey] = useState<string>("");
  const [saving, setSaving] = useState("");
  const [saved, setSaved] = useState("");

  async function save(key: string) {
    setSaving(key);
    await fetch(`/api/admin/email-templates/${key}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject: state[key].subject, body: state[key].body }),
    });
    setSaving(""); setSaved(key); setTimeout(() => setSaved(""), 1500);
  }
  const set = (key: string, field: "subject" | "body", v: string) =>
    setState((s) => ({ ...s, [key]: { ...s[key], [field]: v } }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Email Templates</h1>
        <p className="text-sm text-slate-500">Edit the subject and body for each notification email. Use <code>{"{Name}"}</code>, <code>{"{Username}"}</code>, <code>{"{Password}"}</code>, <code>{"{LoginURL}"}</code>, <code>{"{Amount}"}</code> etc. as placeholders. (Sending via SMTP is configured later.)</p>
      </div>

      <div className="space-y-3">
        {rows.map((r) => {
          const t = state[r.key];
          const isOpen = openKey === r.key;
          return (
            <div key={r.key} className="card overflow-hidden">
              <button onClick={() => setOpenKey(isOpen ? "" : r.key)} className="flex w-full items-center justify-between px-5 py-3 text-left">
                <span className="font-semibold text-slate-800">{r.category}</span>
                <span className="text-xs text-slate-400">{isOpen ? "▲" : "▼"}</span>
              </button>
              {isOpen && (
                <div className="space-y-3 border-t border-slate-100 p-5">
                  <div><label className="label">Subject</label><input className="input" value={t.subject} onChange={(e) => set(r.key, "subject", e.target.value)} /></div>
                  <div><label className="label">Body</label><textarea className="input font-mono text-xs" rows={8} value={t.body} onChange={(e) => set(r.key, "body", e.target.value)} /></div>
                  <button onClick={() => save(r.key)} disabled={saving === r.key} className="btn-primary text-sm">{saving === r.key ? "Saving…" : saved === r.key ? "Saved ✓" : "Save Template"}</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
