"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export interface Row {
  token: string;
  name: string;
  school: string;
  city: string;
  classCourse: string;
  date: string;
  overall: number;
  top: string;
}

export default function ResultsClient({ rows }: { rows: Row[] }) {
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filtered = useMemo(() => {
    const t = q.toLowerCase().trim();
    return rows.filter((r) => {
      if (t && ![r.name, r.school, r.city, r.classCourse].some((v) => v.toLowerCase().includes(t))) return false;
      if (from && r.date && new Date(r.date) < new Date(from)) return false;
      if (to && r.date && new Date(r.date) > new Date(to + "T23:59:59")) return false;
      return true;
    });
  }, [rows, q, from, to]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Results & Reports</h1>
          <p className="text-sm text-slate-500">All completed assessments across every school.</p>
        </div>
        <button
          onClick={() => (window.location.href = `/api/admin/export?q=${encodeURIComponent(q)}`)}
          className="btn-primary text-sm"
        >
          ⬇ Export Excel
        </button>
      </div>

      <div className="card p-4">
        <div className="mb-4 flex flex-wrap gap-3">
          <input className="input max-w-xs" placeholder="Search school, student, city, class…" value={q} onChange={(e) => setQ(e.target.value)} />
          <input className="input max-w-[170px]" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <input className="input max-w-[170px]" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <p className="mb-3 text-sm text-slate-500">{filtered.length} report(s)</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-400">
              <tr>
                <th className="py-2 font-semibold">Student</th>
                <th className="py-2 font-semibold">School</th>
                <th className="py-2 font-semibold">City</th>
                <th className="py-2 font-semibold">Class</th>
                <th className="py-2 font-semibold">Overall</th>
                <th className="py-2 font-semibold">Top</th>
                <th className="py-2 font-semibold">Date</th>
                <th className="py-2 font-semibold text-right">Report</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 300).map((r) => (
                <tr key={r.token} className="border-t border-slate-100">
                  <td className="py-2.5 font-medium text-slate-800">{r.name}</td>
                  <td className="py-2.5 text-slate-500">{r.school}</td>
                  <td className="py-2.5 text-slate-500">{r.city || "—"}</td>
                  <td className="py-2.5 text-slate-500">{r.classCourse || "—"}</td>
                  <td className="py-2.5 font-semibold text-brand-700">{r.overall}%</td>
                  <td className="py-2.5 text-slate-500">{r.top}</td>
                  <td className="py-2.5 text-slate-500">{r.date ? new Date(r.date).toLocaleDateString("en-GB") : "—"}</td>
                  <td className="py-2.5 text-right">
                    <Link href={`/report/${r.token}`} className="font-semibold text-brand-600">Open</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
