import Link from "next/link";
import {
  Download,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Palette,
  Phone,
  Sparkles,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Progress } from "@/components/ui/progress";

const PROFILE_PERCENT = 85; // Mock — matches dashboard overview

export default function CVPage() {
  const canGenerate = PROFILE_PERCENT >= 70;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="My CV"
        subtitle="Auto-generated from your profile data"
      />

      {/* Low profile warning */}
      {!canGenerate && (
        <div className="mb-6 rounded-xl border border-amber-200 border-l-4 border-l-amber-400 bg-amber-50 p-5 dark:border-amber-500/30 dark:bg-amber-500/10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 size-5 shrink-0 text-amber-600" />
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-200">
                  Complete your profile to generate your CV
                </p>
                <p className="mt-0.5 text-sm text-amber-800/80 dark:text-amber-200/70">
                  Your profile is {PROFILE_PERCENT}% complete. We need at least 70% to
                  generate a CV.
                </p>
                <div className="mt-2 max-w-xs">
                  <Progress value={PROFILE_PERCENT} className="h-1.5" />
                </div>
              </div>
            </div>
            <Button asChild>
              <Link href="/dashboard/profile">Complete profile</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Button size="lg" disabled={!canGenerate}>
          <Download className="size-4" /> Download as PDF
        </Button>
        <Button size="lg" variant="outline" disabled={!canGenerate}>
          <Palette className="size-4" /> Customize CV
        </Button>
      </div>

      {/* CV Preview Card */}
      <div className="rounded-xl border border-border bg-white p-8 shadow-sm dark:bg-card">
        {/* Header */}
        <div className="flex items-start gap-4 border-b border-border pb-6">
          <span className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
            AK
          </span>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Ayesha Khan</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Computer Science · Undergraduate
            </p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="size-3" /> ayesha@nust.edu.pk
              </span>
              <span className="flex items-center gap-1">
                <Phone className="size-3" /> +92 300 1234567
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="size-3" /> Islamabad, Pakistan
              </span>
            </div>
          </div>
        </div>

        {/* Education */}
        <section className="mt-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <GraduationCap className="size-4" /> Education
          </h3>
          <div className="mt-3 text-sm">
            <p className="font-medium text-foreground">
              BS Computer Science
            </p>
            <p className="text-muted-foreground">
              National University of Sciences & Technology (NUST) · 2023 – 2027
            </p>
            <p className="mt-1 text-muted-foreground">CGPA: 3.8 / 4.0</p>
          </div>
        </section>

        {/* Skills */}
        <section className="mt-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <Sparkles className="size-4" /> Skills
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {["React", "TypeScript", "Node.js", "Python", "SQL", "Figma", "Git"].map(
              (s) => (
                <span
                  key={s}
                  className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground"
                >
                  {s}
                </span>
              )
            )}
          </div>
        </section>

        {/* About */}
        <section className="mt-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <User className="size-4" /> About
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Passionate computer science student at NUST with a strong interest in
            full-stack web development and UI/UX design. Active member of the NUST
            developer community and Google Developer Student Club. Seeking
            internships and scholarships to grow my skills and contribute to
            impactful projects.
          </p>
        </section>

        {/* Placeholder */}
        <div className="mt-8 rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
          <FileText className="mx-auto size-6" />
          <p className="mt-2 font-medium">More sections coming soon</p>
          <p className="text-xs">
            Experience, projects, certifications, and references will appear here
            as you fill in your profile.
          </p>
        </div>
      </div>
    </div>
  );
}
