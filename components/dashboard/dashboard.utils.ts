import type { ApplicationStatus, ApplicationType } from "./dashboard.types";

// ─── Application ID generation ───────────────────────────────
// Format: {PREFIX}-{YEAR}-{6-digit padded}
//   Scholarship: SCH-2026-000047
//   Internship:  INT-2026-000023
//   External:    EXT-2026-000005
export function generateApplicationId(
  type: ApplicationType,
  isExternal: boolean,
  seq: number,
  year = new Date().getFullYear()
): string {
  const prefix = isExternal ? "EXT" : type === "scholarship" ? "SCH" : "INT";
  return `${prefix}-${year}-${String(seq).padStart(6, "0")}`;
}

// ─── Status labels ───────────────────────────────────────────
const STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  "under-review": "Under Review",
  shortlisted: "Shortlisted",
  interview: "Interview",
  accepted: "Accepted",
  "not-selected": "Not Selected",
  withdrawn: "Withdrawn",
  "external-applied": "Applied externally",
};

export function formatStatus(status: ApplicationStatus): string {
  return STATUS_LABELS[status];
}

// ─── Status progression (for the stepper on detail pages) ────
// The happy-path lifecycle. Terminal/branch states handled separately.
export const STATUS_FLOW: ApplicationStatus[] = [
  "submitted",
  "under-review",
  "shortlisted",
  "accepted",
];

export function statusStepIndex(status: ApplicationStatus): number {
  switch (status) {
    case "draft":
      return -1;
    case "submitted":
      return 0;
    case "under-review":
      return 1;
    case "shortlisted":
    case "interview":
      return 2;
    case "accepted":
    case "not-selected":
      return 3;
    default:
      return -1;
  }
}

// Statuses an org can transition an application into.
export const ORG_STATUS_OPTIONS: ApplicationStatus[] = [
  "submitted",
  "under-review",
  "shortlisted",
  "interview",
  "accepted",
  "not-selected",
];

// ─── Date helpers ────────────────────────────────────────────
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function daysUntil(iso?: string): number | null {
  if (!iso) return null;
  const target = new Date(iso).getTime();
  const now = Date.now();
  return Math.ceil((target - now) / MS_PER_DAY);
}

export function formatDeadline(iso?: string): string {
  if (!iso) return "No deadline";
  const d = new Date(iso);
  const label = d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const left = daysUntil(iso);
  if (left === null) return label;
  if (left < 0) return `${label} (closed)`;
  if (left === 0) return `${label} (closes today)`;
  return `${label} (${left} ${left === 1 ? "day" : "days"} left)`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}
