import type { Metadata } from "next";
import { Section, SectionHeader, FeatureCard, CheckItem, PageHeader } from "@/components/site/ui";
import LeadForm from "@/components/site/LeadForm";

export const metadata: Metadata = {
  title: "For Schools",
  description: "Schools can conduct the Multiple Intelligence based psychometric test for Class 9–10 students and generate detailed career guidance reports.",
};

export default function ForSchoolsPage() {
  return (
    <>
      <PageHeader
        eyebrow="For Schools"
        title="Psychometric Test for Class 9–10 Students"
        subtitle="Help every student discover their strengths and choose the right stream with a scientific, bilingual Multiple Intelligence assessment."
      />

      <Section>
        <div className="container-page grid gap-6 md:grid-cols-3">
          <FeatureCard icon="🧠" title="Multiple Intelligence Test">
            70 research-based statements (1–4 scale) measuring 8 intelligences, available in English &amp; Punjabi.
          </FeatureCard>
          <FeatureCard icon="📄" title="Detailed Student Report">
            MI scores, Mackenzie domains, RIASEC interests, career suggestions, Big-5 personality and stream recommendations.
          </FeatureCard>
          <FeatureCard icon="🖥" title="School Dashboard">
            Add students, conduct tests, and view, download and manage every report from one place.
          </FeatureCard>
        </div>
      </Section>

      <Section className="bg-slate-50">
        <div className="container-page grid items-start gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader title="What your school gets" />
            <ul className="mt-6 space-y-3">
              <CheckItem>Secure school login and profile management.</CheckItem>
              <CheckItem>Add students and start tests with one click.</CheckItem>
              <CheckItem>Unique secure test link for every student.</CheckItem>
              <CheckItem>Bilingual delivery (English &amp; Punjabi).</CheckItem>
              <CheckItem>Professional, printable PDF reports.</CheckItem>
              <CheckItem>Export data to Excel for records.</CheckItem>
            </ul>
          </div>
          <div>
            <h2 className="mb-4 text-xl font-bold text-slate-900">Enroll your school</h2>
            <LeadForm type="enroll" />
          </div>
        </div>
      </Section>
    </>
  );
}
