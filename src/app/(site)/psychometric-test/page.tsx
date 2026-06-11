import type { Metadata } from "next";
import Link from "next/link";
import { getAllLocationMeta } from "@/lib/locations";

export const metadata: Metadata = {
  title: "Psychometric Test & Career Counselling Locations in Punjab",
  description:
    "Psychometric test and career counselling across Punjab — Chandigarh, Mohali, Ludhiana, Amritsar, Bathinda, Faridkot, Kotkapura and more. Find your city.",
  alternates: { canonical: "/psychometric-test" },
};

export const dynamic = "force-dynamic";

export default function LocationsIndex() {
  const locations = getAllLocationMeta();

  return (
    <>
      <section className="border-b border-slate-200 bg-gradient-to-br from-brand-50 to-white">
        <div className="container-page py-12 sm:py-16">
          <p className="section-eyebrow">Locations</p>
          <h1 className="mt-2 max-w-3xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Psychometric Test & Career Counselling Across Punjab
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Scientific, bilingual psychometric assessment and career guidance for students, parents, schools and
            companies — available online across Punjab and India. Choose your city.
          </p>
        </div>
      </section>

      <div className="container-page py-10 sm:py-14">
        {locations.length === 0 ? (
          <p className="text-slate-500">Location pages coming soon.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((l) => (
              <Link
                key={l.slug}
                href={`/psychometric-test/${l.slug}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
              >
                <p className="text-[11px] font-bold uppercase tracking-wider text-brand-600">{l.region}</p>
                <h2 className="mt-1 text-lg font-bold text-slate-900 group-hover:text-brand-700">{l.city}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-slate-500">{l.excerpt}</p>
                <span className="mt-3 inline-flex text-sm font-semibold text-brand-600">View →</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
