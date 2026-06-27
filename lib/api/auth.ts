// ═════════════════════════════════════════════════════════════
// Scholify · Auth API
// ───────────────────────────────────────────────────────────────
// Every call here uses cookie-based auth. The backend sets two
// HTTP-only cookies on /login and /refresh:
//
//   access_token   (15min, JWT containing user.id + roles)
//   refresh_token  (30d, opaque random, scoped to /api/v1/auth/*)
//
// /signup intentionally does NOT set cookies — the user must
// verify their email first via POST /verify-email.
//
// The frontend NEVER reads tokens — the browser sends them
// automatically because every request goes through `apiFetch`
// (lib/api/client.ts) with `credentials: "include"`.
// ═════════════════════════════════════════════════════════════

import { apiFetch } from "./client";

// ─── Types ────────────────────────────────────────────────────

export type BackendRole =
  | "student"
  | "org_owner"
  | "org_admin"
  | "org_recruiter"
  | "org_viewer"
  | "platform_admin"
  | "platform_moderator";

export type UiRole = "guest" | "student" | "org";

export interface AuthUser {
  id: string;
  email: string;
  roles: BackendRole[];
  activeOrgId?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  email: string;
  password: string;
  fullName: string;
}

/** Organization kinds — must match the `organization_kinds` lookup keys. */
export type OrganizationKind =
  | "scholarship_provider"
  | "internship_provider"
  | "both"
  | "government"
  | "ngo"
  | "university"
  | "corporate";

export interface SignupOrgInput {
  email: string;
  password: string;
  contactName: string;
  designation: string;
  organizationName: string;
  organizationType: OrganizationKind | "scholarship-provider" | "internship-provider";
  website?: string;
  country?: string;
}

/** Critical auth endpoints return a `message` for the frontend to surface. */
export interface SignupResult {
  user: AuthUser;
  message: string;
}

export interface SignupOrgResult {
  user: AuthUser;
  organization: { id: string; name: string; slug: string; verified: boolean };
  message: string;
}

export interface LoginResult {
  user: AuthUser;
  message: string;
}

export interface MessageResult {
  message: string;
}

interface MeBody { user: AuthUser }
interface AuthBody { user: AuthUser; message?: string }

// ─── API calls ────────────────────────────────────────────────

const BASE = "/api/v1/auth";

/**
 * Register a new student. Does NOT log the user in — verification
 * email is sent; the user can sign in only after clicking the link.
 */
export async function signup(input: SignupInput): Promise<SignupResult> {
  const body = await apiFetch<AuthBody>(`${BASE}/signup`, {
    method: "POST",
    body: input,
  });
  return { user: body.user, message: body.message ?? "Account created." };
}

/**
 * Register a new organization (creates user + org + owner-membership atomically).
 * Does NOT log the user in — they must verify their email AND wait for org
 * verification (admin reviews within 1–2 business days).
 */
export async function signupOrg(input: SignupOrgInput): Promise<SignupOrgResult> {
  return apiFetch<SignupOrgResult>(`${BASE}/signup-org`, {
    method: "POST",
    body: input,
  });
}

/**
 * Email + password login. Throws `ApiError` with `code = 'EMAIL_NOT_VERIFIED'`
 * (HTTP 403) when the account exists but the email is unverified.
 * Sets the access + refresh cookies on success.
 */
export async function login(input: LoginInput): Promise<LoginResult> {
  const body = await apiFetch<AuthBody>(`${BASE}/login`, {
    method: "POST",
    body: input,
  });
  return { user: body.user, message: body.message ?? "Signed in." };
}

export async function logout(): Promise<void> {
  await apiFetch<void>(`${BASE}/logout`, { method: "POST" });
}

export async function getMe(): Promise<AuthUser | null> {
  try {
    const { user } = await apiFetch<MeBody>(`${BASE}/me`);
    return user;
  } catch (err: unknown) {
    if (err && typeof err === "object" && "status" in err && (err as { status: number }).status === 401) {
      return null;
    }
    throw err;
  }
}

export async function refresh(): Promise<AuthUser> {
  const { user } = await apiFetch<AuthBody>(`${BASE}/refresh`, { method: "POST" });
  return user;
}

/** Confirm an email-verify token from the link sent by the backend. */
export async function verifyEmail(token: string): Promise<MessageResult> {
  return apiFetch<MessageResult>(`${BASE}/verify-email`, {
    method: "POST",
    body: { token },
  });
}

/** Ask the backend to resend the verification email. */
export async function resendVerification(email: string): Promise<MessageResult> {
  return apiFetch<MessageResult>(`${BASE}/resend-verification`, {
    method: "POST",
    body: { email },
  });
}

// ─── Helpers used by UserContext + UI ─────────────────────────

export function deriveUiRole(roles: BackendRole[]): UiRole {
  if (roles.some((r) =>
    r === "org_owner" || r === "org_admin" || r === "org_recruiter" || r === "org_viewer"
  )) return "org";
  if (roles.includes("student")) return "student";
  return "guest";
}

export function deriveDisplayName(email: string): string {
  const local = email.split("@")[0] ?? email;
  return local
    .split(/[._-]/)
    .filter(Boolean)
    .map((s) => s[0]!.toUpperCase() + s.slice(1))
    .join(" ") || email;
}

export function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (name.slice(0, 2) || "?").toUpperCase();
}
