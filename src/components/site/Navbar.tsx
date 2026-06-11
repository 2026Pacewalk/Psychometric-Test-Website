"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SITE_NAME, NAV_LINKS, LOGIN_LINKS, ORG } from "@/lib/site";

/* ---------- inline icons (no extra deps) ---------- */
const I = {
  phone: (c = "") => (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>
  ),
  mail: (c = "") => (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>
  ),
  chevron: (c = "") => (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
  ),
  arrow: (c = "") => (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
  ),
  check: (c = "") => (
    <svg className={c} viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
  ),
  school: (c = "") => (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 6 8-4 8 4-8 4-8-4Z"/><path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6"/><path d="M12 10v8"/></svg>
  ),
  building: (c = "") => (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M10 21v-3a2 2 0 0 1 4 0v3"/></svg>
  ),
  store: (c = "") => (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9 4.5 4h15L21 9M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9M3 9h18"/></svg>
  ),
  user: (c = "") => (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a7 7 0 0 1 16 0v1"/></svg>
  ),
  shield: (c = "") => (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>
  ),
};

const LOGIN_ICON: Record<string, (c?: string) => JSX.Element> = {
  "/school-login": I.school,
  "/company-login": I.building,
  "/centre-login": I.store,
  "/individual/login": I.user,
  "/admin/login": I.shield,
};

