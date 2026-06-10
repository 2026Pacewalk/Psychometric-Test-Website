import Link from "next/link";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="bg-gradient-to-br from-brand-700 to-brand-900 py-16 text-white sm:py-20">
      <div className="container-page max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-widest text-brand-200">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 text-lg text-brand-100">{subtitle}</p>}
      </div>
    </section>
  );
}

export function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`py-14 sm:py-20 ${className}`}>{children}</section>;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  center,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-2xl`}>
      {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
      <h2 className="h-section mt-2">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-slate-600">{subtitle}</p>}
    </div>
  );
}

export function FeatureCard({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-6 transition hover:-translate-y-1 hover:shadow-soft">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-2xl">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{children}</p>
    </div>
  );
}

export function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-xs text-green-700">
        ✓
      </span>
      <span className="text-slate-600">{children}</span>
    </li>
  );
}

export function CTASection({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <section className="bg-brand-700">
      <div className="container-page flex flex-col items-center gap-6 py-14 text-center text-white sm:py-16">
        <h2 className="max-w-2xl text-3xl font-extrabold sm:text-4xl">{title}</h2>
        <p className="max-w-xl text-brand-100">{subtitle}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/how-to-enroll" className="btn bg-white text-brand-700 hover:bg-brand-50">
            Enroll Your School
          </Link>
          <Link href="/sample-report" className="btn border border-white/40 text-white hover:bg-white/10">
            View Sample Report
          </Link>
        </div>
      </div>
    </section>
  );
}
