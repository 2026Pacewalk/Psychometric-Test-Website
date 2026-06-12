import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface FaqItem {
  q: string;
  a: string;
}
export interface RelatedItem {
  title: string;
  slug: string;
}
export interface PostMeta {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  publishDate: string;
  dateModified: string;
  author: string;
  category: string;
  readingTime: string;
  image: string;
  imageAlt: string;
  imageCaption: string;
  keywords: string[];
  faqs: FaqItem[];
  related: RelatedItem[];
  featured: boolean;
}
export interface Post extends PostMeta {
  html: string;
}

marked.setOptions({ gfm: true, breaks: false });

function normalize(data: Record<string, any>, slug: string): PostMeta {
  return {
    slug,
    title: data.title || slug,
    metaTitle: data.metaTitle || data.title || slug,
    metaDescription: data.metaDescription || data.excerpt || "",
    excerpt: data.excerpt || data.metaDescription || "",
    // Convention: featured image auto-wires from /public/blog/<slug>/featured.webp
    // (frontmatter `image` still honoured as an override if provided).
    image: data.image && !/\.jpg$/.test(data.image) ? data.image : `/blog/${slug}/featured.webp`,
    publishDate: data.publishDate || "",
    dateModified: data.dateModified || data.publishDate || "",
    author: data.author || "TestPsychometric Career Team",
    category: data.category || "Career Guidance",
    readingTime: data.readingTime || "",
    imageAlt: data.imageAlt || data.title || slug,
    imageCaption: data.imageCaption || "",
    keywords: Array.isArray(data.keywords) ? data.keywords : [],
    faqs: Array.isArray(data.faqs) ? data.faqs : [],
    related: Array.isArray(data.related) ? data.related : [],
    featured: !!data.featured,
  };
}

export function getAllPostMeta(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, f), "utf8");
      const { data } = matter(raw);
      return normalize(data, f.replace(/\.md$/, ""));
    })
    .sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1));
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

export function getPost(slug: string): Post | null {
  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const html = marked.parse(content, { async: false }) as string;
  return { ...normalize(data, slug), html };
}

/** True if the post's featured image file actually exists in /public. */
export function imageExists(image: string): boolean {
  if (!image) return false;
  return fs.existsSync(path.join(process.cwd(), "public", image.replace(/^\//, "")));
}

/** Discover auto-placed images for a post: PNG OG image + social + content images. */
export function getPostImages(slug: string): { og: string | null; social: string | null; content: string[] } {
  const dir = path.join(process.cwd(), "public", "blog", slug);
  const og = fs.existsSync(path.join(dir, "og.png")) ? `/blog/${slug}/og.png` : null;
  const social = fs.existsSync(path.join(dir, "social.webp")) ? `/blog/${slug}/social.webp` : null;
  const content: string[] = [];
  for (let i = 1; i <= 6; i++) {
    if (fs.existsSync(path.join(dir, `content-${i}.webp`))) content.push(`/blog/${slug}/content-${i}.webp`);
  }
  return { og, social, content };
}
