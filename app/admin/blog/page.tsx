"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteBlogPost,
  listAllBlogPosts,
  type BlogStatus,
  type BlogSummary,
  type ListBlogResponse,
} from "@/lib/api/blog";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400",
  published: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
};

const STATUS_OPTIONS: ("" | BlogStatus)[] = ["", "published", "draft"];

export default function AdminBlogPage() {
  const [data, setData] = useState<ListBlogResponse | null>(null);
  const [status, setStatus] = useState<"" | BlogStatus>("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    listAllBlogPosts({ status: status || undefined, pageSize: 100, sort: "newest" })
      .then(setData)
      .catch((e) => setError(e?.message ?? "Failed to load"));
  }, [status]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(post: BlogSummary) {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    setPending(post.id);
    try {
      await deleteBlogPost(post.id);
      load();
    } catch (e: unknown) {
      setError((e as { message?: string })?.message ?? "Delete failed");
    } finally {
      setPending(null);
    }
  }

  function formatDate(iso: string | null): string {
    if (!iso) return "-";
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blog</h1>
          <p className="text-sm text-muted-foreground">Write and manage SEO articles. Published posts appear at /blog and in the sitemap.</p>
        </div>
        <Button asChild size="sm" className="gap-1.5">
          <Link href="/admin/blog/create"><Plus className="size-4" /> New Post</Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-1">
        {STATUS_OPTIONS.map((s) => (
          <Button key={s} variant={status === s ? "default" : "outline"} size="sm"
            onClick={() => setStatus(s)} className="capitalize">
            {s || "All"}
          </Button>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertTriangle className="size-4 shrink-0" /> {error}
        </div>
      )}

      <Card className="overflow-hidden gap-0 border-border py-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!data && <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">Loading…</TableCell></TableRow>}
            {data?.items.length === 0 && <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No posts yet. Create your first one.</TableCell></TableRow>}
            {data?.items.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="max-w-[320px] truncate font-medium text-foreground">{p.title}</div>
                  <div className="text-xs text-muted-foreground">/blog/{p.slug}</div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{p.category}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={`rounded-full capitalize ${STATUS_COLORS[p.status] ?? ""}`}>{p.status}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">{formatDate(p.publishedAt)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    {p.status === "published" && (
                      <Button asChild variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-emerald-600">
                        <Link href={`/blog/${p.slug}`} target="_blank" aria-label="View live"><ExternalLink className="size-3.5" /></Link>
                      </Button>
                    )}
                    <Button asChild variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground">
                      <Link href={`/admin/blog/${p.id}/edit`} aria-label="Edit"><Pencil className="size-3.5" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon-sm" disabled={pending === p.id}
                      onClick={() => handleDelete(p)}
                      className="text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10">
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
