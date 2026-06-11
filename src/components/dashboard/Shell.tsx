"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoutButton from "@/components/LogoutButton";
import NotificationBell from "@/components/dashboard/NotificationBell";
import NavIcon from "@/components/dashboard/NavIcon";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  /** Optional group heading; consecutive items with the same section are grouped. */
  section?: string;
}

export default function Shell({
  brand,
  subtitle,
  nav,
  userName,
  accent = "brand",
  notifAllHref,
  children,
}: {
  brand: string;
  subtitle: string;
  nav: NavItem[];
  userName: string;
  accent?: "brand" | "dark";
  notifAllHref?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dark = accent === "dark";

  function isActive(href: string) {
    if (href.endsWith("/dashboard") || href.endsWith("/admin") || href === "/company" || href === "/centre") return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  // Group items into ordered sections while preserving order.
  const groups: { section: string | null; items: NavItem[] }[] = [];
  for (const item of nav) {
    const sec = item.section ?? null;
    const last = groups[groups.length - 1];
    if (last && last.section === sec) last.items.push(item);
    else groups.push({ section: sec, items: [item] });
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 transform flex-col border-r transition-transform lg:static lg:translate-x-0 ${
          dark ? "border-slate-800 bg-slate-900 text-slate-100" : "border-slate-200 bg-white"
        } ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Brand */}
        <div className={`flex h-16 flex-shrink-0 items-center gap-2.5 px-5 ${dark ? "border-b border-slate-800" : "border-b border-slate-100"}`}>
          <img src="/logo.png" alt={brand} className="h-9 w-9 rounded-xl bg-white object-contain p-0.5 ring-1 ring-black/5" />
          <div className="min-w-0">
            <p className={`truncate text-sm font-bold ${dark ? "text-white" : "text-slate-900"}`}>{brand}</p>
            <p className="truncate text-[11px] text-slate-400">{subtitle}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
          {groups.map((g, gi) => (
            <div key={gi} className="space-y-0.5">
              {g.section && (
                <p className={`px-3 pb-1 pt-1 text-[10px] font-bold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>
                  {g.section}
                </p>
              )}
              {g.items.map((item) => {
                const active = isActive(item.href);
                const cls = dark
                  ? active
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                  : active
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900";
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] font-medium transition ${cls}`}
                  >
                    <NavIcon name={item.icon} className={`h-[18px] w-[18px] flex-shrink-0 ${active ? "" : "opacity-80"}`} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md sm:px-6">
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
            <Link href="/" className="hidden items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-brand-600 sm:inline-flex">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M21 3l-9 9M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" /></svg>
              View site
            </Link>
            <NotificationBell allHref={notifAllHref} />
            <div className="hidden h-6 w-px bg-slate-200 sm:block" />
            <div className="flex items-center gap-2">
              <span className="hidden text-sm font-semibold text-slate-700 sm:inline">{userName}</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <LogoutButton />
          </div>
        </header>
        <main className="flex-1 p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">{children}</main>
      </div>

      {/* Mobile app-style bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        {nav.slice(0, 5).map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-medium transition ${active ? "text-brand-700" : "text-slate-400"}`}
            >
              <NavIcon name={item.icon} className={`h-5 w-5 transition ${active ? "scale-110" : ""}`} />
              <span className="max-w-full truncate px-0.5">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
