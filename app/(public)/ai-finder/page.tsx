"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles, Wand2, Search, ListChecks, ArrowRight, GraduationCap,
  Building2, CalendarClock, LogIn, RefreshCw, Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/components/auth/UserContext";
import { getRecommendations, type RecommendationDto } from "@/lib/api/postings";

const LOADER_STEPS = [
  { Icon: Wand2, text: "Reading your profile & skills…" },
  { Icon: Search, text: "Scanning live scholarships & internships…" },
  { Icon: ListChecks, text: "Ranking your best-matched opportunities…" },
];

type Phase = "idle" | "loading" | "done" | "error";

export default function AiFinderPage() {
  const router = useRouter();
  const { role } = useUser();
  const isGuest = role === "guest";

  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(0);
  const [items, setItems] = useState<RecommendationDto[]>([]);
  const [profileComplete, setProfileComplete] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const stepTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (stepTimer.current) clearInterval(stepTimer.current); }, []);

  async function handleFind() {
    if (isGuest) {
      router.push("/login?next=/ai-finder");
      return;
    }
    setPhase("loading");
    setStep(0);
    setError(null);
    stepTimer.current = setInterval(() => setStep((s) => Math.min(s + 1, LOADER_STEPS.length - 1)), 1100);

    const started = Date.now();
    try {
      const res = await getRecommendations();
      // Let the loader breathe- min 2.4s for the "AI is working" feel.
      const elapsed = Date.now() - started;
      if (elapsed < 2400) await new Promise((r) => setTimeout(r, 2400 - elapsed));
      setItems(res.items);
      setProfileComplete(res.profileComplete);
      setPhase("done");
    } catch (e: unknown) {
      setError((e as { message?: string })?.message ?? "Something went wrong. Please try again.");
      setPhase("error");
    } finally {
      if (stepTimer.current) clearInterval(stepTimer.current);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 px-6 py-10 text-white shadow-sm sm:px-10 sm:py-12">
        <div aria-hidden className="pointer-events-none absolute -right-12 -top-16 size-56 rounded-full bg-white/10 blur-2xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-20 right-32 size-52 rounded-full bg-black/10 blur-2xl" />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="size-3.5" /> AI-powered matching
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Let AI find opportunities made for you
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-emerald-50 sm:text-base">
            Our matching engine reads your profile — field of study, skills, level and location — and surfaces
            the scholarships and internships you&apos;re most likely to win. No endless scrolling.
          </p>
          {phase === "idle" && (
            <Button
              size="lg"
              onClick={handleFind}
              className="mt-6 gap-2 bg-white text-emerald-700 shadow-md hover:bg-emerald-50"
            >
              {isGuest ? <><LogIn className="size-4" /> Log in to find my opportunities</> : <><Wand2 className="size-4" /> Find my opportunities</>}
            </Button>
          )}
          {isGuest && phase === "idle" && (
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-50/90">
              <Lock className="size-3.5" /> Takes 10 seconds — we match against your saved profile.
            </p>
          )}
        </div>
      </div>

      {/* ── Loader ── */}
      {phase === "loading" && (
        <div className="mt-10 flex flex-col items-center rounded-2xl border border-border bg-card px-6 py-14 text-center">
          <div className="relative flex size-16 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/30" />
            <span className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15">
              <Sparkles className="size-7 animate-pulse" />
            </span>
          </div>
          <div className="mt-6 space-y-2">
            {LOADER_STEPS.map(({ Icon, text }, i) => (
              <div
                key={i}
                className={`flex items-center justify-center gap-2 text-sm transition-all ${
                  i <= step ? "font-medium text-foreground" : "text-muted-foreground/40"
                }`}
              >
                <Icon className={`size-4 ${i === step ? "text-emerald-600 dark:text-emerald-400" : ""} ${i < step ? "text-emerald-500" : ""}`} />
                {text}
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">Analyzing your profile against live opportunities…</p>
        </div>
      )}

      {/* ── Error ── */}
      {phase === "error" && (
        <div className="mt-8 rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" className="mt-4 gap-1.5" onClick={handleFind}>
            <RefreshCw className="size-4" /> Try again
          </Button>
        </div>
      )}

      {/* ── Results ── */}
      {phase === "done" && (
        <div className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
                <Sparkles className="size-5 text-emerald-500" />
                We found {items.length} {items.length === 1 ? "opportunity" : "opportunities"} for you
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">Ranked by how well they match your profile.</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleFind} className="gap-1.5">
              <RefreshCw className="size-4" /> Refresh
            </Button>
          </div>

          {!profileComplete && (
            <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
              Add your field of study and skills in your{" "}
              <Link href="/dashboard/profile" className="font-semibold underline">profile</Link>{" "}
              to get sharper, personalized matches.
            </div>
          )}

          {items.length === 0 ? (
            <p className="mt-10 text-center text-muted-foreground">
              No live opportunities right now. Check back soon or browse{" "}
              <Link href="/scholarships" className="font-medium text-emerald-600">scholarships</Link>.
            </p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {items.map((r) => <RecCard key={r.id} r={r} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RecCard({ r }: { r: RecommendationDto }) {
  const isInternship = r.type === "internship";
  const deadline = r.deadlineAt ? new Date(r.deadlineAt) : null;
  return (
    <Link
      href={`/postings/${r.publicSlug}`}
      className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <Badge variant="secondary" className="rounded-full bg-emerald-50 capitalize text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
          {isInternship ? <Building2 className="size-3" /> : <GraduationCap className="size-3" />}
          {r.type}
        </Badge>
        {r.matchScore > 0 && (
          <span className="shrink-0 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-2.5 py-1 text-xs font-bold text-white">
            {r.matchScore}% match
          </span>
        )}
      </div>

      <h3 className="mt-3 line-clamp-2 font-semibold leading-snug text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
        {r.title}
      </h3>
      <p className="mt-0.5 text-sm text-muted-foreground">{r.organization.name}</p>

      {r.reasons.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {r.reasons.slice(0, 3).map((reason, i) => (
            <span key={i} className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {reason}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          {deadline && <><CalendarClock className="size-3.5" /> {deadline.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</>}
        </span>
        <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
          View <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
