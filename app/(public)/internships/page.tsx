import { Suspense } from "react";
import { InternshipsClient } from "@/components/internships/InternshipsClient";
import { InternshipGridSkeleton } from "@/components/internships/InternshipGridSkeleton";
import { listPostings, toInternship } from "@/lib/api/postings";
import type { Internship } from "@/components/internships/internships.types";

export const metadata = {
  title: "Internships | Scholify",
  description:
    "Every paid, unpaid, remote and onsite internship for Pakistani students - updated daily, completely free.",
};

// SSR-fresh — always pull the latest listings from the backend.
export const dynamic = "force-dynamic";

export default async function InternshipsPage() {
  let internships: Internship[] = [];
  let fetchError: string | null = null;

  try {
    // Pull a generous window; client-side filtering handles the rest for now.
    const res = await listPostings({ type: "internship", pageSize: 50 });
    internships = res.items.map(toInternship);
  } catch (err) {
    fetchError = err instanceof Error ? err.message : "Failed to load internships";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 xl:max-w-8xl 2xl:max-w-screen-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Internships don&apos;t get posted on Facebook anymore.{" "}
          <span className="text-primary">They get posted here.</span>
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Every paid, unpaid, remote and onsite internship for Pakistani students — from local startups to
          international companies. Updated daily, completely free.
        </p>
      </div>

      {fetchError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          <p className="font-medium">Couldn&apos;t load internships</p>
          <p className="mt-1 text-destructive/80">
            The backend didn&apos;t respond. Please refresh in a moment.
          </p>
        </div>
      ) : (
        <Suspense fallback={<InternshipGridSkeleton />}>
          <InternshipsClient internships={internships} />
        </Suspense>
      )}
    </div>
  );
}
