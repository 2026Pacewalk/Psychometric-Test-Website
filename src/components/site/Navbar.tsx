"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SITE_NAME, NAV_LINKS, LOGIN_LINKS, ORG } from "@/lib/site";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 print:hidden">
      {/* Tricolour accent strip */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-green-600" />

      {/* Utility bar */}
      <div className="bg-slate-900 text-slate-200">
        <div className="container-page flex h-9 items-center justify-between text-xs">
          <p className="truncate">Operated by <span className="font-semibold text-white">{ORG.operator}</span></p>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline">Helpline: {ORG.phone}</span>
            <span className="hidden lg:inline">English · ਪੰਜਾਬੀ</span>
            <Link href="/individual" className="font-semibold text-white hover:underline">Register</Link>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <nav className="container-page flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt={SITE_NAME} className="h-10 w-10 rounded-lg object-contain" />
            <span>
              <span className="block text-lg font-extrabold leading-tight text-slate-900">{SITE_NAME}</span>
              <span className="block text-[11px] font-medium leading-tight text-slate-500">An initiative of {ORG.operator}</span>
            </span>
          </Link>

          <div className="hidden items-center gap-0.5 xl:flex">
            {NAV_LINKS.slice(0, 8).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-md px-2.5 py-2 text-[13px] font-medium transition ${
                  pathname === l.href ? "text-brand-700" : "text-slate-600 hover:text-brand-700"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <div className="relative" onMouseLeave={() => setLoginOpen(false)}>
              <button
                onClick={() => setLoginOpen((o) => !o)}
                onMouseEnter={() => setLoginOpen(true)}
                className="btn-outline px-4 py-2 text-sm"
              >
                Login ▾
              </button>
              {loginOpen && (
                <div className="absolute right-0 top-full z-50 w-48 rounded-xl border border-slate-200 bg-white py-2 shadow-soft">
                  {LOGIN_LINKS.map((l) => (
                    <Link key={l.href} href={l.href} className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-700">
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/for-schools" className="btn-primary px-4 py-2 text-sm">Enroll School</Link>
          </div>

          <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? "✕" : "☰"}
          </button>
        </nav>

        {open && (
          <div className="border-t border-slate-200 bg-white lg:hidden">
            <div className="container-page grid grid-cols-2 gap-1 py-3">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium ${pathname === l.href ? "bg-brand-50 text-brand-700" : "text-slate-600"}`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="container-page grid grid-cols-2 gap-2 pb-4">
              {LOGIN_LINKS.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="btn-outline text-xs">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
