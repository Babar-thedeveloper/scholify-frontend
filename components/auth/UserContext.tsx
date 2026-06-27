"use client";

// ─────────────────────────────────────────────────────────────
// Real auth context. Backend-backed via lib/api/auth.
//
// What it gives the rest of the app:
//   - `user`       — the logged-in user, or the guest sentinel
//   - `role`       — coarse UI bucket ('guest' | 'student' | 'org')
//   - `roles`      — fine-grained backend roles (for RBAC checks)
//   - `login()`    — wraps the real /login + refreshes context
//   - `signup()`   — wraps the real /signup + refreshes context
//   - `logout()`   — wraps the real /logout + clears context
//   - `refetch()`  — re-hydrate from /me (e.g. after role grant)
//   - `isLoading`  — true until the initial /me check finishes
// ─────────────────────────────────────────────────────────────

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  type AuthUser,
  type BackendRole,
  type LoginInput,
  type LoginResult,
  type SignupInput,
  type SignupResult,
  type UiRole,
  deriveDisplayName,
  deriveInitials,
  deriveUiRole,
  getMe,
  login as loginApi,
  logout as logoutApi,
  signup as signupApi,
} from "@/lib/api/auth";

/** Public-facing user shape. Combines backend `AuthUser` with UI-derived fields. */
export interface User {
  id: string;
  email: string;
  roles: BackendRole[];
  /** Coarse bucket for navbar/sidebar selection. */
  role: UiRole;
  name: string;
  initials: string;
  /** Org context when present (set later by org-switcher). */
  organization?: {
    name: string;
    verified: boolean;
  };
  activeOrgId?: string;
}

const GUEST: User = {
  id: "guest",
  email: "",
  roles: [],
  role: "guest",
  name: "Guest",
  initials: "G",
};

/** Map backend `AuthUser` → frontend `User`. */
function fromAuthUser(a: AuthUser): User {
  const name = deriveDisplayName(a.email);
  return {
    id: a.id,
    email: a.email,
    roles: a.roles,
    role: deriveUiRole(a.roles),
    name,
    initials: deriveInitials(name),
    activeOrgId: a.activeOrgId,
  };
}

interface UserContextValue {
  user: User;
  role: UiRole;
  roles: BackendRole[];
  isAuthed: boolean;
  isLoading: boolean;
  /** Returns { user, message } — show the message via toast. */
  login: (input: LoginInput) => Promise<LoginResult>;
  /** Returns { user, message } but does NOT log the user in
   *  (they must verify their email first). */
  signup: (input: SignupInput) => Promise<SignupResult>;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
  /** Inline RBAC check. */
  hasRole: (...roles: BackendRole[]) => boolean;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(GUEST);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    try {
      const u = await getMe();
      setUser(u ? fromAuthUser(u) : GUEST);
    } catch {
      // Network failure during hydration → behave as guest, don't crash.
      setUser(GUEST);
    }
  }, []);

  // On mount, ask the backend "who am I?" — succeeds if the cookie is valid.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await refetch();
      if (!cancelled) setIsLoading(false);
    })();
    return () => { cancelled = true; };
  }, [refetch]);

  const login = useCallback(async (input: LoginInput): Promise<LoginResult> => {
    const result = await loginApi(input);
    setUser(fromAuthUser(result.user));
    return result;
  }, []);

  const signup = useCallback(async (input: SignupInput): Promise<SignupResult> => {
    // No setUser — verification gate. The user becomes a real session only
    // after they confirm the email and then call login.
    return signupApi(input);
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try { await logoutApi(); } catch { /* still clear locally */ }
    setUser(GUEST);
  }, []);

  const hasRole = useCallback(
    (...roles: BackendRole[]) => roles.some((r) => user.roles.includes(r)),
    [user.roles]
  );

  const value = useMemo<UserContextValue>(
    () => ({
      user,
      role: user.role,
      roles: user.roles,
      isAuthed: user.role !== "guest",
      isLoading,
      login,
      signup,
      logout,
      refetch,
      hasRole,
    }),
    [user, isLoading, login, signup, logout, refetch, hasRole]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}

/** Backward-compat alias for older imports. */
export type UserRole = UiRole;
