import { Suspense } from "react";
import { fetchScholarships } from "@/services/scholarships";
import { ScholarshipsClient } from "@/components/scholarships/ScholarshipsClient";
import { ScholarshipGridSkeleton } from "@/components/scholarships/ScholarshipGridSkeleton";

export const metadata = {
  title: "Scholarships | ScholarHub",
  description: "Discover national, international, and provincial scholarships for Pakistani students.",
};

export default async function ScholarshipsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const scholarships = await fetchScholarships(baseUrl);

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 xl:max-w-8xl 2xl:max-w-screen-2xl">
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Scholarships don&apos;t find you. You find them. Start here.
        </h1>
        <p className="mt-1 max-w-2xl text-xs text-muted-foreground sm:text-sm">
          Every national, international and provincial scholarship for Pakistani students — in one place, updated daily, completely free.
        </p>
      </div>

      <Suspense fallback={<ScholarshipGridSkeleton />}>
        <ScholarshipsClient scholarships={scholarships} />
      </Suspense>
    </div>
  );
}
