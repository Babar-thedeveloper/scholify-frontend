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
    <div className="flex flex-col gap-3 rounded-2xl bg-muted/30 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-full bg-primary/10 p-1.5 text-primary">
          <Bell className="size-4" aria-hidden="true" />
        </div>
        <div>
          <p className="text-[13px] font-medium text-gray-900 dark:text-gray-100">
            Never miss a deadline.
          </p>
          <p className="text-[13px] text-gray-500 dark:text-gray-400">
            Get free reminders 7 days before any scholarship closes.
          </p>
        </div>
      </div>
      <Button size="sm" asChild className="text-xs">
        <Link href="/register">Create free account →</Link>
      </Button>
    </div>
  );
}
