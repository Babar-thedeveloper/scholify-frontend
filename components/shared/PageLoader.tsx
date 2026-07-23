"use client";

import { Spinner } from "@/components/ui/spinner";
import { ScholifyLogo } from "@/components/scholify-logo";

interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = "Loading…" }: PageLoaderProps) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm">
      <ScholifyLogo className="h-10 w-auto" />
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner size="sm" />
        <span>{message}</span>
      </div>
    </div>
  );
}
