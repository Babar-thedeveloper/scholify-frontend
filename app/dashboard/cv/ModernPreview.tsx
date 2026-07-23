"use client";
// ─────────────────────────────────────────────────────────────
// Modern CV - premium single-column layout: slate header with an
// emerald accent, quiet typography, and a subtle experience rail.
// ─────────────────────────────────────────────────────────────
import type { CvDto, WorkExperienceEntry } from "@/lib/api/cv";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function period(e: WorkExperienceEntry) {
  const start = `${MONTHS[e.startMonth - 1]} ${e.startYear}`;
  const end = e.isCurrent
    ? "Present"
    : e.endMonth && e.endYear
    ? `${MONTHS[e.endMonth - 1]} ${e.endYear}`
    : "";
  return end ? `${start} - ${end}` : start;
}

function initials(name: string | null) {
  if (!name) return "?";
  return name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

interface Props { cv: CvDto }

export default function ModernPreview({ cv }: Props) {
  const contact = [
    cv.email,
    cv.phone ?? null,
    cv.city ? `${cv.city}, ${cv.country}` : null,
  ].filter(Boolean) as string[];

  return (
    <div className="bg-white font-sans text-[11px] leading-relaxed text-[#1f2937] min-h-[1120px] w-full">
      {/* ── Header ── */}
      <header className="relative overflow-hidden bg-[#0f172a] px-9 pb-8 pt-9 text-white">
        <div
          className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle,#34d399,transparent 70%)" }}
        />
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500" />
        <div className="relative flex items-center gap-5">
          <div className="flex size-[68px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-lg font-bold text-white shadow-lg select-none">
            {initials(cv.fullName)}
          </div>
          <div className="min-w-0">
            <h1 className="text-[27px] font-bold leading-none tracking-tight">{cv.fullName ?? "Your Name"}</h1>
            {cv.fieldOfStudy && cv.degreeLevel && (
              <p className="mt-2 text-[13px] font-medium text-emerald-400">
                {cv.degreeLevel} in {cv.fieldOfStudy}
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] text-slate-300">
              {contact.map((c, i) => (
                <span key={i} className="flex items-center gap-2.5">
                  {i > 0 && <span className="size-1 rounded-full bg-slate-500" />}
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="space-y-6 px-9 py-7">
        {cv.bio && (
          <Section label="Profile">
            <p className="text-[#4b5563]">{cv.bio}</p>
          </Section>
        )}

        {cv.workExperience.length > 0 && (
          <Section label="Experience">
            <div className="space-y-4">
              {cv.workExperience.map((e) => (
                <div key={e.id} className="grid grid-cols-[86px_1fr] gap-4">
                  <div className="pt-0.5 text-[9.5px] font-medium uppercase tracking-wide text-slate-400">
                    {period(e)}
                  </div>
                  <div className="relative border-l border-slate-200 pl-4">
                    <span className="absolute -left-[3.5px] top-[5px] size-[7px] rounded-full bg-emerald-500 ring-2 ring-white" />
                    <p className="text-[12px] font-semibold text-slate-900">{e.title}</p>
                    <p className="text-[10.5px] font-medium text-emerald-700">
                      {e.company}{e.city ? ` · ${e.city}` : ""}
                    </p>
                    {e.description && (
                      <p className="mt-1 whitespace-pre-line leading-snug text-[#555]">{e.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {cv.university && (
          <Section label="Education">
            <div className="grid grid-cols-[86px_1fr] gap-4">
              <div className="pt-0.5 text-[9.5px] font-medium uppercase tracking-wide text-slate-400">
                {cv.expectedGraduationYear ? `- ${cv.expectedGraduationYear}` : ""}
              </div>
              <div className="relative border-l border-slate-200 pl-4">
                <span className="absolute -left-[3.5px] top-[5px] size-[7px] rounded-full bg-emerald-500 ring-2 ring-white" />
                {cv.degreeLevel && cv.fieldOfStudy && (
                  <p className="text-[12px] font-semibold text-slate-900">{cv.degreeLevel} in {cv.fieldOfStudy}</p>
                )}
                <p className="text-[10.5px] font-medium text-emerald-700">{cv.university}</p>
                {cv.cgpa && <p className="mt-0.5 text-[#555]">CGPA: {cv.cgpa} / 4.0</p>}
              </div>
            </div>
          </Section>
        )}

        <div className="grid grid-cols-2 gap-6">
          {cv.skills.length > 0 && (
            <Section label="Skills">
              <div className="flex flex-wrap gap-1.5">
                {cv.skills.map((s, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-medium text-emerald-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {cv.languages.length > 0 && (
            <Section label="Languages">
              <div className="space-y-1.5">
                {cv.languages.map((l) => (
                  <div key={l.id} className="flex items-center justify-between">
                    <span className="font-medium text-slate-900">{l.language}</span>
                    <span className="text-[9.5px] uppercase tracking-wide text-slate-400">{l.level}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        {cv.certifications.length > 0 && (
          <Section label="Certifications">
            <div className="space-y-2">
              {cv.certifications.map((c) => (
                <div key={c.id} className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{c.name}</p>
                    {c.issuer && <p className="text-slate-500">{c.issuer}</p>}
                  </div>
                  {c.year && <span className="ml-2 shrink-0 text-[10px] text-slate-400">{c.year}</span>}
                </div>
              ))}
            </div>
          </Section>
        )}

        <Section label="References">
          <p className="italic text-slate-400">Available on request.</p>
        </Section>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2.5">
        <span className="h-3.5 w-1 rounded-full bg-emerald-500" />
        <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-900">{label}</h2>
        <span className="h-px flex-1 bg-slate-100" />
      </div>
      {children}
    </section>
  );
}
