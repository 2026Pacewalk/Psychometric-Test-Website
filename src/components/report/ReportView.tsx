"use client";

import { ReportData, counselorRecommendation } from "@/lib/scoring";
import {
  SKILL_MAP,
  CATEGORIES,
  STATUS_COLOR,
  StatusKey,
  recommendation,
  SkillKey,
} from "@/lib/skills";
import {
  SkillBars,
  CategoryRadar,
  CategoryBars,
  RiasecPie,
  PotentialPie,
} from "./Charts";
import ReportToolbar from "./ReportToolbar";
import { ReportLang, pick, ui, SKILL_DEF_PA, CATEGORY_PA } from "@/lib/i18n";

type ProfileRow = [string, string | null | undefined];

function StatusBadge({ status, lang }: { status: StatusKey; lang: ReportLang }) {
  return (
    <span className="badge text-white" style={{ backgroundColor: STATUS_COLOR[status] }}>
      {ui(status, lang)}
    </span>
  );
}

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "TestPsychometric";
const operator = "AMG Educational Charitable Society";

export default function ReportView({
  data,
  name,
  profile,
  completedAt,
  lang = "both",
}: {
  data: ReportData;
  name: string;
  profile: ProfileRow[];
  completedAt: string;
  lang?: ReportLang;
}) {
  const counsel = counselorRecommendation(data);
  const t = (k: string) => ui(k, lang);
  const date = new Date(completedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Paired categories that map to per-skill detail sections (first 6).
  const pairedCategories = CATEGORIES.slice(0, 6);

  const profileRows: ProfileRow[] = profile;

  return (
    <div className="min-h-screen bg-slate-100 py-6 print:bg-white print:py-0">
      <ReportToolbar lang={lang} />

      {/* PAGE 1 — Cover / Profile */}
      <section className="print-page avoid-break">
        <div className="rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-200">
            {siteName} · Psychometric Assessment
          </p>
          <h1 className="mt-3 text-4xl font-extrabold">{name}</h1>
          <p className="mt-1 text-brand-100">
            12 Core Life Skills · RIASEC Career Profile · Personalised Report
          </p>
          <div className="mt-6 flex flex-wrap gap-6">
            <div>
              <p className="text-3xl font-extrabold">{data.overallPercent}%</p>
              <p className="text-xs text-brand-200">Overall Skill Index</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold">{data.topRiasec[0]}</p>
              <p className="text-xs text-brand-200">Top Career Interest</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold">{date}</p>
              <p className="text-xs text-brand-200">Report Date</p>
            </div>
          </div>
        </div>

        <h2 className="mt-8 text-lg font-bold text-slate-900">{pick("Profile", "ਪ੍ਰੋਫਾਈਲ", lang)}</h2>
        <div className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
          {profileRows.map(([label, v]) => (
            <div key={label} className="flex justify-between border-b border-slate-100 py-2 text-sm">
              <span className="font-medium text-slate-500">{label}</span>
              <span className="text-right text-slate-800">{v || "—"}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl bg-slate-50 p-5 text-sm leading-relaxed text-slate-600">
          This report is not just another test score — it is a comprehensive roadmap of the
          student&apos;s potential. We have identified <strong>12 Core Life Skills</strong> that play a
          crucial role in growth and success, covering intellectual ability, emotional strength,
          creativity, adaptability and the practical talents needed to thrive in the modern world.
        </div>
      </section>

      {/* PAGE 2 — 12 Core Life Skills */}
      <section className="print-page">
        <h2 className="h-section mb-1 text-2xl">{t("coreSkills")}</h2>
        <p className="mb-5 text-sm text-slate-500">
          {pick("Each skill is scored out of 25. Status bands: Highly Dominant (20+), Dominant (16–20), Less Dominant (11–15), Need Attention (0–10).",
            "ਹਰ ਹੁਨਰ 25 ਵਿੱਚੋਂ ਅੰਕਿਤ ਹੈ। ਸਥਿਤੀ: ਬਹੁਤ ਪ੍ਰਬਲ (20+), ਪ੍ਰਬਲ (16–20), ਘੱਟ ਪ੍ਰਬਲ (11–15), ਧਿਆਨ ਲੋੜੀਂਦਾ (0–10)।", lang)}
        </p>

        <div className="avoid-break overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-2 font-semibold">{t("skill")}</th>
                <th className="px-4 py-2 font-semibold">{t("score")} /25</th>
                <th className="px-4 py-2 font-semibold">%</th>
                <th className="px-4 py-2 font-semibold">{t("status")}</th>
              </tr>
            </thead>
            <tbody>
              {data.skills.map((s) => (
                <tr key={s.key} className="border-t border-slate-100">
                  <td className="px-4 py-2 font-medium text-slate-800">{pick(SKILL_MAP[s.key].en, SKILL_MAP[s.key].pa, lang)}</td>
                  <td className="px-4 py-2">{s.raw}</td>
                  <td className="px-4 py-2">{s.percent}%</td>
                  <td className="px-4 py-2">
                    <StatusBadge status={s.status} lang={lang} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="avoid-break mt-6">
          <SkillBars skills={data.skills} />
        </div>
      </section>

      {/* PAGE 3 — Theory + Radar */}
      <section className="print-page">
        <h2 className="h-section mb-3 text-2xl">{t("softSkillTheory")}</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Unlike hard skills, which are technical and quantifiable, soft skills are personal
          attributes and character traits that influence how a person interacts with others and
          navigates their environment. Research shows that soft skills like communication,
          collaboration and critical thinking are crucial for success, complementing technical
          knowledge. Key foundational theories include:
        </p>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>
            <strong>Emotional Intelligence Theory</strong> (Salovey, Mayer &amp; Goleman) — the
            ability to understand and manage emotions, in oneself and others, is critical to social
            and professional success.
          </li>
          <li>
            <strong>Social Cognitive Theory</strong> (Bandura) — learning occurs in a social context
            through observation, imitation and modelling.
          </li>
          <li>
            <strong>Adult Learning Theory</strong> (Knowles) — people learn best when they can apply
            new skills directly to their lives and work.
          </li>
        </ul>

        <h3 className="mt-8 text-lg font-bold text-slate-900">Skill Category Overview</h3>
        <div className="avoid-break mt-2">
          <CategoryRadar categories={data.categories} />
        </div>
      </section>

      {/* PAGE 4 — Category scores */}
      <section className="print-page">
        <h2 className="h-section mb-4 text-2xl">{t("categories")} (out of 100)</h2>
        <div className="avoid-break">
          <CategoryBars categories={data.categories} />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {data.categories.map((c) => (
            <div key={c.key} className="avoid-break rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-800">{pick(c.label, CATEGORY_PA[c.key], lang)}</h4>
                <span className="text-lg font-extrabold text-brand-700">{c.percent}%</span>
              </div>
              <StatusBadge status={c.status} lang={lang} />
              <p className="mt-2 text-xs leading-relaxed text-slate-500">{c.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PAGE 5 — RIASEC */}
      <section className="print-page">
        <h2 className="h-section mb-1 text-2xl">{t("riasecTitle")}</h2>
        <p className="mb-4 text-sm text-slate-500">
          Based on Holland&apos;s theory of six personality–career types. Recognising your main
          interests helps you understand your aspirations and professional potential.
        </p>
        <div className="avoid-break">
          <RiasecPie riasec={data.riasec} />
        </div>
        <div className="mt-4 space-y-3">
          {[...data.riasec]
            .sort((a, b) => b.percent - a.percent)
            .map((r) => (
              <div key={r.key} className="avoid-break rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: r.color }} />
                    <h4 className="font-bold text-slate-800">{r.label}</h4>
                    <StatusBadge status={r.status} lang={lang} />
                  </div>
                  <span className="text-lg font-extrabold" style={{ color: r.color }}>
                    {r.percent}%
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  <strong>{t("careerFields")}:</strong> {r.fields}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  <strong>{t("typicalTraits")}:</strong> {r.traits}
                </p>
                <p className="mt-1 text-[11px] italic text-slate-400">Formula: {r.formula}</p>
              </div>
            ))}
        </div>
      </section>

      {/* PAGES 6–7 — Skill detail by paired category */}
      {pairedCategories.map((cat) => (
        <section key={cat.key} className="print-page">
          <h2 className="h-section mb-1 text-2xl">{pick(cat.label, CATEGORY_PA[cat.key], lang)}</h2>
          <p className="mb-5 text-sm text-slate-500">{cat.blurb}</p>
          <div className="space-y-5">
            {cat.skills.map((sk: SkillKey) => {
              const def = SKILL_MAP[sk];
              const res = data.skills.find((x) => x.key === sk)!;
              return (
                <div key={sk} className="avoid-break rounded-xl border border-slate-200 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      {def.en} <span className="font-pa text-base text-slate-400">{def.pa}</span>
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-slate-500">
                        {res.raw}/25 · {res.percent}%
                      </span>
                      <StatusBadge status={res.status} lang={lang} />
                    </div>
                  </div>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div>
                      <dt className="font-semibold text-slate-700">{t("definition")}</dt>
                      <dd className="text-slate-600">{pick(def.definition, SKILL_DEF_PA[def.key], lang)}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-700">{t("value")}</dt>
                      <dd className="text-slate-600">{def.value}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-700">{t("potential")}</dt>
                      <dd className="text-slate-600">{def.potential}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-700">{t("recommendation")}</dt>
                      <dd className="text-brand-700">{recommendation(def, res.status)}</dd>
                    </div>
                  </dl>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* PAGE 8 — Potential pie + final grid */}
      <section className="print-page">
        <h2 className="h-section mb-3 text-2xl">{t("potentialOfSkills")}</h2>
        <div className="avoid-break">
          <PotentialPie categories={data.categories} />
        </div>

        <h3 className="mt-8 text-lg font-bold text-slate-900">{t("completeSnapshot")}</h3>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {data.skills.map((s) => (
            <div key={s.key} className="avoid-break rounded-lg border border-slate-200 p-3 text-center">
              <p className="text-xs font-medium text-slate-500">{pick(SKILL_MAP[s.key].en, SKILL_MAP[s.key].pa, lang)}</p>
              <p className="text-xl font-extrabold text-slate-900">{s.raw}</p>
              <span
                className="text-[10px] font-semibold"
                style={{ color: STATUS_COLOR[s.status] }}
              >
                {ui(s.status, lang)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* PAGE 9 — Counselor recommendation */}
      <section className="print-page">
        <h2 className="h-section mb-4 text-2xl">{t("finalReco")}</h2>
        <div className="rounded-xl bg-brand-50 p-5 text-sm leading-relaxed text-slate-700">
          {counsel.summary}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-5">
            <h4 className="font-bold text-slate-800">{t("suggestedStream")}</h4>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {counsel.streams.length ? (
                counsel.streams.map((s) => <li key={s}>{s}</li>)
              ) : (
                <li>Explore broadly across streams — the profile is well balanced.</li>
              )}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 p-5">
            <h4 className="font-bold text-slate-800">{t("focusAreas")}</h4>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {counsel.focus.length ? (
                counsel.focus.map((s) => <li key={s}>{s}</li>)
              ) : (
                <li>No critical gaps — maintain and deepen current strengths.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex items-end justify-between">
          <div>
            <div className="h-12 w-48 border-b border-slate-300" />
            <p className="mt-1 text-xs text-slate-500">Counsellor Signature</p>
          </div>
          <div className="text-right text-xs text-slate-400">
            <p>{siteName} · Operated by {operator}</p>
            <p>{date}</p>
          </div>
        </div>

        <p className="mt-10 text-center text-sm font-semibold text-brand-700">
          Thanks for visiting — we wish you success in unlocking your full potential!
        </p>
      </section>
    </div>
  );
}
