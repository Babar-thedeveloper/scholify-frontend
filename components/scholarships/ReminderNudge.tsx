"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReminderNudgeProps {
  showNudge?: boolean;
}

export function ReminderNudge({ showNudge = true }: ReminderNudgeProps) {
  if (!showNudge) return null;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/40 bg-secondary/70 p-4 shadow-sm shadow-black/5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-full bg-primary/15 p-1.5 text-primary backdrop-blur-md">
          <Bell className="size-4" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            Never miss a deadline.
          </p>
          <p className="text-sm text-muted-foreground">
            Get free reminders 7 days before any scholarship closes.
          </p>
        </div>
      </div>
      <Button
        asChild
        className="bg-primary text-primary-foreground shadow-sm shadow-black/10 backdrop-blur-sm transition-colors hover:bg-primary/90"
      >
        <Link href="/register">Create free account →</Link>
      </Button>
    </div>
  );
}
