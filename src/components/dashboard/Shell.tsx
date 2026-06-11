"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoutButton from "@/components/LogoutButton";
import NotificationBell from "@/components/dashboard/NotificationBell";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
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
  const sidebarBg = accent === "dark" ? "bg-slate-900 text-slate-100" : "bg-white";

  function isActive(href: string) {
    if (href.endsWith("/dashboard") || href.endsWith("/admin")) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 ${sidebarBg} transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 px-5">
          <img src="/logo.png" alt={brand} className="h-9 w-9 rounded-xl bg-white object-contain p-0.5" />
          <div>
            <p className={`text-sm font-bold ${accent === "dark" ? "text-white" : "text-slate-900"}`}>
              {brand}
            </p>
            <p className="text-[11px] text-slate-400">{subtitle}</p>
          </div>
        </div>
        <nav className="space-y-1 px-3 py-2">
          {nav.map((item) => {
            const active = isActive(item.href);
            const base =
              accent === "dark"
                ? active
                  ? "bg-brand-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
                : active
                ? "bg-brand-50 text-brand-700"
                : "text-slate-600 hover:bg-slate-100";
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${base}`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(true)}>
            ☰
          </button>
          <div className="flex flex-1 items-center justify-end gap-3">
            <Link href="/" className="hidden text-sm text-slate-500 hover:text-brand-600 sm:inline">
              View site
            </Link>
            <NotificationBell allHref={notifAllHref} />
            <div className="flex items-center gap-2">
              <span className="hidden text-sm font-medium text-slate-700 sm:inline">{userName}</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                {userName.charAt(0)}
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
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${active ? "text-brand-700" : "text-slate-500"}`}
            >
              <span className={`text-lg ${active ? "scale-110" : ""} transition`}>{item.icon}</span>
              <span className="max-w-full truncate px-0.5">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
