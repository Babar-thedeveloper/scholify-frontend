import { apiFetch } from "./client";

const BASE = "/api/v1/admin";

// ─── Types ────────────────────────────────────────────────────
export interface PlatformStats {
  totalUsers: number;
  totalOrgs: number;
  pendingOrgVerifications: number;
  totalPostings: number;
  activePostings: number;
  totalApplications: number;
  verifiedStudents: number;
}

export interface AdminOrg {
  id: string;
  slug: string;
  name: string;
  website: string | null;
  industry: string | null;
  country: string;
  verificationStatus: "pending" | "approved" | "rejected" | "suspended";
  verifiedAt: string | null;
  createdAt: string;
  memberCount: number;
  activePostingCount: number;
}

export interface AdminStudent {
  id: string;
  email: string;
  fullName: string | null;
  university: string | null;
  isVerifiedStudent: boolean;
  verifiedAt: string | null;
  createdAt: string;
  completionPercent: number;
}

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  payload: Record<string, unknown> | null;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Stats ────────────────────────────────────────────────────
export async function getPlatformStats(): Promise<PlatformStats> {
  const data = await apiFetch<{ stats: PlatformStats }>(`${BASE}/stats`);
  return data.stats;
}

// ─── Orgs ─────────────────────────────────────────────────────
export interface ListOrgsParams {
  status?: "pending" | "approved" | "rejected" | "suspended";
  search?: string;
  page?: number;
  pageSize?: number;
}

export async function listAdminOrgs(params: ListOrgsParams = {}): Promise<PaginatedResponse<AdminOrg>> {
  const qs = new URLSearchParams();
  if (params.status) qs.set("status", params.status);
  if (params.search) qs.set("search", params.search);
  if (params.page) qs.set("page", String(params.page));
  if (params.pageSize) qs.set("pageSize", String(params.pageSize));
  const q = qs.toString();
  return apiFetch<PaginatedResponse<AdminOrg>>(`${BASE}/orgs${q ? `?${q}` : ""}`);
}

export async function getAdminOrg(id: string): Promise<AdminOrg> {
  const data = await apiFetch<{ org: AdminOrg }>(`${BASE}/orgs/${id}`);
  return data.org;
}

export async function verifyOrg(
  id: string,
  action: "approved" | "rejected" | "suspended",
  reason?: string,
): Promise<AdminOrg> {
  const data = await apiFetch<{ org: AdminOrg }>(`${BASE}/orgs/${id}/verify`, {
    method: "PATCH",
    body: { action, reason },
  });
  return data.org;
}

// ─── Students ─────────────────────────────────────────────────
export interface ListStudentsParams {
  search?: string;
  verified?: boolean;
  page?: number;
  pageSize?: number;
}

export async function listAdminStudents(params: ListStudentsParams = {}): Promise<PaginatedResponse<AdminStudent>> {
  const qs = new URLSearchParams();
  if (params.search) qs.set("search", params.search);
  if (params.verified !== undefined) qs.set("verified", String(params.verified));
  if (params.page) qs.set("page", String(params.page));
  if (params.pageSize) qs.set("pageSize", String(params.pageSize));
  const q = qs.toString();
  return apiFetch<PaginatedResponse<AdminStudent>>(`${BASE}/students${q ? `?${q}` : ""}`);
}

export async function verifyStudent(id: string, verified: boolean): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`${BASE}/students/${id}/verify`, {
    method: "PATCH",
    body: { verified },
  });
}

// ─── Feature flags ────────────────────────────────────────────
export async function listFeatureFlags(): Promise<FeatureFlag[]> {
  const data = await apiFetch<{ flags: FeatureFlag[] }>(`${BASE}/feature-flags`);
  return data.flags;
}

export async function patchFeatureFlag(
  key: string,
  enabled: boolean,
  payload?: Record<string, unknown> | null,
): Promise<FeatureFlag> {
  const data = await apiFetch<{ flag: FeatureFlag }>(`${BASE}/feature-flags/${key}`, {
    method: "PATCH",
    body: { enabled, payload },
  });
  return data.flag;
}

// ─── Admin postings ───────────────────────────────────────────
export interface AdminPosting {
  id: string;
  slug: string;
  title: string;
  type: "scholarship" | "internship";
  status: "draft" | "active" | "paused" | "closed";
  orgId: string;
  orgName: string;
  isPlatformPost: boolean;
  deadlineAt: string | null;
  applicantCount: number;
  createdAt: string;
}

export interface ListAdminPostingsParams {
  status?: "draft" | "active" | "paused" | "closed";
  type?: "scholarship" | "internship";
  orgId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export async function listAdminPostings(params: ListAdminPostingsParams = {}): Promise<PaginatedResponse<AdminPosting>> {
  const qs = new URLSearchParams();
  if (params.status) qs.set("status", params.status);
  if (params.type) qs.set("type", params.type);
  if (params.orgId) qs.set("orgId", params.orgId);
  if (params.search) qs.set("search", params.search);
  if (params.page) qs.set("page", String(params.page));
  if (params.pageSize) qs.set("pageSize", String(params.pageSize));
  const q = qs.toString();
  return apiFetch<PaginatedResponse<AdminPosting>>(`${BASE}/postings${q ? `?${q}` : ""}`);
}

export async function forcePostingStatus(
  id: string,
  status: "draft" | "active" | "paused" | "closed",
  reason?: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`${BASE}/postings/${id}/status`, {
    method: "PATCH",
    body: { status, reason },
  });
}

export async function adminDeletePosting(id: string): Promise<void> {
  await apiFetch<void>(`${BASE}/postings/${id}`, { method: "DELETE" });
}

export interface CreatePlatformPostingInput {
  type: "scholarship" | "internship";
  title: string;
  description: string;
  eligibilityCriteria?: string;
  deadlineAt?: string;
  applyMethod: "platform" | "external";
  externalUrl?: string;
  publish?: boolean;
  // Scholarship
  fundingAmount?: string;
  countryScope?: "pakistan" | "international" | "specific";
  specificCountry?: string;
  // Internship
  workMode?: "remote" | "onsite" | "hybrid";
  city?: string;
  isPaid?: boolean;
  stipendAmount?: number;
  stipendCurrency?: string;
  durationMonths?: number;
  startDate?: string;
}

export async function createPlatformPosting(
  input: CreatePlatformPostingInput,
): Promise<{ message: string; slug: string }> {
  return apiFetch<{ message: string; slug: string }>(`${BASE}/postings`, {
    method: "POST",
    body: input,
  });
}

// ─── Admin users ──────────────────────────────────────────────
export interface AdminUser {
  id: string;
  email: string;
  emailVerifiedAt: string | null;
  createdAt: string;
  roles: string[];
}

export interface ListAdminUsersParams {
  search?: string;
  role?: string;
  page?: number;
  pageSize?: number;
}

export async function listAdminUsers(params: ListAdminUsersParams = {}): Promise<PaginatedResponse<AdminUser>> {
  const qs = new URLSearchParams();
  if (params.search) qs.set("search", params.search);
  if (params.role) qs.set("role", params.role);
  if (params.page) qs.set("page", String(params.page));
  if (params.pageSize) qs.set("pageSize", String(params.pageSize));
  const q = qs.toString();
  return apiFetch<PaginatedResponse<AdminUser>>(`${BASE}/users${q ? `?${q}` : ""}`);
}

export async function assignUserRole(
  userId: string,
  role: string,
  grant: boolean,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`${BASE}/users/${userId}/roles`, {
    method: "PATCH",
    body: { role, grant },
  });
}
