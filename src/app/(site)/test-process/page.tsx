import type { Metadata } from "next";
import { Section, SectionHeader, PageHeader, CTASection } from "@/components/site/ui";
import { SCORE_OPTIONS } from "@/lib/skills";

export const metadata: Metadata = {
  title: "Test Process",
  description:
    "How the psychometric test works — from adding a student to the 50-statement assessment, automated scoring and instant report generation.",
};

const STEPS = [
  ["School adds the student", "The school enters the student in its dashboard and starts a test."],
  ["Student opens the test link", "A unique, secure link opens the assessment on any device."],
  ["Fill personal details", "The student confirms name, class, contact and other details."],
  ["Answer 50 statements", "Each statement is rated on a 1–5 agreement scale, in English or Punjabi."],
  ["Automatic scoring", "The system instantly calculates 12 skill scores, categories and RIASEC interests."],
  ["Personalised report", "A multi-page bilingual report is generated and ready to download as PDF."],
];

export default function TestProcessPage() {
  return (
    <>
      <PageHeader
        eyebrow="How It Works"
        title="The Test Process"
        subtitle="A smooth, six-step journey from enrollment to a finished, professional report."
      />

      <Section>
        <div className="container-page">
          <ol className="relative space-y-6 border-l-2 border-brand-100 pl-8">
            {STEPS.map(([t, d], i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[2.6rem] flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{t}</h3>
                <p className="mt-1 text-slate-600">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section className="bg-slate-50">
        <div className="container-page">
          <SectionHeader center eyebrow="The Scale" title="Every statement uses a 1–5 scale" />
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-5">
            {SCORE_OPTIONS.map((o) => (
              <div key={o.value} className="card p-5 text-center">
                <p className="text-3xl font-extrabold text-brand-700">{o.value}</p>
                <p className="mt-1 text-sm font-medium text-slate-700">{o.en}</p>
                <p className="font-pa mt-0.5 text-xs text-slate-400">{o.pa}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <CTASection
        title="See it in action"
        subtitle="View a sample report or enroll your school to get started."
      />
    </>
  );
}
