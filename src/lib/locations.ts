import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const LOC_DIR = path.join(process.cwd(), "content", "locations");

export interface FaqItem {
  q: string;
  a: string;
}
export interface LocationMeta {
  slug: string;
  city: string;
  region: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  dateModified: string;
  nearby: string[];
  faqs: FaqItem[];
  isHome: boolean;
}
export interface Location extends LocationMeta {
  html: string;
}

marked.setOptions({ gfm: true, breaks: false });

function normalize(data: Record<string, any>, slug: string): LocationMeta {
  return {
    slug,
    city: data.city || slug,
    region: data.region || "Punjab",
    title: data.title || `Psychometric Test in ${data.city || slug}`,
    metaTitle: data.metaTitle || data.title || slug,
    metaDescription: data.metaDescription || data.excerpt || "",
    excerpt: data.excerpt || data.metaDescription || "",
    dateModified: data.dateModified || "",
    nearby: Array.isArray(data.nearby) ? data.nearby : [],
    faqs: Array.isArray(data.faqs) ? data.faqs : [],
    isHome: !!data.isHome,
  };
}

export function getAllLocationMeta(): LocationMeta[] {
  if (!fs.existsSync(LOC_DIR)) return [];
  return fs
    .readdirSync(LOC_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(LOC_DIR, f), "utf8");
      const { data } = matter(raw);
      return normalize(data, f.replace(/\.md$/, ""));
    })
    .sort((a, b) => a.city.localeCompare(b.city));
}

export function getAllLocationSlugs(): string[] {
  if (!fs.existsSync(LOC_DIR)) return [];
  return fs.readdirSync(LOC_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

/** Featured image path for a location if it exists in /public. */
export function locationImage(slug: string): string | null {
  const p = path.join(process.cwd(), "public", "locations", slug, "featured.webp");
  return fs.existsSync(p) ? `/locations/${slug}/featured.webp` : null;
}

/** PNG OG image path (WhatsApp/Facebook friendly) if it exists. */
export function locationOgImage(slug: string): string | null {
  const p = path.join(process.cwd(), "public", "locations", slug, "og.png");
  return fs.existsSync(p) ? `/locations/${slug}/og.png` : null;
}

export function getLocation(slug: string): Location | null {
  const file = path.join(LOC_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const html = marked.parse(content, { async: false }) as string;
  return { ...normalize(data, slug), html };
}
