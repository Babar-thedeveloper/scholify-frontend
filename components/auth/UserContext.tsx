"use client";

// ─────────────────────────────────────────────────────────────
// MOCK AUTH. Real authentication (Fastify + session/JWT) will
// replace this provider. Until then we keep a fake user in React
// state, persisted to localStorage so role survives refreshes.
// Swap `useUser()` consumers to the real session hook later.
// ─────────────────────────────────────────────────────────────

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type UserRole = "guest" | "student" | "org";

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  initials: string;
  organization?: {
    name: string;
    type: "scholarship-provider" | "internship-provider";
    logo?: string;
    verified: boolean;
  };
}

// Canned identities per role for the mock.
const MOCK_USERS: Record<Exclude<UserRole, "guest">, User> = {
  student: {
    id: "stu_ayesha",
    role: "student",
    name: "Ayesha Khan",
    email: "ayesha@nust.edu.pk",
    initials: "AK",
  },
  org: {
    id: "org_daraz",
    role: "org",
    name: "Daraz Pakistan",
    email: "hr@daraz.pk",
    initials: "D",
    organization: {
      name: "Daraz Pakistan",
      type: "internship-provider",
      verified: true,
    },
  },
};

const GUEST: User = {
  id: "guest",
  role: "guest",
  name: "Guest",
  email: "",
  initials: "G",
};

interface UserContextValue {
  user: User;
  role: UserRole;
  setRole: (role: UserRole) => void;
  logout: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextValue | null>(null);

const STORAGE_KEY = "scholify:mock-role";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("guest");
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage on mount (client only).
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as UserRole | null;
      if (saved === "student" || saved === "org" || saved === "guest") {
        setRoleState(saved);
      }
    } catch {
      /* ignore */
    }
    setIsLoading(false);
  }, []);

  const setRole = useCallback((next: UserRole) => {
    setRoleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const logout = useCallback(() => setRole("guest"), [setRole]);

  const user = role === "guest" ? GUEST : MOCK_USERS[role];

  const value = useMemo<UserContextValue>(
    () => ({ user, role, setRole, logout, isLoading }),
    [user, role, setRole, logout, isLoading]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}
