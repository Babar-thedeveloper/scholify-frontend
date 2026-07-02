"use client";
// ─────────────────────────────────────────────────────────────
// Europass-style HTML preview.
// Renders an accurate Europass layout for the live preview pane.
// Phase 7c will convert this same data into a @react-pdf/renderer
// component for the downloadable PDF.
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

export default function EuropassPreview({ cv }: Props) {
  const hasWorkExp    = cv.workExperience.length > 0;
  const hasLanguages  = cv.languages.length > 0;
  const hasCerts      = cv.certifications.length > 0;
  const hasSkills     = cv.skills.length > 0;
  const hasAbout      = !!cv.bio;

  return (
    <div className="bg-white text-[#1a1a1a] font-sans text-xs leading-relaxed min-h-[1120px] w-full">
      {/* ── Top blue stripe ── */}
      <div className="bg-[#003399] h-1.5 w-full" />

      {/* ── Header ── */}
      <div className="flex items-start gap-5 px-8 py-6 border-b-2 border-[#003399]">
        {/* Avatar placeholder */}
        <div className="flex size-[72px] shrink-0 items-center justify-center rounded-full bg-[#dde5f4] text-[#003399] font-bold text-lg select-none">
          {initials(cv.fullName)}
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#003399] mb-0.5">
            Curriculum Vitae
          </p>
          <h1 className="text-2xl font-bold text-[#003399] leading-tight">
            {cv.fullName ?? "Your Name"}
          </h1>
          {cv.fieldOfStudy && cv.degreeLevel && (
            <p className="text-sm text-[#444] mt-0.5">
              {cv.fieldOfStudy} · {cv.degreeLevel}
            </p>
          )}
        </div>
      </div>

      {/* ── Body: two columns ── */}
      <div className="flex">
        {/* Left sidebar */}
        <aside className="w-[220px] shrink-0 bg-[#f0f4fb] px-5 py-5 space-y-5">
          {/* Contact */}
          <Section label="Contact">
            <ContactRow icon="✉" value={cv.email} />
            {cv.phone && <ContactRow icon="☏" value={cv.phone} />}
            {cv.city && (
              <ContactRow icon="⌖" value={`${cv.city}, ${cv.country}`} />
            )}
            {cv.dateOfBirth && (
              <ContactRow icon="⁂" value={cv.dateOfBirth} label="Date of birth" />
            )}
          </Section>

          {/* Languages */}
          {hasLanguages && (
            <Section label="Languages">
              <div className="space-y-1.5">
                {cv.languages.map((l) => (
                  <div key={l.id}>
                    <p className="font-semibold text-[#1a1a1a]">{l.language}</p>
                    <p className="text-[#555] text-[10px]">{l.level}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Skills */}
          {hasSkills && (
            <Section label="Skills">
              <div className="flex flex-wrap gap-1">
                {cv.skills.map((s, i) => (
                  <span
                    key={i}
                    className="rounded bg-[#dde5f4] px-1.5 py-0.5 text-[10px] text-[#003399]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </aside>

        {/* Main content */}
        <main className="flex-1 px-6 py-5 space-y-5">
          {/* About */}
          {hasAbout && (
            <MainSection label="Profile">
              <p className="text-[#333] leading-relaxed">{cv.bio}</p>
            </MainSection>
          )}

          {/* Work experience */}
          {hasWorkExp && (
            <MainSection label="Work Experience">
              <div className="space-y-4">
                {cv.workExperience.map((e) => (
                  <div key={e.id} className="flex gap-4">
                    <div className="w-[110px] shrink-0 text-[#555] text-[10px] pt-0.5">
                      {period(e)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[#1a1a1a]">{e.title}</p>
                      <p className="text-[#555]">
                        {e.company}
                        {e.city ? `, ${e.city}` : ""}
                      </p>
                      {e.description && (
                        <p className="mt-1 text-[#444] leading-snug whitespace-pre-line">
                          {e.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </MainSection>
          )}

          {/* Education */}
          {cv.university && (
            <MainSection label="Education">
              <div className="flex gap-4">
                <div className="w-[110px] shrink-0 text-[#555] text-[10px] pt-0.5">
                  {cv.expectedGraduationYear
                    ? `– ${cv.expectedGraduationYear}`
                    : ""}
                </div>
                <div className="flex-1">
                  {cv.degreeLevel && cv.fieldOfStudy && (
                    <p className="font-semibold text-[#1a1a1a]">
                      {cv.degreeLevel} in {cv.fieldOfStudy}
                    </p>
                  )}
                  <p className="text-[#555]">{cv.university}</p>
                  {cv.cgpa && (
                    <p className="text-[#444] mt-0.5">CGPA: {cv.cgpa} / 4.0</p>
                  )}
                </div>
              </div>
            </MainSection>
          )}

          {/* Certifications */}
          {hasCerts && (
            <MainSection label="Certifications">
              <div className="space-y-2">
                {cv.certifications.map((c) => (
                  <div key={c.id} className="flex gap-4">
                    <div className="w-[110px] shrink-0 text-[#555] text-[10px] pt-0.5">
                      {c.year ?? ""}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[#1a1a1a]">{c.name}</p>
                      {c.issuer && <p className="text-[#555]">{c.issuer}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </MainSection>
          )}

          {/* References */}
          <MainSection label="References">
            <p className="text-[#555] italic">Available on request.</p>
          </MainSection>
        </main>
      </div>

      {/* ── Bottom stripe ── */}
      <div className="bg-[#003399] h-1 w-full mt-4" />
    </div>
  );
}

// ─── Helper sub-components ───────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-widest text-[#003399] mb-1.5 pb-0.5 border-b border-[#c0cce8]">
        {label}
      </p>
      {children}
    </div>
  );
}

function ContactRow({ icon, value, label }: { icon: string; value: string; label?: string }) {
  return (
    <div className="flex items-start gap-1.5 text-[10px]">
      <span className="text-[#003399] mt-px shrink-0">{icon}</span>
      <span className="text-[#333] break-all">{value}</span>
    </div>
  );
}

function MainSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-4 bg-[#003399] rounded-sm shrink-0" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#003399]">{label}</p>
        <div className="flex-1 h-px bg-[#c0cce8]" />
      </div>
      {children}
    </div>
  );
}
