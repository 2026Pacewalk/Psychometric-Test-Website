import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Section, SectionHeader, FeatureCard, PageHeader } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "Individual Test",
  description: "Take a psychometric test personally after a secure online payment, and download your personalised report anytime.",
};

export const dynamic = "force-dynamic";

export default async function IndividualPage() {
  const pricing = await prisma.pricing.findMany({ where: { active: true }, orderBy: { amount: "asc" } });

  return (
    <>
      <PageHeader
        eyebrow="Individual Test"
        title="Take a Test, Personally"
        subtitle="For parents, students, employees and any individual who wants a personal assessment — pay securely online and get your report instantly."
      />

      <Section>
        <div className="container-page grid gap-6 md:grid-cols-3">
          <FeatureCard icon="🧾" title="Choose Your Test">
            Student Test, Employee / Self-Assessment Test, or Parent-for-Child assessment.
          </FeatureCard>
          <FeatureCard icon="💳" title="Pay Securely">
            Complete a secure online payment via Razorpay. Your test unlocks immediately after payment.
          </FeatureCard>
          <FeatureCard icon="📥" title="Lifetime Access">
            Log in anytime to take your test and download previous reports.
          </FeatureCard>
        </div>
      </Section>

      <Section className="bg-slate-50">
        <div className="container-page">
          <SectionHeader center eyebrow="Test Options & Pricing" title="Pick a Test to Begin" />
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-3">
            {pricing.map((p) => (
              <div key={p.id} className="card flex flex-col p-6 text-center">
                <h3 className="text-base font-bold text-slate-900">{p.label}</h3>
                <p className="mt-4 text-3xl font-extrabold text-brand-700">₹{p.amount}</p>
                <Link href="/individual/register" className="btn-primary mt-5">Register &amp; Start</Link>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">
            Already registered?{" "}
            <Link href="/individual/login" className="font-semibold text-brand-700">Log in to your account</Link>
          </p>
        </div>
      </Section>
    </>
  );
}
