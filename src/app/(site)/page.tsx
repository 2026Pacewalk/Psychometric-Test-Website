import Link from "next/link";
import { prisma } from "@/lib/db";
import { Section, SectionHeader, FeatureCard } from "@/components/site/ui";
import { TrustSection } from "@/components/site/Trust";

export const dynamic = "force-dynamic";

const AUDIENCES = [
  {
    icon: "🏫",
    title: "For Schools",
    tag: "Class 9–10 Students",
    desc: "Conduct the Multiple Intelligence based career assessment and generate detailed student guidance reports.",
    points: ["70-question MI test (1–4 scale)", "English & Punjabi", "Stream & career recommendations"],
    cta: "Enroll School",
    href: "/for-schools",
  },
  {
    icon: "🏢",
    title: "For Companies",
    tag: "Employees & Candidates",
    desc: "Assess employees, applicants and teams with the employee psychometric test and review strengths and recommendations.",
    points: ["Employee psychometric test", "Strengths & weaknesses", "Team result management"],
    cta: "Register Company",
    href: "/for-companies",
  },
  {
    icon: "👤",
    title: "Individual Test",
    tag: "Students · Parents · Professionals",
    desc: "Take a test personally after a secure online payment, and download your personalised report anytime.",
    points: ["Pay securely via Razorpay", "Instant test unlock", "Lifetime report access"],
    cta: "Take Individual Test",
    href: "/individual",
  },
];

export default async function HomePage() {
  const hero = await prisma.contentBlock.findUnique({ where: { key: "hero" } });
  const headline = hero?.title || "Scientific Career Guidance for Every Indian Student & Professional";
  const sub =
    hero?.body ||
    "A trusted psychometric assessment platform for schools, companies and individuals — mapping aptitude, intelligence and career interests into a clear, professional report.";

  return (
    <>
      {/* HERO */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-brand-50 to-white">
        <div className="container-page py-14 text-center sm:py-20">
          <span className="badge bg-white text-brand-700 ring-1 ring-brand-100">🇮🇳 Education &amp; Career Guidance Portal</span>
          <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            {headline}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">{sub}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/for-schools" className="btn-primary">Enroll School</Link>
            <Link href="/for-companies" className="btn-outline">Register Company</Link>
            <Link href="/individual" className="btn-accent">Take Individual Test</Link>
            <Link href="/sample-report" className="btn-ghost">View Sample Report →</Link>
          </div>

          {/* Trust badges */}
          <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500">
            {["🔒 Secure & Confidential", "🗣 Bilingual (English · ਪੰਜਾਬੀ)", "📄 Professional PDF Reports", "🎓 Research-based Models", "🤝 Trusted by Schools"].map((b) => (
              <span key={b} className="font-medium">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 3 AUDIENCES */}
      <Section>
        <div className="container-page">
          <SectionHeader center eyebrow="Choose Your Path" title="One Platform, Three Audiences" />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {AUDIENCES.map((a) => (
              <div key={a.title} className="card flex flex-col p-7 ring-1 ring-slate-100">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50 text-3xl">{a.icon}</div>
                <p className="mt-4 text-xs font-bold uppercase tracking-wide text-brand-600">{a.tag}</p>
                <h3 className="mt-1 text-xl font-bold text-slate-900">{a.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{a.desc}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {a.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="text-green-600">✓</span> {p}
                    </li>
                  ))}
                </ul>
                <Link href={a.href} className="btn-primary mt-6 w-full">{a.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* WHAT / WHY / GOV strip */}
      <Section className="bg-slate-50">
        <div className="container-page grid gap-6 md:grid-cols-3">
          <FeatureCard icon="🧠" title="What is a Psychometric Test?">
            A scientific assessment that measures skills, intelligence, personality and interests, turning answers into clear career insight.
          </FeatureCard>
          <FeatureCard icon="🎯" title="Why It Is Important">
            It replaces guesswork with evidence — aligning students and professionals with the paths where they can truly excel.
          </FeatureCard>
          <FeatureCard icon="🏛" title="Govt Career Guidance">
            Supports national education priorities on holistic development, skill assessment and structured career counselling.
          </FeatureCard>
        </div>
      </Section>

      {/* TRUST & REGISTRATION */}
      <TrustSection />

      {/* HOW IT WORKS */}
      <Section>
        <div className="container-page">
          <SectionHeader center eyebrow="Simple Process" title="How It Works" />
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {[
              ["1", "Register / Enroll", "Schools and companies register; individuals create a personal login."],
              ["2", "Add & Assign", "Add students or employees, or individuals pick a test and pay securely."],
              ["3", "Take the Test", "Answer the questions online in English or Punjabi on any device."],
              ["4", "Get the Report", "A professional, printable report is generated automatically."],
            ].map(([n, t, d]) => (
              <div key={n} className="relative card p-6">
                <span className="absolute -top-4 left-6 flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 font-bold text-white">{n}</span>
                <h3 className="mt-3 font-bold text-slate-900">{t}</h3>
                <p className="mt-2 text-sm text-slate-600">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/how-it-works" className="btn-outline">See full process →</Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <section className="bg-brand-800">
        <div className="container-page flex flex-col items-center gap-6 py-14 text-center text-white">
          <h2 className="max-w-2xl text-3xl font-extrabold">Ready to get started?</h2>
          <p className="max-w-xl text-brand-100">Enroll your school, register your company, or take an individual test today.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/for-schools" className="btn bg-white text-brand-800 hover:bg-brand-50">Enroll School</Link>
            <Link href="/individual" className="btn border border-white/40 text-white hover:bg-white/10">Take Individual Test</Link>
          </div>
        </div>
      </section>
    </>
  );
}
