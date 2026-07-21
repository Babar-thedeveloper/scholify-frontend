"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const TARGETS: Record<string, string> = {
  student: "/scholarships",
  org: "/org/search",
  admin: "/admin/students",
};

const PLACEHOLDERS: Record<string, string> = {
  student: "Search scholarships…",
  org: "Search applicants…",
  admin: "Search students…",
};

export function TopbarSearch({ variant }: { variant: "student" | "org" | "admin" }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const target = TARGETS[variant] ?? "/scholarships";
    const query = q.trim();
    router.push(query ? `${target}?search=${encodeURIComponent(query)}` : target);
  }

  return (
    <form onSubmit={onSubmit} className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={PLACEHOLDERS[variant] ?? "Search…"}
        aria-label="Search"
        className="h-9 w-full rounded-full border border-border bg-muted/40 pl-10 pr-14 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-emerald-400 focus:bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:bg-input/30"
      />
      <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
        ⌘K
      </kbd>
    </form>
  );
}
