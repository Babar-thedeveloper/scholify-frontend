"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ChevronLeft, ChevronRight, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  adminDeletePosting,
  forcePostingStatus,
  listAdminPostings,
  type AdminPosting,
  type PaginatedResponse,
} from "@/lib/api/admin";

const STATUS_COLORS: Record<string, string> = {
  draft:  "bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400",
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  paused: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  closed: "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400",
};

const TYPE_COLORS: Record<string, string> = {
  scholarship: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  internship:  "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
};

const STATUS_OPTIONS = ["", "active", "draft", "paused", "closed"] as const;
const TYPE_OPTIONS = ["", "scholarship", "internship"] as const;

export default function AdminPostingsPage() {
  const [data, setData] = useState<PaginatedResponse<AdminPosting> | null>(null);
  const [status, setStatus] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [actionPending, setActionPending] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(() => {
    setError(null);
    listAdminPostings({
      status: status as AdminPosting["status"] | undefined || undefined,
      type: type as AdminPosting["type"] | undefined || undefined,
      search: debouncedSearch || undefined,
      page,
      pageSize: 20,
    }).then(setData).catch((e) => setError(e?.message ?? "Failed to load"));
  }, [status, type, debouncedSearch, page]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(posting: AdminPosting) {
    if (!confirm(`Delete "${posting.title}"? This cannot be undone.`)) return;
    setActionPending(posting.id + "_delete");
    try {
      await adminDeletePosting(posting.id);
      load();
    } catch (e: unknown) {
      setError((e as { message?: string })?.message ?? "Delete failed");
    } finally {
      setActionPending(null);
    }
  }

  async function handleForceStatus(posting: AdminPosting, newStatus: AdminPosting["status"]) {
    setActionPending(posting.id + "_status");
    try {
      await forcePostingStatus(posting.id, newStatus);
      load();
    } catch (e: unknown) {
      setError((e as { message?: string })?.message ?? "Status change failed");
    } finally {
      setActionPending(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">All Postings</h1>
          <p className="text-sm text-muted-foreground">Manage every posting across all organizations + platform posts.</p>
        </div>
        <Button asChild size="sm" className="gap-1.5">
          <Link href="/admin/postings/create">
            <Plus className="size-4" /> New Platform Post
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-56">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search title…" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div className="flex gap-1 flex-wrap">
          {STATUS_OPTIONS.map((s) => (
            <Button key={s} variant={status === s ? "default" : "outline"} size="sm" onClick={() => { setStatus(s); setPage(1); }}
              className="capitalize">
              {s || "All Status"}
            </Button>
          ))}
        </div>
        <div className="flex gap-1">
          {TYPE_OPTIONS.map((t) => (
            <Button key={t} variant={type === t ? "default" : "outline"} size="sm" onClick={() => { setType(t); setPage(1); }}
              className="capitalize">
              {t || "All Types"}
            </Button>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertTriangle className="size-4 shrink-0" /> {error}
        </div>
      )}

      <Card className="overflow-hidden border-border gap-0 py-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>Title</TableHead>
              <TableHead>Org</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Applicants</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!data && <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">Loading…</TableCell></TableRow>}
            {data?.items.length === 0 && <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No postings found.</TableCell></TableRow>}
            {data?.items.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="font-medium text-foreground max-w-[220px] truncate">{p.title}</div>
                  {p.isPlatformPost && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Platform post</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs max-w-[120px] truncate">{p.orgName}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={`rounded-full capitalize ${TYPE_COLORS[p.type] ?? ""}`}>
                    {p.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={`rounded-full capitalize ${STATUS_COLORS[p.status] ?? ""}`}>
                    {p.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {p.deadlineAt ? new Date(p.deadlineAt).toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" }) : "-"}
                </TableCell>
                <TableCell className="text-muted-foreground tabular-nums">{p.applicantCount}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {p.status !== "active" && (
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleForceStatus(p, "active")}
                        disabled={!!actionPending}
                        className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400"
                      >
                        Publish
                      </Button>
                    )}
                    {p.status === "active" && (
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleForceStatus(p, "paused")}
                        disabled={!!actionPending}
                        className="bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400"
                      >
                        Pause
                      </Button>
                    )}
                    {p.status !== "closed" && (
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleForceStatus(p, "closed")}
                        disabled={!!actionPending}
                        className="bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-500/10 dark:text-slate-400"
                      >
                        Close
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(p)}
                      disabled={!!actionPending}
                      className="text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{(page - 1) * 20 + 1}–{Math.min(page * 20, data.total)} of {data.total}</span>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="icon" disabled={page === data.totalPages} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
