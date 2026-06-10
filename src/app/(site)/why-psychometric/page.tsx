import type { Metadata } from "next";
import { Section, SectionHeader, FeatureCard, CheckItem, PageHeader, CTASection } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "Why Psychometric Testing Is Important",
  description:
    "Why psychometric testing is essential for student career planning — reducing wrong stream selection and aligning aspirations with aptitude.",
};

export default function WhyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Why It Matters"
        title="Why Psychometric Testing Is Important"
        subtitle="The single most important decision a student makes — choosing a career path — should be based on evidence, not guesswork."
      />

      <Section>
        <div className="container-page grid items-start gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader title="The problem with guesswork" />
            <p className="mt-4 text-slate-600">
              Many students pick streams based on what friends choose, family pressure, or trends — not
              their genuine strengths and interests. This leads to disengagement, poor performance and
              costly course changes later.
            </p>
            <ul className="mt-6 space-y-3">
              <CheckItem>Reduces wrong-stream selection after Class 10 and 12.</CheckItem>
              <CheckItem>Boosts motivation by aligning study with strengths.</CheckItem>
              <CheckItem>Helps students discover careers they never considered.</CheckItem>
              <CheckItem>Gives parents objective data to support decisions.</CheckItem>
              <CheckItem>Lowers dropout rates and career dissatisfaction.</CheckItem>
            </ul>
          </div>
          <div className="grid gap-6">
            <FeatureCard icon="🧭" title="Direction Before Decisions">
              Students see their dominant skills and career interests before committing to a stream.
            </FeatureCard>
            <FeatureCard icon="📈" title="Confidence &amp; Self-Awareness">
              Understanding strengths and areas needing attention builds healthy self-belief.
            </FeatureCard>
            <FeatureCard icon="🤝" title="Better Parent–Student Conversations">
              A shared, neutral report turns arguments into productive planning.
            </FeatureCard>
          </div>
        </div>
      </Section>

      <CTASection
        title="Give every student the clarity they deserve"
        subtitle="Bring scientific career guidance to your school today."
      />
    </>
  );
}
