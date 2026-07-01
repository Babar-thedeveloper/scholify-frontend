import { Suspense } from "react";
import { ScholarshipsClient } from "@/components/scholarships/ScholarshipsClient";
import { ScholarshipGridSkeleton } from "@/components/scholarships/ScholarshipGridSkeleton";
import { listPostings, toScholarship } from "@/lib/api/postings";
import type { Scholarship } from "@/components/scholarships/scholarships.types";

export const metadata = {
  title: "Scholarships | Scholify",
  description: "Discover national, international, and provincial scholarships for Pakistani students.",
};

// SSR-fresh — always pull the latest listings from the backend.
export const dynamic = "force-dynamic";

export default async function ScholarshipsPage() {
  let scholarships: Scholarship[] = [];
  let fetchError: string | null = null;

  try {
    const res = await listPostings({ type: "scholarship", pageSize: 50 });
    scholarships = res.items.map(toScholarship);
  } catch (err) {
    fetchError = err instanceof Error ? err.message : "Failed to load scholarships";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 xl:max-w-8xl 2xl:max-w-screen-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Every scholarship, one search.{" "}
          <span className="text-primary">Zero guesswork.</span>
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Every national, international and provincial scholarship for Pakistani students — updated daily,
          completely free.
        </p>
      </div>

      {fetchError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          <p className="font-medium">Couldn&apos;t load scholarships</p>
          <p className="mt-1 text-destructive/80">
            The backend didn&apos;t respond. Please refresh in a moment.
          </p>
        </div>
      ) : (
        <Suspense fallback={<ScholarshipGridSkeleton />}>
          <ScholarshipsClient scholarships={scholarships} />
        </Suspense>
      )}
    </div>
  );
}
