import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { listPostings } from "@/lib/api/postings";
import { listBlogPosts, type BlogSummary } from "@/lib/api/blog";
import type { PostingDto } from "@/lib/api/postings";

// Refresh the generated sitemap hourly.
export const revalidate = 3600;

// The backend caps pageSize at 50, so walk pages until we've collected
// everything (bounded so a misbehaving API can't spin forever).
const PAGE_SIZE = 50;
const MAX_PAGES = 20;

const STATIC_PATHS: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1.0, changeFrequency: "daily" },
  { path: "/scholarships", priority: 0.9, changeFrequency: "daily" },
  { path: "/internships", priority: 0.9, changeFrequency: "daily" },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.4, changeFrequency: "yearly" },
  { path: "/ai-cv", priority: 0.6, changeFrequency: "monthly" },
  { path: "/help", priority: 0.4, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

/** Fetch every page of a paginated endpoint, up to MAX_PAGES. */
async function collectAll<T>(
  fetchPage: (page: number, pageSize: number) => Promise<{ items: T[]; totalPages: number }>
): Promise<T[]> {
  const first = await fetchPage(1, PAGE_SIZE);
  const items = [...first.items];
  const pages = Math.min(first.totalPages, MAX_PAGES);
  for (let p = 2; p <= pages; p++) {
    const res = await fetchPage(p, PAGE_SIZE);
    items.push(...res.items);
  }
  return items;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = STATIC_PATHS.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  let postingRoutes: MetadataRoute.Sitemap = [];
  try {
    const postings = await collectAll<PostingDto>((page, pageSize) => listPostings({ page, pageSize }));
    postingRoutes = postings.map((p) => ({
      url: `${SITE_URL}/postings/${p.publicSlug}`,
      lastModified: p.postedAt ?? p.createdAt ?? now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch {
    // Backend unreachable at build/request time - ship the static routes only.
  }

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await collectAll<BlogSummary>((page, pageSize) => listBlogPosts({ page, pageSize, sort: "newest" }));
    blogRoutes = posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.updatedAt ?? p.publishedAt ?? now,
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch {
    // Backend unreachable - skip blog URLs.
  }

  return [...staticRoutes, ...postingRoutes, ...blogRoutes];
}
