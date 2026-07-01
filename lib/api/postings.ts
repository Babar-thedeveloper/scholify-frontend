// ═════════════════════════════════════════════════════════════
// Scholify · Postings API
// ───────────────────────────────────────────────────────────────
// Backend returns a unified `PostingDto` for both internships and
// scholarships. This module also provides thin adapters that map
// the DTO into the existing frontend types (`Internship`,
// `Scholarship`) so the current UI components don't need to change.
// ═════════════════════════════════════════════════════════════

import { apiFetch } from "./client";
import type { Internship, InternshipField, WorkMode, WorkType } from "@/components/internships/internships.types";
import type {
  DegreeLevel,
  FundingType,
  Scholarship,
  ScholarshipCategory,
} from "@/components/scholarships/scholarships.types";
import type { Posting } from "@/components/dashboard/dashboard.types";

// ─── DTO from backend ────────────────────────────────────────
export interface PostingDto {
  id: string;
  publicSlug: string;
  type: "internship" | "scholarship";
  title: string;
  description: string | null;
  eligibilityCriteria: string | null;
  deadlineAt: string | null;
  postedAt: string | null;
  createdAt: string;
  applyMethod: "platform" | "external";
  externalUrl: string | null;
  organization: { id: string; name: string; slug: string; verified: boolean };
  workMode: "remote" | "onsite" | "hybrid" | null;
  city: string | null;
  isPaid: boolean | null;
  stipendAmount: string | null;
  stipendCurrency: string | null;
  durationMonths: number | null;
  startDate: string | null;
  fundingAmount: string | null;
  fundingCurrency: string | null;
  countryScope: string | null;
  specificCountry: string | null;
}

export interface ListPostingsResponse {
  items: PostingDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ListPostingsParams {
  type?: "internship" | "scholarship";
  search?: string;
  workMode?: "remote" | "onsite" | "hybrid";
  field?: string;
  city?: string;
  isPaid?: boolean;
  duration?: "1-3" | "3-6" | "6+";
  degreeLevel?: string;
  countryScope?: "pakistan" | "international" | "specific";
  deadlineBefore?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

// ─── Calls ──────────────────────────────────────────────────

export async function listPostings(params: ListPostingsParams = {}): Promise<ListPostingsResponse> {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "" && v !== "all") qs.set(k, String(v));
  }
  const suffix = qs.toString();
  return apiFetch<ListPostingsResponse>(`/api/v1/postings${suffix ? `?${suffix}` : ""}`);
}

export async function getPostingBySlug(slug: string): Promise<PostingDto> {
  const { posting } = await apiFetch<{ posting: PostingDto }>(`/api/v1/postings/${slug}`);
  return posting;
}

/** DTO returned by GET /api/v1/postings/mine — includes org-only fields. */
export interface MyPostingDto extends PostingDto {
  status: "draft" | "active" | "paused" | "closed" | "archived";
  applicantCount: number;
  newApplicantCount: number;
}

export interface MyPostingsResponse {
  items: MyPostingDto[];
  total: number;
}

/** Fetch the current org's own postings (all statuses). Requires auth. */
export async function listMyPostings(): Promise<MyPostingsResponse> {
  return apiFetch<MyPostingsResponse>(`/api/v1/postings/mine`);
}

// ─── Create posting (org side) ──────────────────────────────

interface CreatePostingBase {
  title: string;
  description: string;
  eligibilityCriteria?: string;
  deadlineAt?: string;   // ISO datetime
  applyMethod: "platform" | "external";
  externalUrl?: string;
  publish?: boolean;
}

export interface CreateScholarshipInput extends CreatePostingBase {
  type: "scholarship";
  fundingAmount?: string;
  countryScope?: "pakistan" | "international" | "specific";
  specificCountry?: string;
}

export interface CreateInternshipInput extends CreatePostingBase {
  type: "internship";
  workMode: "remote" | "onsite" | "hybrid";
  city?: string;
  isPaid: boolean;
  stipendAmount?: number;
  stipendCurrency?: string;   // default "PKR"
  durationMonths?: number;
  startDate?: string;         // YYYY-MM-DD
}

