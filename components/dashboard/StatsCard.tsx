import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface StatsCardProps {
  value: string | number;
  label: string;
  Icon?: LucideIcon;
  /** tailwind text color class for the icon chip, e.g. "text-emerald-600" */
  accent?: string;
  /** Renders the highlighted green-gradient variant (Donezo-style featured stat). */
  featured?: boolean;
}

export function StatsCard({ value, label, Icon, accent = "text-emerald-600", featured = false }: StatsCardProps) {
  return (
    <Card
      hover
      className={cn(
        "gap-0 p-5",
        featured &&
          "border-transparent bg-gradient-to-br from-emerald-500 to-emerald-700 text-white dark:from-emerald-600 dark:to-emerald-800"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={cn("text-3xl font-bold tracking-tight", featured ? "text-white" : "text-foreground")}>
            {value}
          </p>
          <p className={cn("mt-1 text-sm", featured ? "text-emerald-50/90" : "text-muted-foreground")}>
            {label}
          </p>
        </div>
        {Icon && (
          <span
            className={cn(
              "flex size-9 items-center justify-center rounded-lg",
              featured ? "bg-white/20 text-white" : cn("bg-muted", accent)
            )}
          >
            <Icon className="size-5" />
          </span>
        )}
      </div>
    </Card>
  );
}
