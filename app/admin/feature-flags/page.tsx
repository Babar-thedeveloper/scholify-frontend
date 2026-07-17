"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Flag, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
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
        <Button
          variant="outline"
          size="sm"
          onClick={load}
          className="gap-1.5"
        >
          <RefreshCw className="size-3.5" />
          Refresh
        </Button>
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
        <Card className="divide-y divide-border border-border gap-0 py-0">
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
              <Switch
                disabled={toggling === flag.key}
                onCheckedChange={() => toggle(flag)}
                checked={flag.enabled}
                aria-label={`Toggle ${flag.key}`}
                className="ml-6 shrink-0"
              />
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
