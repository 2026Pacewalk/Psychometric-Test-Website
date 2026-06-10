"use client";

import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import { STATUS_COLOR } from "@/lib/skills";
import { CategoryResult, RiasecResult, SkillResult } from "@/lib/scoring";

export function SkillBars({ skills }: { skills: SkillResult[] }) {
  const data = skills.map((s) => ({ name: s.label, value: s.raw, status: s.status }));
  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 16, right: 8, left: -16, bottom: 60 }}>
          <XAxis dataKey="name" angle={-40} textAnchor="end" interval={0} tick={{ fontSize: 11 }} height={70} />
          <YAxis domain={[0, 25]} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v: number) => [`${v} / 25`, "Score"]} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            <LabelList dataKey="value" position="top" style={{ fontSize: 10, fill: "#475569" }} />
            {data.map((d, i) => (
              <Cell key={i} fill={STATUS_COLOR[d.status as keyof typeof STATUS_COLOR]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryRadar({ categories }: { categories: CategoryResult[] }) {
  const data = categories.map((c) => ({ subject: c.label, value: c.percent }));
  return (
    <div style={{ width: "100%", height: 360 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} angle={30} />
          <Radar dataKey="value" stroke="#1f47f5" fill="#3366ff" fillOpacity={0.45} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryBars({ categories }: { categories: CategoryResult[] }) {
  const data = categories.map((c) => ({ name: c.label, value: c.percent, status: c.status }));
  return (
    <div style={{ width: "100%", height: 340 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={data} margin={{ top: 4, right: 32, left: 24, bottom: 4 }}>
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="name" width={92} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v: number) => [`${v}%`, "Score"]} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]}>
            <LabelList dataKey="value" position="right" formatter={(v: number) => `${v}%`} style={{ fontSize: 10, fill: "#475569" }} />
            {data.map((d, i) => (
              <Cell key={i} fill={STATUS_COLOR[d.status as keyof typeof STATUS_COLOR]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RiasecPie({ riasec }: { riasec: RiasecResult[] }) {
  const data = riasec.map((r) => ({ name: r.label, value: r.percent, color: r.color }));
  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="80%"
            label={(e: any) => `${e.name} ${e.value}%`}
            labelLine={false}
            style={{ fontSize: 10 }}
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Pie>
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PotentialPie({ categories }: { categories: CategoryResult[] }) {
  const palette = ["#3366ff", "#16a34a", "#f59e0b", "#a855f7", "#ef4444", "#0ea5e9", "#14b8a6", "#f97316", "#8b5cf6", "#64748b"];
  const data = categories.map((c, i) => ({ name: c.label, value: c.percent, color: palette[i % palette.length] }));
  return (
    <div style={{ width: "100%", height: 340 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="45%"
            outerRadius="80%"
            label={(e: any) => `${e.name}`}
            labelLine={false}
            style={{ fontSize: 9 }}
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Pie>
          <Tooltip formatter={(v: number) => [`${v}%`, "Score"]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