const PRIMARY = NAV_LINKS.slice(0, 5);
const MORE = NAV_LINKS.slice(5);

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState<"en" | "pa">("en");
  const headerRef = useRef<HTMLElement>(null);

  // subtle elevation once the page scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // remember language choice (cosmetic toggle for marketing pages)
  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("tp-lang")) as "en" | "pa" | null;
    if (saved) setLang(saved);
  }, []);
  function chooseLang(l: "en" | "pa") {
    setLang(l);
    try { localStorage.setItem("tp-lang", l); } catch {}
    document.documentElement.lang = l === "pa" ? "pa" : "en";
  }

  // close menus on route change
  useEffect(() => {
    setOpen(false); setLoginOpen(false); setMoreOpen(false);
  }, [pathname]);

  const moreActive = MORE.some((l) => l.href === pathname);

  return (
    <header ref={headerRef} className="sticky top-0 z-40 print:hidden">
      {/* Tricolour accent strip */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-green-600" />

      {/* Utility bar */}
      <div className="bg-gradient-to-r from-slate-950 via-brand-950 to-slate-950 text-slate-300">
        <div className="container-page flex h-9 items-center justify-between gap-3 text-xs">
          <p className="flex min-w-0 items-center gap-1.5 truncate">
            <span className="inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/90 text-white">{I.check("h-2.5 w-2.5")}</span>
            <span className="truncate">Operated by <span className="font-semibold text-white">{ORG.operator}</span></span>
          </p>
          <div className="flex items-center gap-4">
            <a href={`tel:${ORG.phone.replace(/\s/g, "")}`} className="hidden items-center gap-1.5 transition hover:text-white sm:flex">
              {I.phone("h-3.5 w-3.5")} <span>{ORG.phone}</span>
            </a>
            <a href={`mailto:${ORG.email}`} className="hidden items-center gap-1.5 transition hover:text-white lg:flex">
              {I.mail("h-3.5 w-3.5")} <span>{ORG.email}</span>
            </a>
            {/* Language segmented toggle */}
            <div className="flex items-center rounded-full bg-white/10 p-0.5 ring-1 ring-white/15">
              <button onClick={() => chooseLang("en")} className={`rounded-full px-2 py-0.5 text-[11px] font-semibold transition ${lang === "en" ? "bg-white text-slate-900" : "text-slate-300 hover:text-white"}`}>English</button>
              <button onClick={() => chooseLang("pa")} className={`font-pa rounded-full px-2 py-0.5 text-[11px] font-semibold transition ${lang === "pa" ? "bg-white text-slate-900" : "text-slate-300 hover:text-white"}`}>ਪੰਜਾਬੀ</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className={`border-b bg-white/90 backdrop-blur-md transition-shadow ${scrolled ? "border-slate-200 shadow-soft" : "border-slate-100"}`}>
        <nav className="container-page flex h-[68px] items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="group flex items-center gap-3">
            <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-card ring-1 ring-slate-200/70 transition group-hover:ring-brand-300">
              <img src="/logo.png" alt={SITE_NAME} className="h-9 w-9 rounded-lg object-contain" />
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-extrabold tracking-tight text-slate-900">
                Test<span className="text-brand-600">Psychometric</span>
              </span>
              <span className="block text-[11px] font-medium text-slate-500">An initiative of {ORG.operator}</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 lg:flex">
            {PRIMARY.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative rounded-lg px-3 py-2 text-[13.5px] font-semibold transition ${
                    active ? "text-brand-700" : "text-slate-600 hover:text-brand-700"
                  }`}
                >
                  {l.label}
                  <span className={`absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-600 transition-all duration-300 ${active ? "opacity-100" : "opacity-0"}`} />
                </Link>
              );
            })}

            {/* More dropdown */}
            <div className="relative" onMouseEnter={() => setMoreOpen(true)} onMouseLeave={() => setMoreOpen(false)}>
              <button
                className={`flex items-center gap-1 rounded-lg px-3 py-2 text-[13.5px] font-semibold transition ${
                  moreActive || moreOpen ? "text-brand-700" : "text-slate-600 hover:text-brand-700"
                }`}
              >
                More {I.chevron(`h-3.5 w-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`)}
              </button>
              {moreOpen && (
                <div className="absolute right-0 top-full z-50 w-64 pt-2">
                  <div className="grid gap-0.5 rounded-2xl border border-slate-200 bg-white p-2 shadow-soft">
                    {MORE.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                          pathname === l.href ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50 hover:text-brand-700"
                        }`}
                      >
                        {l.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CTAs */}
          <div className="hidden items-center gap-2 lg:flex">
            <div className="relative" onMouseEnter={() => setLoginOpen(true)} onMouseLeave={() => setLoginOpen(false)}>
              <button className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-700">
                Login {I.chevron(`h-3.5 w-3.5 transition-transform ${loginOpen ? "rotate-180" : ""}`)}
              </button>
              {loginOpen && (
                <div className="absolute right-0 top-full z-50 w-60 pt-2">
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-soft">
                    <p className="px-3 pb-1 pt-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">Choose your portal</p>
                    {LOGIN_LINKS.map((l) => {
                      const Icon = LOGIN_ICON[l.href] || I.user;
                      return (
                        <Link
                          key={l.href}
                          href={l.href}
                          className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-brand-50 hover:text-brand-700"
                        >
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-brand-100 group-hover:text-brand-600">{Icon("h-4 w-4")}</span>
                          {l.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <Link
              href="/for-schools"
              className="group inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:from-brand-700 hover:to-brand-800 hover:shadow-lg"
            >
              Enroll School {I.arrow("h-4 w-4 transition-transform group-hover:translate-x-0.5")}
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
            )}
          </button>
        </nav>

        {/* Mobile sheet */}
        {open && (
          <div className="border-t border-slate-200 bg-white lg:hidden">
            <div className="container-page space-y-3 py-4">
              <div className="grid grid-cols-2 gap-1.5">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                      pathname === l.href ? "bg-brand-50 text-brand-700 ring-1 ring-brand-100" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>

              <Link
                href="/for-schools"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-4 py-3 text-sm font-bold text-white shadow-soft"
              >
                Enroll School {I.arrow("h-4 w-4")}
              </Link>

              <div>
                <p className="mb-1.5 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">Login portals</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {LOGIN_LINKS.map((l) => {
                    const Icon = LOGIN_ICON[l.href] || I.user;
                    return (
                      <Link
                        key={l.href}
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600"
                      >
                        {Icon("h-4 w-4 text-brand-600")} {l.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
                <a href={`tel:${ORG.phone.replace(/\s/g, "")}`} className="flex items-center gap-1.5">{I.phone("h-3.5 w-3.5")} {ORG.phone}</a>
                <div className="flex items-center rounded-full bg-white p-0.5 ring-1 ring-slate-200">
                  <button onClick={() => chooseLang("en")} className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${lang === "en" ? "bg-brand-600 text-white" : "text-slate-500"}`}>English</button>
                  <button onClick={() => chooseLang("pa")} className={`font-pa rounded-full px-2 py-0.5 text-[11px] font-semibold ${lang === "pa" ? "bg-brand-600 text-white" : "text-slate-500"}`}>ਪੰਜਾਬੀ</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
