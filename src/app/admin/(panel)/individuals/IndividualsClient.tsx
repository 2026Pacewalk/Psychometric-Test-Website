"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export interface IndRow {
  id: string; name: string; email: string; phone: string; city: string;
  tests: number; payments: number; joined: string;
}

export default function IndividualsClient({ rows }: { rows: IndRow[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const t = q.toLowerCase().trim();
    if (!t) return rows;
    return rows.filter((r) => [r.name, r.email, r.phone, r.city].some((v) => v.toLowerCase().includes(t)));
  }, [rows, q]);

  async function remove(r: IndRow) {
    if (!confirm(`Delete ${r.name}? This removes their tests, reports and payments.`)) return;
    await fetch(`/api/admin/individuals/${r.id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-extrabold text-slate-900">Individual Users</h1><p className="text-sm text-slate-500">Self-service users who take tests after payment.</p></div>
      <div className="card p-4">
        <input className="input mb-4 max-w-sm" placeholder="Search name, email, city…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-400"><tr><th className="py-2 font-semibold">Name</th><th className="py-2 font-semibold">Email</th><th className="py-2 font-semibold">Phone</th><th className="py-2 font-semibold">City</th><th className="py-2 font-semibold">Tests</th><th className="py-2 font-semibold">Payments</th><th className="py-2 font-semibold text-right">Action</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? <tr><td colSpan={7} className="py-10 text-center text-slate-400">No users.</td></tr> : filtered.map((r) => (
                <tr key={r.id} className="border-t border-slate-100">
                  <td className="py-2.5 font-medium text-slate-800">{r.name}</td>
                  <td className="py-2.5 text-slate-500">{r.email}</td>
                  <td className="py-2.5 text-slate-500">{r.phone || "—"}</td>
                  <td className="py-2.5 text-slate-500">{r.city || "—"}</td>
                  <td className="py-2.5 text-slate-500">{r.tests}</td>
                  <td className="py-2.5 text-slate-500">{r.payments}</td>
                  <td className="py-2.5 text-right"><button onClick={() => remove(r)} className="font-semibold text-red-600">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
