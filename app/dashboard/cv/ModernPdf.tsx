"use client";
// ─────────────────────────────────────────────────────────────
// Modern CV – React-PDF document.
// Dark header, emerald accents, clean grid layout.
// ─────────────────────────────────────────────────────────────
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import type { CvDto, WorkExperienceEntry } from "@/lib/api/cv";

// ─── Colours ────────────────────────────────────────────────
const NAVY    = "#111827";
const EMERALD = "#059669";
const EMERALD_LIGHT = "#d1fae5";
const EMERALD_TEXT  = "#065f46";
const DARK   = "#1a1a1a";
const MID    = "#444444";
const GREY   = "#888888";
const LINE   = "#e5e7eb";
const WHITE  = "#ffffff";

// ─── Month helper ────────────────────────────────────────────
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function period(e: WorkExperienceEntry) {
  const start = `${MONTHS[e.startMonth - 1]} ${e.startYear}`;
  const end = e.isCurrent ? "Present"
    : e.endMonth && e.endYear ? `${MONTHS[e.endMonth - 1]} ${e.endYear}` : "";
  return end ? `${start} – ${end}` : start;
}

function initials(name: string | null) {
  if (!name) return "?";
  return name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

// ─── Styles ──────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 8,
    color: DARK,
    backgroundColor: WHITE,
  },

  // Header
  header: {
    backgroundColor: NAVY,
    paddingHorizontal: 28,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: EMERALD,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 16, fontFamily: "Helvetica-Bold", color: WHITE },
  headerRight: { flex: 1 },
  name: { fontSize: 20, fontFamily: "Helvetica-Bold", color: WHITE, lineHeight: 1.2 },
  subtitle: { fontSize: 9, color: EMERALD, marginTop: 2 },
  contactLine: { flexDirection: "row", gap: 12, marginTop: 6 },
  contactItem: { fontSize: 7, color: "#d1d5db" },

  // Body
  body: { paddingHorizontal: 28, paddingVertical: 18, gap: 16 },

  // Section
  section: { gap: 8 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  sectionLabel: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    color: EMERALD_TEXT,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },
  sectionLine: { flex: 1, height: 0.5, backgroundColor: LINE },

  // Bio
  bioText: { fontSize: 8, color: MID, lineHeight: 1.5 },

  // Entry row
  entryRow: { flexDirection: "row", gap: 12, marginBottom: 8 },
  entryDate: { width: 86, fontSize: 6.5, color: GREY, paddingTop: 1 },
  entryContent: { flex: 1 },
  entryTitle: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: DARK },
  entryCompany: { fontSize: 7, color: EMERALD_TEXT, marginTop: 1 },
  entryBody: { fontSize: 7, color: MID, marginTop: 2, lineHeight: 1.4 },

  // Two-column grid
  grid: { flexDirection: "row", gap: 16 },
  gridCol: { flex: 1 },

  // Skills
  skillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  skillChip: {
    borderRadius: 20,
    border: `0.5pt solid ${EMERALD}`,
    backgroundColor: EMERALD_LIGHT,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  skillChipText: { fontSize: 6.5, color: EMERALD_TEXT },

  // Languages
  langRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  langName: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: DARK },
  langLevel: { fontSize: 7, color: GREY },

  // Certs
  certRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  certName: { fontSize: 8, fontFamily: "Helvetica-Bold", color: DARK },
  certIssuer: { fontSize: 7, color: GREY, marginTop: 1 },
  certYear: { fontSize: 7, color: GREY },

  refText: { fontSize: 7.5, color: GREY, fontStyle: "italic" },
});

// ─── Sub-components ──────────────────────────────────────────
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={s.section}>
      <View style={s.sectionHeader}>
        <Text style={s.sectionLabel}>{label}</Text>
        <View style={s.sectionLine} />
      </View>
      {children}
    </View>
  );
}

// ─── Document ────────────────────────────────────────────────
interface Props { cv: CvDto }

