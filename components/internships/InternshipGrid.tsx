"use client";

import { useState } from "react";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { InternshipCard } from "./InternshipCard";
import { InternshipModal } from "./InternshipModal";
import { InternshipReminderNudge } from "./InternshipReminderNudge";
import type { Internship } from "./internships.types";

interface InternshipGridProps {
  internships: Internship[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
  showNudge?: boolean;
}

export function InternshipGrid({
  internships,
  page,
  totalPages,
  onPageChange,
  onClearFilters,
  showNudge = true,
}: InternshipGridProps) {
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);

  if (internships.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="rounded-full bg-muted/50 p-4">
          <SearchX className="size-6 text-gray-400" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            No internships found
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
        {internships.map((internship) => (
          <InternshipCard
            key={internship.id}
            internship={internship}
            onClick={() => setSelectedInternship(internship)}
          />
        ))}
      </div>

      <InternshipReminderNudge showNudge={showNudge} />

      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />

      <InternshipModal
        internship={selectedInternship}
        open={selectedInternship !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedInternship(null);
        }}
      />
    </div>
  );
}
