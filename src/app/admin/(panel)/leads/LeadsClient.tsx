"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export interface LeadRow {
  id: string;
  type: string;
  name: string;
  email: string;
  phone: string;
  school: string;
  city: string;
  message: string;
  status: string;
  read: boolean;
  createdAt: string;
}

const STATUSES = ["new", "contacted", "converted", "closed"];
const STATUS_STYLE: Record<string, string> = {
  new: "bg-amber-100 text-amber-700",
  contacted: "bg-blue-100 text-blue-700",
  converted: "bg-green-100 text-green-700",
  closed: "bg-slate-200 text-slate-600",
};

export default function LeadsClient({ rows }: { rows: LeadRow[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<"all" | "enroll" | "contact">("all");
  const [open, setOpen] = useState<LeadRow | null>(null);

  const filtered = useMemo(() => (tab === "all" ? rows : rows.filter((r) => r.type === tab)), [rows, tab]);

  async function patch(id: string, body: Record<string, unknown>) {
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    router.refresh();
  }
  async function remove(id: string) {
    if (!confirm("Delete this inquiry?")) return;
    await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
    setOpen(null);
    router.refresh();
  }

  function view(l: LeadRow) {
    setOpen(l);
    if (!l.read) patch(l.id, { read: true });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Leads & Inquiries</h1>
        <p className="text-sm text-slate-500">School enrollment requests and contact-form messages.</p>
      </div>

      <div className="flex gap-2">
        {(["all", "enroll", "contact"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${
              tab === t ? "bg-brand-600 text-white" : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            {t === "enroll" ? "Enrollment" : t}
          </button>
        ))}
      </div>

      <div className="card overflow-x-auto p-4">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400">
            <tr>
              <th className="py-2 font-semibold">Name</th>
              <th className="py-2 font-semibold">Type</th>
              <th className="py-2 font-semibold">Contact</th>
              <th className="py-2 font-semibold">City</th>
              <th className="py-2 font-semibold">Status</th>
              <th className="py-2 font-semibold">Date</th>
              <th className="py-2 font-semibold text-right">View</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="py-10 text-center text-slate-400">No inquiries.</td></tr>
            ) : (
              filtered.map((l) => (
                <tr key={l.id} className={`border-t border-slate-100 ${!l.read ? "bg-amber-50/40" : ""}`}>
                  <td className="py-2.5 font-medium text-slate-800">
                    {!l.read && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-amber-500" />}
                    {l.name}
                  </td>
                  <td className="py-2.5 capitalize text-slate-500">{l.type}</td>
                  <td className="py-2.5 text-slate-500">{l.phone || l.email || "—"}</td>
                  <td className="py-2.5 text-slate-500">{l.city || "—"}</td>
                  <td className="py-2.5">
                    <select
                      value={l.status}
                      onChange={(e) => patch(l.id, { status: e.target.value })}
                      className={`badge cursor-pointer border-0 ${STATUS_STYLE[l.status]}`}
                    >
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="py-2.5 text-slate-500">{new Date(l.createdAt).toLocaleDateString("en-GB")}</td>
                  <td className="py-2.5 text-right">
                    <button onClick={() => view(l)} className="font-semibold text-brand-600">Open</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setOpen(null)}>
          <div className="card w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">{open.name}</h3>
              <button onClick={() => setOpen(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <dl className="space-y-2 text-sm">
              <Row k="Type" v={open.type} />
              <Row k="Phone" v={open.phone || "—"} />
              <Row k="Email" v={open.email || "—"} />
              <Row k="School" v={open.school || "—"} />
              <Row k="City" v={open.city || "—"} />
              <div>
                <dt className="font-semibold text-slate-700">Message</dt>
                <dd className="mt-1 rounded-lg bg-slate-50 p-3 text-slate-600">{open.message || "—"}</dd>
              </div>
            </dl>
            <div className="mt-5 flex justify-between">
              {open.phone && (
                <a
                  href={`https://wa.me/${open.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  className="btn-accent text-sm"
                >
                  WhatsApp
                </a>
              )}
              <button onClick={() => remove(open.id)} className="btn-outline text-sm text-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-slate-100 py-1.5">
      <dt className="font-medium text-slate-500">{k}</dt>
      <dd className="capitalize text-slate-800">{v}</dd>
    </div>
  );
}
