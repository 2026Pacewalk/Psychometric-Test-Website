"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface Block {
  key: string;
  label: string;
  title: string;
  body: string;
}

export default function ContentClient({ blocks }: { blocks: Block[] }) {
  const router = useRouter();
  const [state, setState] = useState<Record<string, Block>>(
    Object.fromEntries(blocks.map((b) => [b.key, b]))
  );
  const [saving, setSaving] = useState("");
  const [saved, setSaved] = useState("");

  async function save(key: string) {
    setSaving(key);
    await fetch(`/api/admin/content/${key}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state[key]),
    });
    setSaving("");
    setSaved(key);
    setTimeout(() => setSaved(""), 1500);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Website Content</h1>
        <p className="text-sm text-slate-500">Edit key text blocks shown on the public website.</p>
      </div>

      <div className="space-y-4">
        {blocks.map((b) => (
          <div key={b.key} className="card space-y-3 p-5">
            <h3 className="font-bold text-slate-800">{b.label}</h3>
            <div>
              <label className="label">Title / Headline</label>
              <input
                className="input"
                value={state[b.key].title}
                onChange={(e) => setState((s) => ({ ...s, [b.key]: { ...s[b.key], title: e.target.value } }))}
              />
            </div>
            <div>
              <label className="label">Body</label>
              <textarea
                className="input"
                rows={3}
                value={state[b.key].body}
                onChange={(e) => setState((s) => ({ ...s, [b.key]: { ...s[b.key], body: e.target.value } }))}
              />
            </div>
            <button onClick={() => save(b.key)} disabled={saving === b.key} className="btn-primary text-sm">
              {saving === b.key ? "Saving…" : saved === b.key ? "Saved ✓" : "Save"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
