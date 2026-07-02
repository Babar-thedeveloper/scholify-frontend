// ─────────────────────────────────────────────────────────────
// Scholify · CV API client
// ─────────────────────────────────────────────────────────────
import { apiFetch } from "./client";

export interface WorkExperienceEntry {
  id: string;
  title: string;
  company: string;
  city?: string;
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
}

export interface PatchCvInput {
  workExperience?: WorkExperienceEntry[];
  languages?: LanguageEntry[];
  certifications?: CertificationEntry[];
  skills?: string[];
  templateKey?: "europass" | "modern";
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
