"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SearchBar } from "./SearchBar";
import { FilterBar } from "./FilterBar";
import { SortBar } from "./SortBar";
import { ScholarshipGrid } from "./ScholarshipGrid";
import type {
  Scholarship,
  ScholarshipCategory,
  DegreeLevel,
  FundingType,
  ScholarshipFilters,
} from "./scholarships.types";
import {
  filterScholarships,
  sortScholarships,
  paginateScholarships,
  activeFilterCount,
  hasActiveFilters,
} from "./scholarships.utils";

interface ScholarshipsClientProps {
  scholarships: Scholarship[];
}

const defaultFilters: ScholarshipFilters = {
  search: "",
  category: "all",
  level: "all",
  fundingType: "all",
  destination: "all",
  deadlineRange: "any",
  sort: "deadline-asc",
  page: 1,
};

function parseFilters(params: URLSearchParams): ScholarshipFilters {
  return {
    search: params.get("search") || defaultFilters.search,
    category:
      (params.get("category") as ScholarshipCategory | "all") || defaultFilters.category,
    level: (params.get("level") as DegreeLevel | "all") || defaultFilters.level,
    fundingType:
      (params.get("fundingType") as FundingType | "all") || defaultFilters.fundingType,
    destination: params.get("destination") || defaultFilters.destination,
    deadlineRange:
      (params.get("deadlineRange") as ScholarshipFilters["deadlineRange"]) ||
      defaultFilters.deadlineRange,
    sort: (params.get("sort") as ScholarshipFilters["sort"]) || defaultFilters.sort,
    page: Math.max(1, parseInt(params.get("page") || "1", 10)),
  };
}

export function ScholarshipsClient({ scholarships }: ScholarshipsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);

  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  const updateUrl = useCallback(
    (next: Partial<ScholarshipFilters>, resetPage = true) => {
      const current = parseFilters(searchParams);
      const updated = { ...current, ...next };
      if (resetPage) updated.page = 1;

      const params = new URLSearchParams();
      if (updated.search) params.set("search", updated.search);
      if (updated.category !== "all") params.set("category", updated.category);
      if (updated.level !== "all") params.set("level", updated.level);
      if (updated.fundingType !== "all") params.set("fundingType", updated.fundingType);
      if (updated.destination !== "all") params.set("destination", updated.destination);
      if (updated.deadlineRange !== "any") params.set("deadlineRange", updated.deadlineRange);
      if (updated.sort !== defaultFilters.sort) params.set("sort", updated.sort);
      if (updated.page > 1) params.set("page", String(updated.page));

      startTransition(() => {
        router.replace(`?${params.toString()}`, { scroll: false });
      });
    },
    [searchParams, router]
  );

  const filtered = useMemo(() => {
    const { sort, page, ...rest } = filters;
    return filterScholarships(scholarships, rest);
  }, [scholarships, filters]);

  const sorted = useMemo(() => {
    return sortScholarships(filtered, filters.sort);
  }, [filtered, filters.sort]);

  const { pageItems, totalPages, totalCount } = useMemo(() => {
    return paginateScholarships(sorted, filters.page);
  }, [sorted, filters.page]);

  const filterValues = useMemo(() => {
    const { sort, search, page, ...rest } = filters;
    return rest;
  }, [filters]);

  const clearAll = useCallback(() => {
    const current = parseFilters(searchParams);
    const params = new URLSearchParams();
    if (current.sort !== defaultFilters.sort) params.set("sort", current.sort);
    startTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  }, [searchParams, router]);

  const activeCount = activeFilterCount(filterValues);
  const hasFilters = hasActiveFilters(filterValues);

  return (
    <div>
      {/* Mobile: sticky Filters button → drawer */}
      <div className="sticky top-14 z-30 mb-4 lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full gap-2 bg-card shadow-sm">
              <SlidersHorizontal className="size-4" aria-hidden="true" />
              Filters
              {activeCount > 0 && (
                <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                  {activeCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex w-[300px] flex-col p-0">
            <SheetHeader className="border-b px-4 py-3">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <FilterBar filters={filterValues} onChange={(next) => updateUrl(next)} />
            </div>
            <SheetFooter className="flex-row gap-2 border-t px-4 py-3">
              {hasFilters && (
                <Button variant="outline" className="flex-1" onClick={clearAll}>
                  Clear all
                </Button>
              )}
              <SheetClose asChild>
                <Button className="flex-1">Show results</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex gap-6">
        {/* Desktop: filter sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-4 rounded-2xl bg-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]">
            <div className="mb-4 flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <SlidersHorizontal className="size-4" aria-hidden="true" />
                Filters
                {activeCount > 0 && (
                  <span className="rounded-full bg-primary px-1.5 py-0.5 text-[11px] text-primary-foreground">
                    {activeCount}
                  </span>
                )}
              </p>
              {hasFilters && (
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-xs text-muted-foreground hover:text-foreground"
                  onClick={clearAll}
                >
                  Clear
                </Button>
              )}
            </div>
            <FilterBar filters={filterValues} onChange={(next) => updateUrl(next)} />
          </div>
        </aside>

        {/* Main column */}
        <div
          className={`min-w-0 flex-1 space-y-5 ${isPending ? "opacity-70 transition-opacity" : "transition-opacity"}`}
        >
          <SearchBar value={filters.search} onChange={(search) => updateUrl({ search })} />
          <SortBar
            count={totalCount}
            sort={filters.sort}
            onSortChange={(sort) => updateUrl({ sort }, false)}
            onClearFilters={clearAll}
            hasFilters={hasFilters}
          />
          <ScholarshipGrid
            scholarships={pageItems}
            page={filters.page}
            totalPages={totalPages}
            onPageChange={(page) => updateUrl({ page }, false)}
            onClearFilters={clearAll}
            showNudge={true}
          />
        </div>
      </div>
    </div>
  );
}
