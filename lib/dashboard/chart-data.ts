import type { CSSProperties } from "react";

/**
 * Dashboard chart theming + helpers. Data itself comes from the
 * backend aggregation endpoints — no dummy fallbacks.
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

/** Maps a backend category `key` → themed color. */
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
