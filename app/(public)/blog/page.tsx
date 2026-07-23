import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";
import { listBlogPosts, type BlogSummary } from "@/lib/api/blog";
import { SITE_URL } from "@/lib/site";
import { BlogThumbnail } from "@/components/blog/BlogThumbnail";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const TITLE = "Scholarship & Career Blog";
const DESCRIPTION =
  "Guides, deadlines and career advice for Pakistani students - how to win fully funded scholarships, land internships, and build a standout CV.";

export const metadata: Metadata = {
  title: `${TITLE} | Scholify`,
  description: DESCRIPTION,
  keywords: [
    "scholarship guides",
    "how to win scholarships",
    "internship tips",
    "CV writing tips",
    "study abroad advice",
    "scholarship deadlines",
    "Pakistani students",
  ],
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    title: `${TITLE} · Scholify`,
    description: DESCRIPTION,
  },
};

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function BlogIndexPage() {
  let posts: BlogSummary[] = [];
  try {
    const res = await listBlogPosts({ pageSize: 50, sort: "newest" });
    posts = res.items;
  } catch {
    posts = [];
  }

  const [featured, ...rest] = posts;

  // CollectionPage + Breadcrumb structured data for GSC.
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/blog`,
    isPartOf: { "@id": `${SITE_URL}#website` },
    hasPart: posts.slice(0, 20).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.publishedAt ?? p.createdAt,
      author: { "@type": "Organization", name: p.authorName },
    })),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Header */}
      <div className="max-w-2xl">
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
          Scholify Blog
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {TITLE}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{DESCRIPTION}</p>
      </div>

      {posts.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">No posts published yet. Check back soon.</p>
      ) : (
        <>
          {/* Featured post */}
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group mt-10 grid overflow-hidden rounded-3xl border border-border bg-card transition-shadow hover:shadow-lg md:grid-cols-2"
            >
              <div className="aspect-[1200/630] w-full overflow-hidden md:aspect-auto">
                <BlogThumbnail title={featured.title} category={featured.category} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col justify-center gap-3 p-6 sm:p-8">
                <Badge variant="secondary" className="w-fit rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                  {featured.category}
                </Badge>
                <h2 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  {featured.title}
                </h2>
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{featured.excerpt}</p>
                <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><CalendarDays className="size-3.5" /> {formatDate(featured.publishedAt)}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="size-3.5" /> {featured.readingMinutes} min read</span>
                </div>
              </div>
            </Link>
          )}

          {/* Grid */}
          {rest.length > 0 && (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg"
                >
                  <div className="aspect-[1200/630] w-full overflow-hidden">
                    <BlogThumbnail title={p.title} category={p.category} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <Badge variant="secondary" className="w-fit rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                      {p.category}
                    </Badge>
                    <h3 className="text-base font-semibold leading-snug text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      {p.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
                    <div className="mt-auto flex items-center gap-4 pt-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><CalendarDays className="size-3.5" /> {formatDate(p.publishedAt)}</span>
                      <span className="inline-flex items-center gap-1"><Clock className="size-3.5" /> {p.readingMinutes} min</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
