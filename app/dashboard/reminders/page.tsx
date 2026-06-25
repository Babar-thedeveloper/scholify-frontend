"use client";

import { useState } from "react";
import { Bell, CalendarClock, Mail, MessageSquare, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { MOCK_REMINDERS } from "@/components/dashboard/dashboard.mock";
import { formatDate } from "@/components/dashboard/dashboard.utils";
import type { Reminder } from "@/components/dashboard/dashboard.types";

const CHANNEL_LABEL: Record<Reminder["channel"], { label: string; Icon: typeof Mail }> = {
  email: { label: "Email", Icon: Mail },
  whatsapp: { label: "WhatsApp", Icon: MessageSquare },
  both: { label: "Email & WhatsApp", Icon: Mail },
};

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>(MOCK_REMINDERS);

  function remove(id: string) {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    // TODO: DELETE /reminders/:id
    toast.success("Reminder deleted");
  }

  function edit(id: string) {
    // TODO: Open edit modal when implemented
    toast.info("Editing reminder — coming soon");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Reminders"
        subtitle="Get notified before your saved scholarship and internship deadlines"
      />

      {reminders.length === 0 ? (
        <EmptyState
          Icon={Bell}
          title="No reminders set"
          description="When you set reminders on scholarships or internships, they'll appear here."
          actionLabel="Browse scholarships"
          actionHref="/scholarships"
        />
      ) : (
        <div className="flex flex-col gap-3">
          {reminders.map((r) => {
            const ch = CHANNEL_LABEL[r.channel];
            return (
              <div
                key={r.id}
                className="rounded-xl border border-border bg-white p-5 dark:bg-card"
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <Bell className="size-5" />
                  </span>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground">{r.itemTitle}</h3>
                    <div className="mt-2 flex flex-col gap-1.5 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <CalendarClock className="size-3.5 shrink-0" />
                        Reminder set for: {formatDate(r.remindAt)} ({r.daysBefore}{" "}
                        {r.daysBefore === 1 ? "day" : "days"} before deadline)
                      </span>
                      <span className="flex items-center gap-2">
                        <ch.Icon className="size-3.5 shrink-0" />
                        Channel: {ch.label}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => edit(r.id)}
                    >
                      <Pencil className="size-3.5" /> Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                          <Trash2 className="size-3.5" /> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this reminder?</AlertDialogTitle>
                          <AlertDialogDescription>
                            The reminder for &ldquo;{r.itemTitle}&rdquo; will be permanently
                            removed. You can always create a new one later.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => remove(r.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
