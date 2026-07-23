"use client";

// ─────────────────────────────────────────────────────────────
// "Remind me" button for a posting detail page sidebar.
//
// - Only visible to logged-in students
// - Opens a dialog to pick days-before + channel
// - Calls POST /reminders on submit
// - Once created, the button flips into a compact "Reminder set"
//   state and lets the student open the dialog again to edit or
//   remove it (delete → back to "Remind me")
// ─────────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import { BellRing, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "@/components/shared/Modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/components/auth/UserContext";
import {
  createReminder,
  deleteReminder,
  listReminders,
  patchReminder,
  type ReminderChannel,
  type ReminderDto,
} from "@/lib/api/reminders";
import { ApiError } from "@/lib/api/client";

interface Props {
  postingId: string;
  postingSlug: string;
  /** ISO deadline- used to hide the button when already closed. */
  deadlineAt?: string | null;
}

const DAYS_OPTIONS = [1, 3, 7, 14, 30];

export function RemindMeButton({ postingId, postingSlug, deadlineAt }: Props) {
  const { user, isAuthed, isLoading: authLoading } = useUser();
  const [existing, setExisting] = useState<ReminderDto | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [daysBefore, setDaysBefore] = useState<number>(7);
  const [channel, setChannel] = useState<ReminderChannel>("email");

  useEffect(() => {
    if (authLoading || !isAuthed || user.role !== "student") return;
    let cancelled = false;
    (async () => {
      try {
        const { items } = await listReminders();
        if (cancelled) return;
        const match = items.find((r) => r.postingId === postingId) ?? null;
        setExisting(match);
        if (match) {
          setDaysBefore(match.daysBefore);
          setChannel((match.channel as ReminderChannel) ?? "email");
        }
      } catch {
        /* silent */
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => { cancelled = true; };
  }, [postingId, isAuthed, authLoading, user.role]);

  if (authLoading || !isAuthed || user.role !== "student") return null;

  const deadlinePassed = !!deadlineAt && new Date(deadlineAt).getTime() <= Date.now();
  if (deadlinePassed && !existing) return null;

  async function save() {
    setBusy(true);
    try {
      if (existing) {
        const res = await patchReminder(existing.id, { daysBefore, channel });
        setExisting(res.reminder);
        toast.success("Reminder updated");
      } else {
        const res = await createReminder({ postingId, postingSlug, daysBefore, channel });
        setExisting(res.reminder);
        toast.success(res.message);
      }
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't save reminder.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!existing) return;
    setBusy(true);
    try {
      await deleteReminder(existing.id);
      setExisting(null);
      toast.success("Reminder removed");
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't delete reminder.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button
          variant={existing ? "secondary" : "outline"}
          size="lg"
          className="w-full"
          disabled={!hydrated}
        >
          <BellRing className={existing ? "size-4 fill-current" : "size-4"} />
          {existing
            ? `Reminder · ${existing.daysBefore} day${existing.daysBefore === 1 ? "" : "s"} before`
            : "Remind me"}
        </Button>
      }
    >
      <ModalHeader
        title={existing ? "Edit reminder" : "Set a reminder"}
        description="We'll ping you before this deadline so you don't miss it."
      />

      <ModalBody className="grid gap-4">
        <div className="grid gap-1.5">
          <Label className="text-sm font-medium">Remind me</Label>
          <Select
            value={String(daysBefore)}
            onValueChange={(v) => setDaysBefore(Number(v))}
          >
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
          <Label className="text-sm font-medium">Channel</Label>
          <Select value={channel} onValueChange={(v) => setChannel(v as ReminderChannel)}>
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
        {existing && (
          <Button
            variant="ghost"
            className="text-destructive hover:text-destructive sm:mr-auto"
            onClick={remove}
            disabled={busy}
          >
            <Trash2 className="size-4" /> Remove
          </Button>
        )}
        <Button variant="outline" onClick={() => setOpen(false)} disabled={busy}>
          Cancel
        </Button>
        <Button onClick={save} disabled={busy}>
          {busy && <Spinner size="sm" />}
          {existing ? "Save changes" : "Set reminder"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
