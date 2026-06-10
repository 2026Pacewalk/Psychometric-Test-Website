"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Notif { id: string; type: string; title: string; body: string | null; link: string | null; read: boolean; createdAt: string }

export default function NotificationBell({ allHref }: { allHref?: string }) {
  const [items, setItems] = useState<Notif[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  async function load() {
    try {
      const r = await fetch("/api/notifications");
      const d = await r.json();
      setItems(d.items || []);
      setUnread(d.unread || 0);
    } catch { /* ignore */ }
  }
  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => { clearInterval(t); document.removeEventListener("mousedown", onClick); };
  }, []);

  async function markAll() {
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ all: true }) });
    load();
  }
  async function markOne(id: string) {
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => { setOpen((o) => !o); }} className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Notifications">
        <span className="text-lg">🔔</span>
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-80 rounded-xl border border-slate-200 bg-white shadow-soft">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2">
            <span className="text-sm font-bold text-slate-800">Notifications</span>
            {unread > 0 && <button onClick={markAll} className="text-xs font-semibold text-brand-600">Mark all read</button>}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-slate-400">No notifications</p>
            ) : items.slice(0, 12).map((n) => {
              const inner = (
                <div className={`border-b border-slate-50 px-4 py-2.5 hover:bg-slate-50 ${n.read ? "" : "bg-amber-50/50"}`}>
                  <p className="text-sm font-medium text-slate-800">{n.title}</p>
                  {n.body && <p className="text-xs text-slate-500">{n.body}</p>}
                  <p className="mt-0.5 text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleString("en-GB")}</p>
                </div>
              );
              return n.link ? (
                <Link key={n.id} href={n.link} onClick={() => { markOne(n.id); setOpen(false); }}>{inner}</Link>
              ) : (
                <div key={n.id} onClick={() => markOne(n.id)} className="cursor-pointer">{inner}</div>
              );
            })}
          </div>
          {allHref && (
            <Link href={allHref} onClick={() => setOpen(false)} className="block border-t border-slate-100 px-4 py-2 text-center text-xs font-semibold text-brand-600">
              View all notifications
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
