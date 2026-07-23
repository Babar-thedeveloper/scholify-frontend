"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { Label } from "@/components/ui/label";
import { BlogThumbnail } from "@/components/blog/BlogThumbnail";
import {
  createBlogPost,
  updateBlogPost,
  type BlogPost,
  type BlogStatus,
} from "@/lib/api/blog";

const CATEGORIES = ["Guides", "Scholarships", "Internships", "Career", "Deadlines", "News"];

interface Props {
  /** Present when editing; omit for create. */
  initial?: BlogPost;
}

export function BlogPostForm({ initial }: Props) {
  const router = useRouter();
  const editing = !!initial;

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [category, setCategory] = useState(initial?.category ?? "Guides");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [authorName, setAuthorName] = useState(initial?.authorName ?? "Scholify Team");
  const [seoTitle, setSeoTitle] = useState(initial?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(initial?.seoDescription ?? "");
  const [status, setStatus] = useState<BlogStatus>(initial?.status ?? "draft");
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [tagInput, setTagInput] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function addTag() {
    const v = tagInput.trim().toLowerCase();
    if (v && !tags.includes(v)) setTags([...tags, v]);
    setTagInput("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      excerpt: excerpt.trim(),
      content: content.trim(),
      category,
      tags,
      status,
      authorName: authorName.trim(),
      seoTitle: seoTitle.trim() || undefined,
      seoDescription: seoDescription.trim() || undefined,
    };

    try {
      if (editing && initial) {
        await updateBlogPost(initial.id, payload);
      } else {
        await createBlogPost(payload);
      }
      router.push("/admin/blog");
      router.refresh();
    } catch (e: unknown) {
      setError((e as { message?: string })?.message ?? "Failed to save post");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => router.push("/admin/blog")}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{editing ? "Edit Post" : "New Blog Post"}</h1>
          <p className="text-sm text-muted-foreground">
            {editing ? "Update this article." : "Write an SEO-friendly article. Content supports Markdown."}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Main form ── */}
        <Card asChild className="gap-0 space-y-5 p-6 lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="title" className="mb-1.5 block">Title <span className="text-destructive">*</span></Label>
              <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. How to Win a Fully Funded Scholarship" />
            </div>

            <div>
              <Label htmlFor="slug" className="mb-1.5 block">Slug</Label>
              <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)}
                placeholder="auto-generated from title (lowercase-with-hyphens)" />
              <p className="mt-1 text-xs text-muted-foreground">URL: /blog/{slug.trim() || "your-title"}</p>
            </div>

            <div>
              <Label className="mb-2 block">Category</Label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <Button key={c} type="button" size="sm" variant={category === c ? "default" : "outline"}
                    onClick={() => setCategory(c)}>
                    {c}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="excerpt" className="mb-1.5 block">
                Excerpt / meta description <span className="text-destructive">*</span>
              </Label>
              <Textarea id="excerpt" required rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
                maxLength={320} placeholder="1–2 sentence summary (also used as the SEO description)." className="resize-none" />
              <p className="mt-1 text-xs text-muted-foreground">{excerpt.length}/320</p>
            </div>

            <div>
              <Label htmlFor="content" className="mb-1.5 block">Content (Markdown) <span className="text-destructive">*</span></Label>
              <Textarea id="content" required rows={16} value={content} onChange={(e) => setContent(e.target.value)}
                placeholder={"## Heading\n\nParagraph text with **bold** and [links](/scholarships).\n\n- bullet one\n- bullet two"}
                className="resize-y font-mono text-sm" />
            </div>

            <div>
              <Label htmlFor="tags" className="mb-1.5 block">Tags</Label>
              <div className="flex gap-2">
                <Input id="tags" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                  placeholder="e.g. scholarships, then Enter" />
                <Button type="button" variant="outline" onClick={addTag}>Add</Button>
              </div>
              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <Tag key={t} onRemove={() => setTags(tags.filter((x) => x !== t))} removeLabel={`Remove ${t}`}>{t}</Tag>
                  ))}
                </div>
              )}
            </div>

            <fieldset className="space-y-4 rounded-lg border border-border p-4">
              <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">SEO overrides (optional)</legend>
              <div>
                <Label htmlFor="seoTitle" className="mb-1.5 block">SEO title</Label>
                <Input id="seoTitle" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)}
                  maxLength={200} placeholder="Defaults to the post title" />
              </div>
              <div>
                <Label htmlFor="seoDesc" className="mb-1.5 block">SEO description</Label>
                <Textarea id="seoDesc" rows={2} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)}
                  maxLength={320} placeholder="Defaults to the excerpt" className="resize-none" />
              </div>
              <div>
                <Label htmlFor="author" className="mb-1.5 block">Author name</Label>
                <Input id="author" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
              </div>
            </fieldset>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertTriangle className="size-4 shrink-0" /> {error}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={loading} onClick={() => setStatus("published")}
                className="bg-emerald-600 text-white hover:bg-emerald-700">
                {loading ? "Saving…" : "Publish"}
              </Button>
              <Button type="submit" disabled={loading} variant="outline" onClick={() => setStatus("draft")}>
                Save as draft
              </Button>
              <Button type="button" variant="ghost" onClick={() => router.push("/admin/blog")}>Cancel</Button>
            </div>
          </form>
        </Card>

        {/* ── Live preview ── */}
        <div className="space-y-4">
          <Card className="gap-0 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Thumbnail preview</p>
            <div className="overflow-hidden rounded-xl border border-border">
              <BlogThumbnail title={title || "Your post title"} category={category} className="aspect-[1200/630] w-full" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Thumbnails are generated automatically from the title and category - no image upload needed.
            </p>
          </Card>
          <Card className="gap-0 p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</p>
            <p className="text-sm text-foreground capitalize">{editing ? initial?.status : "New - unsaved"}</p>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              &quot;Publish&quot; makes the post live at <span className="font-medium">/blog</span> and adds it to the sitemap.
              &quot;Save as draft&quot; keeps it hidden from the public site.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
