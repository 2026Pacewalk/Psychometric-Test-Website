import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeader, FeatureCard, CheckItem, PageHeader } from "@/components/site/ui";
import CentreApplyForm from "@/components/site/CentreApplyForm";
import { ORG } from "@/lib/site";

export const metadata: Metadata = {
  title: "Become an Authorised Study Centre",
  description: "Institutes, coaching centres, schools and education consultants can become an Authorised Study Centre of AMG Educational Charitable Society and deliver scientific psychometric assessments.",
};

const FAQS = [
  ["Who can apply?", "Any institute, coaching centre, school partner, computer centre or education consultant can apply to become an Authorised Study Centre."],
  ["What tests can I conduct?", "All available tests — the Class 9–10 Multiple Intelligence student test and the Employee / Individual psychometric test — in English and Punjabi."],
  ["Do I get my own dashboard?", "Yes. After your application, you log in to a secure dashboard to manage users, conduct tests and download reports."],
  ["What support do I get?", "We provide onboarding guidance, test material, ready-made professional reports and ongoing support."],
  ["How do I get started?", "Fill the Apply Now form below to create your account. Further steps are completed inside your dashboard."],
];

export default function BecomeStudyCentrePage() {
  return (
    <>
      <PageHeader
        eyebrow="Partner With Us"
        title="Become an Authorised Study Centre"
        subtitle={`Partner with ${ORG.operator} to deliver scientific psychometric assessments and career guidance in your area.`}
      />

      <section className="border-b border-slate-200 bg-brand-50">
        <div className="container-page flex flex-col items-center gap-4 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Become an Authorised Study Centre</h2>
            <p className="mt-1 text-slate-600">Apply online, get your secure dashboard, and start conducting psychometric tests.</p>
          </div>
          <Link href="#apply" className="btn-primary">Apply for Authorised Study Centre</Link>
        </div>
      </section>

      {/* What is */}
      <Section>
        <div className="container-page grid items-start gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader eyebrow="Overview" title="What is an Authorised Study Centre?" />
            <p className="mt-4 text-slate-600">
              An Authorised Study Centre is an approved local partner of {ORG.operator} that conducts psychometric
              tests for students, candidates and individuals — using our platform, tests and professional reports.
            </p>
            <p className="mt-3 text-slate-600">
              You get a secure dashboard to add users, create test links, conduct tests and download reports — backed
              by our onboarding support and training.
            </p>
          </div>
          <div className="grid gap-4">
            <FeatureCard icon="🏷" title="Authorised Partnership">Operate under an authorised association with a registered non-profit society.</FeatureCard>
            <FeatureCard icon="🖥" title="Your Own Dashboard">A secure portal to manage everything in one place.</FeatureCard>
          </div>
        </div>
      </Section>

      {/* Benefits */}
      <Section className="bg-slate-50">
        <div className="container-page">
          <SectionHeader center eyebrow="Why Partner" title="Benefits for Study Centres" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <FeatureCard icon="📈" title="New Service Offering">Add a high-value career-guidance service without building your own platform.</FeatureCard>
            <FeatureCard icon="🧠" title="Ready-made Tests">Use proven, research-based assessments with zero setup.</FeatureCard>
            <FeatureCard icon="📄" title="Professional Reports">Generate detailed, printable, branded reports instantly.</FeatureCard>
            <FeatureCard icon="🌐" title="Bilingual Delivery">Offer assessments in English and Punjabi.</FeatureCard>
            <FeatureCard icon="🤝" title="Trusted Association">Partner with a DARPAN-registered charitable society.</FeatureCard>
            <FeatureCard icon="🎓" title="Support & Training">Get onboarding guidance and ongoing assistance.</FeatureCard>
          </div>
        </div>
      </Section>

      {/* Available tests */}
      <Section>
        <div className="container-page">
          <SectionHeader center eyebrow="What You Can Offer" title="Available Psychometric Tests" />
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-3">
            <div className="card p-6">
              <h3 className="text-lg font-bold text-slate-900">School Student Test</h3>
              <p className="mt-2 text-sm text-slate-600">Class 9–10 Multiple Intelligence assessment with a detailed career-guidance report (English &amp; Punjabi).</p>
            </div>
            <div className="card p-6">
              <h3 className="text-lg font-bold text-slate-900">Employee Test</h3>
              <p className="mt-2 text-sm text-slate-600">Psychometric assessment for employees and candidates with a skills &amp; RIASEC report.</p>
            </div>
            <div className="card p-6">
              <h3 className="text-lg font-bold text-slate-900">Individual Test Support</h3>
              <p className="mt-2 text-sm text-slate-600">Support walk-in individuals — students, parents and professionals — who want a personal assessment.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Dashboard + report features */}
      <Section className="bg-slate-50">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader eyebrow="Dashboard" title="Dashboard Features" />
            <ul className="mt-6 space-y-3">
              <CheckItem>Secure login &amp; profile management.</CheckItem>
              <CheckItem>Add users and create secure test links.</CheckItem>
              <CheckItem>Conduct all available tests online.</CheckItem>
              <CheckItem>Manage users, tests and results in one place.</CheckItem>
            </ul>
          </div>
          <div>
            <SectionHeader eyebrow="Reports" title="Report Generation Features" />
            <ul className="mt-6 space-y-3">
              <CheckItem>Automatic, professional report generation.</CheckItem>
              <CheckItem>Printable PDF reports with charts.</CheckItem>
              <CheckItem>Bilingual content (English &amp; Punjabi).</CheckItem>
              <CheckItem>Download and share reports anytime.</CheckItem>
            </ul>
          </div>
        </div>
      </Section>

      {/* Support & training */}
      <Section>
        <div className="container-page">
          <SectionHeader center eyebrow="We've Got You" title="Support & Training" />
          <div className="mx-auto mt-8 max-w-3xl text-center text-slate-600">
            <p>
              Every Authorised Study Centre receives onboarding guidance, access to test material and professional
              report templates, and ongoing support from our team — so you can start delivering assessments
              confidently from day one.
            </p>
          </div>
        </div>
      </Section>

      {/* Apply form */}
      <Section className="bg-slate-50">
        <div id="apply" className="container-page max-w-3xl scroll-mt-24">
          <SectionHeader center eyebrow="Get Started" title="Apply Now" subtitle="Create your study-centre account. The remaining steps are completed inside your secure dashboard." />
          <div className="mt-8"><CentreApplyForm /></div>
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <div className="container-page max-w-3xl">
          <SectionHeader center eyebrow="Questions" title="Frequently Asked Questions" />
          <div className="mt-8 space-y-3">
            {FAQS.map(([q, a]) => (
              <details key={q} className="card p-5">
                <summary className="cursor-pointer font-semibold text-slate-900">{q}</summary>
                <p className="mt-2 text-sm text-slate-600">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
