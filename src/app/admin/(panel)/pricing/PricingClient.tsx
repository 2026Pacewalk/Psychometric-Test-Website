"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface PriceRow { key: string; label: string; amount: number; active: boolean; }

export default function PricingClient({ rows }: { rows: PriceRow[] }) {
  const router = useRouter();
  const [state, setState] = useState<Record<string, PriceRow>>(Object.fromEntries(rows.map((r) => [r.key, r])));
  const [saving, setSaving] = useState(""); const [saved, setSaved] = useState("");

  async function save(key: string) {
    setSaving(key);
    const r = state[key];
    await fetch(`/api/admin/pricing/${key}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: r.label, amount: Number(r.amount), active: r.active }),
    });
    setSaving(""); setSaved(key); setTimeout(() => setSaved(""), 1500); router.refresh();
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-extrabold text-slate-900">Pricing</h1><p className="text-sm text-slate-500">Set the price (₹) for each individual test type.</p></div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {rows.map((r) => {
          const f = state[r.key];
          return (
            <div key={r.key} className="card space-y-3 p-5">
              <span className="text-xs uppercase text-slate-400">{r.key}</span>
              <div><label className="label">Label</label><input className="input" value={f.label} onChange={(e) => setState((s) => ({ ...s, [r.key]: { ...s[r.key], label: e.target.value } }))} /></div>
              <div><label className="label">Amount (₹)</label><input className="input" type="number" value={f.amount} onChange={(e) => setState((s) => ({ ...s, [r.key]: { ...s[r.key], amount: Number(e.target.value) } }))} /></div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.active} onChange={(e) => setState((s) => ({ ...s, [r.key]: { ...s[r.key], active: e.target.checked } }))} /> Active</label>
              <button onClick={() => save(r.key)} disabled={saving === r.key} className="btn-primary text-sm">{saving === r.key ? "Saving…" : saved === r.key ? "Saved ✓" : "Save"}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
