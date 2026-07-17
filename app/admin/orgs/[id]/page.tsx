"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, Building2, CheckCircle2, ExternalLink, XCircle } from "lucide-react";
import { getAdminOrg, verifyOrg, type AdminOrg } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function statusColor(status: AdminOrg["verificationStatus"]) {
  const map: Record<string, string> = {
    pending: "text-amber-600 dark:text-amber-400",
    approved: "text-emerald-600 dark:text-emerald-400",
    rejected: "text-red-600 dark:text-red-400",
    suspended: "text-slate-500 dark:text-slate-400",
  };
  return map[status] ?? "";
}

export default function AdminOrgDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [org, setOrg] = useState<AdminOrg | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState<"approved" | "rejected" | "suspended" | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    getAdminOrg(id)
      .then(setOrg)
      .catch((e) => setError(e?.message ?? "Failed to load"));
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function doAction(action: "approved" | "rejected" | "suspended") {
    setActionError(null);
    setPending(action);
    try {
      const updated = await verifyOrg(id, action, reason || undefined);
      setOrg(updated);
      setReason("");
    } catch (e: unknown) {
      setActionError((e as { message?: string })?.message ?? "Action failed");
    } finally {
      setPending(null);
    }
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        <AlertTriangle className="size-4 shrink-0" /> {error}
      </div>
    );
  }

  if (!org) {
    return <div className="text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{org.name}</h1>
          <p className="text-sm text-muted-foreground">{org.slug}</p>
        </div>
      </div>

      {/* Info card */}
      <Card className="grid gap-4 border-border p-5 sm:grid-cols-2 lg:grid-cols-3">
        <Detail label="Industry" value={org.industry ?? "—"} />
        <Detail label="Country" value={org.country} />
        <Detail label="Members" value={String(org.memberCount)} />
        <Detail label="Active Postings" value={String(org.activePostingCount)} />
        <Detail
          label="Website"
          value={org.website ?? "—"}
          href={org.website ?? undefined}
        />
        <Detail
          label="Registered"
          value={new Date(org.createdAt).toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" })}
        />
        <div className="sm:col-span-2 lg:col-span-3">
          <p className="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</p>
          <p className={`text-sm font-semibold capitalize ${statusColor(org.verificationStatus)}`}>
            {org.verificationStatus}
            {org.verifiedAt && (
              <span className="ml-2 font-normal text-muted-foreground">
                ({new Date(org.verifiedAt).toLocaleDateString()})
              </span>
            )}
          </p>
        </div>
      </Card>

      {/* Action panel */}
      <Card className="border-border p-5 space-y-4 gap-0">
        <h2 className="font-semibold text-foreground">Verification Action</h2>
        <div>
          <Label className="mb-1.5 block text-sm text-muted-foreground">
            Reason <span className="text-xs">(optional, visible in audit log)</span>
          </Label>
          <Textarea
            rows={3}
            placeholder="e.g. Missing registration certificate…"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="resize-none"
          />
        </div>
        {actionError && (
          <p className="text-sm text-destructive">{actionError}</p>
        )}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => doAction("approved")}
            disabled={!!pending}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <CheckCircle2 className="size-4 mr-1.5" />
            {pending === "approved" ? "Approving…" : "Approve"}
          </Button>
          <Button
            variant="outline"
            onClick={() => doAction("rejected")}
            disabled={!!pending}
            className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            <XCircle className="size-4 mr-1.5" />
            {pending === "rejected" ? "Rejecting…" : "Reject"}
          </Button>
          <Button
            variant="outline"
            onClick={() => doAction("suspended")}
            disabled={!!pending}
          >
            {pending === "suspended" ? "Suspending…" : "Suspend"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

function Detail({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div>
      <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-emerald-600 hover:underline dark:text-emerald-400"
        >
          {value} <ExternalLink className="size-3" />
        </a>
      ) : (
        <p className="text-sm text-foreground">{value}</p>
      )}
    </div>
  );
}
