"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export function HomeHero() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36 xl:max-w-8xl 2xl:max-w-screen-2xl">
        <div className="flex flex-col items-center text-center">
          <Badge
            variant="secondary"
            className="mb-6 gap-1.5 px-3 py-1.5 text-sm font-medium"
          >
            <Sparkles className="size-4" />
            New scholarship tools are live
          </Badge>

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Find and manage scholarships with{" "}
            <span className="text-primary">confidence</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Scholify helps students discover the right scholarships, track deadlines, and submit winning applications — all in one place.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/signup">
                Start your journey
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/#features">See how it works</Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-col items-center gap-3 text-sm text-muted-foreground sm:flex-row sm:gap-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-primary" />
              <span>AI-powered matching</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-primary" />
              <span>Deadline reminders</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-primary" />
              <span>Application tracking</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
