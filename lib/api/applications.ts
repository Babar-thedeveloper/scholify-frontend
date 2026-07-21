// ═════════════════════════════════════════════════════════════
// Scholify · Applications API
// ═════════════════════════════════════════════════════════════
import { apiFetch } from "./client";

export type ApplicationStatusKey =
  | "draft"
  | "submitted"
  | "under_review"
  | "shortlisted"
  | "interview"
  | "accepted"
  | "not_selected"
  | "withdrawn";

/** DTO returned by the backend applications endpoints. */
export interface ApplicationDto {
  publicId: string;
  postingId: string;
  postingSlug: string;
  postingTitle: string;
  type: "internship" | "scholarship";
  organizationName: string;
  status: ApplicationStatusKey;
  submittedAt: string | null;
  lastStatusChangeAt: string;
  createdAt: string;
  deadlineAt: string | null;
  coverLetter: string | null;
  location: string | null;
  stipendAmount: string | null;
  fundingAmount: string | null;
}

export interface SubmitApplicationInput {
  postingSlug: string;
  coverLetter?: string;
}

export interface SubmitApplicationResult {
  application: ApplicationDto;
  message: string;
}

export interface ListMyApplicationsParams {
  status?: ApplicationStatusKey;
  type?: "internship" | "scholarship";
  page?: number;
  pageSize?: number;
}

export interface ListMyApplicationsResponse {
  items: ApplicationDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TimelineEventDto {
  id: string;
  eventType: "submission" | "status_change" | "note" | "message" | "attachment" | "view";
  description: string | null;
  fromStatus: ApplicationStatusKey | null;
  toStatus: ApplicationStatusKey | null;
  actorKind: "student" | "organization" | "system";
  occurredAt: string;
}

export interface ApplicationDetailDto extends ApplicationDto {
  timeline: TimelineEventDto[];
}

// ─── Calls ───────────────────────────────────────────────────

const BASE = "/api/v1/applications";

export async function submitApplication(
  input: SubmitApplicationInput
): Promise<SubmitApplicationResult> {
  return apiFetch<SubmitApplicationResult>(BASE, { method: "POST", body: input });
}

export async function listMyApplications(
  params: ListMyApplicationsParams = {}
): Promise<ListMyApplicationsResponse> {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  }
  const suffix = qs.toString();
  return apiFetch<ListMyApplicationsResponse>(`${BASE}${suffix ? `?${suffix}` : ""}`);
}

// ─── Dashboard charts ────────────────────────────────────────
export interface ChartGroup {
  key: string;
  name: string;
  value: number;
}
export interface ChartSeriesPoint {
  label: string;
  value: number;
}
export interface StudentCharts {
  statusBreakdown: ChartGroup[];
  monthly: ChartSeriesPoint[];
}

export async function getStudentCharts(): Promise<StudentCharts> {
  const { charts } = await apiFetch<{ charts: StudentCharts }>(`${BASE}/me/charts`);
  return charts;
}

/** Full detail + chronological timeline for one of MY applications. */
export async function getApplicationDetail(publicId: string): Promise<ApplicationDetailDto> {
  const { application } = await apiFetch<{ application: ApplicationDetailDto }>(
    `${BASE}/${encodeURIComponent(publicId)}`
  );
  return application;
}

export interface WithdrawResult {
  application: ApplicationDto;
  message: string;
}

/** Withdraw one of MY applications. Rejected by the backend for terminal states. */
export async function withdrawApplication(publicId: string): Promise<WithdrawResult> {
  return apiFetch<WithdrawResult>(
    `${BASE}/${encodeURIComponent(publicId)}/withdraw`,
    { method: "POST" }
  );
}

// ═════════════════════════════════════════════════════════════
// Org side — applicants list + detail + status change
// ═════════════════════════════════════════════════════════════

export interface OrgApplicantDto {
  publicId: string;
  postingId: string;
  postingTitle: string;
  postingSlug: string;
  postingType: "internship" | "scholarship";
  status: ApplicationStatusKey;
  submittedAt: string | null;
  lastStatusChangeAt: string;
  createdAt: string;
  coverLetter: string | null;
  student: {
    id: string;
    email: string;
    fullName: string | null;
    initials: string;
    university: string | null;
    degreeLevel: string | null;
    fieldOfStudy: string | null;
    cgpa: string | null;
    isVerifiedStudent: boolean;
  };
}

export interface ListOrgApplicantsParams {
  postingId?: string;
  status?: ApplicationStatusKey;
  university?: string;
  field?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: "recent" | "oldest" | "gpa_desc" | "name_asc";
  page?: number;
  pageSize?: number;
}

export interface ListOrgApplicantsResponse {
  items: OrgApplicantDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const MANAGE = `${BASE}/manage`;

export async function listOrgApplicants(
  params: ListOrgApplicantsParams = {}
): Promise<ListOrgApplicantsResponse> {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  }
  const suffix = qs.toString();
  return apiFetch<ListOrgApplicantsResponse>(`${MANAGE}${suffix ? `?${suffix}` : ""}`);
}

export async function getApplicantForOrg(publicId: string): Promise<OrgApplicantDto> {
  const { applicant } = await apiFetch<{ applicant: OrgApplicantDto }>(
    `${MANAGE}/${encodeURIComponent(publicId)}`
  );
  return applicant;
}

/** Statuses an org can transition into. */
export type OrgTargetStatus =
  | "under_review"
  | "shortlisted"
  | "interview"
  | "accepted"
  | "not_selected";

export interface ChangeStatusInput {
  status: OrgTargetStatus;
  internalNote?: string;
  studentNote?: string;
  notifyByEmail?: boolean;
}

export interface ChangeStatusResult {
  applicant: OrgApplicantDto;
  message: string;
}

export async function changeApplicantStatus(
  publicId: string,
  input: ChangeStatusInput
): Promise<ChangeStatusResult> {
  return apiFetch<ChangeStatusResult>(
    `${MANAGE}/${encodeURIComponent(publicId)}/status`,
    { method: "PATCH", body: input }
  );
}

// ─── Frontend-friendly labels ────────────────────────────────
export const APPLICATION_STATUS_LABEL: Record<ApplicationStatusKey, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under review",
  shortlisted: "Shortlisted",
  interview: "Interview",
  accepted: "Accepted",
  not_selected: "Not selected",
  withdrawn: "Withdrawn",
};

export const APPLICATION_STATUS_COLOR: Record<ApplicationStatusKey, string> = {
  draft:        "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  submitted:    "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  under_review: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  shortlisted:  "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  interview:    "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  accepted:     "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200",
  not_selected: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  withdrawn:    "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
};
