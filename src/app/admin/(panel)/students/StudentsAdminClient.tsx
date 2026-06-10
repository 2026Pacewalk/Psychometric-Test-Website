"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export interface Row {
  id: string;
  name: string;
  school: string;
  city: string;
  classCourse: string;
  mobile: string;
  category: string;
  status: string;
  token: string | null;
}

export default function StudentsAdminClient({ rows }: { rows: Row[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const t = q.toLowerCase().trim();
    if (!t) return rows;
    return rows.filter((r) =>
      [r.name, r.school, r.city, r.classCourse, r.mobile].some((v) => v.toLowerCase().includes(t))
    );
  }, [rows, q]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">All Students</h1>
        <p className="text-sm text-slate-500">Search across every school by name, school, city or class.</p>
      </div>

      <div className="card p-4">
        <input className="input mb-4 max-w-sm" placeholder="Search students…" value={q} onChange={(e) => setQ(e.target.value)} />
        <p className="mb-3 text-sm text-slate-500">{filtered.length} student(s)</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-400">
              <tr>
                <th className="py-2 font-semibold">Name</th>
                <th className="py-2 font-semibold">School</th>
                <th className="py-2 font-semibold">City</th>
                <th className="py-2 font-semibold">Class</th>
                <th className="py-2 font-semibold">Category</th>
                <th className="py-2 font-semibold">Status</th>
                <th className="py-2 font-semibold text-right">Report</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 300).map((r) => (
                <tr key={r.id} className="border-t border-slate-100">
                  <td className="py-2.5 font-medium text-slate-800">{r.name}</td>
                  <td className="py-2.5 text-slate-500">{r.school}</td>
                  <td className="py-2.5 text-slate-500">{r.city || "—"}</td>
                  <td className="py-2.5 text-slate-500">{r.classCourse || "—"}</td>
                  <td className="py-2.5 text-slate-500">{r.category || "—"}</td>
                  <td className="py-2.5 capitalize text-slate-500">{r.status.replace("_", " ")}</td>
                  <td className="py-2.5 text-right">
                    {r.token ? (
                      <Link href={`/report/${r.token}`} className="font-semibold text-brand-600">View</Link>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length > 300 && (
            <p className="mt-3 text-center text-xs text-slate-400">Showing first 300 of {filtered.length}. Refine your search.</p>
          )}
        </div>
      </div>
    </div>
  );
}
