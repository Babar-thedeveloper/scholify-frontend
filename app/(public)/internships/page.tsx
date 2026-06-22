import { Suspense } from "react";
import { MOCK_INTERNSHIPS } from "@/components/internships/internships.mock";
import { InternshipsClient } from "@/components/internships/InternshipsClient";
import { InternshipGridSkeleton } from "@/components/internships/InternshipGridSkeleton";

export const metadata = {
  title: "Internships | Scholify",
  description:
    "Every paid, unpaid, remote and onsite internship for Pakistani students - updated daily, completely free.",
};

export default function InternshipsPage() {
  const internships = MOCK_INTERNSHIPS;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 xl:max-w-8xl 2xl:max-w-screen-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Internships don&apos;t get posted on Facebook anymore.{" "}
          <span className="text-primary">They get posted here.</span>
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Every paid, unpaid, remote and onsite internship for Pakistani students - from local startups to international companies. Updated daily, completely free.
        </p>
      </div>

      <Suspense fallback={<InternshipGridSkeleton />}>
        <InternshipsClient internships={internships} />
      </Suspense>
    </div>
  );
}
