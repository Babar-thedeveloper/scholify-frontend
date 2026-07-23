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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <Badge variant="secondary" className={`rounded-full capitalize ${map[status] ?? ""}`}>
      {status}
    </Badge>
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
            <Button
              key={opt.value}
              variant={status === opt.value ? "default" : "outline"}
              size="sm"
              onClick={() => { setStatus(opt.value); setPage(1); }}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertTriangle className="size-4 shrink-0" /> {error}
        </div>
      )}

      {/* Table */}
      <Card className="overflow-hidden border-border gap-0 py-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>Organization</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {!data && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            )}
            {data?.items.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  No organizations found.
                </TableCell>
              </TableRow>
            )}
            {data?.items.map((org) => (
              <TableRow key={org.id}>
                <TableCell className="font-medium text-foreground">
                  <div>{org.name}</div>
                  <div className="text-xs text-muted-foreground">{org.slug}</div>
                </TableCell>
                <TableCell className="text-muted-foreground">{org.industry ?? "-"}</TableCell>
                <TableCell className="text-muted-foreground">{org.country}</TableCell>
                <TableCell className="text-muted-foreground">{org.memberCount}</TableCell>
                <TableCell>{statusBadge(org.verificationStatus)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(org.createdAt).toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" })}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/admin/orgs/${org.id}`}
                    className="text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                  >
                    Review
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {(page - 1) * 20 + 1}–{Math.min(page * 20, data.total)} of {data.total}
          </span>
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
