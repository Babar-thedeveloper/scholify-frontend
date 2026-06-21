"use client";

import { SlidersHorizontal, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryTabs } from "./CategoryTabs";
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
import type { ScholarshipFilters } from "./scholarships.types";

interface FilterBarProps {
  filters: Omit<ScholarshipFilters, "search" | "sort" | "page">;
  activeCount: number;
  hasFilters: boolean;
  onChange: (
    filters: Omit<ScholarshipFilters, "search" | "sort" | "page">
  ) => void;
  onClear: () => void;
}

const degreeOptions = [
  { value: "all", label: "All levels" },
  { value: "undergraduate", label: "Undergraduate" },
  { value: "masters", label: "Masters" },
  { value: "phd", label: "PhD" },
];

const fundingOptions = [
  { value: "all", label: "All types" },
  { value: "fully-funded", label: "Fully funded" },
  { value: "partial", label: "Partial funding" },
  { value: "need-based", label: "Need-based" },
  { value: "merit-based", label: "Merit-based" },
];

const destinationOptions = [
  { value: "all", label: "All destinations" },
  { value: "Pakistan", label: "Pakistan" },
  { value: "UK", label: "UK" },
  { value: "USA", label: "USA" },
  { value: "Germany", label: "Germany" },
  { value: "Turkey", label: "Turkey" },
  { value: "China", label: "China" },
  { value: "Australia", label: "Australia" },
  { value: "Other", label: "Other" },
];

const deadlineOptions = [
  { value: "any", label: "Any deadline" },
  { value: "this-week", label: "Closing this week" },
  { value: "this-month", label: "Closing this month" },
  { value: "next-3-months", label: "Next 3 months" },
  { value: "open", label: "Open / rolling" },
];

export function FilterBar({
  filters,
  activeCount,
  hasFilters,
  onChange,
  onClear,
}: FilterBarProps) {
  const update = (
    key: keyof typeof filters,
    value: (typeof filters)[keyof typeof filters]
  ) => {
    onChange({ ...filters, [key]: value });
  };

  const filterContent = (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-3">
      <Select
        value={filters.level}
        onValueChange={(value) => update("level", value as typeof filters.level)}
        aria-label="Degree level filter"
      >
        <SelectTrigger className="w-full border-border/50 bg-card/70 backdrop-blur-md md:w-[150px]">
          <SelectValue placeholder="Degree level" />
        </SelectTrigger>
        <SelectContent className="border-border/40 bg-card/85 backdrop-blur-xl">
          {degreeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.fundingType}
        onValueChange={(value) =>
          update("fundingType", value as typeof filters.fundingType)
        }
        aria-label="Funding type filter"
      >
        <SelectTrigger className="w-full border-border/50 bg-card/70 backdrop-blur-md md:w-[150px]">
          <SelectValue placeholder="Funding type" />
        </SelectTrigger>
        <SelectContent className="border-border/40 bg-card/85 backdrop-blur-xl">
          {fundingOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.destination}
        onValueChange={(value) =>
          update("destination", value as typeof filters.destination)
        }
        aria-label="Destination filter"
      >
        <SelectTrigger className="w-full border-border/50 bg-card/70 backdrop-blur-md md:w-[170px]">
          <SelectValue placeholder="Destination" />
        </SelectTrigger>
        <SelectContent className="border-border/40 bg-card/85 backdrop-blur-xl">
          {destinationOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.deadlineRange}
        onValueChange={(value) =>
          update("deadlineRange", value as typeof filters.deadlineRange)
        }
        aria-label="Deadline filter"
      >
        <SelectTrigger className="w-full border-border/50 bg-card/70 backdrop-blur-md md:w-[170px]">
          <SelectValue placeholder="Deadline" />
        </SelectTrigger>
        <SelectContent className="border-border/40 bg-card/85 backdrop-blur-xl">
          {deadlineOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full md:w-[170px]">
            <Select value="all" disabled aria-label="Field of study filter">
              <SelectTrigger className="w-full cursor-not-allowed border-border/50 bg-muted/50 opacity-60 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Lock className="size-3.5" aria-hidden="true" />
                  <SelectValue placeholder="Field of study" />
                </div>
              </SelectTrigger>
              <SelectContent className="border-border/40 bg-card/85 backdrop-blur-xl">
                <SelectItem value="all">All fields</SelectItem>
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
    <div className="sticky top-14 z-30 rounded-xl border border-border/50 bg-card/80 p-3 shadow-sm shadow-black/5 backdrop-blur-xl">
      <div className="flex flex-col gap-2">
        <CategoryTabs
          value={filters.category}
          onChange={(category) => onChange({ ...filters, category })}
        />

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="hidden md:block">{filterContent}</div>

          <div className="flex items-center gap-2 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 border-border/60 bg-card/70 backdrop-blur-md" aria-label="Open filters">
                <SlidersHorizontal className="size-4" aria-hidden="true" />
                Filters
                {activeCount > 0 && (
                  <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                    {activeCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto max-h-[85vh] border-border/50 bg-card/85 backdrop-blur-xl">
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
                      className="flex-1 border-border/60 bg-card/70 backdrop-blur-md hover:bg-card/90"
                    >
                      Clear all
                    </Button>
                  </SheetClose>
                )}
                <SheetClose asChild>
                  <Button className="flex-1 bg-primary text-primary-foreground shadow-sm shadow-black/10 backdrop-blur-sm transition-colors hover:bg-primary/90">
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
              className="text-sm border-border/60 bg-card/70 text-muted-foreground backdrop-blur-md hover:bg-card/90 hover:text-foreground"
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
            className="px-0 text-sm text-primary hover:bg-primary/10 hover:text-primary"
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
