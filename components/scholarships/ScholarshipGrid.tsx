"use client";

import { useState } from "react";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { ScholarshipCard } from "./ScholarshipCard";
import { ScholarshipModal } from "./ScholarshipModal";
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
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

  if (scholarships.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="rounded-full bg-muted/50 p-4">
          <SearchX className="size-6 text-gray-400" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            No scholarships found
          </h3>
          <p className="mt-1 text-[13px] text-gray-500 dark:text-gray-400">
            Try adjusting your filters or search term
          </p>
        </div>
        <Button size="sm" onClick={onClearFilters}>
          Clear all filters
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        key={page}
        className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
      >
        {scholarships.map((scholarship) => (
          <ScholarshipCard
            key={scholarship.id}
            scholarship={scholarship}
            onClick={() => setSelectedScholarship(scholarship)}
          />
        ))}
      </div>

      <ReminderNudge showNudge={showNudge} />

      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />

      <ScholarshipModal
        scholarship={selectedScholarship}
        open={selectedScholarship !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedScholarship(null);
        }}
      />
    </div>
  );
}
