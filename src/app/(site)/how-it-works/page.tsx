import type { Metadata } from "next";
import { Section, SectionHeader, PageHeader, CTASection } from "@/components/site/ui";
import { STUDENT_SCALE } from "@/lib/mi";
import { SCORE_OPTIONS } from "@/lib/skills";

export const metadata: Metadata = {
  title: "How It Works",
  description: "How the psychometric testing process works for schools, companies and individuals — from registration to automated report generation.",
};

const TRACKS = [
  { title: "Schools", steps: ["School registers and is approved", "School adds Class 9–10 students", "Student takes the 70-question MI test (English/Punjabi)", "MI career-guidance report is generated"] },
  { title: "Companies", steps: ["Company registers and is approved", "Company adds employees / candidates", "Employee takes the psychometric test", "Skill & RIASEC report is generated"] },
  { title: "Individuals", steps: ["Create a personal login", "Choose a test type and pay securely", "Test unlocks instantly", "Download your report anytime"] },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader eyebrow="Process" title="How It Works" subtitle="A clear, guided journey for every audience — from start to a finished, professional report." />

      <Section>
        <div className="container-page grid gap-6 md:grid-cols-3">
          {TRACKS.map((t) => (
            <div key={t.title} className="card p-6">
              <h3 className="text-lg font-bold text-slate-900">{t.title}</h3>
              <ol className="mt-4 space-y-3">
                {t.steps.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-600">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-slate-50">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader eyebrow="Student Test" title="1–4 Agreement Scale" subtitle="Used in the school Multiple Intelligence test." />
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {STUDENT_SCALE.map((o) => (
                <div key={o.value} className="card p-4 text-center">
                  <p className="text-2xl font-extrabold text-brand-700">{o.value}</p>
                  <p className="mt-1 text-xs font-medium text-slate-700">{o.en}</p>
                  <p className="font-pa text-[11px] text-slate-400">{o.pa}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <SectionHeader eyebrow="Employee Test" title="1–5 Agreement Scale" subtitle="Used in the company / individual employee test." />
            <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-5">
              {SCORE_OPTIONS.map((o) => (
                <div key={o.value} className="card p-3 text-center">
                  <p className="text-xl font-extrabold text-brand-700">{o.value}</p>
                  <p className="mt-1 text-[11px] font-medium text-slate-700">{o.en}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <CTASection title="Ready to begin?" subtitle="Enroll your school, register your company, or take an individual test." />
    </>
  );
}
