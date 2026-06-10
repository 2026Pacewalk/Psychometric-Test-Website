import type { Metadata } from "next";
import { Section, SectionHeader, FeatureCard, CheckItem, PageHeader, CTASection } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "Benefits for Students",
  description:
    "How students benefit from a psychometric assessment — self-awareness, career direction and a personalised bilingual report.",
};

export default function BenefitsStudentsPage() {
  return (
    <>
      <PageHeader
        eyebrow="For Students"
        title="Benefits for Students"
        subtitle="A clear, personalised roadmap that helps every student understand themselves and choose the right path."
      />

      <Section>
        <div className="container-page grid gap-6 md:grid-cols-3">
          <FeatureCard icon="🪞" title="Self-Awareness">
            Discover dominant strengths, hidden talents and areas that need attention.
          </FeatureCard>
          <FeatureCard icon="🧭" title="Career Direction">
            Get matched RIASEC career interests and suitable stream recommendations.
          </FeatureCard>
          <FeatureCard icon="📄" title="Personalised Report">
            Receive a detailed, printable report with charts, skill definitions and counsellor notes.
          </FeatureCard>
          <FeatureCard icon="🌐" title="Comfortable Language">
            Take the test in English or Punjabi (ਪੰਜਾਬੀ) — whichever feels natural.
          </FeatureCard>
          <FeatureCard icon="💪" title="Confidence to Choose">
            Make stream and career decisions backed by data, not pressure.
          </FeatureCard>
          <FeatureCard icon="🎯" title="Focused Improvement">
            Know exactly which skills to develop next, with practical recommendations.
          </FeatureCard>
        </div>
      </Section>

      <Section className="bg-slate-50">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div className="card p-8">
            <h3 className="text-lg font-bold text-slate-900">Your report includes</h3>
            <ul className="mt-4 space-y-3">
              <CheckItem>Student profile &amp; overall skill index.</CheckItem>
              <CheckItem>12 Core Life Skills with scores and status.</CheckItem>
              <CheckItem>Category analysis and skill definitions.</CheckItem>
              <CheckItem>RIASEC career interest chart &amp; suggestions.</CheckItem>
              <CheckItem>Suggested streams and a final counsellor recommendation.</CheckItem>
            </ul>
          </div>
          <div>
            <SectionHeader
              title="Designed for clarity"
              subtitle="No jargon, no confusion — just a clear picture of who the student is today and where they can excel tomorrow."
            />
          </div>
        </div>
      </Section>

      <CTASection
        title="Help students unlock their full potential"
        subtitle="Ask your school to enroll, or contact us to learn more."
      />
    </>
  );
}
