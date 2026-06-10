"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface Notif { id: string; type: string; title: string; body: string | null; link: string | null; read: boolean; createdAt: string }

export default function NotificationsPage() {
  const [items, setItems] = useState<Notif[]>([]);
  const [type, setType] = useState("");

  async function load() {
    const r = await fetch("/api/notifications");
    const d = await r.json();
    setItems(d.items || []);
  }
  useEffect(() => { load(); }, []);

  const types = useMemo(() => Array.from(new Set(items.map((i) => i.type))).sort(), [items]);
  const filtered = useMemo(() => (type ? items.filter((i) => i.type === type) : items), [items, type]);

  async function markAll() { await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ all: true }) }); load(); }
  async function markOne(id: string) { await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); load(); }
  async function del(id: string) { await fetch(`/api/notifications/${id}`, { method: "DELETE" }); load(); }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-extrabold text-slate-900">Notifications</h1><p className="text-sm text-slate-500">Alerts for leads, payments, applications and settlements.</p></div>
        <button onClick={markAll} className="btn-outline text-sm">Mark all read</button>
      </div>

      <div className="card p-4">
        <select className="input mb-4 max-w-xs" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <div className="divide-y divide-slate-100">
          {filtered.length === 0 ? <p className="py-10 text-center text-sm text-slate-400">No notifications.</p> : filtered.map((n) => (
            <div key={n.id} className={`flex items-start justify-between gap-3 py-3 ${n.read ? "" : "bg-amber-50/40"} px-2`}>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800">{!n.read && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-amber-500" />}{n.title}</p>
                {n.body && <p className="text-xs text-slate-500">{n.body}</p>}
                <p className="mt-0.5 text-[11px] text-slate-400">{n.type} · {new Date(n.createdAt).toLocaleString("en-GB")}</p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-2 text-xs font-semibold">
                {n.link && <Link href={n.link} className="text-brand-600">Open</Link>}
                {!n.read && <button onClick={() => markOne(n.id)} className="text-slate-500">Read</button>}
                <button onClick={() => del(n.id)} className="text-red-500">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
