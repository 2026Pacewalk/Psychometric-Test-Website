"use client";

import { ReactNode } from "react";
import { MIReportData, INTELLIGENCES, MI_STATUS_COLOR, studentRecommendation } from "@/lib/mi";
import { IntelligenceBars, DomainPie, RiasecBars, Big5Bars, CareerBars } from "./MICharts";
import ReportToolbar from "./ReportToolbar";
import {
  ReportLang, pick, ui, INT_DESC_PA, INT_LABEL_PA, RIASEC_LABEL_PA, BIG5_LABEL_PA, DOMAIN_PA,
} from "@/lib/i18n";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "TestPsychometric";
const operator = "AMG Educational Charitable Society";

interface Taker {
  name: string; dob?: string | null; email?: string | null; mobile?: string | null;
  address?: string | null; city?: string | null; classCourse?: string | null;
  schoolName?: string | null;
}

export default function MIReportView({
  data, taker, completedAt, lang = "both",
}: {
  data: MIReportData; taker: Taker; completedAt: string; lang?: ReportLang;
}) {
  const date = new Date(completedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const rec = studentRecommendation(data);
  const ranked = [...data.intelligences].sort((a, b) => a.rank - b.rank);

  // Page text is authored once as a function of a single language `l`;
  // in bilingual mode each page renders English (left) and Punjabi (right).
  const profileRows: [string, string | null | undefined][] = [
    ["name", taker.name], ["dob", taker.dob], ["email", taker.email], ["contact", taker.mobile],
    ["classCourse", taker.classCourse], ["school", taker.schoolName], ["city", taker.city], ["address", taker.address],
  ];

  const cover = (l: ReportLang) => (
    <>
      <div className="rounded-xl border-2 border-blue-800 p-5 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-800">{siteName}</p>
        <h1 className="mt-1 text-2xl font-extrabold text-slate-900">{pick("PSYCHOMETRIC TEST", "ਮਨੋਮਾਪ ਟੈਸਟ", l)}</h1>
        <p className="mt-1 text-[11px] text-slate-500">{pick("Aptitude · Career · Stream · Interest", "ਯੋਗਤਾ · ਕਰੀਅਰ · ਸਟਰੀਮ · ਰੁਚੀ", l)}</p>
      </div>
      <h2 className="mt-5 text-base font-bold text-slate-900">{ui("welcome", l)}</h2>
      <div className="mt-2">
        {profileRows.map(([k, v]) => (
          <div key={k} className="flex justify-between border-b border-slate-100 py-1.5 text-sm">
            <span className="font-medium text-slate-500">{ui(k, l)}</span>
            <span className="text-right text-slate-800">{v || "—"}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-blue-50 p-3 text-xs text-slate-700">
        <strong>{ui("topStrengths", l)}:</strong> {data.topIntelligences.join(", ")} · <strong>{ui("reportDate", l)}:</strong> {date}
      </div>
    </>
  );

  const miText = (l: ReportLang) => (
    <>
      <h2 className="h-section mb-1 text-xl">{ui("miTheory", l)}</h2>
      <p className="mb-3 text-xs text-slate-600">
        {pick(
          "Eight kinds of intelligence differentiate one person from another (Howard Gardner, 1983). Human intelligence can be broadly divided into eight categories.",
          "ਅੱਠ ਤਰ੍ਹਾਂ ਦੀਆਂ ਬੁੱਧੀਆਂ ਇੱਕ ਵਿਅਕਤੀ ਨੂੰ ਦੂਜੇ ਤੋਂ ਵੱਖ ਕਰਦੀਆਂ ਹਨ (ਹਾਵਰਡ ਗਾਰਡਨਰ, 1983)। ਮਨੁੱਖੀ ਬੁੱਧੀ ਨੂੰ ਅੱਠ ਸ਼੍ਰੇਣੀਆਂ ਵਿੱਚ ਵੰਡਿਆ ਜਾ ਸਕਦਾ ਹੈ।",
          l
        )}
      </p>
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-3 py-1.5 font-semibold">{ui("intelligenceType", l)}</th>
              <th className="px-2 py-1.5 font-semibold">{ui("score", l)}</th>
              <th className="px-2 py-1.5 font-semibold">%</th>
              <th className="px-2 py-1.5 font-semibold">{ui("rank", l)}</th>
              <th className="px-2 py-1.5 font-semibold">{ui("status", l)}</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((i) => (
              <tr key={i.key} className="border-t border-slate-100">
                <td className="px-3 py-1.5 font-medium text-slate-800">{pick(i.label, INT_LABEL_PA[i.key], l)}</td>
                <td className="px-2 py-1.5">{i.score}</td>
                <td className="px-2 py-1.5">{i.percent}%</td>
                <td className="px-2 py-1.5">{i.rank}</td>
                <td className="px-2 py-1.5"><span className="badge text-white" style={{ backgroundColor: MI_STATUS_COLOR[i.status] }}>{ui(i.status, l)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const mackenzieText = (l: ReportLang) => (
    <>
      <h2 className="h-section mb-1 text-xl">{ui("mackenzie", l)}</h2>
      <p className="mb-3 text-xs text-slate-600">
        {pick("Walter Mackenzie groups the eight intelligences into three domains showing how they work together.",
          "ਵਾਲਟਰ ਮੈਕੈਂਜ਼ੀ ਅੱਠ ਬੁੱਧੀਆਂ ਨੂੰ ਤਿੰਨ ਖੇਤਰਾਂ ਵਿੱਚ ਵੰਡਦਾ ਹੈ ਜੋ ਦੱਸਦੇ ਹਨ ਕਿ ਇਹ ਕਿਵੇਂ ਮਿਲ ਕੇ ਕੰਮ ਕਰਦੀਆਂ ਹਨ।", l)}
      </p>
      <div className="space-y-2">
        {data.domains.map((d) => (
          <div key={d.key} className="rounded-xl border border-slate-200 p-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800">{pick(d.label, DOMAIN_PA[d.key], l)}</h4>
              <span className="font-extrabold text-blue-700">{d.percent}%</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const gardnerText = (l: ReportLang) => (
    <>
      <h2 className="h-section mb-2 text-xl">{ui("gardner", l)}</h2>
      <div className="space-y-2">
        {INTELLIGENCES.map((i) => (
          <div key={i.key} className="rounded-xl border border-slate-200 p-3">
            <h4 className="text-sm font-bold text-slate-900">{pick(i.en, i.pa, l)}</h4>
            <p className="mt-1 text-xs text-slate-600">{pick(i.description, INT_DESC_PA[i.key], l)}</p>
          </div>
        ))}
      </div>
    </>
  );

  const riasecText = (l: ReportLang) => (
    <>
      <h2 className="h-section mb-1 text-xl">{ui("riasecTitle", l)}</h2>
      <p className="mb-3 text-xs text-slate-600">
        {pick("Holland's six personality–work environment types (scored out of 10).",
          "ਹੌਲੈਂਡ ਦੀਆਂ ਛੇ ਸ਼ਖਸੀਅਤ–ਕੰਮ ਵਾਤਾਵਰਨ ਕਿਸਮਾਂ (10 ਵਿੱਚੋਂ ਅੰਕ)।", l)}
      </p>
      <div className="space-y-2">
        {[...data.riasec].sort((a, b) => b.score10 - a.score10).map((r) => (
          <div key={r.key} className="rounded-xl border border-slate-200 p-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">{pick(r.label, RIASEC_LABEL_PA[r.key], l)}</h4>
              <span className="text-xs font-bold text-blue-700">{r.score10}/10</span>
            </div>
            <p className="mt-1 text-xs text-slate-600">{l === "pa" ? r.personality : r.personality}</p>
          </div>
        ))}
      </div>
    </>
  );

  const careerText = (l: ReportLang) => (
    <>
      <h2 className="h-section mb-1 text-xl">{ui("careerSuggestions", l)}</h2>
      <p className="mb-2 text-xs text-slate-600">
        {pick("Best-matched career clusters from the intelligence profile. Top three highlighted.",
          "ਬੁੱਧੀ ਪ੍ਰੋਫਾਈਲ ਅਨੁਸਾਰ ਸਭ ਤੋਂ ਢੁਕਵੇਂ ਕਰੀਅਰ ਖੇਤਰ। ਚੋਟੀ ਦੇ ਤਿੰਨ ਉਜਾਗਰ।", l)}
      </p>
    </>
  );

  const big5Text = (l: ReportLang) => (
    <>
      <h2 className="h-section mb-1 text-xl">{ui("big5", l)}</h2>
      <p className="mb-2 text-xs text-slate-600">{pick("Five broad personality dimensions (out of 40).", "ਪੰਜ ਵਿਆਪਕ ਸ਼ਖਸੀਅਤ ਪਹਿਲੂ (40 ਵਿੱਚੋਂ)।", l)}</p>
      <div className="space-y-1.5">
        {data.big5.map((b) => (
          <div key={b.key} className="rounded-lg border border-slate-200 p-2 text-xs">
            <span className="font-bold text-slate-800">{pick(b.label, BIG5_LABEL_PA[b.key], l)} ({b.key}) — {b.score}/40.</span>{" "}
            <span className="text-slate-600">{b.desc}</span>
          </div>
        ))}
      </div>
    </>
  );

  const counsellorText = (l: ReportLang) => (
    <>
      <h2 className="h-section mb-2 text-xl">{ui("counsellor", l)}</h2>
      <p className="text-sm text-slate-700">{pick("Dear", "ਪਿਆਰੇ", l)} {taker.name},</p>
      <p className="mt-1 text-sm font-semibold text-blue-800">{ui("congratulations", l)}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-600">
        {pick("You have successfully completed the Psychometric Test.", "ਤੁਸੀਂ ਮਨੋਮਾਪ ਟੈਸਟ ਸਫਲਤਾਪੂਰਵਕ ਪੂਰਾ ਕੀਤਾ ਹੈ।", l)} {rec.summary}
      </p>
      <div className="mt-3 rounded-xl bg-blue-50 p-3">
        <h4 className="text-sm font-bold text-slate-800">{ui("suggestedStream", l)}</h4>
        <ol className="mt-1 list-decimal space-y-0.5 pl-5 text-xs text-slate-700">
          {rec.streams.map((s) => <li key={s}>{s}</li>)}
        </ol>
      </div>
      <p className="mt-4 text-center text-xs font-semibold text-blue-800">{ui("thanksMsg", l)}</p>
    </>
  );

  const pages: { text: (l: ReportLang) => ReactNode; chart?: ReactNode }[] = [
    { text: cover },
    { text: miText, chart: <IntelligenceBars data={data} /> },
    { text: mackenzieText, chart: <DomainPie data={data} /> },
    { text: gardnerText },
    { text: riasecText, chart: <RiasecBars data={data} /> },
    { text: careerText, chart: <CareerBars data={data} /> },
    { text: big5Text, chart: <Big5Bars data={data} /> },
    { text: counsellorText },
  ];

  return (
    <div className="min-h-screen bg-slate-100 py-6 print:bg-white print:py-0">
      <ReportToolbar lang={lang} />
      {pages.map((pg, i) => (
        <section key={i} className="print-page">
          {lang === "both" ? (
            <div className="grid grid-cols-2 gap-6">
              <div className="border-r border-dashed border-slate-200 pr-5">{pg.text("en")}</div>
              <div className="font-pa pl-1">{pg.text("pa")}</div>
            </div>
          ) : (
            pg.text(lang)
          )}
          {pg.chart && <div className="avoid-break mt-4">{pg.chart}</div>}
        </section>
      ))}

      <section className="print-page">
        <div className="flex items-end justify-between">
          <div><div className="h-10 w-40 border-b border-slate-300" /><p className="mt-1 text-xs text-slate-500">{pick("Counsellor / Psychologist", "ਕਾਊਂਸਲਰ / ਮਨੋਵਿਗਿਆਨੀ", lang)}</p></div>
          <div className="text-right text-xs text-slate-400"><p>{siteName} · Operated by {operator}</p><p>{date}</p></div>
        </div>
      </section>
    </div>
  );
}
