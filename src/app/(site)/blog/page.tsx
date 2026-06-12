import type { Metadata } from "next";
import Link from "next/link";
import { getAllPostMeta, imageExists } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Career & Psychometric Testing Blog",
  description:
    "Expert guides on psychometric tests, career assessment, RIASEC, multiple intelligence and career guidance for students, parents, schools and companies in India.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    title: "Career & Psychometric Testing Blog | TestPsychometric",
    description:
      "Expert guides on psychometric tests, career assessment, RIASEC and career guidance for students, parents, schools and companies in India.",
    url: "https://testpsychometric.com/blog",
    images: [{ url: "https://testpsychometric.com/og-default.png", width: 1200, height: 630, alt: "TestPsychometric Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Career & Psychometric Testing Blog | TestPsychometric",
    description: "Expert guides on psychometric tests and career guidance for India.",
    images: ["https://testpsychometric.com/og-default.png"],
  },
};

export const dynamic = "force-dynamic";

export default function BlogIndex() {
  const posts = getAllPostMeta();
  const featured = posts.find((p) => p.featured) || posts[0];
  const rest = posts.filter((p) => p.slug !== featured?.slug);

  return (
    <>
      {/* Header */}
      <section className="border-b border-slate-200 bg-gradient-to-br from-brand-50 to-white">
        <div className="container-page py-12 sm:py-16">
          <p className="section-eyebrow">TestPsychometric Blog</p>
          <h1 className="mt-2 max-w-3xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Career Guidance, Psychometric Testing & Assessment Insights
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Practical, science-backed guides for students, parents, schools and companies — written by the
            TestPsychometric career team.
          </p>
        </div>
      </section>

      <div className="container-page py-10 sm:py-14">
        {posts.length === 0 && (
          <p className="text-slate-500">No articles published yet. Check back soon.</p>
        )}

        {/* Featured */}
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group mb-10 grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md md:grid-cols-2"
          >
            <div className="relative flex min-h-[220px] items-center justify-center bg-gradient-to-br from-brand-600 to-brand-900 p-8 text-white">
              {imageExists(featured.image) ? (
                <img src={featured.image} alt={featured.imageAlt} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <span className="text-center text-lg font-bold leading-snug">{featured.title}</span>
              )}
            </div>
            <div className="p-6 sm:p-8">
              <span className="badge bg-brand-50 text-brand-700">{featured.category}</span>
              <h2 className="mt-3 text-2xl font-extrabold leading-tight text-slate-900 group-hover:text-brand-700">
                {featured.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-slate-600">{featured.excerpt}</p>
              <p className="mt-4 text-xs font-medium text-slate-400">
                {featured.author} · {featured.readingTime}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                Read article →
              </span>
            </div>
          </Link>
        )}

        {/* Grid */}
        {rest.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex min-h-[140px] items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 p-5 text-center text-sm font-semibold text-white">
                  {imageExists(p.image) ? (
                    <img src={p.image} alt={p.imageAlt} className="h-full w-full object-cover" />
                  ) : (
                    p.title
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">{p.category}</span>
                  <h3 className="mt-1 line-clamp-2 font-bold leading-snug text-slate-900 group-hover:text-brand-700">
                    {p.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-500">{p.excerpt}</p>
                  <p className="mt-3 text-xs text-slate-400">{p.readingTime}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
