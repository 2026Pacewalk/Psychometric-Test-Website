import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Section, SectionHeader, PageHeader } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Transparent pricing for individual psychometric tests. Schools and companies are managed via subscription / approval.",
};

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const pricing = await prisma.pricing.findMany({ where: { active: true }, orderBy: { amount: "asc" } });

  return (
    <>
      <PageHeader eyebrow="Pricing" title="Simple, Transparent Pricing" subtitle="Individual tests are pay-per-use. Schools and companies are onboarded via subscription or manual approval — contact us for institutional plans." />

      <Section>
        <div className="container-page">
          <SectionHeader center eyebrow="Individual Tests" title="Pay only for what you take" />
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
            {pricing.map((p) => (
              <div key={p.id} className="card flex flex-col p-7 text-center">
                <h3 className="text-base font-bold text-slate-900">{p.label}</h3>
                <p className="mt-4 text-4xl font-extrabold text-brand-700">₹{p.amount}</p>
                <p className="mt-1 text-xs text-slate-500">one-time · incl. report</p>
                <Link href="/individual" className="btn-primary mt-6">Take this Test</Link>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
            <h3 className="text-lg font-bold text-slate-900">Schools &amp; Companies</h3>
            <p className="mt-2 text-sm text-slate-600">
              Institutional pricing is based on the number of students or employees. Accounts are activated by our
              team after approval.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Link href="/for-schools" className="btn-outline text-sm">School Plans</Link>
              <Link href="/for-companies" className="btn-outline text-sm">Company Plans</Link>
              <Link href="/contact" className="btn-primary text-sm">Contact Sales</Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
