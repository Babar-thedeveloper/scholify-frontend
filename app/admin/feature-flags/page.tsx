"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Flag, RefreshCw } from "lucide-react";
import { listFeatureFlags, patchFeatureFlag, type FeatureFlag } from "@/lib/api/admin";

export default function AdminFeatureFlagsPage() {
  const [flags, setFlags] = useState<FeatureFlag[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  function load() {
    setError(null);
    listFeatureFlags()
      .then(setFlags)
      .catch((e) => setError(e?.message ?? "Failed to load"));
  }

  useEffect(() => { load(); }, []);

  async function toggle(flag: FeatureFlag) {
    setToggling(flag.key);
    try {
      const updated = await patchFeatureFlag(flag.key, !flag.enabled, flag.payload);
      setFlags((prev) =>
        prev ? prev.map((f) => (f.key === flag.key ? updated : f)) : prev
      );
    } catch (e: unknown) {
      setError((e as { message?: string })?.message ?? "Toggle failed");
    } finally {
      setToggling(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Feature Flags</h1>
          <p className="text-sm text-muted-foreground">Toggle platform features without a deploy.</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
        >
          <RefreshCw className="size-3.5" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertTriangle className="size-4 shrink-0" /> {error}
        </div>
      )}

      {!flags && !error && (
        <div className="text-sm text-muted-foreground">Loading…</div>
      )}

      {flags?.length === 0 && (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          <Flag className="mx-auto mb-2 size-8 opacity-30" />
          <p className="text-sm">No feature flags configured yet.</p>
          <p className="text-xs mt-1">Flags are created automatically when first toggled via PATCH /admin/feature-flags/:key.</p>
        </div>
      )}

      {flags && flags.length > 0 && (
        <div className="divide-y divide-border rounded-xl border border-border bg-white dark:bg-card">
          {flags.map((flag) => (
            <div key={flag.key} className="flex items-center justify-between px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-sm font-medium text-foreground">{flag.key}</p>
                <p className="text-xs text-muted-foreground">
                  Last updated {new Date(flag.updatedAt).toLocaleString("en-PK")}
                </p>
                {flag.payload && (
                  <pre className="mt-1.5 max-w-md overflow-x-auto rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                    {JSON.stringify(flag.payload, null, 2)}
                  </pre>
                )}
              </div>
              <button
                disabled={toggling === flag.key}
                onClick={() => toggle(flag)}
                className={`ml-6 shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 ${
                  flag.enabled ? "bg-emerald-500" : "bg-muted-foreground/30"
                }`}
                role="switch"
                aria-checked={flag.enabled}
                aria-label={`Toggle ${flag.key}`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                    flag.enabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
