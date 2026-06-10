"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export interface ReportRow {
  token: string;
  name: string;
  classCourse: string;
  category: string;
  mobile: string;
  date: string;
  overall: number;
  top: string;
}

export default function ReportsClient({ rows }: { rows: ReportRow[] }) {
  const [q, setQ] = useState("");
  const [cls, setCls] = useState("");
  const [category, setCategory] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [minScore, setMinScore] = useState("");

  const classes = useMemo(
    () => Array.from(new Set(rows.map((r) => r.classCourse).filter(Boolean))).sort(),
    [rows]
  );

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (q && !r.name.toLowerCase().includes(q.toLowerCase())) return false;
      if (cls && r.classCourse !== cls) return false;
      if (category && r.category !== category) return false;
      if (minScore && r.overall < Number(minScore)) return false;
      if (from && r.date && new Date(r.date) < new Date(from)) return false;
      if (to && r.date && new Date(r.date) > new Date(to + "T23:59:59")) return false;
      return true;
    });
  }, [rows, q, cls, category, minScore, from, to]);

  function exportExcel() {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (cls) params.set("class", cls);
    if (category) params.set("category", category);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    window.location.href = `/api/school/export?${params.toString()}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Reports</h1>
          <p className="text-sm text-slate-500">Filter, view, print and export student reports.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="btn-outline text-sm no-print">
            🖨 Print List
          </button>
          <button onClick={exportExcel} className="btn-primary text-sm no-print">
            ⬇ Export Excel
          </button>
        </div>
      </div>

      <div className="card grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-6 no-print">
        <input className="input" placeholder="Search name…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input" value={cls} onChange={(e) => setCls(e.target.value)}>
          <option value="">All Classes</option>
          {classes.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {["GEN", "OBC", "SC", "OTHER"].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <input className="input" type="number" placeholder="Min score %" value={minScore} onChange={(e) => setMinScore(e.target.value)} />
        <input className="input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <input className="input" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>

      <div className="card overflow-x-auto p-4">
        <p className="mb-3 text-sm text-slate-500">{filtered.length} report(s)</p>
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400">
            <tr>
              <th className="py-2 font-semibold">Name</th>
              <th className="py-2 font-semibold">Class</th>
              <th className="py-2 font-semibold">Category</th>
              <th className="py-2 font-semibold">Overall</th>
              <th className="py-2 font-semibold">Top Interest</th>
              <th className="py-2 font-semibold">Date</th>
              <th className="py-2 font-semibold text-right no-print">Report</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400">
                  No reports match the filters.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.token} className="border-t border-slate-100">
                  <td className="py-2.5 font-medium text-slate-800">{r.name}</td>
                  <td className="py-2.5 text-slate-500">{r.classCourse || "—"}</td>
                  <td className="py-2.5 text-slate-500">{r.category || "—"}</td>
                  <td className="py-2.5 font-semibold text-brand-700">{r.overall}%</td>
                  <td className="py-2.5 text-slate-500">{r.top}</td>
                  <td className="py-2.5 text-slate-500">
                    {r.date ? new Date(r.date).toLocaleDateString("en-GB") : "—"}
                  </td>
                  <td className="py-2.5 text-right no-print">
                    <Link href={`/report/${r.token}`} className="font-semibold text-brand-600 hover:text-brand-700">
                      Open
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
