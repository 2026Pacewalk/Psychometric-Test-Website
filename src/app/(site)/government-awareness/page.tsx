import type { Metadata } from "next";
import { Section, SectionHeader, FeatureCard, CheckItem, PageHeader } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "Government Awareness & Career Guidance",
  description:
    "How national education policy emphasises career guidance and counselling, and why structured psychometric assessment supports these goals.",
};

export default function GovtPage() {
  return (
    <>
      <PageHeader
        eyebrow="Policy & Awareness"
        title="Government Awareness & Career Guidance Importance"
        subtitle="National education reforms increasingly stress holistic development, skill assessment and structured career counselling for students."
      />

      <Section>
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader title="Aligned with modern education goals" />
            <p className="mt-4 text-slate-600">
              The National Education Policy (NEP) and various state initiatives emphasise competency-based
              learning, vocational exposure and career counselling from the secondary level. Psychometric
              assessment is a practical tool that helps schools deliver on these priorities.
            </p>
            <ul className="mt-6 space-y-3">
              <CheckItem>Supports NEP&apos;s focus on holistic, multidisciplinary development.</CheckItem>
              <CheckItem>Encourages early career awareness and vocational guidance.</CheckItem>
              <CheckItem>Promotes skill-based evaluation beyond rote marks.</CheckItem>
              <CheckItem>Helps bridge the gap between education and employability.</CheckItem>
            </ul>
          </div>
          <div className="grid gap-6">
            <FeatureCard icon="🏛" title="Structured Counselling">
              Schools can institutionalise career counselling with data instead of ad-hoc advice.
            </FeatureCard>
            <FeatureCard icon="🌱" title="Skill Development Focus">
              Identifies life skills that government frameworks increasingly recognise as essential.
            </FeatureCard>
            <FeatureCard icon="🗣" title="Regional Language Access">
              Bilingual English &amp; Punjabi delivery improves accessibility and inclusion.
            </FeatureCard>
          </div>
        </div>
      </Section>

      <Section className="bg-slate-50">
        <div className="container-page">
          <SectionHeader center title="Educational counselling, revitalised" />
          <p className="mx-auto mt-4 max-w-3xl text-center text-slate-600">
            Modern career theories such as Holland&apos;s RIASEC model can inform educational counselling in
            secondary and post-secondary settings. By associating six personality types with matching
            environments, schools can guide students toward suitable educational and vocational paths — for
            the benefit of both students and institutions.
          </p>
        </div>
      </Section>
    </>
  );
}
