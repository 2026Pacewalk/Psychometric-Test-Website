import type { Metadata } from "next";
import { Section, SectionHeader, FeatureCard, PageHeader } from "@/components/site/ui";
import { RegistrationDetails } from "@/components/site/Trust";
import { ORG } from "@/lib/site";

export const metadata: Metadata = {
  title: "About & Trust",
  description:
    "About the psychometric assessment portal operated by AMG Educational Charitable Society — registration, DARPAN ID and trust details.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Understanding Psychometric Testing"
        subtitle="A scientific approach to understanding how students think, feel, behave and where their true potential lies."
      />

      <Section>
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader title="What it is" />
            <p className="mt-4 text-slate-600">
              Psychometrics is the science of measuring mental capabilities and behavioural style.
              A psychometric assessment uses carefully designed statements to measure a student&apos;s
              skills, personality traits and interests in an objective, standardised way.
            </p>
            <p className="mt-3 text-slate-600">
              Instead of relying on marks alone, it reveals <strong>how</strong> a student learns,
              communicates, makes decisions and adapts — the factors that truly shape career success.
            </p>
          </div>
          <div>
            <SectionHeader title="Our approach" />
            <p className="mt-4 text-slate-600">
              Our assessment combines a <strong>12 Core Life Skills</strong> framework with
              Holland&apos;s globally recognised <strong>RIASEC</strong> career-interest model. Each
              student answers 50 statements on a 1–5 scale, and our engine converts these into skill
              scores, category insights and matched career suggestions.
            </p>
            <p className="mt-3 text-slate-600">
              The result is a clear, personalised, bilingual report that students, parents and
              counsellors can act on with confidence.
            </p>
          </div>
        </div>
      </Section>

      <Section className="bg-slate-50">
        <div className="container-page">
          <SectionHeader center eyebrow="The Foundations" title="Built on Established Theory" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <FeatureCard icon="💡" title="Emotional Intelligence Theory">
              Salovey, Mayer &amp; Goleman — understanding and managing emotions is critical to social and professional success.
            </FeatureCard>
            <FeatureCard icon="👥" title="Social Cognitive Theory">
              Bandura — skills are learned through observation, imitation and interaction within a social context.
            </FeatureCard>
            <FeatureCard icon="🎯" title="Holland's RIASEC Theory">
              Six personality–career types help match students to suitable educational and vocational paths.
            </FeatureCard>
          </div>
        </div>
      </Section>

      <Section>
        <div className="container-page">
          <SectionHeader
            eyebrow="Trust & Registration"
            title="About the Operating Organisation"
            subtitle={`This portal is operated by ${ORG.operator}, a registered charitable society working in education, literacy and skill development across ${ORG.operationalArea}.`}
          />
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="space-y-4 text-sm leading-relaxed text-slate-600">
              <p>
                {ORG.operator} was registered in {ORG.registrationYear} in {ORG.cityOfRegistration},
                {" "}{ORG.stateOfRegistration} under {ORG.actName}. The society is listed on the
                NITI Aayog DARPAN portal with ID <strong>{ORG.darpanId}</strong> ({ORG.darpanStatus}).
              </p>
              <p>
                Working under the leadership of its President, <strong>{ORG.president}</strong>, the
                society focuses on <strong>{ORG.primarySector}</strong>, with a secondary focus on{" "}
                {ORG.secondarySector}.
              </p>
              <p>
                Reference: <a href={ORG.reference} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-700 hover:underline">{ORG.reference}</a>
              </p>
            </div>
            <RegistrationDetails />
          </div>
        </div>
      </Section>
    </>
  );
}
