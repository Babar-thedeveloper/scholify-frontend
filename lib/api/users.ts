// ═════════════════════════════════════════════════════════════
// Scholify · User profile API
// ═════════════════════════════════════════════════════════════
import { apiFetch } from "./client";

export type DegreeLevelKey = "undergraduate" | "masters" | "phd" | "postdoc" | "diploma";
export type ProvinceKey = "punjab" | "sindh" | "kpk" | "balochistan" | "gb" | "ajk" | "islamabad";

export interface ProfileDto {
  user: { id: string; email: string; emailVerified: boolean };
  personal: {
    fullName: string | null;
    dateOfBirth: string | null;
    phone: string | null;
    whatsapp: string | null;
    bio: string | null;
    profilePhotoUrl: string | null;
  };
  academic: {
    universityId: string | null;
    universityName: string | null;
    universityOther: string | null;
    degreeLevel: DegreeLevelKey | null;
    currentYear: number | null;
    fieldOfStudyId: string | null;
    fieldOfStudyName: string | null;
    cgpa: string | null;
    expectedGraduationYear: number | null;
  };
  address: {
    line1: string | null;
    city: string | null;
    provinceKey: ProvinceKey | null;
    postalCode: string | null;
  };
  verification: {
    isVerifiedStudent: boolean;
    verifiedAt: string | null;
  };
  completionPercent: number;
  discoverable: boolean;
}

export interface PatchProfileInput {
  personal?: {
    fullName?: string | null;
    dateOfBirth?: string | null;    // YYYY-MM-DD
    phone?: string | null;
    whatsapp?: string | null;
    bio?: string | null;
  };
  academic?: {
    universityOther?: string | null;
    degreeLevel?: DegreeLevelKey | null;
    currentYear?: number | null;
    fieldOfStudyOther?: string | null;
    cgpa?: number | null;
    expectedGraduationYear?: number | null;
  };
  address?: {
    line1?: string | null;
    city?: string | null;
    province?: ProvinceKey | null;
    postalCode?: string | null;
  };
  discoverable?: boolean;
}

export interface PatchProfileResult {
  profile: ProfileDto;
  message: string;
}

const BASE = "/api/v1/users";

export async function getMyProfile(): Promise<ProfileDto> {
  const { profile } = await apiFetch<{ profile: ProfileDto }>(`${BASE}/me/profile`);
  return profile;
}

export async function patchMyProfile(input: PatchProfileInput): Promise<PatchProfileResult> {
  return apiFetch<PatchProfileResult>(`${BASE}/me/profile`, {
    method: "PATCH",
    body: input,
  });
}

// ─── Sidebar badge counts ───────────────────────────────────
export interface SidebarCountsDto {
  student?: {
    applications: number;
    saved: number;
    reminders: number;
    completionPercent: number;
  };
  organization?: {
    postings: number;
    applicants: number;
    drafts: number;
  };
}

export async function getSidebarCounts(): Promise<SidebarCountsDto> {
  const { counts } = await apiFetch<{ counts: SidebarCountsDto }>(`${BASE}/me/sidebar-counts`);
  return counts;
}

// ─── Frontend-friendly labels ────────────────────────────────
export const DEGREE_LABEL: Record<DegreeLevelKey, string> = {
  undergraduate: "Undergraduate",
  masters: "Masters",
  phd: "PhD",
  postdoc: "Postdoctoral",
  diploma: "Diploma",
};

export const PROVINCE_LABEL: Record<ProvinceKey, string> = {
  punjab: "Punjab",
  sindh: "Sindh",
  kpk: "Khyber Pakhtunkhwa",
  balochistan: "Balochistan",
  gb: "Gilgit-Baltistan",
  ajk: "Azad Kashmir",
  islamabad: "Islamabad Capital Territory",
};
