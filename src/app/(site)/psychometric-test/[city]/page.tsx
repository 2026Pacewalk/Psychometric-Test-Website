import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllLocationSlugs, getLocation } from "@/lib/locations";
import { ORG, SITE_NAME } from "@/lib/site";

const BASE = "https://testpsychometric.com";

export function generateStaticParams() {
  return getAllLocationSlugs().map((city) => ({ city }));
}

export function generateMetadata({ params }: { params: { city: string } }): Metadata {
  const loc = getLocation(params.city);
  if (!loc) return { title: "Location not found" };
  return {
    title: loc.metaTitle,
    description: loc.metaDescription,
    alternates: { canonical: `/psychometric-test/${loc.slug}` },
    openGraph: {
      type: "website",
      title: loc.metaTitle,
      description: loc.metaDescription,
      url: `${BASE}/psychometric-test/${loc.slug}`,
      images: [{ url: "/logo.png" }],
    },
  };
}

const CTAS = [
  { label: "Student Test", href: "/individual" },
  { label: "Parent Assessment", href: "/individual" },
  { label: "Employee Assessment", href: "/for-companies" },
  { label: "School Program", href: "/for-schools" },
  { label: "Study Centre Program", href: "/become-study-centre" },
];

export default function LocationPage({ params }: { params: { city: string } }) {
  const loc = getLocation(params.city);
  if (!loc) notFound();

  const url = `${BASE}/psychometric-test/${loc.slug}`;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Psychometric Test & Career Assessment in ${loc.city}`,
    serviceType: "Psychometric Testing and Career Counselling",
    description: loc.metaDescription,
    areaServed: { "@type": "City", name: loc.city },
    provider: {
      "@type": "EducationalOrganization",
      name: SITE_NAME,
      legalName: ORG.operator,
      url: BASE,
      logo: `${BASE}/logo.png`,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Arvind Nagar, Bathinda Road, Kotkapura",
        addressLocality: "Faridkot",
        addressRegion: "Punjab",
        postalCode: "151204",
        addressCountry: "IN",
      },
    },
    url,
  };

  const faqSchema =
    loc.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: loc.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "Locations", item: `${BASE}/psychometric-test` },
      { "@type": "ListItem", position: 3, name: loc.city, item: url },
    ],
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <header className="bg-gradient-to-br from-brand-700 to-brand-950 text-white">
        <div className="container-page py-12 sm:py-16">
          <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-brand-200">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/psychometric-test" className="hover:text-white">Locations</Link>
            <span>/</span>
            <span className="text-white/90">{loc.city}</span>
          </nav>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-200">{loc.region} · India</p>
          <h1 className="mt-2 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            {loc.title}
          </h1>
          <p className="mt-4 max-w-2xl text-brand-100">{loc.excerpt}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/individual" className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-brand-700 transition hover:bg-brand-50">
              Take the Test
            </Link>
            <Link href="/contact" className="rounded-xl border border-white/40 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10">
              Talk to a Counsellor
            </Link>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_300px] lg:py-14">
        <div
          className="prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-headings:font-extrabold prose-h2:text-2xl prose-h2:mt-10 prose-a:font-semibold prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:rounded-r-xl prose-blockquote:border-brand-500 prose-blockquote:bg-brand-50 prose-blockquote:py-1 prose-blockquote:not-italic prose-table:text-sm"
          dangerouslySetInnerHTML={{ __html: loc.html }}
        />

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-brand-100 bg-brand-50 p-5">
            <p className="text-sm font-bold text-slate-900">Get started in {loc.city}</p>
            <p className="mt-1 text-xs text-slate-600">Take the assessment online and get a bilingual career report.</p>
            <Link href="/individual" className="btn-primary mt-3 w-full py-2.5 text-sm">Take the Test</Link>
            <Link href="/sample-report" className="mt-2 block text-center text-xs font-semibold text-brand-600">See a sample report →</Link>
          </div>
          {loc.nearby.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-bold text-slate-900">Also serving near {loc.city}</p>
              <p className="mt-2 text-sm text-slate-500">{loc.nearby.join(" · ")}</p>
            </div>
          )}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm">
            <p className="font-bold text-slate-900">Operated by</p>
            <p className="mt-1 text-slate-600">{ORG.operator}</p>
            <p className="mt-1 text-xs text-slate-400">{ORG.address}</p>
          </div>
        </aside>
      </div>

      {/* CTA band */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="container-page py-10 text-center">
          <h2 className="text-2xl font-extrabold text-slate-900">Discover Your Strengths in {loc.city}</h2>
          <p className="mt-2 text-slate-600">Take a psychometric assessment today.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {CTAS.map((c, i) => (
              <Link key={c.label} href={c.href} className={i === 0 ? "btn-primary px-5 py-2.5 text-sm" : "btn-outline px-5 py-2.5 text-sm"}>
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
