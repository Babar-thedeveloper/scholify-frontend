import type { CSSProperties } from "react";

/**
 * DUMMY dashboard chart data — frontend-only for now.
 * Categories mirror the backend seeded lookups (application_statuses,
 * posting_statuses, verification_statuses, roles). Swap these arrays for
 * real aggregation-endpoint data once wired.
 */

export interface DonutDatum {
  name: string;
  value: number;
  color: string;
}

export interface BarDatum {
  label: string;
  value: number;
}

/** Theme-aligned palette — emerald-led, matching the app's StatusBadge hues. */
export const CHART_COLORS = {
  emerald: "#059669", // active / accepted / approved
  emeraldLight: "#34d399",
  teal: "#14b8a6",
  blue: "#3b82f6", // submitted
  amber: "#f59e0b", // under review / paused / pending
  violet: "#8b5cf6", // shortlisted
  indigo: "#6366f1", // interview
  rose: "#f43f5e", // not selected / closed / rejected
  slate: "#94a3b8", // draft / withdrawn / archived / suspended
} as const;

/** Shared themed tooltip styling (adapts to light/dark via CSS vars). */
export const CHART_TOOLTIP_STYLE: CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  fontSize: "12px",
  padding: "8px 12px",
  boxShadow: "0 8px 24px -12px rgba(0,0,0,0.25)",
  color: "var(--foreground)",
};

/** Maps a backend category `key` → themed color, so API data colors match the dummy. */
export const STATUS_COLOR: Record<string, string> = {
  // application statuses
  submitted: CHART_COLORS.blue,
  under_review: CHART_COLORS.amber,
  shortlisted: CHART_COLORS.violet,
  interview: CHART_COLORS.indigo,
  accepted: CHART_COLORS.emerald,
  not_selected: CHART_COLORS.rose,
  withdrawn: CHART_COLORS.slate,
  // user roles
  student: CHART_COLORS.emerald,
  org: CHART_COLORS.blue,
  admin: CHART_COLORS.amber,
  // verification statuses
  approved: CHART_COLORS.emerald,
  pending: CHART_COLORS.amber,
  rejected: CHART_COLORS.rose,
  suspended: CHART_COLORS.slate,
  // posting statuses
  active: CHART_COLORS.emerald,
  closed: CHART_COLORS.rose,
  draft: CHART_COLORS.slate,
  archived: CHART_COLORS.teal,
  paused: CHART_COLORS.amber,
};

/** Convert backend `{key,name,value}` groups into themed donut data. */
export function toDonutData(groups: { key: string; name: string; value: number }[]): DonutDatum[] {
  return groups.map((g) => ({
    name: g.name,
    value: g.value,
    color: STATUS_COLOR[g.key] ?? CHART_COLORS.slate,
  }));
}

// ── Student ───────────────────────────────────────────────
// application_statuses: draft, submitted, under_review, shortlisted,
// interview, accepted, not_selected, withdrawn
export const studentStatusData: DonutDatum[] = [
  { name: "Submitted", value: 6, color: CHART_COLORS.blue },
  { name: "Under Review", value: 4, color: CHART_COLORS.amber },
  { name: "Shortlisted", value: 2, color: CHART_COLORS.violet },
  { name: "Interview", value: 1, color: CHART_COLORS.indigo },
  { name: "Accepted", value: 1, color: CHART_COLORS.emerald },
  { name: "Not Selected", value: 3, color: CHART_COLORS.rose },
  { name: "Withdrawn", value: 1, color: CHART_COLORS.slate },
];

export const studentActivityData: BarDatum[] = [
  { label: "Feb", value: 1 },
  { label: "Mar", value: 2 },
  { label: "Apr", value: 3 },
  { label: "May", value: 2 },
  { label: "Jun", value: 4 },
  { label: "Jul", value: 3 },
];

// ── Organization ──────────────────────────────────────────
// Applicant statuses visible to an org (submitted onward).
export const orgApplicantStatusData: DonutDatum[] = [
  { name: "Submitted", value: 12, color: CHART_COLORS.blue },
  { name: "Under Review", value: 8, color: CHART_COLORS.amber },
  { name: "Shortlisted", value: 5, color: CHART_COLORS.violet },
  { name: "Interview", value: 3, color: CHART_COLORS.indigo },
  { name: "Accepted", value: 3, color: CHART_COLORS.emerald },
  { name: "Not Selected", value: 6, color: CHART_COLORS.rose },
];

export const orgApplicationsData: BarDatum[] = [
  { label: "Feb", value: 9 },
  { label: "Mar", value: 14 },
  { label: "Apr", value: 11 },
  { label: "May", value: 18 },
  { label: "Jun", value: 22 },
  { label: "Jul", value: 16 },
];

// posting_statuses: draft, active, paused, closed, archived
export const orgPostingStatusData: DonutDatum[] = [
  { name: "Draft", value: 2, color: CHART_COLORS.slate },
  { name: "Active", value: 5, color: CHART_COLORS.emerald },
  { name: "Paused", value: 1, color: CHART_COLORS.amber },
  { name: "Closed", value: 3, color: CHART_COLORS.rose },
];

// ── Admin (platform) ──────────────────────────────────────
export const adminUsersByRoleData: DonutDatum[] = [
  { name: "Students", value: 320, color: CHART_COLORS.emerald },
  { name: "Org members", value: 62, color: CHART_COLORS.blue },
  { name: "Admins", value: 6, color: CHART_COLORS.amber },
];

// verification_statuses: pending, approved, rejected, suspended
export const adminOrgVerificationData: DonutDatum[] = [
  { name: "Approved", value: 41, color: CHART_COLORS.emerald },
  { name: "Pending", value: 9, color: CHART_COLORS.amber },
  { name: "Rejected", value: 4, color: CHART_COLORS.rose },
  { name: "Suspended", value: 2, color: CHART_COLORS.slate },
];

export const adminPostingStatusData: DonutDatum[] = [
  { name: "Active", value: 86, color: CHART_COLORS.emerald },
  { name: "Closed", value: 39, color: CHART_COLORS.rose },
  { name: "Draft", value: 14, color: CHART_COLORS.slate },
  { name: "Archived", value: 12, color: CHART_COLORS.teal },
  { name: "Paused", value: 7, color: CHART_COLORS.amber },
];

export const adminSignupsData: BarDatum[] = [
  { label: "Feb", value: 24 },
  { label: "Mar", value: 41 },
  { label: "Apr", value: 38 },
  { label: "May", value: 57 },
  { label: "Jun", value: 72 },
  { label: "Jul", value: 63 },
];

export const adminApplicationsData: BarDatum[] = [
  { label: "Feb", value: 86 },
  { label: "Mar", value: 132 },
  { label: "Apr", value: 118 },
  { label: "May", value: 174 },
  { label: "Jun", value: 210 },
  { label: "Jul", value: 165 },
];

export const adminPostingsCreatedData: BarDatum[] = [
  { label: "Feb", value: 8 },
  { label: "Mar", value: 15 },
  { label: "Apr", value: 12 },
  { label: "May", value: 19 },
  { label: "Jun", value: 24 },
  { label: "Jul", value: 17 },
];
