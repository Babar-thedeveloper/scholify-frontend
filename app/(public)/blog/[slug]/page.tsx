import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock, Tag } from "lucide-react";
import { getBlogPost, type BlogPost } from "@/lib/api/blog";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { Badge } from "@/components/ui/badge";
import { BlogThumbnail } from "@/components/blog/BlogThumbnail";
import { Markdown } from "@/components/blog/Markdown";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const p = await getBlogPost(slug);
    const title = p.seoTitle ?? p.title;
    const description = p.seoDescription ?? p.excerpt;
    return {
      title: `${title} | Scholify`,
      description,
      alternates: { canonical: `/blog/${slug}` },
      keywords: p.tags,
      authors: [{ name: p.authorName }],
      openGraph: {
        type: "article",
        title,
        description,
        url: `${SITE_URL}/blog/${slug}`,
        publishedTime: p.publishedAt ?? undefined,
        modifiedTime: p.updatedAt,
        authors: [p.authorName],
        tags: p.tags,
        images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: p.title }],
      },
      twitter: { card: "summary_large_image", title, description },
    };
  } catch {
    return { title: "Article | Scholify" };
  }
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  let post: BlogPost;
  try {
    post = await getBlogPost(slug);
  } catch {
    notFound();
  }

  const published = post.publishedAt ?? post.createdAt;

  // BlogPosting (Article) structured data - GSC rich result eligible.
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription ?? post.excerpt,
    datePublished: published,
    dateModified: post.updatedAt,
    articleSection: post.category,
    keywords: post.tags.join(", "),
    wordCount: post.content.trim().split(/\s+/).length,
    inLanguage: "en",
    author: { "@type": "Organization", name: post.authorName, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
    },
    image: `${SITE_URL}/og-image.svg`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${slug}` },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${slug}` },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <Link href="/blog" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to blog
      </Link>

      {/* Header */}
      <Badge variant="secondary" className="rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
        {post.category}
      </Badge>
      <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
        {post.title}
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-border pb-6 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{post.authorName}</span>
        <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-4" /> {formatDate(published)}</span>
        <span className="inline-flex items-center gap-1.5"><Clock className="size-4" /> {post.readingMinutes} min read</span>
      </div>

      {/* Cover */}
      <div className="my-8 overflow-hidden rounded-2xl border border-border">
        <BlogThumbnail title={post.title} category={post.category} className="aspect-[1200/630] w-full" />
      </div>

      {/* Body */}
      <Markdown content={post.content} />

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-border pt-6">
          <Tag className="size-4 text-muted-foreground" />
          {post.tags.map((t) => (
            <span key={t} className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 text-white sm:p-8">
        <h2 className="text-xl font-bold">Never miss a scholarship deadline</h2>
        <p className="mt-2 text-sm text-emerald-50">
          Save the opportunities you care about and get email reminders before every deadline - 100% free.
        </p>
        <Link
          href="/scholarships"
          className="mt-4 inline-flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition-colors hover:bg-emerald-50"
        >
          Browse scholarships
        </Link>
      </div>
    </article>
  );
}
