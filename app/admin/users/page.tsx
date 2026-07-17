"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, ChevronLeft, ChevronRight, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { assignUserRole, listAdminUsers, type AdminUser, type PaginatedResponse } from "@/lib/api/admin";

const ALL_ROLES = [
  "student",
  "org_owner",
  "org_admin",
  "org_recruiter",
  "org_viewer",
  "platform_admin",
  "platform_moderator",
] as const;

const ROLE_COLORS: Record<string, string> = {
  student:            "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  org_owner:          "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  org_admin:          "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
  org_recruiter:      "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300",
  org_viewer:         "bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400",
  platform_admin:     "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
  platform_moderator: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
};

function RoleChip({ role, onRemove }: { role: string; onRemove?: () => void }) {
  return (
    <Badge variant="secondary" className={`rounded-full ${ROLE_COLORS[role] ?? "bg-muted text-muted-foreground"}`}>
      {role.replace(/_/g, " ")}
      {onRemove && (
        <Button variant="ghost" size="icon-xs" onClick={onRemove} className="ml-0.5 hover:opacity-70 leading-none" aria-label={`Remove ${role}`}>×</Button>
      )}
    </Badge>
  );
}

export default function AdminUsersPage() {
  const [data, setData] = useState<PaginatedResponse<AdminUser> | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(() => {
    setError(null);
    listAdminUsers({
      search: debouncedSearch || undefined,
      role: roleFilter && roleFilter !== "all" ? roleFilter : undefined,
      page,
      pageSize: 25,
    }).then(setData).catch((e) => setError(e?.message ?? "Failed to load"));
  }, [debouncedSearch, roleFilter, page]);

  useEffect(() => { load(); }, [load]);

  async function handleRoleToggle(user: AdminUser, role: string, grant: boolean) {
    setPendingAction(user.id + role);
    try {
      await assignUserRole(user.id, role, grant);
      load();
    } catch (e: unknown) {
      setError((e as { message?: string })?.message ?? "Role change failed");
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Users & Roles</h1>
        <p className="text-sm text-muted-foreground">Search all platform users and manage their roles directly.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-60">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search email…" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <Select
          value={roleFilter}
          onValueChange={(v) => { setRoleFilter(v); setPage(1); }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {ALL_ROLES.map((r) => (
              <SelectItem key={r} value={r}>{r.replace(/_/g, " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertTriangle className="size-4 shrink-0" /> {error}
        </div>
      )}

      <Card className="divide-y divide-border border-border gap-0 py-0">
        {!data && <div className="px-4 py-8 text-center text-muted-foreground text-sm">Loading…</div>}
        {data?.items.length === 0 && <div className="px-4 py-8 text-center text-muted-foreground text-sm">No users found.</div>}
        {data?.items.map((user) => {
          const isExpanded = expandedUser === user.id;
          return (
            <div key={user.id} className="px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm text-foreground truncate">{user.email}</span>
                    {!user.emailVerifiedAt && (
                      <span className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400 rounded px-1.5 py-0.5">Unverified email</span>
                    )}
                    {user.roles.includes("platform_admin") && (
                      <ShieldCheck className="size-4 text-rose-500" />
                    )}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {user.roles.length === 0
                      ? <span className="text-xs text-muted-foreground italic">No roles</span>
                      : user.roles.map((r) => (
                          <RoleChip
                            key={r}
                            role={r}
                            onRemove={() => handleRoleToggle(user, r, false)}
                          />
                        ))
                    }
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    {new Date(user.createdAt).toLocaleDateString("en-PK", { year: "numeric", month: "short" })}
                  </span>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => setExpandedUser(isExpanded ? null : user.id)}
                  >
                    {isExpanded ? "Done" : "Manage Roles"}
                  </Button>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-3 rounded-lg bg-muted/40 p-3">
                  <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Grant a role</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_ROLES.filter((r) => !user.roles.includes(r)).map((r) => (
                      <Button
                        key={r}
                        variant="outline"
                        size="xs"
                        disabled={!!pendingAction}
                        onClick={() => handleRoleToggle(user, r, true)}
                        className="hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
                      >
                        + {r.replace(/_/g, " ")}
                      </Button>
                    ))}
                    {ALL_ROLES.every((r) => user.roles.includes(r)) && (
                      <span className="text-xs text-muted-foreground italic">All roles already granted</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </Card>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{(page - 1) * 25 + 1}–{Math.min(page * 25, data.total)} of {data.total}</span>
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
