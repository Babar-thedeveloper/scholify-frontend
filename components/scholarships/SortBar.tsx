"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ScholarshipFilters } from "./scholarships.types";

interface SortBarProps {
  count: number;
  sort: ScholarshipFilters["sort"];
  onSortChange: (sort: ScholarshipFilters["sort"]) => void;
  onClearFilters: () => void;
  hasFilters: boolean;
}

const sortOptions: { value: ScholarshipFilters["sort"]; label: string }[] = [
  { value: "deadline-asc", label: "Deadline: soonest first" },
  { value: "recently-added", label: "Recently added" },
  { value: "fully-funded-first", label: "Fully funded first" },
  { value: "az", label: "A → Z" },
];

export function SortBar({
  count,
  sort,
  onSortChange,
  onClearFilters,
  hasFilters,
}: SortBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <span className="hidden text-[13px] text-gray-500 dark:text-gray-400 sm:inline">
          Sort by:
        </span>
        <Select
          value={sort}
          onValueChange={(value) =>
            onSortChange(value as ScholarshipFilters["sort"])
          }
          aria-label="Sort scholarships"
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
            No scholarships match your filters.{" "}
            <button
              onClick={onClearFilters}
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              Clear filters
            </button>
          </span>
        ) : (
          <span>
            <strong className="font-semibold text-gray-900 dark:text-gray-100">{count}</strong> scholarships
            found
          </span>
        )}
      </div>
    </div>
  );
}
