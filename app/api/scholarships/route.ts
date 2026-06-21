import { NextResponse } from "next/server";
import scholarships from "@/app/constants/scholarships.json";
import type { Scholarship } from "@/components/scholarships/scholarships.types";

export async function GET() {
  return NextResponse.json(scholarships as Scholarship[]);
}
