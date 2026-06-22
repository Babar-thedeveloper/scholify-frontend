"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InternshipFilters } from "./internships.types";

interface InternshipSortBarProps {
  count: number;
  sort: InternshipFilters["sort"];
  onSortChange: (sort: InternshipFilters["sort"]) => void;
  onClearFilters: () => void;
  hasFilters: boolean;
}

const sortOptions: { value: InternshipFilters["sort"]; label: string }[] = [
  { value: "most-recent", label: "Most recent" },
  { value: "highest-stipend", label: "Highest stipend" },
  { value: "closing-soon", label: "Closing soon" },
  { value: "az", label: "A → Z" },
];

export function InternshipSortBar({
  count,
  sort,
  onSortChange,
  onClearFilters,
  hasFilters,
}: InternshipSortBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <span className="hidden text-[13px] text-gray-500 dark:text-gray-400 sm:inline">
          Sort by:
        </span>
        <Select
          value={sort}
          onValueChange={(value) =>
            onSortChange(value as InternshipFilters["sort"])
          }
          aria-label="Sort internships"
        >
          <SelectTrigger className="w-[180px] text-[13px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="text-[13px] text-gray-500 dark:text-gray-400">
        {count === 0 ? (
          <span className="text-gray-700 dark:text-gray-300">
            No internships match your filters.{" "}
            <button
              onClick={onClearFilters}
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              Clear filters
            </button>
          </span>
        ) : (
          <span>
            <strong className="font-semibold text-gray-900 dark:text-gray-100">{count}</strong> internships
            found
          </span>
        )}
      </div>
    </div>
  );
}
