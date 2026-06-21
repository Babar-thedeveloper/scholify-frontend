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
    <div className="flex flex-col gap-3 rounded-xl border border-white/40 bg-emerald-50/70 p-4 shadow-sm shadow-black/5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-full bg-emerald-100/80 p-1.5 text-emerald-700 backdrop-blur-md">
          <Bell className="size-4" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-medium text-emerald-900">
            Never miss a deadline.
          </p>
          <p className="text-sm text-emerald-800">
            Get free reminders 7 days before any scholarship closes.
          </p>
        </div>
      </div>
      <Button
        asChild
        className="bg-emerald-600/95 text-white shadow-sm shadow-emerald-900/10 backdrop-blur-sm transition-colors hover:bg-emerald-600"
      >
        <Link href="/register">Create free account →</Link>
      </Button>
    </div>
  );
}
