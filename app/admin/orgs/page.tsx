"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Search,
  XCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  listAdminOrgs,
  type AdminOrg,
  type PaginatedResponse,
} from "@/lib/api/admin";

const STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "suspended", label: "Suspended" },
] as const;

function statusBadge(status: AdminOrg["verificationStatus"]) {
  const map: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    rejected: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
    suspended: "bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${map[status] ?? ""}`}>
      {status}
    </span>
  );
}

export default function AdminOrgsPage() {
  const [data, setData] = useState<PaginatedResponse<AdminOrg> | null>(null);
  const [status, setStatus] = useState<string>("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(() => {
    setError(null);
    listAdminOrgs({
      status: status as AdminOrg["verificationStatus"] | undefined || undefined,
      search: debouncedSearch || undefined,
      page,
      pageSize: 20,
    })
      .then(setData)
      .catch((e) => setError(e?.message ?? "Failed to load"));
  }, [status, debouncedSearch, page]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Organization Queue</h1>
        <p className="text-sm text-muted-foreground">Review and verify organization registrations.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-60">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search name or industry…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex gap-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setStatus(opt.value); setPage(1); }}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                status === opt.value
                  ? "bg-foreground text-background"
                  : "border border-border bg-white text-foreground hover:bg-muted dark:bg-card"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertTriangle className="size-4 shrink-0" /> {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-white dark:bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Organization</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Industry</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Country</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Members</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Joined</th>
              <th className="w-16 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {!data && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            )}
            {data?.items.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No organizations found.
                </td>
              </tr>
            )}
            {data?.items.map((org) => (
              <tr key={org.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium text-foreground">
                  <div>{org.name}</div>
                  <div className="text-xs text-muted-foreground">{org.slug}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{org.industry ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{org.country}</td>
                <td className="px-4 py-3 text-muted-foreground">{org.memberCount}</td>
                <td className="px-4 py-3">{statusBadge(org.verificationStatus)}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(org.createdAt).toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" })}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orgs/${org.id}`}
                    className="text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                  >
                    Review
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {(page - 1) * 20 + 1}–{Math.min(page * 20, data.total)} of {data.total}
          </span>
          <div className="flex gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="flex size-8 items-center justify-center rounded-md border border-border disabled:opacity-40 hover:bg-muted"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              disabled={page === data.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="flex size-8 items-center justify-center rounded-md border border-border disabled:opacity-40 hover:bg-muted"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
