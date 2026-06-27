"use client";

// ─────────────────────────────────────────────────────────────
// RBAC hooks.
// Use these for inline UI checks. For whole-route guards, use
// <RoleGuard> (coarse: guest/student/org) or <RequireRole>
// (fine: specific backend roles).
// ─────────────────────────────────────────────────────────────
import { useUser } from "@/components/auth/UserContext";
import type { BackendRole } from "@/lib/api/auth";

/**
 * `useHasRole("org_admin", "org_owner")` → true if the current user has
 * ANY of the listed roles. Passing zero args → false.
 */
export function useHasRole(...roles: BackendRole[]): boolean {
  const { hasRole } = useUser();
  return hasRole(...roles);
}

/** True if the user is logged in (any role). */
export function useIsAuthed(): boolean {
  return useUser().isAuthed;
}

/** True while the initial /me hydration is still running. */
export function useIsAuthLoading(): boolean {
  return useUser().isLoading;
}
