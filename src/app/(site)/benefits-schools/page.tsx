import type { Metadata } from "next";
import { Section, SectionHeader, FeatureCard, CheckItem, PageHeader, CTASection } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "Benefits for Schools",
  description:
    "How schools benefit from offering psychometric assessments — a dedicated dashboard, automated reports, and a stronger value proposition for parents.",
};

export default function BenefitsSchoolsPage() {
  return (
    <>
      <PageHeader
        eyebrow="For Schools"
        title="Benefits for Schools"
        subtitle="Add a premium, science-backed career guidance service that differentiates your school and delights parents."
      />

      <Section>
        <div className="container-page">
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard icon="🖥" title="Dedicated Dashboard">
              A secure school panel to add students, start tests and manage all results in one place.
            </FeatureCard>
            <FeatureCard icon="⚡" title="Automated Reports">
              Reports are generated instantly when a student submits — no manual scoring or paperwork.
            </FeatureCard>
            <FeatureCard icon="🔎" title="Powerful Filtering">
              Filter results by class, date, student name, score and category in seconds.
            </FeatureCard>
            <FeatureCard icon="📤" title="Export to PDF &amp; Excel">
              Download individual reports as PDF and bulk data as Excel for records and meetings.
            </FeatureCard>
            <FeatureCard icon="📊" title="At-a-Glance Stats">
              See total students tested, pending tests, completed tests and reports generated.
            </FeatureCard>
            <FeatureCard icon="🏆" title="Stronger Reputation">
              Position your school as forward-thinking and student-centric to attract admissions.
            </FeatureCard>
          </div>
        </div>
      </Section>

      <Section className="bg-slate-50">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader title="Everything your team needs" />
            <ul className="mt-6 space-y-3">
              <CheckItem>Secure login and school profile management.</CheckItem>
              <CheckItem>Add students individually and start tests with one click.</CheckItem>
              <CheckItem>Share a unique secure test link with each student.</CheckItem>
              <CheckItem>View submitted tests and download professional reports.</CheckItem>
              <CheckItem>Bilingual delivery in English &amp; Punjabi.</CheckItem>
            </ul>
          </div>
          <div className="card p-6">
            <p className="text-sm font-semibold text-slate-400">Dashboard Preview</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                ["Students", "248"],
                ["Completed", "201"],
                ["Pending", "47"],
                ["Reports", "201"],
              ].map(([l, n]) => (
                <div key={l} className="rounded-xl bg-brand-50 p-4 text-center">
                  <p className="text-2xl font-extrabold text-brand-700">{n}</p>
                  <p className="text-xs text-slate-500">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <CTASection
        title="Bring premium career guidance to your school"
        subtitle="Enroll today and activate your secure dashboard."
      />
    </>
  );
}
