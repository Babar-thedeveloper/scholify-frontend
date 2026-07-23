"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { getBlogPostById, type BlogPost } from "@/lib/api/blog";

export default function AdminEditBlogPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBlogPostById(id)
      .then(setPost)
      .catch((e) => setError(e?.message ?? "Failed to load post"));
  }, [id]);

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
        <AlertTriangle className="size-4 shrink-0" /> {error}
      </div>
    );
  }
  if (!post) {
    return <p className="py-10 text-center text-muted-foreground">Loading…</p>;
  }
  return <BlogPostForm initial={post} />;
}
