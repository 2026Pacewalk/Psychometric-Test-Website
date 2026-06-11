import type { MetadataRoute } from "next";
import { getAllPostMeta } from "@/lib/blog";

const BASE = "https://testpsychometric.com";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/for-schools",
    "/for-companies",
    "/individual",
    "/become-study-centre",
    "/about",
    "/why-psychometric",
    "/how-it-works",
    "/government-awareness",
    "/sample-report",
    "/pricing",
    "/contact",
    "/blog",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const posts = getAllPostMeta().map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: p.dateModified ? new Date(p.dateModified) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...posts];
}
