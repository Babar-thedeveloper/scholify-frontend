"use client";

import { useEffect, useState } from "react";
import { getSidebarCounts, type SidebarCountsDto } from "@/lib/api/users";

interface UseSidebarCountsReturn {
  counts: SidebarCountsDto;
  loading: boolean;
  error: Error | null;
}

export function useSidebarCounts(): UseSidebarCountsReturn {
  const [counts, setCounts] = useState<SidebarCountsDto>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    getSidebarCounts()
      .then((data) => {
        if (!cancelled) {
          setCounts(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { counts, loading, error };
}
