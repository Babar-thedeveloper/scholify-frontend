"use client";
// ─────────────────────────────────────────────────────────────
// Europass CV - refined official-style layout: navy accents, a
// clean sidebar (contact, languages with CEFR bars, skills) and a
// structured main column.
// ─────────────────────────────────────────────────────────────
import { sortByRecency, type CvDto, type LanguageEntry, type WorkExperienceEntry } from "@/lib/api/cv";

const NAVY = "#003399";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const CEFR_PCT: Record<string, number> = {
  Native: 100, C2: 95, C1: 85, B2: 70, B1: 55, A2: 40, A1: 25,
};

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

export default function EuropassPreview({ cv }: Props) {
  const hasWorkExp = cv.workExperience.length > 0;
  const hasLanguages = cv.languages.length > 0;
  const hasCerts = cv.certifications.length > 0;
  const hasSkills = cv.skills.length > 0;

  return (
    <div className="bg-white font-sans text-[11px] leading-relaxed text-[#1a1a1a] min-h-[1120px] w-full">
      {/* ── Header ── */}
      <div className="h-1.5 w-full" style={{ background: NAVY }} />
      <header className="flex items-start gap-5 px-8 py-6" style={{ borderBottom: `2px solid ${NAVY}` }}>
        <div
          className="flex size-[74px] shrink-0 items-center justify-center rounded-full text-lg font-bold select-none"
          style={{ background: "#dde5f4", color: NAVY }}
        >
          {initials(cv.fullName)}
        </div>
        <div className="flex-1 pt-1">
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.22em]" style={{ color: NAVY }}>
            Curriculum Vitae
          </p>
          <h1 className="text-[26px] font-bold leading-tight" style={{ color: NAVY }}>
            {cv.fullName ?? "Your Name"}
          </h1>
          {(cv.headline || (cv.degreeLevel && cv.fieldOfStudy)) && (
            <p className="mt-1 text-[13px] text-[#444]">{cv.headline || `${cv.degreeLevel} in ${cv.fieldOfStudy}`}</p>
          )}
        </div>
      </header>

      {/* ── Body: two columns ── */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-[224px] shrink-0 space-y-5 px-5 py-6" style={{ background: "#f4f7fc" }}>
          <Section label="Contact">
            <div className="space-y-2">
              <ContactRow icon="✉" value={cv.email} />
              {cv.phone && <ContactRow icon="✆" value={cv.phone} />}
              {(cv.city || cv.country) && <ContactRow icon="⌖" value={[cv.city, cv.country].filter(Boolean).join(", ")} />}
              {cv.dateOfBirth && <ContactRow icon="◷" value={cv.dateOfBirth} />}
            </div>
          </Section>

          {hasLanguages && (
            <Section label="Language skills">
              <div className="space-y-2.5">
                {cv.languages.map((l) => <LanguageBar key={l.id} lang={l} />)}
              </div>
            </Section>
          )}

          {hasSkills && (
            <Section label="Skills">
              <div className="flex flex-wrap gap-1">
                {cv.skills.map((s, i) => (
                  <span
                    key={i}
                    className="rounded px-1.5 py-0.5 text-[9.5px] font-medium"
                    style={{ background: "#dde5f4", color: NAVY }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </aside>

        {/* Main */}
        <main className="flex-1 space-y-5 px-6 py-6">
          {(cv.aboutMe || cv.bio) && (
            <MainSection label="About Me">
              <p className="whitespace-pre-line leading-relaxed text-[#333]">{cv.aboutMe || cv.bio}</p>
            </MainSection>
          )}

          {hasWorkExp && (
            <MainSection label="Work Experience">
              <div className="space-y-3.5">
                {sortByRecency(cv.workExperience).map((e) => (
                  <div key={e.id}>
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-[#1a1a1a]">{e.title}</p>
                      <p className="shrink-0 text-[10px] text-[#667]">{period(e)}</p>
                    </div>
                    <p className="text-[#555]">{[e.company, e.city, e.country].filter(Boolean).join(", ")}</p>
                    {e.description && (
                      <p className="mt-1 whitespace-pre-line leading-snug text-[#444]">{e.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </MainSection>
          )}

          {cv.university && (
            <MainSection label="Education and Training">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-[#1a1a1a]">
                    {cv.degreeLevel && cv.fieldOfStudy ? `${cv.degreeLevel} in ${cv.fieldOfStudy}` : (cv.degreeLevel || cv.fieldOfStudy || "Education")}
                  </p>
                  {cv.expectedGraduationYear && <p className="shrink-0 text-[10px] text-[#667]">{cv.expectedGraduationYear}</p>}
                </div>
                <p className="text-[#555]">{cv.university}</p>
                {cv.cgpa && <p className="mt-0.5 text-[#444]">CGPA: {cv.cgpa} / 4.0</p>}
              </div>
            </MainSection>
          )}

          {hasCerts && (
            <MainSection label="Certifications">
              <div className="space-y-2.5">
                {cv.certifications.map((c) => (
                  <div key={c.id}>
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-[#1a1a1a]">{c.name}</p>
                      {c.year && <p className="shrink-0 text-[10px] text-[#667]">{c.year}</p>}
                    </div>
                    {c.issuer && <p className="text-[#555]">{c.issuer}</p>}
                  </div>
                ))}
              </div>
            </MainSection>
          )}

          {(cv.customSections ?? []).map((sec) =>
            sec.items.length > 0 ? (
              <MainSection key={sec.id} label={sec.title}>
                <div className="space-y-2.5">
                  {sec.items.map((it) => (
                    <div key={it.id}>
                      <p className="font-semibold text-[#1a1a1a]">{it.heading}</p>
                      {it.subtitle && <p className="text-[#555]">{it.subtitle}</p>}
                      {it.description && (
                        <p className="mt-1 whitespace-pre-line leading-snug text-[#444]">{it.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </MainSection>
            ) : null
          )}

          <MainSection label="References">
            <p className="italic text-[#777]">Available on request.</p>
          </MainSection>
        </main>
      </div>

      <div className="h-1 w-full" style={{ background: NAVY }} />
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p
        className="mb-2 border-b pb-1 text-[9px] font-bold uppercase tracking-[0.16em]"
        style={{ color: NAVY, borderColor: "#c0cce8" }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}

function ContactRow({ icon, value }: { icon: string; value: string }) {
  return (
    <div className="flex items-start gap-2 text-[10px]">
      <span className="mt-px shrink-0" style={{ color: NAVY }}>{icon}</span>
      <span className="break-words text-[#333]">{value}</span>
    </div>
  );
}

function LanguageBar({ lang }: { lang: LanguageEntry }) {
  const pct = CEFR_PCT[lang.level] ?? 50;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="font-semibold text-[#1a1a1a]">{lang.language}</span>
        <span className="text-[9px] text-[#667]">{lang.level}</span>
      </div>
      <div className="mt-1 h-1 w-full overflow-hidden rounded-full" style={{ background: "#d3ddf0" }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: NAVY }} />
      </div>
    </div>
  );
}

function MainSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <div className="h-4 w-1.5 shrink-0 rounded-sm" style={{ background: NAVY }} />
        <p className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: NAVY }}>{label}</p>
        <div className="h-px flex-1" style={{ background: "#c0cce8" }} />
      </div>
      {children}
    </div>
  );
}