export type CreatePostingInput = CreateScholarshipInput | CreateInternshipInput;

export interface CreatePostingResult {
  posting: MyPostingDto;
  message: string;
}

export async function createPosting(input: CreatePostingInput): Promise<CreatePostingResult> {
  return apiFetch<CreatePostingResult>(`/api/v1/postings`, {
    method: "POST",
    body: input,
  });
}

// ─── Org-side lifecycle (edit + status transitions) ─────────
export interface UpdatePostingInput {
  title?: string;
  description?: string;
  eligibilityCriteria?: string | null;
  deadlineAt?: string | null;
  applyMethod?: "platform" | "external";
  externalUrl?: string | null;

  // Scholarship
  fundingAmount?: string | null;
  countryScope?: "pakistan" | "international" | "specific" | null;
  specificCountry?: string | null;

  // Internship
  workMode?: "remote" | "onsite" | "hybrid";
  city?: string | null;
  isPaid?: boolean;
  stipendAmount?: number | null;
  stipendCurrency?: string;
  durationMonths?: number | null;
  startDate?: string | null;
}

export interface PostingResult {
  posting: MyPostingDto;
  message: string;
}

const MANAGE = (id: string) => `/api/v1/postings/manage/${encodeURIComponent(id)}`;

export async function getMyPosting(id: string): Promise<MyPostingDto> {
  const { posting } = await apiFetch<{ posting: MyPostingDto }>(MANAGE(id));
  return posting;
}

export async function updatePosting(id: string, input: UpdatePostingInput): Promise<PostingResult> {
  return apiFetch<PostingResult>(MANAGE(id), { method: "PATCH", body: input });
}

export const publishPosting = (id: string) =>
  apiFetch<PostingResult>(`${MANAGE(id)}/publish`, { method: "POST" });

export const pausePosting = (id: string) =>
  apiFetch<PostingResult>(`${MANAGE(id)}/pause`, { method: "POST" });

export const resumePosting = (id: string) =>
  apiFetch<PostingResult>(`${MANAGE(id)}/resume`, { method: "POST" });

export const closePosting = (id: string) =>
  apiFetch<PostingResult>(`${MANAGE(id)}/close`, { method: "POST" });

export const deletePosting = (id: string) =>
  apiFetch<void>(MANAGE(id), { method: "DELETE" });

/** Adapt a MyPostingDto → the existing dashboard `Posting` shape used by PostingCard. */
export function toDashboardPosting(dto: MyPostingDto): Posting {
  const duration =
    dto.durationMonths != null
      ? `${dto.durationMonths} month${dto.durationMonths === 1 ? "" : "s"}`
      : undefined;
  const stipend =
    dto.isPaid && dto.stipendAmount
      ? `${dto.stipendCurrency ?? "PKR"} ${Number(dto.stipendAmount).toLocaleString()}/month`
      : undefined;

  // Dashboard type doesn't model 'archived' — treat it as 'closed' for UI.
  const status: Posting["status"] = dto.status === "archived" ? "closed" : dto.status;

  return {
    id: dto.id,
    type: dto.type,
    status,
    title: dto.title,
    description: dto.description ?? "",
    organizationId: dto.organization.id,
    organizationName: dto.organization.name,
    postedAt: dto.postedAt ?? dto.createdAt,
    deadlineAt: dto.deadlineAt ?? undefined,
    applyMethod: "platform",
    applicantCount: dto.applicantCount,
    newApplicantCount: dto.newApplicantCount,
    fundingAmount: dto.fundingAmount ?? undefined,
    countryScope: dto.countryScope ?? undefined,
    workMode: dto.workMode ?? undefined,
    city: dto.city ?? undefined,
    isPaid: dto.isPaid ?? undefined,
    stipend,
    duration,
    startDate: dto.startDate ?? undefined,
  };
}

// ─── Adapters — DTO → frontend types ─────────────────────────

