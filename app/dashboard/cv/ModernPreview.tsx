"use client";
// ─────────────────────────────────────────────────────────────
// Modern CV style — clean, minimal, dark header.
// Same data model as EuropassPreview.
// ─────────────────────────────────────────────────────────────
import type { CvDto, WorkExperienceEntry } from "@/lib/api/cv";

const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

function period(e: WorkExperienceEntry) {
  const start = `${MONTHS[e.startMonth - 1]} ${e.startYear}`;
  const end = e.isCurrent
    ? "Present"
    : e.endMonth && e.endYear
    ? `${MONTHS[e.endMonth - 1]} ${e.endYear}`
    : "";
  return end ? `${start} – ${end}` : start;
}

function initials(name: string | null) {
  if (!name) return "?";
  return name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

interface Props { cv: CvDto }

export default function ModernPreview({ cv }: Props) {
  return (
    <div className="bg-white text-[#1a1a1a] font-sans text-xs leading-relaxed min-h-[1120px] w-full">
      {/* ── Dark header ── */}
      <div className="bg-[#111827] text-white px-8 py-7">
        <div className="flex items-center gap-5">
          <div className="flex size-[64px] shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-xl select-none">
            {initials(cv.fullName)}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {cv.fullName ?? "Your Name"}
            </h1>
            {cv.fieldOfStudy && cv.degreeLevel && (
              <p className="text-emerald-400 text-sm mt-0.5">
                {cv.fieldOfStudy} · {cv.degreeLevel}
              </p>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2 text-[10px] text-gray-300">
              <span>{cv.email}</span>
              {cv.phone && <span>{cv.phone}</span>}
              {cv.city && <span>{cv.city}, {cv.country}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-8 py-6 space-y-5">
        {/* About */}
        {cv.bio && (
          <ModernSection label="About">
            <p className="text-[#444] leading-relaxed">{cv.bio}</p>
          </ModernSection>
        )}

        {/* Work experience */}
        {cv.workExperience.length > 0 && (
          <ModernSection label="Work Experience">
            <div className="space-y-4">
              {cv.workExperience.map((e) => (
                <div key={e.id} className="flex gap-4">
                  <div className="w-[115px] shrink-0 text-[#888] text-[10px] pt-0.5">
                    {period(e)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#1a1a1a]">{e.title}</p>
                    <p className="text-emerald-700 text-[10px]">
                      {e.company}{e.city ? ` · ${e.city}` : ""}
                    </p>
                    {e.description && (
                      <p className="mt-1 text-[#555] leading-snug whitespace-pre-line">
                        {e.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ModernSection>
        )}

        {/* Education */}
        {cv.university && (
          <ModernSection label="Education">
            <div className="flex gap-4">
              <div className="w-[115px] shrink-0 text-[#888] text-[10px] pt-0.5">
                {cv.expectedGraduationYear ? `– ${cv.expectedGraduationYear}` : ""}
              </div>
              <div className="flex-1">
                {cv.degreeLevel && cv.fieldOfStudy && (
                  <p className="font-semibold text-[#1a1a1a]">
                    {cv.degreeLevel} in {cv.fieldOfStudy}
                  </p>
                )}
                <p className="text-emerald-700 text-[10px]">{cv.university}</p>
                {cv.cgpa && (
                  <p className="text-[#555] mt-0.5">CGPA: {cv.cgpa} / 4.0</p>
                )}
              </div>
            </div>
          </ModernSection>
        )}

        <div className="grid grid-cols-2 gap-5">
          {/* Skills */}
          {cv.skills.length > 0 && (
            <ModernSection label="Skills">
              <div className="flex flex-wrap gap-1.5">
                {cv.skills.map((s, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] text-emerald-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </ModernSection>
          )}

          {/* Languages */}
          {cv.languages.length > 0 && (
            <ModernSection label="Languages">
              <div className="space-y-1.5">
                {cv.languages.map((l) => (
                  <div key={l.id} className="flex justify-between">
                    <span className="font-medium text-[#1a1a1a]">{l.language}</span>
                    <span className="text-[#888]">{l.level}</span>
                  </div>
                ))}
              </div>
            </ModernSection>
          )}
        </div>

        {/* Certifications */}
        {cv.certifications.length > 0 && (
          <ModernSection label="Certifications">
            <div className="space-y-2">
              {cv.certifications.map((c) => (
                <div key={c.id} className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-[#1a1a1a]">{c.name}</p>
                    {c.issuer && <p className="text-[#888]">{c.issuer}</p>}
                  </div>
                  {c.year && <span className="text-[#888] text-[10px] shrink-0 ml-2">{c.year}</span>}
                </div>
              ))}
            </div>
          </ModernSection>
        )}

        {/* References */}
        <ModernSection label="References">
          <p className="text-[#888] italic">Available on request.</p>
        </ModernSection>
      </div>
    </div>
  );
}

function ModernSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 whitespace-nowrap">
          {label}
        </p>
        <div className="flex-1 h-px bg-[#e5e7eb]" />
      </div>
      {children}
    </div>
  );
}
