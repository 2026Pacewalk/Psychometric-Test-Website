"use client";

import {
  Bar, BarChart, Cell, LabelList, Pie, PieChart, PolarAngleAxis, PolarGrid,
  PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { MI_STATUS_COLOR, MIReportData } from "@/lib/mi";

export function IntelligenceBars({ data }: { data: MIReportData }) {
  const rows = data.intelligences.map((i) => ({ name: i.short, value: i.percent, status: i.status }));
  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 16, right: 8, left: -16, bottom: 56 }}>
          <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} tick={{ fontSize: 10 }} height={64} />
          <YAxis tick={{ fontSize: 10 }} unit="%" />
          <Tooltip formatter={(v: number) => [`${v}%`, "Share"]} />
          <Bar dataKey="value" radius={[5, 5, 0, 0]}>
            <LabelList dataKey="value" position="top" formatter={(v: number) => `${v}%`} style={{ fontSize: 9, fill: "#475569" }} />
            {rows.map((r, i) => (
              <Cell key={i} fill={MI_STATUS_COLOR[r.status]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function IntelligenceRadar({ data }: { data: MIReportData }) {
  const rows = data.intelligences.map((i) => ({ subject: i.short, value: i.percent }));
  return (
    <div style={{ width: "100%", height: 340 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={rows} outerRadius="72%">
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
          <PolarRadiusAxis tick={{ fontSize: 8 }} angle={30} />
          <Radar dataKey="value" stroke="#1d4ed8" fill="#3b82f6" fillOpacity={0.45} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DomainPie({ data }: { data: MIReportData }) {
  const colors = ["#1d4ed8", "#15803d", "#b45309"];
  const rows = data.domains.map((d, i) => ({ name: d.label, value: d.percent, color: colors[i] }));
  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={rows} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%"
            label={(e: any) => `${e.name} ${e.value}%`} labelLine={false} style={{ fontSize: 10 }}>
            {rows.map((r, i) => <Cell key={i} fill={r.color} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RiasecBars({ data }: { data: MIReportData }) {
  const rows = data.riasec.map((r) => ({ name: r.label, value: r.score10 }));
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={rows} margin={{ top: 4, right: 36, left: 24, bottom: 4 }}>
          <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 10 }} />
          <YAxis type="category" dataKey="name" width={92} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v: number) => [`${v} / 10`, "Score"]} />
          <Bar dataKey="value" radius={[0, 5, 5, 0]} fill="#1d4ed8">
            <LabelList dataKey="value" position="right" style={{ fontSize: 10, fill: "#475569" }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Big5Bars({ data }: { data: MIReportData }) {
  const rows = data.big5.map((b) => ({ name: b.key, value: b.score }));
  const colors = ["#1d4ed8", "#15803d", "#7c3aed", "#b91c1c", "#b45309"];
  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 16, right: 8, left: -18, bottom: 4 }}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 40]} tick={{ fontSize: 10 }} />
          <Tooltip formatter={(v: number) => [`${v} / 40`, "Score"]} />
          <Bar dataKey="value" radius={[5, 5, 0, 0]}>
            <LabelList dataKey="value" position="top" style={{ fontSize: 10, fill: "#475569" }} />
            {rows.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CareerBars({ data }: { data: MIReportData }) {
  const rows = data.careers.map((c) => ({ name: c.label, value: c.match, top: c.top }));
  return (
    <div style={{ width: "100%", height: 24 * rows.length + 40 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={rows} margin={{ top: 4, right: 40, left: 8, bottom: 4 }}>
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
          <YAxis type="category" dataKey="name" width={200} tick={{ fontSize: 10 }} />
          <Tooltip formatter={(v: number) => [`${v}%`, "Match"]} />
          <Bar dataKey="value" radius={[0, 5, 5, 0]}>
            <LabelList dataKey="value" position="right" formatter={(v: number) => `${v}%`} style={{ fontSize: 9, fill: "#475569" }} />
            {rows.map((r, i) => <Cell key={i} fill={r.top ? "#15803d" : "#94a3b8"} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
