import type { Metadata } from "next";
import { Section, SectionHeader, FeatureCard, CheckItem, PageHeader } from "@/components/site/ui";
import LeadForm from "@/components/site/LeadForm";

export const metadata: Metadata = {
  title: "For Companies",
  description: "Companies can assess employees, candidates and teams with the employee psychometric test and review strengths, weaknesses and recommendations.",
};

export default function ForCompaniesPage() {
  return (
    <>
      <PageHeader
        eyebrow="For Companies"
        title="Employee Psychometric Assessment"
        subtitle="Assess employees, job applicants and teams to understand strengths, work style and career fit — with clear, professional reports."
      />

      <Section>
        <div className="container-page grid gap-6 md:grid-cols-3">
          <FeatureCard icon="👥" title="Assess Your Team">
            Add employees and candidates and conduct the employee psychometric test online.
          </FeatureCard>
          <FeatureCard icon="📊" title="Strengths & Weaknesses">
            Review 12 core skills, RIASEC work interests and clear recommendations per person.
          </FeatureCard>
          <FeatureCard icon="🗂" title="Result Management">
            View, filter and export employee results and reports from your company dashboard.
          </FeatureCard>
        </div>
      </Section>

      <Section className="bg-slate-50">
        <div className="container-page grid items-start gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader title="Why companies use it" />
            <ul className="mt-6 space-y-3">
              <CheckItem>Better hiring and role-fit decisions.</CheckItem>
              <CheckItem>Identify training and development needs.</CheckItem>
              <CheckItem>Build balanced, complementary teams.</CheckItem>
              <CheckItem>Objective, data-driven insights.</CheckItem>
            </ul>
            <p className="mt-6 rounded-xl bg-white p-4 text-sm text-slate-600 ring-1 ring-slate-200">
              Company accounts are activated by our team. Submit your details and we will set up your secure
              company dashboard and login.
            </p>
          </div>
          <div>
            <h2 className="mb-4 text-xl font-bold text-slate-900">Register your company</h2>
            <LeadForm type="company" />
          </div>
        </div>
      </Section>
    </>
  );
}
