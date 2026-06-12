import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getPost, imageExists, getPostImages } from "@/lib/blog";
import { ORG, SITE_NAME } from "@/lib/site";

const BASE = "https://testpsychometric.com";

/** Interleave content images between article sections (after intro, then spaced across H2s). */
function interleaveImages(html: string, images: string[], altBase: string): string {
  if (!images.length) return html;
  const parts = html.split(/(?=<h2)/g); // parts[0] = intro; each later part starts with an <h2>
  if (parts.length < 2) {
    // No headings — just append images at the end.
    return html + images.map((src, i) => figure(src, `${altBase} — illustration ${i + 1}`)).join("");
  }
  // Choose insertion points: before part[1] (after intro), then spaced across remaining sections.
  const slots: number[] = [1];
  const step = Math.max(1, Math.floor((parts.length - 1) / images.length));
  for (let i = 1; i < images.length; i++) slots.push(Math.min(parts.length - 1, 1 + i * step));
  const out: string[] = [];
  let imgIdx = 0;
  for (let i = 0; i < parts.length; i++) {
    if (slots.includes(i) && imgIdx < images.length) {
      out.push(figure(images[imgIdx], `${altBase} — illustration ${imgIdx + 1}`));
      imgIdx++;
    }
    out.push(parts[i]);
  }
  while (imgIdx < images.length) {
    out.push(figure(images[imgIdx], `${altBase} — illustration ${imgIdx + 1}`));
    imgIdx++;
  }
  return out.join("");
}

function figure(src: string, alt: string): string {
  return `<figure class="not-prose my-8"><img src="${src}" alt="${alt}" loading="lazy" class="w-full rounded-2xl shadow-sm" /></figure>`;
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: "Article not found" };
  const imgs = getPostImages(post.slug);
  const ogImage = `${BASE}${imgs.og || "/og-default.png"}`;
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.metaTitle,
      description: post.metaDescription,
      url: `${BASE}/blog/${post.slug}`,
      publishedTime: post.publishDate,
      modifiedTime: post.dateModified,
      images: [{ url: ogImage }],
    },
    twitter: { card: "summary_large_image", title: post.metaTitle, description: post.metaDescription, images: [ogImage] },
  };
}

const CTAS = [
  { label: "Student Test", href: "/individual" },
  { label: "Parent Assessment", href: "/individual" },
  { label: "Employee Assessment", href: "/for-companies" },
  { label: "School Program", href: "/for-schools" },
  { label: "Study Centre Program", href: "/become-study-centre" },
];

export default function BlogArticle({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const url = `${BASE}/blog/${post.slug}`;
  const imgs = getPostImages(post.slug);
  const ogImage = `${BASE}${imgs.og || "/og-default.png"}`;
  const bodyHtml = interleaveImages(post.html, imgs.content, post.title);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    image: ogImage,
    author: { "@type": "Organization", name: SITE_NAME, url: BASE },
    publisher: {
      "@type": "Organization",
      name: ORG.operator,
      logo: { "@type": "ImageObject", url: `${BASE}/logo.png` },
    },
    datePublished: post.publishDate,
    dateModified: post.dateModified,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  const faqSchema =
    post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((f) => ({
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
      { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <header className="bg-gradient-to-br from-brand-700 to-brand-950 text-white">
        <div className="container-page py-10 sm:py-14">
          {/* Breadcrumb */}
          <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-brand-200">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <span>/</span>
            <span className="text-white/90">{post.category}</span>
          </nav>
          <span className="badge bg-white/15 text-white">{post.category}</span>
          <h1 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-brand-200">
            <span>By {post.author}</span>
            {post.readingTime && <span>· {post.readingTime}</span>}
            {post.publishDate && (
              <span>· {new Date(post.publishDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
            )}
          </p>
        </div>
      </header>

      {imageExists(post.image) && (
        <figure className="container-page -mt-6">
          <img src={post.image} alt={post.imageAlt} className="w-full rounded-2xl shadow-lg" />
          {post.imageCaption && <figcaption className="mt-2 text-center text-xs text-slate-400">{post.imageCaption}</figcaption>}
        </figure>
      )}

      {/* Body */}
      <div className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_300px] lg:py-14">
        <div
          className="prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-headings:font-extrabold prose-h2:text-2xl prose-h2:mt-10 prose-a:font-semibold prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:rounded-r-xl prose-blockquote:border-brand-500 prose-blockquote:bg-brand-50 prose-blockquote:py-1 prose-blockquote:not-italic prose-table:text-sm"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-brand-100 bg-brand-50 p-5">
            <p className="text-sm font-bold text-slate-900">Discover your strengths</p>
            <p className="mt-1 text-xs text-slate-600">Take a scientific psychometric assessment and get a bilingual career report.</p>
            <Link href="/individual" className="btn-primary mt-3 w-full py-2.5 text-sm">Take the Test</Link>
          </div>
          {post.related.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-bold text-slate-900">Related reading</p>
              <ul className="mt-3 space-y-2.5">
                {post.related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/blog/${r.slug}`} className="text-sm font-medium text-slate-600 hover:text-brand-700">
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {/* CTA band */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="container-page py-10 text-center">
          <h2 className="text-2xl font-extrabold text-slate-900">Discover Your Strengths, Career Interests & Hidden Potential</h2>
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

      {/* Related (mobile-friendly full row) */}
      {post.related.length > 0 && (
        <section className="container-page py-10">
          <h2 className="text-lg font-bold text-slate-900">You may also like</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {post.related.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:text-brand-700 hover:shadow-sm"
              >
                {r.title} →
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
