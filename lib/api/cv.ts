// ─────────────────────────────────────────────────────────────
// Scholify · CV API client
// ─────────────────────────────────────────────────────────────
import { apiFetch } from "./client";

export interface WorkExperienceEntry {
  id: string;
  title: string;
  company: string;
  city?: string;
  country?: string;
  startMonth: number;
  startYear: number;
  endMonth?: number;
  endYear?: number;
  isCurrent: boolean;
  description?: string;
}

export interface LanguageEntry {
  id: string;
  language: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Native";
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer?: string;
  year?: number;
}

export interface CvCustomSectionItem {
  id: string;
  heading: string;
  subtitle?: string;
  description?: string;
}

export interface CvCustomSection {
  id: string;
  title: string;
  items: CvCustomSectionItem[];
}

export interface CvDto {
  fullName: string | null;
  email: string;
  phone: string | null;
  dateOfBirth: string | null;
  bio: string | null;
  city: string | null;
  country: string;
  university: string | null;
  degreeLevel: string | null;
  fieldOfStudy: string | null;
  cgpa: string | null;
  expectedGraduationYear: number | null;
  workExperience: WorkExperienceEntry[];
  languages: LanguageEntry[];
  certifications: CertificationEntry[];
  skills: string[];
  templateKey: string;
  customSections: CvCustomSection[];
  /** Europass "About Me" — tailorable personal statement (falls back to profile bio). */
  aboutMe: string | null;
  /** CV subtitle line (e.g. "Computer Science Undergraduate"). */
  headline: string | null;
  /** Raw profile values, used to pre-fill "From Profile" mode. */
  profileDefaults: CvIdentity;
}

export interface CvIdentity {
  fullName?: string;
  phone?: string;
  city?: string;
  country?: string;
  headline?: string;
  university?: string;
  degreeLevel?: string;
  fieldOfStudy?: string;
  cgpa?: string;
}

export interface PatchCvInput {
  workExperience?: WorkExperienceEntry[];
  languages?: LanguageEntry[];
  certifications?: CertificationEntry[];
  skills?: string[];
  templateKey?: "europass" | "modern";
  customSections?: CvCustomSection[];
  aboutMe?: string | null;
  identity?: CvIdentity | null;
}

/**
 * Europass requires reverse-chronological order (most recent first).
 * Current/ongoing roles sort to the very top, then by end date, then start.
 */
export function sortByRecency(list: WorkExperienceEntry[]): WorkExperienceEntry[] {
  const rank = (e: WorkExperienceEntry) =>
    e.isCurrent ? 999999 : (e.endYear ?? e.startYear) * 12 + (e.endMonth ?? 12);
  const startRank = (e: WorkExperienceEntry) => e.startYear * 12 + e.startMonth;
  return [...list].sort((a, b) => rank(b) - rank(a) || startRank(b) - startRank(a));
}

export async function getMyCv(): Promise<CvDto> {
  const { cv } = await apiFetch<{ cv: CvDto }>("/api/v1/users/me/cv");
  return cv;
}

export async function patchMyCv(input: PatchCvInput): Promise<CvDto> {
  const { cv } = await apiFetch<{ cv: CvDto }>("/api/v1/users/me/cv", {
    method: "PATCH",
    body: input,
  });
  return cv;
}
