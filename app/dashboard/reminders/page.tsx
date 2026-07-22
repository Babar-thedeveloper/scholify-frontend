"use client";

// ─────────────────────────────────────────────────────────────
// /dashboard/reminders — student's list of active reminders.
//
// Wired to GET /api/v1/reminders. Each row supports:
//   - Edit: days-before + channel via dialog (PATCH)
//   - Delete: confirm dialog → DELETE
//   - Toggle active: pause / resume without deleting (PATCH)
// ─────────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  CalendarClock,
  Loader2,
  Mail,
  MessageSquare,
  Pencil,
  Smartphone,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "@/components/shared/Modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { formatDate } from "@/components/dashboard/dashboard.utils";
import {
  deleteReminder,
  listReminders,
  patchReminder,
  type ReminderChannel,
  type ReminderDto,
} from "@/lib/api/reminders";
import { handleApiError } from "@/lib/api/handle-error";

const DAYS_OPTIONS = [1, 3, 7, 14, 30];

const CHANNEL_META: Record<string, { label: string; Icon: typeof Mail }> = {
  email: { label: "Email", Icon: Mail },
  whatsapp: { label: "WhatsApp", Icon: MessageSquare },
  sms: { label: "SMS", Icon: Smartphone },
  in_app: { label: "In-app only", Icon: Bell },
};

function channelMeta(key: string) {
  return CHANNEL_META[key] ?? { label: key, Icon: Bell };
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<ReminderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ReminderDto | null>(null);
  const [editDays, setEditDays] = useState<number>(7);
  const [editChannel, setEditChannel] = useState<ReminderChannel>("email");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { items } = await listReminders();
        if (!cancelled) setReminders(items);
      } catch (err) {
        if (!cancelled)
          handleApiError(err, "Couldn't load reminders.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function handleDelete(id: string) {
    const prev = reminders;
    setReminders((r) => r.filter((x) => x.id !== id));
    try {
      await deleteReminder(id);
      toast.success("Reminder deleted");
    } catch (err) {
      setReminders(prev);
      handleApiError(err, "Couldn't delete reminder.");
    }
  }

  async function togglePause(r: ReminderDto) {
    const next = !r.isActive;
    setReminders((list) => list.map((x) => (x.id === r.id ? { ...x, isActive: next } : x)));
    try {
      await patchReminder(r.id, { isActive: next });
      toast.success(next ? "Reminder resumed" : "Reminder paused");
    } catch (err) {
      setReminders((list) => list.map((x) => (x.id === r.id ? { ...x, isActive: !next } : x)));
      handleApiError(err, "Couldn't update reminder.");
    }
  }

  function openEdit(r: ReminderDto) {
    setEditing(r);
    setEditDays(r.daysBefore);
    setEditChannel((r.channel as ReminderChannel) ?? "email");
  }

  async function saveEdit() {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await patchReminder(editing.id, {
        daysBefore: editDays,
        channel: editChannel,
      });
      setReminders((list) => list.map((x) => (x.id === editing.id ? res.reminder : x)));
      toast.success("Reminder updated");
      setEditing(null);
    } catch (err) {
      handleApiError(err, "Couldn't update reminder.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Reminders"
        subtitle="Get notified before your scholarship and internship deadlines"
      />

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Spinner size="sm" className="mr-2" /> Loading…
        </div>
      ) : reminders.length === 0 ? (
        <EmptyState
          Icon={Bell}
          title="No reminders set"
          description="Open a scholarship or internship and hit “Remind me” to get notified before it closes."
          actionLabel="Browse scholarships"
          actionHref="/scholarships"
        />
      ) : (
        <div className="flex flex-col gap-3">
          {reminders.map((r) => {
            const ch = channelMeta(r.channel);
            const inactive = !r.isActive;
            return (
              <div
                key={r.id}
                className={`rounded-xl border border-border bg-white p-5 dark:bg-card ${inactive ? "opacity-60" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <Bell className="size-5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/postings/${r.postingSlug}`}
                      className="font-semibold text-foreground hover:underline"
                    >
                      {r.postingTitle}
                    </Link>
                    <p className="text-xs text-muted-foreground">{r.organizationName}</p>
                    <div className="mt-2 flex flex-col gap-1.5 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <CalendarClock className="size-3.5 shrink-0" />
                        {formatDate(r.remindAt)} · {r.daysBefore}{" "}
                        {r.daysBefore === 1 ? "day" : "days"} before deadline
                      </span>
                      <span className="flex items-center gap-2">
                        <ch.Icon className="size-3.5 shrink-0" />
                        {ch.label}
                        {r.lastSentAt && (
                          <span className="ml-1 text-xs">· sent {formatDate(r.lastSentAt)}</span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
                    <Button size="sm" variant="ghost" onClick={() => togglePause(r)}>
                      {r.isActive ? "Pause" : "Resume"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => openEdit(r)}>
                      <Pencil className="size-3.5" /> Edit
                    </Button>
                    <ConfirmModal
                      trigger={
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" /> Delete
                        </Button>
                      }
                      title="Delete this reminder?"
                      description={`The reminder for "${r.postingTitle}" will be permanently removed. You can always create a new one later.`}
                      confirmText="Delete"
                      onConfirm={() => handleDelete(r.id)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit dialog */}
      <Modal
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
      >
        <ModalHeader
          title="Edit reminder"
          description={editing?.postingTitle}
        />

        <ModalBody className="grid gap-4">
          <div className="grid gap-1.5">
            <label className="text-sm font-medium">Remind me</label>
            <Select value={String(editDays)} onValueChange={(v) => setEditDays(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OPTIONS.map((d) => (
                  <SelectItem key={d} value={String(d)}>
                    {d} day{d === 1 ? "" : "s"} before deadline
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <label className="text-sm font-medium">Channel</label>
            <Select value={editChannel} onValueChange={(v) => setEditChannel(v as ReminderChannel)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="in_app">In-app only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </ModalBody>

        <ModalFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => setEditing(null)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={saveEdit} disabled={saving}>
            {saving && <Spinner size="sm" />}
            Save changes
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
