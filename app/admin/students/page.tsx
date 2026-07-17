"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, ChevronLeft, ChevronRight, Search } from "lucide-react";
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
import { listAdminStudents, verifyStudent, type AdminStudent, type PaginatedResponse } from "@/lib/api/admin";

export default function AdminStudentsPage() {
  const [data, setData] = useState<PaginatedResponse<AdminStudent> | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(() => {
    setError(null);
    listAdminStudents({
      search: debouncedSearch || undefined,
      verified: verifiedFilter === "" ? undefined : verifiedFilter === "true",
      page,
      pageSize: 25,
    })
      .then(setData)
      .catch((e) => setError(e?.message ?? "Failed to load"));
  }, [debouncedSearch, verifiedFilter, page]);

  useEffect(() => { load(); }, [load]);

  async function toggle(student: AdminStudent) {
    setToggling(student.id);
    try {
      await verifyStudent(student.id, !student.isVerifiedStudent);
      load();
    } catch {
      // silently fail — the next load will show the real state
    } finally {
      setToggling(null);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Students</h1>
        <p className="text-sm text-muted-foreground">Grant or revoke student verification badges.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-60">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search name or email…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex gap-1">
          {[{ v: "", label: "All" }, { v: "true", label: "Verified" }, { v: "false", label: "Unverified" }].map((opt) => (
            <Button
              key={opt.v}
              variant={verifiedFilter === opt.v ? "default" : "outline"}
              size="sm"
              onClick={() => { setVerifiedFilter(opt.v); setPage(1); }}
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

      <Card className="overflow-hidden border-border gap-0 py-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>Student</TableHead>
              <TableHead>Profile</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Since</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {!data && (
              <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">Loading…</TableCell></TableRow>
            )}
            {data?.items.length === 0 && (
              <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No students found.</TableCell></TableRow>
            )}
            {data?.items.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <div className="font-medium text-foreground">{s.fullName ?? "—"}</div>
                  <div className="text-xs text-muted-foreground">{s.email}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${s.completionPercent}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{s.completionPercent}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  {s.isVerifiedStudent ? (
                    <Badge variant="secondary" className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      Unverified
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(s.createdAt).toLocaleDateString("en-PK", { year: "numeric", month: "short" })}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="xs"
                    disabled={toggling === s.id}
                    onClick={() => toggle(s)}
                    className={s.isVerifiedStudent
                      ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400"
                    }
                  >
                    {toggling === s.id ? "…" : s.isVerifiedStudent ? "Revoke" : "Verify"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {(page - 1) * 25 + 1}–{Math.min(page * 25, data.total)} of {data.total}
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
