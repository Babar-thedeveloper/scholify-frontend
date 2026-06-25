import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  value: string | number;
  label: string;
  Icon?: LucideIcon;
  /** tailwind text color class for the icon chip, e.g. "text-emerald-600" */
  accent?: string;
}

export function StatsCard({ value, label, Icon, accent = "text-emerald-600" }: StatsCardProps) {
  return (
    <div className="dash-card rounded-xl border border-border bg-white p-5 dark:bg-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{label}</p>
        </div>
        {Icon && (
          <span className={cn("flex size-9 items-center justify-center rounded-lg bg-muted", accent)}>
            <Icon className="size-5" />
          </span>
        )}
      </div>
    </div>
  );
}
