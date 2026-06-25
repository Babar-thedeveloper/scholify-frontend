import { CheckCircle2, Circle, FileText, MessageSquare, RefreshCw } from "lucide-react";
import { timeAgo } from "./dashboard.utils";
import type { ApplicationTimelineEvent } from "./dashboard.types";

const TYPE_ICON = {
  "status-change": RefreshCw,
  note: MessageSquare,
  submission: FileText,
  message: MessageSquare,
} as const;

export function ApplicationTimeline({ events }: { events: ApplicationTimelineEvent[] }) {
  return (
    <ol className="relative space-y-5 pl-6">
      {/* vertical line */}
      <span className="absolute left-[9px] top-1 bottom-1 w-px bg-border" aria-hidden="true" />
      {events.map((e, i) => {
        const Icon = i === 0 ? CheckCircle2 : TYPE_ICON[e.type] ?? Circle;
        return (
          <li key={i} className="relative">
            <span className="absolute -left-6 top-0 flex size-5 items-center justify-center rounded-full bg-background">
              <Icon
                className={
                  i === 0 ? "size-5 text-emerald-600" : "size-4 text-muted-foreground"
                }
              />
            </span>
            <p className="text-sm font-medium text-foreground">{e.description}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{timeAgo(e.timestamp)}</p>
          </li>
        );
      })}
    </ol>
  );
}
