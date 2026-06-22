"use client";

import { SlidersHorizontal, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InternshipCategoryTabs } from "./InternshipCategoryTabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { InternshipFilters } from "./internships.types";

interface InternshipFilterBarProps {
  filters: Omit<InternshipFilters, "search" | "sort" | "page">;
  activeCount: number;
  hasFilters: boolean;
  onChange: (
    filters: Omit<InternshipFilters, "search" | "sort" | "page">
  ) => void;
  onClear: () => void;
}

const workTypeOptions = [
  { value: "all", label: "All types" },
  { value: "internship", label: "Internship" },
  { value: "part-time", label: "Part-time" },
  { value: "full-time", label: "Full-time" },
];

const stipendOptions = [
  { value: "all", label: "All" },
  { value: "paid", label: "Paid only" },
  { value: "unpaid", label: "Unpaid only" },
];

const cityOptions = [
  { value: "all", label: "All cities" },
  { value: "Karachi", label: "Karachi" },
  { value: "Lahore", label: "Lahore" },
  { value: "Islamabad", label: "Islamabad" },
  { value: "Remote", label: "Remote" },
  { value: "Other", label: "Other" },
];

const durationOptions = [
  { value: "all", label: "Any duration" },
  { value: "1-3", label: "1–3 months" },
  { value: "3-6", label: "3–6 months" },
  { value: "6+", label: "6+ months" },
];

const fieldOptions = [
  { value: "all", label: "All fields" },
  { value: "software-it", label: "Software / IT" },
  { value: "marketing", label: "Marketing" },
  { value: "design", label: "Design" },
  { value: "finance", label: "Finance" },
  { value: "sales", label: "Sales / BD" },
  { value: "engineering", label: "Engineering" },
  { value: "other", label: "Other" },
];

export function InternshipFilterBar({
  filters,
  activeCount,
  hasFilters,
  onChange,
  onClear,
}: InternshipFilterBarProps) {
  const update = (
    key: keyof typeof filters,
    value: (typeof filters)[keyof typeof filters]
  ) => {
    onChange({ ...filters, [key]: value });
  };

  const filterContent = (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-3">
      <Select
        value={filters.workType}
        onValueChange={(value) => update("workType", value as typeof filters.workType)}
        aria-label="Work type filter"
      >
        <SelectTrigger className="w-full text-[13px] md:w-[150px]">
          <SelectValue placeholder="Work type" />
        </SelectTrigger>
        <SelectContent>
          {workTypeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.stipend}
        onValueChange={(value) => update("stipend", value as typeof filters.stipend)}
        aria-label="Stipend filter"
      >
        <SelectTrigger className="w-full text-[13px] md:w-[140px]">
          <SelectValue placeholder="Stipend" />
        </SelectTrigger>
        <SelectContent>
          {stipendOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.city}
        onValueChange={(value) => update("city", value as typeof filters.city)}
        aria-label="City filter"
      >
        <SelectTrigger className="w-full text-[13px] md:w-[150px]">
          <SelectValue placeholder="City" />
        </SelectTrigger>
        <SelectContent>
          {cityOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.duration}
        onValueChange={(value) => update("duration", value as typeof filters.duration)}
        aria-label="Duration filter"
      >
        <SelectTrigger className="w-full text-[13px] md:w-[160px]">
          <SelectValue placeholder="Duration" />
        </SelectTrigger>
        <SelectContent>
          {durationOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.field}
        onValueChange={(value) => update("field", value as typeof filters.field)}
        aria-label="Field filter"
      >
        <SelectTrigger className="w-full text-[13px] md:w-[160px]">
          <SelectValue placeholder="Field" />
        </SelectTrigger>
        <SelectContent>
          {fieldOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full md:w-[170px]">
            <Select value="all" disabled aria-label="Experience level filter">
              <SelectTrigger className="w-full cursor-not-allowed opacity-60 text-[13px]">
                <div className="flex items-center gap-2">
                  <Lock className="size-3.5" aria-hidden="true" />
                  <SelectValue placeholder="Experience level" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All levels</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Coming soon</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );

  return (
    <div className="sticky top-14 z-30 rounded-2xl bg-card p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]">
      <div className="flex flex-col gap-2">
        <InternshipCategoryTabs
          value={filters.category}
          onChange={(category) => onChange({ ...filters, category })}
        />

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="hidden md:block">{filterContent}</div>

          <div className="flex items-center gap-2 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 text-[13px]" aria-label="Open filters">
                <SlidersHorizontal className="size-4" aria-hidden="true" />
                Filters
                {activeCount > 0 && (
                  <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                    {activeCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto max-h-[85vh]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-4">{filterContent}</div>
              <SheetFooter className="mt-6 flex-row gap-2">
                {hasFilters && (
                  <SheetClose asChild>
                    <Button
                      variant="outline"
                      onClick={onClear}
                      className="flex-1 text-[13px]"
                    >
                      Clear all
                    </Button>
                  </SheetClose>
                )}
                <SheetClose asChild>
                  <Button className="flex-1 text-[13px]">
                    Show results
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden md:flex md:items-center">
          {hasFilters && (
            <Button
              variant="outline"
              className="text-[13px] text-gray-500 hover:text-foreground"
              onClick={onClear}
              aria-label="Clear all filters"
            >
              Clear all filters
            </Button>
          )}
        </div>
      </div>

      {hasFilters && (
        <div className="mt-2 flex md:hidden">
          <Button
            variant="ghost"
            className="px-0 text-[13px] text-primary hover:text-primary"
            onClick={onClear}
            aria-label="Clear all filters"
          >
            Clear all filters
          </Button>
        </div>
      )}
      </div>
    </div>
  );
}
