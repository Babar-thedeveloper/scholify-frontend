"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ORG_STATUS_OPTIONS, formatStatus } from "@/components/dashboard/dashboard.utils";
import type { ApplicationStatus } from "@/components/dashboard/dashboard.types";

export interface StatusChangePayload {
  nextStatus: ApplicationStatus;
  studentNote: string;
  notifyByEmail: boolean;
}

interface Props {
  current: ApplicationStatus;
  applicantName: string;
  /** If provided, called on Update — parent handles the API call.
   *  If omitted, falls back to a local toast (used in the mock demo). */
  onSubmit?: (payload: StatusChangePayload) => Promise<void>;
}

export function StatusChangeControl({ current, applicantName, onSubmit }: Props) {
  const [status, setStatus] = useState<ApplicationStatus>(current);
  const [next, setNext] = useState<ApplicationStatus>(current);
  const [note, setNote] = useState("");
  const [notify, setNotify] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Keep local state in sync if the parent's `current` prop changes (e.g. after API refresh).
  useEffect(() => {
    setStatus(current);
    setNext(current);
  }, [current]);

  const dirty = next !== status;

  async function update() {
    if (!dirty) return;
    const payload: StatusChangePayload = {
      nextStatus: next,
      studentNote: note,
      notifyByEmail: notify,
    };

    if (onSubmit) {
      setSubmitting(true);
      try {
        await onSubmit(payload);
        // Parent should update `current` via prop; local state resyncs via effect.
        setNote("");
      } catch {
        /* parent handles error toasting */
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // Fallback: local-only demo behaviour.
    setStatus(next);
    setNote("");
    toast.success(
      `Status updated to "${formatStatus(next)}"${
        notify ? ` — ${applicantName} notified by email` : ""
      }`
    );
  }

  return (
    <div className="rounded-xl border border-border bg-white p-5 dark:bg-card">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">Current status</p>
        <StatusBadge status={status} size="md" />
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Change status to</label>
        <Select
          value={next}
          onValueChange={(v) => setNext(v as ApplicationStatus)}
          disabled={submitting}
        >
          <SelectTrigger className="h-9 w-full text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ORG_STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {formatStatus(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {dirty && (
        <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 duration-200 animate-in fade-in-0">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Add a note <span className="text-muted-foreground">(optional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              disabled={submitting}
              placeholder="Share feedback with the applicant…"
              className="resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            />
          </div>
          <label className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
            <span className="text-sm text-foreground">Send email notification to applicant</span>
            <Switch checked={notify} onCheckedChange={setNotify} disabled={submitting} />
          </label>
        </div>
      )}

      <Button className="mt-4 w-full" size="lg" disabled={!dirty || submitting} onClick={update}>
        {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
        Update status
      </Button>
    </div>
  );
}
