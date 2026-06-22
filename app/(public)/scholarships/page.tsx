import { Suspense } from "react";
import { fetchScholarships } from "@/services/scholarships";
import { ScholarshipsClient } from "@/components/scholarships/ScholarshipsClient";
import { ScholarshipGridSkeleton } from "@/components/scholarships/ScholarshipGridSkeleton";

export const metadata = {
  title: "Scholarships | Scholify",
  description: "Discover national, international, and provincial scholarships for Pakistani students.",
};

export default async function ScholarshipsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
  const scholarships = await fetchScholarships(baseUrl);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 xl:max-w-8xl 2xl:max-w-screen-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Scholarships
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Every national, international and provincial scholarship for Pakistani students - updated daily, completely free.
        </p>
      </div>

      <Suspense fallback={<ScholarshipGridSkeleton />}>
        <ScholarshipsClient scholarships={scholarships} />
      </Suspense>
    </div>
  );
}
