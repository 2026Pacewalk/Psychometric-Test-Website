import type { Metadata } from "next";
import { Section, SectionHeader, PageHeader } from "@/components/site/ui";
import LeadForm from "@/components/site/LeadForm";

export const metadata: Metadata = {
  title: "How Schools Can Enroll",
  description:
    "Enroll your school for psychometric testing in three simple steps. Submit the form or message us on WhatsApp.",
};

const STEPS = [
  ["Submit your details", "Fill the form below or message us on WhatsApp with your school name and city."],
  ["Verification & approval", "We verify your school and activate a secure dashboard login for you."],
  ["Onboard & start testing", "Add students, conduct tests and download reports — we guide you throughout."],
];

export default function EnrollPage() {
  return (
    <>
      <PageHeader
        eyebrow="Get Started"
        title="How Schools Can Enroll"
        subtitle="Onboarding is quick and fully supported. Most schools are live within a day."
      />

      <Section>
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader title="Three simple steps" />
            <ol className="mt-6 space-y-5">
              {STEPS.map(([t, d], i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900">{t}</h3>
                    <p className="text-sm text-slate-600">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8 rounded-xl bg-brand-50 p-5 text-sm text-slate-600">
              Already enrolled? Use your school code to{" "}
              <a href="/school-login" className="font-semibold text-brand-700">log in to your dashboard</a>.
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-bold text-slate-900">Enrollment Request</h2>
            <LeadForm type="enroll" />
          </div>
        </div>
      </Section>
    </>
  );
}
