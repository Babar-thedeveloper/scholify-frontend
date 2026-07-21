// ═════════════════════════════════════════════════════════════
// Scholify · Organizations API
// ═════════════════════════════════════════════════════════════
import { apiFetch } from "./client";

const BASE = "/api/v1/organizations";

// ─── Dashboard charts ─────────────────────────────────────────
export interface OrgChartGroup {
  key: string;
  name: string;
  value: number;
}
export interface OrgChartSeriesPoint {
  label: string;
  value: number;
}
export interface OrgCharts {
  applicantsByStatus: OrgChartGroup[];
  postingsByStatus: OrgChartGroup[];
  applicationsMonthly: OrgChartSeriesPoint[];
}

export async function getOrgCharts(): Promise<OrgCharts> {
  const { charts } = await apiFetch<{ charts: OrgCharts }>(`${BASE}/me/charts`);
  return charts;
}

// ─── Profile ─────────────────────────────────────────────────

export interface OrgAddress {
  line1: string | null;
  city: string | null;
  province: string | null;
  country: string;
}

export interface OrgProfileDto {
  id: string;
  slug: string;
  name: string;
  legalName: string | null;
  kind: string | null;
  industry: string | null;
  description: string | null;
  website: string | null;
  country: string;
  verified: boolean;
  verificationStatus: string;
  address: OrgAddress;
  social: Record<string, string>;
  createdAt: string;
}

export interface PublicOrgProfileDto {
  slug: string;
  name: string;
  description: string | null;
  website: string | null;
  industry: string | null;
  kind: string | null;
  country: string;
  verified: boolean;
  social: Record<string, string>;
  activePostingCount: number;
}

export async function getMyOrg(): Promise<OrgProfileDto> {
  const res = await apiFetch<{ profile: OrgProfileDto }>(`${BASE}/me`);
  return res.profile;
}

export interface PatchOrgInput {
  name?: string;
  legalName?: string | null;
  industry?: string | null;
  description?: string | null;
  website?: string | null;
  kind?: string;
  country?: string;
  address?: {
    line1?: string | null;
    city?: string | null;
    province?: string | null;
  };
  social?: {
    linkedin?: string | null;
    twitter?: string | null;
    instagram?: string | null;
    facebook?: string | null;
    youtube?: string | null;
    tiktok?: string | null;
  };
}

export async function patchMyOrg(input: PatchOrgInput): Promise<OrgProfileDto> {
  const res = await apiFetch<{ profile: OrgProfileDto }>(`${BASE}/me`, {
    method: "PATCH",
    body: input,
  });
  return res.profile;
}

export async function getPublicOrg(slug: string): Promise<PublicOrgProfileDto> {
  const res = await apiFetch<{ org: PublicOrgProfileDto }>(`${BASE}/${encodeURIComponent(slug)}`);
  return res.org;
}

// ─── Team ─────────────────────────────────────────────────────

export type TeamRole = "owner" | "admin" | "member";
export type InviteRole = "admin" | "member";

export interface TeamMemberDto {
  userId: string;
  email: string;
  fullName: string | null;
  designation: string | null;
  role: TeamRole;
  joinedAt: string;
  invitedByEmail: string | null;
}

export interface PendingInviteDto {
  id: string;
  email: string;
  role: InviteRole;
  invitedAt: string;
  expiresAt: string;
}

export interface ListTeamResponse {
  members: TeamMemberDto[];
  invitations: PendingInviteDto[];
}

export async function listTeam(): Promise<ListTeamResponse> {
  return apiFetch<ListTeamResponse>(`${BASE}/me/members`);
}

export async function inviteMember(input: { email: string; role: InviteRole }): Promise<PendingInviteDto> {
  const res = await apiFetch<{ invite: PendingInviteDto }>(`${BASE}/me/invitations`, {
    method: "POST",
    body: input,
  });
  return res.invite;
}

export async function patchMemberRole(userId: string, role: InviteRole): Promise<TeamMemberDto> {
  const res = await apiFetch<{ member: TeamMemberDto }>(
    `${BASE}/me/members/${encodeURIComponent(userId)}`,
    { method: "PATCH", body: { role } }
  );
  return res.member;
}

export async function removeMember(userId: string): Promise<void> {
  await apiFetch<void>(`${BASE}/me/members/${encodeURIComponent(userId)}`, { method: "DELETE" });
}

export async function revokeInvitation(id: string): Promise<void> {
  await apiFetch<void>(`${BASE}/me/invitations/${encodeURIComponent(id)}`, { method: "DELETE" });
}

// ─── Invitation acceptance flow (unauthed) ────────────────────

export interface InvitationInfoDto {
  orgName: string;
  role: InviteRole;
  email: string;
  needsSignup: boolean;
  expiresAt: string;
}

export async function getInvitationInfo(token: string): Promise<InvitationInfoDto> {
  return apiFetch<InvitationInfoDto>(
    `${BASE}/invitation-info?token=${encodeURIComponent(token)}`
  );
}

export interface AcceptInviteInput {
  token: string;
  fullName?: string;
  password?: string;
  designation?: string;
}

export async function acceptInvite(input: AcceptInviteInput): Promise<{ message: string; userId: string }> {
  return apiFetch<{ message: string; userId: string }>(`${BASE}/accept-invite`, {
    method: "POST",
    body: input,
  });
}
