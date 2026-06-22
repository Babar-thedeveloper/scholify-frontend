"use client";

import { useCallback, useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { InternshipSearchBar } from "./InternshipSearchBar";
import { InternshipFilterBar } from "./InternshipFilterBar";
import { InternshipSortBar } from "./InternshipSortBar";
import { InternshipGrid } from "./InternshipGrid";
import type {
  Internship,
  WorkMode,
  WorkType,
  InternshipField,
  InternshipFilters,
} from "./internships.types";
import {
  filterInternships,
  sortInternships,
  paginateInternships,
  activeFilterCount,
  hasActiveFilters,
} from "./internships.utils";

interface InternshipsClientProps {
  internships: Internship[];
}

const defaultFilters: InternshipFilters = {
  search: "",
  category: "all",
  workType: "all",
  stipend: "all",
  city: "all",
  duration: "all",
  field: "all",
  sort: "most-recent",
  page: 1,
};

function parseFilters(params: URLSearchParams): InternshipFilters {
  return {
    search: params.get("search") || defaultFilters.search,
    category:
      (params.get("category") as WorkMode | "all") || defaultFilters.category,
    workType: (params.get("workType") as WorkType | "all") || defaultFilters.workType,
    stipend:
      (params.get("stipend") as InternshipFilters["stipend"]) || defaultFilters.stipend,
    city: params.get("city") || defaultFilters.city,
    duration:
      (params.get("duration") as InternshipFilters["duration"]) || defaultFilters.duration,
    field: (params.get("field") as InternshipField | "all") || defaultFilters.field,
    sort: (params.get("sort") as InternshipFilters["sort"]) || defaultFilters.sort,
    page: Math.max(1, parseInt(params.get("page") || "1", 10)),
  };
}

export function InternshipsClient({ internships }: InternshipsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  const updateUrl = useCallback(
    (next: Partial<InternshipFilters>, resetPage = true) => {
      const current = parseFilters(searchParams);
      const updated = { ...current, ...next };
      if (resetPage) updated.page = 1;

      const params = new URLSearchParams();
      if (updated.search) params.set("search", updated.search);
      if (updated.category !== "all") params.set("category", updated.category);
      if (updated.workType !== "all") params.set("workType", updated.workType);
      if (updated.stipend !== "all") params.set("stipend", updated.stipend);
      if (updated.city !== "all") params.set("city", updated.city);
      if (updated.duration !== "all") params.set("duration", updated.duration);
      if (updated.field !== "all") params.set("field", updated.field);
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
    return filterInternships(internships, rest);
  }, [internships, filters]);

  const sorted = useMemo(() => {
    return sortInternships(filtered, filters.sort);
  }, [filtered, filters.sort]);

  const { pageItems, totalPages, totalCount } = useMemo(() => {
    return paginateInternships(sorted, filters.page);
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
      <InternshipSearchBar
        value={filters.search}
        onChange={(search) => updateUrl({ search })}
      />

      <InternshipFilterBar
        filters={filterValues}
        activeCount={activeCount}
        hasFilters={hasFilters}
        onChange={(next) => updateUrl(next)}
        onClear={clearAll}
      />

      <InternshipSortBar
        count={totalCount}
        sort={filters.sort}
        onSortChange={(sort) => updateUrl({ sort }, false)}
        onClearFilters={clearAll}
        hasFilters={hasFilters}
      />

      <InternshipGrid
        internships={pageItems}
        page={filters.page}
        totalPages={totalPages}
        onPageChange={(page) => updateUrl({ page }, false)}
        onClearFilters={clearAll}
        showNudge={true}
      />
    </div>
  );
}
