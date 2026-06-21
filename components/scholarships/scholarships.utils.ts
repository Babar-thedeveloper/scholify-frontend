import type {
  Scholarship,
  ScholarshipCategory,
  DegreeLevel,
  FundingType,
  ScholarshipFilters,
} from "./scholarships.types";

const ITEMS_PER_PAGE = 18;

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isPastDeadline(deadline: string | null, today: Date): boolean {
  if (!deadline) return false;
  const date = startOfDay(new Date(`${deadline}T00:00:00`));
  return date.getTime() < startOfDay(today).getTime();
}

export function daysUntil(deadline: string | null, today: Date): number | null {
  if (!deadline) return null;
  const d = startOfDay(new Date(`${deadline}T00:00:00`));
  const t = startOfDay(today);
  const diff = d.getTime() - t.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function deadlineStatus(
  days: number | null
): "open" | "far" | "soon" | "urgent" {
  if (days === null) return "open";
  if (days > 30) return "far";
  if (days >= 8) return "soon";
  return "urgent";
}

export function getCategoryBorder(category: ScholarshipCategory): string {
  switch (category) {
    case "national":
      return "border-t-4 border-emerald-600 dark:border-emerald-400";
    case "international":
      return "border-t-4 border-blue-600 dark:border-blue-400";
    case "provincial":
      return "border-t-4 border-amber-500 dark:border-amber-400";
    default:
      return "border-t-4 border-muted";
  }
}

export function getCategoryPill(category: ScholarshipCategory): string {
  switch (category) {
    case "national":
      return "bg-emerald-500/15 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300";
    case "international":
      return "bg-blue-500/15 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300";
    case "provincial":
      return "bg-amber-500/15 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function getFundingPill(fundingType: FundingType): string {
  switch (fundingType) {
    case "fully-funded":
      return "bg-yellow-500/15 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300";
    case "need-based":
      return "bg-red-500/15 text-red-800 dark:bg-red-500/20 dark:text-red-300";
    case "merit-based":
      return "bg-purple-500/15 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300";
    case "partial":
      return "bg-gray-500/15 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function formatDeadline(date: string | null): string {
  if (!date) return "Open deadline";
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function matchesSearch(scholarship: Scholarship, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  return (
    scholarship.title.toLowerCase().includes(q) ||
    scholarship.provider.toLowerCase().includes(q) ||
    scholarship.summary.toLowerCase().includes(q)
  );
}

export function matchesCategory(
  scholarship: Scholarship,
  category: ScholarshipCategory | "all"
): boolean {
  if (category === "all") return true;
  return scholarship.category === category;
}

export function matchesLevel(
  scholarship: Scholarship,
  level: DegreeLevel | "all"
): boolean {
  if (level === "all") return true;
  if (scholarship.level === "any") return true;
  return scholarship.level === level;
}

export function matchesFundingType(
  scholarship: Scholarship,
  fundingType: FundingType | "all"
): boolean {
  if (fundingType === "all") return true;
  return scholarship.fundingType === fundingType;
}

export function matchesDestination(
  scholarship: Scholarship,
  destination: string
): boolean {
  if (destination === "all") return true;
  return scholarship.destination === destination;
}

export function matchesDeadlineRange(
  scholarship: Scholarship,
  deadlineRange: ScholarshipFilters["deadlineRange"],
  today: Date
): boolean {
  if (deadlineRange === "any") return true;
  if (deadlineRange === "open") return scholarship.deadline === null;
  const days = daysUntil(scholarship.deadline, today);
  if (days === null) return false;
  if (deadlineRange === "this-week") return days >= 0 && days <= 7;
  if (deadlineRange === "this-month") return days >= 0 && days <= 30;
  if (deadlineRange === "next-3-months") return days >= 0 && days <= 90;
  return true;
}

export function filterScholarships(
  scholarships: Scholarship[],
  filters: Omit<ScholarshipFilters, "sort" | "page">,
  today = new Date()
): Scholarship[] {
  return scholarships.filter((s) => {
    if (isPastDeadline(s.deadline, today)) return false;
    return (
      matchesSearch(s, filters.search) &&
      matchesCategory(s, filters.category) &&
      matchesLevel(s, filters.level) &&
      matchesFundingType(s, filters.fundingType) &&
      matchesDestination(s, filters.destination) &&
      matchesDeadlineRange(s, filters.deadlineRange, today)
    );
  });
}

export function sortScholarships(
  scholarships: Scholarship[],
  sort: ScholarshipFilters["sort"],
  today = new Date()
): Scholarship[] {
  const list = [...scholarships];
  switch (sort) {
    case "deadline-asc": {
      return list.sort((a, b) => {
        const da = a.deadline ? new Date(`${a.deadline}T00:00:00`).getTime() : Infinity;
        const db = b.deadline ? new Date(`${b.deadline}T00:00:00`).getTime() : Infinity;
        return da - db;
      });
    }
    case "recently-added": {
      return list.sort(
        (a, b) =>
          new Date(`${b.postedAt}T00:00:00`).getTime() -
          new Date(`${a.postedAt}T00:00:00`).getTime()
      );
    }
    case "fully-funded-first": {
      return list.sort((a, b) => {
        if (a.isFullyFunded && !b.isFullyFunded) return -1;
        if (!a.isFullyFunded && b.isFullyFunded) return 1;
        const da = a.deadline ? new Date(`${a.deadline}T00:00:00`).getTime() : Infinity;
        const db = b.deadline ? new Date(`${b.deadline}T00:00:00`).getTime() : Infinity;
        return da - db;
      });
    }
    case "az": {
      return list.sort((a, b) => a.title.localeCompare(b.title));
    }
    default:
      return list;
  }
}

export function paginateScholarships(
  scholarships: Scholarship[],
  page: number
): { pageItems: Scholarship[]; totalPages: number; totalCount: number } {
  const totalPages = Math.max(1, Math.ceil(scholarships.length / ITEMS_PER_PAGE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * ITEMS_PER_PAGE;
  const pageItems = scholarships.slice(start, start + ITEMS_PER_PAGE);
  return { pageItems, totalPages, totalCount: scholarships.length };
}

export function activeFilterCount(
  filters: Omit<ScholarshipFilters, "search" | "sort" | "page">
): number {
  let count = 0;
  if (filters.category !== "all") count++;
  if (filters.level !== "all") count++;
  if (filters.fundingType !== "all") count++;
  if (filters.destination !== "all") count++;
  if (filters.deadlineRange !== "any") count++;
  return count;
}

export function hasActiveFilters(
  filters: Omit<ScholarshipFilters, "search" | "sort" | "page">
): boolean {
  return activeFilterCount(filters) > 0;
}
