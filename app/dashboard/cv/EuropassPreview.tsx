"use client";
// ─────────────────────────────────────────────────────────────
// Europass CV - refined official-style layout: navy accents, a
// clean sidebar (contact, languages with CEFR bars, skills) and a
// structured main column.
// ─────────────────────────────────────────────────────────────
import type { CvDto, LanguageEntry, WorkExperienceEntry } from "@/lib/api/cv";

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
          {cv.fieldOfStudy && cv.degreeLevel && (
            <p className="mt-1 text-[13px] text-[#444]">{cv.degreeLevel} in {cv.fieldOfStudy}</p>
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
              {cv.city && <ContactRow icon="⌖" value={`${cv.city}, ${cv.country}`} />}
              {cv.dateOfBirth && <ContactRow icon="◷" value={cv.dateOfBirth} />}
            </div>
          </Section>

          {hasLanguages && (
            <Section label="Languages">
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
          {cv.bio && (
            <MainSection label="Profile">
              <p className="leading-relaxed text-[#333]">{cv.bio}</p>
            </MainSection>
          )}

          {hasWorkExp && (
            <MainSection label="Work Experience">
              <div className="space-y-4">
                {cv.workExperience.map((e) => (
                  <TimelineRow key={e.id} left={period(e)}>
                    <p className="font-semibold text-[#1a1a1a]">{e.title}</p>
                    <p className="text-[#555]">{e.company}{e.city ? `, ${e.city}` : ""}</p>
                    {e.description && (
                      <p className="mt-1 whitespace-pre-line leading-snug text-[#444]">{e.description}</p>
                    )}
                  </TimelineRow>
                ))}
              </div>
            </MainSection>
          )}

          {cv.university && (
            <MainSection label="Education">
              <TimelineRow left={cv.expectedGraduationYear ? `- ${cv.expectedGraduationYear}` : ""}>
                {cv.degreeLevel && cv.fieldOfStudy && (
                  <p className="font-semibold text-[#1a1a1a]">{cv.degreeLevel} in {cv.fieldOfStudy}</p>
                )}
                <p className="text-[#555]">{cv.university}</p>
                {cv.cgpa && <p className="mt-0.5 text-[#444]">CGPA: {cv.cgpa} / 4.0</p>}
              </TimelineRow>
            </MainSection>
          )}

          {hasCerts && (
            <MainSection label="Certifications">
              <div className="space-y-3">
                {cv.certifications.map((c) => (
                  <TimelineRow key={c.id} left={c.year ? String(c.year) : ""}>
                    <p className="font-semibold text-[#1a1a1a]">{c.name}</p>
                    {c.issuer && <p className="text-[#555]">{c.issuer}</p>}
                  </TimelineRow>
                ))}
              </div>
            </MainSection>
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

function TimelineRow({ left, children }: { left: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="w-[96px] shrink-0 pt-0.5 text-[9.5px] font-medium uppercase tracking-wide text-[#667]">
        {left}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
