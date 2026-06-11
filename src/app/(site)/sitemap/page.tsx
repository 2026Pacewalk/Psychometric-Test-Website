import type { Metadata } from "next";
import Link from "next/link";
import { NAV_LINKS, LOGIN_LINKS } from "@/lib/site";
import { getAllPostMeta } from "@/lib/blog";
import { getAllLocationMeta } from "@/lib/locations";

export const metadata: Metadata = {
  title: "Sitemap",
  description:
    "Explore every page on TestPsychometric — services, blog articles, location pages and login portals. Auto-updated. View the XML sitemap too.",
  alternates: { canonical: "/sitemap" },
};

export const dynamic = "force-dynamic";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-brand-600">{title}</h2>
      <ul className="space-y-2 text-sm">{children}</ul>
    </div>
  );
}

function Item({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link href={href} className="text-slate-600 transition hover:text-brand-700 hover:underline">
        {label}
      </Link>
    </li>
  );
}

export default function HtmlSitemap() {
  const posts = getAllPostMeta();
  const locations = getAllLocationMeta();

  // Group blog posts by category (auto).
  const byCategory = new Map<string, typeof posts>();
  for (const p of posts) {
    const list = byCategory.get(p.category) || [];
    list.push(p);
    byCategory.set(p.category, list);
  }

  const main = NAV_LINKS.filter((l) =>
    ["/", "/about", "/why-psychometric", "/how-it-works", "/government-awareness", "/pricing", "/contact", "/sample-report"].includes(l.href)
  );
  const audiences = NAV_LINKS.filter((l) =>
    ["/for-schools", "/for-companies", "/individual", "/become-study-centre"].includes(l.href)
  );

  const totalPages = NAV_LINKS.length + LOGIN_LINKS.length + posts.length + locations.length + 3;

  return (
    <>
      {/* Header */}
      <section className="border-b border-slate-200 bg-gradient-to-br from-brand-50 to-white">
        <div className="container-page flex flex-wrap items-end justify-between gap-4 py-12 sm:py-16">
          <div>
            <p className="section-eyebrow">Sitemap</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Everything on TestPsychometric
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              A complete, automatically updated map of our site — {totalPages}+ pages across services, blog
              articles and locations. New content appears here the moment it's published.
            </p>
          </div>
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition hover:from-brand-700 hover:to-brand-800"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></svg>
            View sitemap.xml
          </a>
        </div>
      </section>

      <div className="container-page py-10 sm:py-14">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* Main pages */}
          <Section title="Main Pages">
            {main.map((l) => <Item key={l.href} href={l.href} label={l.label} />)}
          </Section>

          {/* Audiences */}
          <Section title="Tests & Programs">
            {audiences.map((l) => <Item key={l.href} href={l.href} label={l.label} />)}
          </Section>

          {/* Login portals */}
          <Section title="Login Portals">
            {LOGIN_LINKS.map((l) => <Item key={l.href} href={l.href} label={l.label} />)}
          </Section>

          {/* Locations */}
          <Section title="Locations">
            <Item href="/psychometric-test" label="All Locations" />
            {locations.map((l) => (
              <Item key={l.slug} href={`/psychometric-test/${l.slug}`} label={l.city} />
            ))}
          </Section>

          {/* Blog by category */}
          {[...byCategory.entries()].map(([category, list]) => (
            <Section key={category} title={`Blog · ${category}`}>
              {list.map((p) => <Item key={p.slug} href={`/blog/${p.slug}`} label={p.title} />)}
            </Section>
          ))}

          {/* Blog index link */}
          <Section title="Blog">
            <Item href="/blog" label="All Articles" />
          </Section>
        </div>
      </div>
    </>
  );
}
