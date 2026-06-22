"use client";

import { useCallback, useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
    <div className={`flex flex-col gap-6 ${isPending ? "opacity-70 transition-opacity" : "transition-opacity"}`}>
      <SearchBar
        value={filters.search}
        onChange={(search) => updateUrl({ search })}
      />

      <FilterBar
        filters={filterValues}
        activeCount={activeCount}
        hasFilters={hasFilters}
        onChange={(next) => updateUrl(next)}
        onClear={clearAll}
      />

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
  );
}