export default function ModernPdf({ cv }: Props) {
  const hasSkills = cv.skills.length > 0;
  const hasLangs  = cv.languages.length > 0;
  const hasCerts  = cv.certifications.length > 0;
  const showGrid  = hasSkills || hasLangs;

  return (
    <Document title={`${cv.fullName ?? "CV"} – Modern`} author="Scholify">
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{initials(cv.fullName)}</Text>
          </View>
          <View style={s.headerRight}>
            <Text style={s.name}>{cv.fullName ?? "Your Name"}</Text>
            {cv.fieldOfStudy && cv.degreeLevel && (
              <Text style={s.subtitle}>{cv.fieldOfStudy} · {cv.degreeLevel}</Text>
            )}
            <View style={s.contactLine}>
              <Text style={s.contactItem}>{cv.email}</Text>
              {cv.phone && <Text style={s.contactItem}>{cv.phone}</Text>}
              {cv.city && (
                <Text style={s.contactItem}>{cv.city}, {cv.country}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Body */}
        <View style={s.body}>
          {/* About */}
          {cv.bio && (
            <Section label="About">
              <Text style={s.bioText}>{cv.bio}</Text>
            </Section>
          )}

          {/* Work experience */}
          {cv.workExperience.length > 0 && (
            <Section label="Work Experience">
              {cv.workExperience.map((e) => (
                <View key={e.id} style={s.entryRow}>
                  <Text style={s.entryDate}>{period(e)}</Text>
                  <View style={s.entryContent}>
                    <Text style={s.entryTitle}>{e.title}</Text>
                    <Text style={s.entryCompany}>
                      {e.company}{e.city ? ` · ${e.city}` : ""}
                    </Text>
                    {e.description && (
                      <Text style={s.entryBody}>{e.description}</Text>
                    )}
                  </View>
                </View>
              ))}
            </Section>
          )}

          {/* Education */}
          {cv.university && (
            <Section label="Education">
              <View style={s.entryRow}>
                <Text style={s.entryDate}>
                  {cv.expectedGraduationYear ? `– ${cv.expectedGraduationYear}` : ""}
                </Text>
                <View style={s.entryContent}>
                  {cv.degreeLevel && cv.fieldOfStudy && (
                    <Text style={s.entryTitle}>
                      {cv.degreeLevel} in {cv.fieldOfStudy}
                    </Text>
                  )}
                  <Text style={s.entryCompany}>{cv.university}</Text>
                  {cv.cgpa && (
                    <Text style={s.entryBody}>CGPA: {cv.cgpa} / 4.0</Text>
                  )}
                </View>
              </View>
            </Section>
          )}

          {/* Skills + Languages grid */}
          {showGrid && (
            <View style={s.grid}>
              {hasSkills && (
                <View style={s.gridCol}>
                  <Section label="Skills">
                    <View style={s.skillsWrap}>
                      {cv.skills.map((skill, i) => (
                        <View key={i} style={s.skillChip}>
                          <Text style={s.skillChipText}>{skill}</Text>
                        </View>
                      ))}
                    </View>
                  </Section>
                </View>
              )}
              {hasLangs && (
                <View style={s.gridCol}>
                  <Section label="Languages">
                    {cv.languages.map((l) => (
                      <View key={l.id} style={s.langRow}>
                        <Text style={s.langName}>{l.language}</Text>
                        <Text style={s.langLevel}>{l.level}</Text>
                      </View>
                    ))}
                  </Section>
                </View>
              )}
            </View>
          )}

          {/* Certifications */}
          {hasCerts && (
            <Section label="Certifications">
              {cv.certifications.map((c) => (
                <View key={c.id} style={s.certRow}>
                  <View>
                    <Text style={s.certName}>{c.name}</Text>
                    {c.issuer && <Text style={s.certIssuer}>{c.issuer}</Text>}
                  </View>
                  {c.year && <Text style={s.certYear}>{c.year}</Text>}
                </View>
              ))}
            </Section>
          )}

          {/* References */}
          <Section label="References">
            <Text style={s.refText}>Available on request.</Text>
          </Section>
        </View>
      </Page>
    </Document>
  );
}
