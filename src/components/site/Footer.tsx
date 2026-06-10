import Link from "next/link";
import { SITE_NAME, NAV_LINKS, ORG } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="container-page grid grid-cols-1 gap-8 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 font-extrabold text-white">
              {SITE_NAME.charAt(0)}
            </span>
            <span className="text-lg font-extrabold text-white">{SITE_NAME}</span>
          </div>
          <p className="mt-3 text-sm text-slate-400">
            Scientific psychometric assessment &amp; career guidance for schools, companies and individuals —
            bilingual reports in English &amp; Punjabi.
          </p>
          <p className="mt-3 text-xs text-slate-500">
            Operated by <span className="font-semibold text-slate-300">{ORG.operator}</span>
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-white">Explore</h4>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.slice(1, 6).map((l) => (
              <li key={l.href}><Link href={l.href} className="hover:text-white">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-white">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.slice(6).map((l) => (
              <li key={l.href}><Link href={l.href} className="hover:text-white">{l.label}</Link></li>
            ))}
            <li><Link href="/about" className="hover:text-white">Trust &amp; Registration</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-white">Registered Office</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>📍 {ORG.address}</li>
            <li>📞 {ORG.phone}</li>
            <li>📧 {ORG.email}</li>
          </ul>
          <div className="mt-3 space-y-1 text-xs text-slate-500">
            <p>DARPAN ID: <span className="text-slate-300">{ORG.darpanId}</span> · {ORG.darpanStatus}</p>
            <p>Society Reg. No: {ORG.registrationNo} · {ORG.registrationYear}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {ORG.operator} · {ORG.domain} · All rights reserved.
      </div>
    </footer>
  );
}
