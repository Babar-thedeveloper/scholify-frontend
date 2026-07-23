// ═════════════════════════════════════════════════════════════
// Scholify · Blog API
// Public reads (published posts) + admin CRUD.
// ═════════════════════════════════════════════════════════════
import { apiFetch } from "./client";

export type BlogStatus = "draft" | "published";

export interface BlogSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  status: BlogStatus;
  authorName: string;
  readingMinutes: number;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost extends BlogSummary {
  content: string;
}

export interface ListBlogResponse {
  items: BlogSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ListBlogParams {
  search?: string;
  category?: string;
  tag?: string;
  status?: BlogStatus;
  sort?: "newest" | "oldest" | "az";
  page?: number;
  pageSize?: number;
}

function qs(params: ListBlogParams): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

// ─── Public ──────────────────────────────────────────────────
export async function listBlogPosts(params: ListBlogParams = {}): Promise<ListBlogResponse> {
  return apiFetch<ListBlogResponse>(`/api/v1/blog${qs(params)}`);
}

export async function getBlogPost(slug: string): Promise<BlogPost> {
  const { post } = await apiFetch<{ post: BlogPost }>(`/api/v1/blog/${encodeURIComponent(slug)}`);
  return post;
}

// ─── Admin ───────────────────────────────────────────────────
export async function listAllBlogPosts(params: ListBlogParams = {}): Promise<ListBlogResponse> {
  return apiFetch<ListBlogResponse>(`/api/v1/blog/manage${qs(params)}`);
}

export async function getBlogPostById(id: string): Promise<BlogPost> {
  const { post } = await apiFetch<{ post: BlogPost }>(`/api/v1/blog/manage/${id}`);
  return post;
}

export interface CreateBlogInput {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  status: BlogStatus;
  authorName: string;
  seoTitle?: string;
  seoDescription?: string;
}

export type UpdateBlogInput = Partial<CreateBlogInput>;

export async function createBlogPost(input: CreateBlogInput): Promise<BlogPost> {
  const { post } = await apiFetch<{ post: BlogPost }>(`/api/v1/blog/manage`, {
    method: "POST",
    body: input,
  });
  return post;
}

export async function updateBlogPost(id: string, input: UpdateBlogInput): Promise<BlogPost> {
  const { post } = await apiFetch<{ post: BlogPost }>(`/api/v1/blog/manage/${id}`, {
    method: "PATCH",
    body: input,
  });
  return post;
}

export async function deleteBlogPost(id: string): Promise<void> {
  await apiFetch<void>(`/api/v1/blog/manage/${id}`, { method: "DELETE" });
}
