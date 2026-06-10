"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ReportLang } from "@/lib/i18n";

const OPTIONS: { key: ReportLang; label: string }[] = [
  { key: "en", label: "English" },
  { key: "pa", label: "ਪੰਜਾਬੀ" },
  { key: "both", label: "Bilingual" },
];

export default function ReportToolbar({ lang }: { lang: ReportLang }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();

  function choose(next: ReportLang) {
    const sp = new URLSearchParams(Array.from(params.entries()));
    sp.set("lang", next);
    router.push(`${pathname}?${sp.toString()}`);
    // Persist as the account's default report language (ignore errors / public views).
    fetch("/api/report-language", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lang: next }),
    }).catch(() => {});
  }

  return (
    <div className="no-print container-page mb-6 flex flex-wrap items-center justify-between gap-3">
      <a href="javascript:history.back()" className="btn-ghost text-sm">← Back</a>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Report language</span>
        <div className="flex items-center gap-1 rounded-full bg-slate-100 p-1 text-sm">
          {OPTIONS.map((o) => (
            <button
              key={o.key}
              onClick={() => choose(o.key)}
              className={`rounded-full px-3 py-1 font-medium ${lang === o.key ? "bg-white text-brand-700 shadow" : "text-slate-500"}`}
            >
              {o.label}
            </button>
          ))}
        </div>
        <button onClick={() => window.print()} className="btn-primary text-sm">
          🖨 Download {lang === "en" ? "English" : lang === "pa" ? "Punjabi" : "Bilingual"} PDF
        </button>
      </div>
    </div>
  );
}
