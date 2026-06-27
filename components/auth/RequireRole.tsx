"use client";

// ─────────────────────────────────────────────────────────────
// Inline RBAC guard for parts of a page that should only render
// for specific backend roles. Pairs with <RoleGuard> (coarse,
// whole-route) and useHasRole (the hook).
//
// Example: only org admins see the "Delete posting" button:
//   <RequireRole roles={["org_owner", "org_admin"]}>
//     <Button variant="destructive">Delete</Button>
//   </RequireRole>
// ─────────────────────────────────────────────────────────────
import { useUser } from "./UserContext";
import type { BackendRole } from "@/lib/api/auth";

interface RequireRoleProps {
  roles: BackendRole[];
  children: React.ReactNode;
  /** Rendered when the user doesn't match. Default: nothing. */
  fallback?: React.ReactNode;
  /** If true, anyone authenticated passes; `roles` is ignored. */
  anyAuthenticated?: boolean;
}

export function RequireRole({
  roles,
  children,
  fallback = null,
  anyAuthenticated = false,
}: RequireRoleProps) {
  const { isAuthed, hasRole } = useUser();
  if (anyAuthenticated) return <>{isAuthed ? children : fallback}</>;
  return <>{hasRole(...roles) ? children : fallback}</>;
}