function initials(name: string): string {
  return name.trim().split(/\s+/).map((s) => s[0]).slice(0, 2).join("").toUpperCase() || "?";
}

/** Map backend field label heuristically; frontend uses a fixed enum. */
function guessField(title: string, description: string | null): InternshipField {
  const t = `${title} ${description ?? ""}`.toLowerCase();
  if (/design|figma|ux|ui|graphic/.test(t)) return "design";
  if (/marketing|growth|seo|campaign|social/.test(t)) return "marketing";
  if (/finance|accounting|reconciliation/.test(t)) return "finance";
  if (/sales|business dev/.test(t)) return "sales";
  if (/software|engineer|backend|frontend|react|node|api|develop/.test(t)) return "software-it";
  if (/mechanical|electrical|civil/.test(t)) return "engineering";
  return "other";
}

export function toInternship(dto: PostingDto): Internship {
  const orgName = dto.organization.name;
  const duration =
    dto.durationMonths != null
      ? `${dto.durationMonths} month${dto.durationMonths === 1 ? "" : "s"}`
      : "—";
  const stipend =
    dto.isPaid && dto.stipendAmount
      ? `${dto.stipendCurrency ?? "PKR"} ${Number(dto.stipendAmount).toLocaleString()}/month`
      : null;

  return {
    id: dto.id,
    title: dto.title,
    company: orgName,
    companyInitials: initials(orgName),
    workMode: (dto.workMode ?? "onsite") as WorkMode,
    workType: "internship" as WorkType,
    field: guessField(dto.title, dto.description),
    city: dto.city,
    isPaid: !!dto.isPaid,
    stipend,
    duration,
    startDate: dto.startDate,
    // "Apply" button routes to the external site when the org chose external,
    // otherwise to the on-platform posting detail page (where the student applies).
    applyUrl:
      dto.applyMethod === "external" && dto.externalUrl
        ? dto.externalUrl
        : `/postings/${dto.publicSlug}`,
    deadline: dto.deadlineAt ? dto.deadlineAt.slice(0, 10) : null,
    summary: dto.description ?? "",
    postedAt: (dto.postedAt ?? dto.createdAt).slice(0, 10),
  };
}

function guessScholarshipCategory(dto: PostingDto): ScholarshipCategory {
  if (dto.countryScope === "pakistan") return "national";
  if (dto.countryScope === "specific" || dto.countryScope === "international") return "international";
  return "national";
}

function guessDegreeLevel(dto: PostingDto): DegreeLevel {
  const t = `${dto.title} ${dto.description ?? ""} ${dto.eligibilityCriteria ?? ""}`.toLowerCase();
  if (/phd|doctorate|postdoc/.test(t)) return "phd";
  if (/masters|master's|msc|ma /.test(t)) return "masters";
  if (/undergrad|bachelor/.test(t)) return "undergraduate";
  return "any";
}

function guessFundingType(fundingAmount: string | null): FundingType {
  const t = (fundingAmount ?? "").toLowerCase();
  if (/fully funded|full/.test(t)) return "fully-funded";
  if (/need|income/.test(t)) return "need-based";
  if (/merit/.test(t)) return "merit-based";
  return "partial";
}

export function toScholarship(dto: PostingDto): Scholarship {
  return {
    id: dto.id,
    title: dto.title,
    provider: dto.organization.name,
    category: guessScholarshipCategory(dto),
    level: guessDegreeLevel(dto),
    fundingType: guessFundingType(dto.fundingAmount),
    destination: dto.specificCountry ?? (dto.countryScope === "pakistan" ? "Pakistan" : "International"),
    deadline: dto.deadlineAt ? dto.deadlineAt.slice(0, 10) : null,
    applyUrl:
      dto.applyMethod === "external" && dto.externalUrl
        ? dto.externalUrl
        : `/postings/${dto.publicSlug}`,
    summary: dto.description ?? "",
    postedAt: (dto.postedAt ?? dto.createdAt).slice(0, 10),
    isFullyFunded: /fully funded|full/i.test(dto.fundingAmount ?? ""),
  };
}
