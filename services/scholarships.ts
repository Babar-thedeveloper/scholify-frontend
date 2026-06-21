import type { Scholarship } from "@/components/scholarships/scholarships.types";

export async function fetchScholarships(baseUrl?: string): Promise<Scholarship[]> {
  const url = baseUrl ? `${baseUrl}/api/scholarships` : "/api/scholarships";
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch scholarships: ${res.status}`);
  }
  return res.json();
}
