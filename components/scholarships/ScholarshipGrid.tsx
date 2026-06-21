"use client";

import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScholarshipCard } from "./ScholarshipCard";
import { ReminderNudge } from "./ReminderNudge";
import type { Scholarship } from "./scholarships.types";

interface ScholarshipGridProps {
  scholarships: Scholarship[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
  showNudge?: boolean;
}

export function ScholarshipGrid({
  scholarships,
  page,
  totalPages,
  onPageChange,
  onClearFilters,
  showNudge = true,
}: ScholarshipGridProps) {
  if (scholarships.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="rounded-full border border-border/40 bg-card/70 p-4 shadow-sm shadow-black/5 backdrop-blur-md">
          <SearchX className="size-8 text-primary" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            No scholarships found
          </h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or search term
          </p>
        </div>
        <Button
          onClick={onClearFilters}
          className="bg-primary text-primary-foreground shadow-sm shadow-black/10 backdrop-blur-sm transition-colors hover:bg-primary/90"
        >
          Clear all filters
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {scholarships.map((scholarship) => (
          <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
        ))}
      </div>

      <ReminderNudge showNudge={showNudge} />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous page"
            className="border-border/40 bg-card/70 backdrop-blur-md hover:bg-card/90"
          >
            ← Previous
          </Button>
          <span className="rounded-lg border border-border/40 bg-card/70 px-3 py-1 text-sm text-muted-foreground shadow-sm shadow-black/5 backdrop-blur-md">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next page"
            className="border-border/40 bg-card/70 backdrop-blur-md hover:bg-card/90"
          >
            Next →
          </Button>
        </div>
      )}
    </div>
  );
}
