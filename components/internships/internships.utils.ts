import type {
  Internship,
  WorkMode,
  WorkType,
  InternshipField,
  InternshipFilters,
} from "./internships.types";

const ITEMS_PER_PAGE = 9;

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

export function getDeadlineUrgency(
  deadline: string | null,
  today = new Date()
): "urgent" | "soon" | "normal" | null {
  const days = daysUntil(deadline, today);
  if (days === null) return null;
  if (days <= 7) return "urgent";
  if (days <= 30) return "soon";
  return "normal";
}

export function getDaysAgo(postedAt: string, today = new Date()): string {
  const posted = startOfDay(new Date(`${postedAt}T00:00:00`));
  const t = startOfDay(today);
  const days = Math.floor((t.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "1 week ago";
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 60) return "1 month ago";
  return `${Math.floor(days / 30)} months ago`;
}

export function getWorkModePill(mode: WorkMode): string {
  switch (mode) {
    case "remote":
      return "bg-blue-500/15 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300";
    case "onsite":
      return "bg-emerald-500/15 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300";
    case "hybrid":
      return "bg-amber-500/15 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function workModeLabel(mode: WorkMode): string {
  return mode.charAt(0).toUpperCase() + mode.slice(1);
}

export function workTypeLabel(type: WorkType): string {
  switch (type) {
    case "internship":
      return "Internship";
    case "part-time":
      return "Part-time";
    case "full-time":
      return "Full-time";
    default:
      return type;
  }
}

export function getFieldPill(): string {
  return "bg-purple-500/15 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300";
}

export function fieldLabel(field: InternshipField): string {
  switch (field) {
    case "software-it":
      return "Software / IT";
    case "marketing":
      return "Marketing";
    case "design":
      return "Design";
    case "finance":
      return "Finance";
    case "sales":
      return "Sales / BD";
    case "engineering":
      return "Engineering";
    case "other":
      return "Other";
    default:
      return field;
  }
}

export function getStipendPill(isPaid: boolean): string {
  return isPaid
    ? "bg-yellow-500/15 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300"
    : "bg-gray-500/15 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300";
}

export function stipendShort(stipend: string | null): string {
  if (!stipend) return "Unpaid";
  // "PKR 40,000/month" -> "Paid · PKR 40k/mo"
  const match = stipend.match(/([\d,]+)/);
  if (!match) return "Paid";
  const amount = parseInt(match[1].replace(/,/g, ""), 10);
  const short = amount >= 1000 ? `${Math.round(amount / 1000)}k` : `${amount}`;
  return `Paid · PKR ${short}/mo`;
}

function stipendAmount(stipend: string | null): number {
  if (!stipend) return -1;
  const match = stipend.match(/([\d,]+)/);
  return match ? parseInt(match[1].replace(/,/g, ""), 10) : 0;
}

export function formatStartDate(startDate: string | null): string {
  return startDate ?? "Rolling start";
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

export function matchesSearch(internship: Internship, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  return (
    internship.title.toLowerCase().includes(q) ||
    internship.company.toLowerCase().includes(q) ||
    internship.summary.toLowerCase().includes(q)
  );
}

export function matchesCategory(
  internship: Internship,
  category: WorkMode | "all"
): boolean {
  if (category === "all") return true;
  return internship.workMode === category;
}

export function matchesWorkType(
  internship: Internship,
  workType: WorkType | "all"
): boolean {
  if (workType === "all") return true;
  return internship.workType === workType;
}

export function matchesStipend(
  internship: Internship,
  stipend: InternshipFilters["stipend"]
): boolean {
  if (stipend === "all") return true;
  if (stipend === "paid") return internship.isPaid;
  return !internship.isPaid;
}

export function matchesCity(internship: Internship, city: string): boolean {
  if (city === "all") return true;
  if (city === "Remote") return internship.city === null || internship.workMode === "remote";
  return internship.city === city;
}

export function matchesDuration(
  internship: Internship,
  duration: InternshipFilters["duration"]
): boolean {
  if (duration === "all") return true;
  const match = internship.duration.match(/(\d+)/);
  if (!match) return false;
  const months = parseInt(match[1], 10);
  if (duration === "1-3") return months >= 1 && months <= 3;
  if (duration === "3-6") return months > 3 && months <= 6;
  if (duration === "6+") return months > 6;
  return true;
}

export function matchesField(
  internship: Internship,
  field: InternshipField | "all"
): boolean {
  if (field === "all") return true;
  return internship.field === field;
}

export function filterInternships(
  internships: Internship[],
  filters: Omit<InternshipFilters, "sort" | "page">,
  today = new Date()
): Internship[] {
  return internships.filter((i) => {
    if (isPastDeadline(i.deadline, today)) return false;
    return (
      matchesSearch(i, filters.search) &&
      matchesCategory(i, filters.category) &&
      matchesWorkType(i, filters.workType) &&
      matchesStipend(i, filters.stipend) &&
      matchesCity(i, filters.city) &&
      matchesDuration(i, filters.duration) &&
      matchesField(i, filters.field)
    );
  });
}

export function sortInternships(
  internships: Internship[],
  sort: InternshipFilters["sort"]
): Internship[] {
  const list = [...internships];
  switch (sort) {
    case "most-recent": {
      return list.sort(
        (a, b) =>
          new Date(`${b.postedAt}T00:00:00`).getTime() -
          new Date(`${a.postedAt}T00:00:00`).getTime()
      );
    }
    case "highest-stipend": {
      return list.sort((a, b) => stipendAmount(b.stipend) - stipendAmount(a.stipend));
    }
    case "closing-soon": {
      return list.sort((a, b) => {
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

export function paginateInternships(
  internships: Internship[],
  page: number
): { pageItems: Internship[]; totalPages: number; totalCount: number } {
  const totalPages = Math.max(1, Math.ceil(internships.length / ITEMS_PER_PAGE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * ITEMS_PER_PAGE;
  const pageItems = internships.slice(start, start + ITEMS_PER_PAGE);
  return { pageItems, totalPages, totalCount: internships.length };
}

export function activeFilterCount(
  filters: Omit<InternshipFilters, "search" | "sort" | "page">
): number {
  let count = 0;
  if (filters.category !== "all") count++;
  if (filters.workType !== "all") count++;
  if (filters.stipend !== "all") count++;
  if (filters.city !== "all") count++;
  if (filters.duration !== "all") count++;
  if (filters.field !== "all") count++;
  return count;
}

export function hasActiveFilters(
  filters: Omit<InternshipFilters, "search" | "sort" | "page">
): boolean {
  return activeFilterCount(filters) > 0;
}
