import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function ProfileCompletionBanner({ percent = 85 }: { percent?: number }) {
  if (percent >= 100) return null;

  return (
    <div className="rounded-xl border border-amber-200 border-l-4 border-l-amber-400 bg-amber-50 p-5 dark:border-amber-500/30 dark:border-l-amber-500 dark:bg-amber-500/10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
            <Sparkles className="size-5" />
          </span>
          <div>
            <p className="font-semibold text-amber-900 dark:text-amber-200">
              Complete your profile to unlock more matches
            </p>
            <p className="mt-0.5 text-sm text-amber-800/80 dark:text-amber-200/70">
              Your profile is {percent}% complete. Finish it to improve your application
              success rate.
            </p>
            <div className="mt-3 max-w-xs">
              <Progress value={percent} className="h-1.5" />
            </div>
          </div>
        </div>
        <Button asChild className="shrink-0 gap-1.5 bg-amber-500 hover:bg-amber-600">
          <Link href="/dashboard/profile">
            Complete profile <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
