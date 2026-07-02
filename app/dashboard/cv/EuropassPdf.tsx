"use client";
// ─────────────────────────────────────────────────────────────
// Europass-style React-PDF document.
// Mirrors the layout of EuropassPreview.tsx but uses
// @react-pdf/renderer primitives (no HTML/CSS).
// ─────────────────────────────────────────────────────────────
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { CvDto, WorkExperienceEntry } from "@/lib/api/cv";

// ─── Colours ────────────────────────────────────────────────
const BLUE   = "#003399";
const LBLUE  = "#dde5f4";
const SIDE   = "#f0f4fb";
const DARK   = "#1a1a1a";
const MID    = "#444444";
const LIGHT  = "#555555";
const LINE   = "#c0cce8";

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
    backgroundColor: "#ffffff",
  },
  topStripe: { height: 4, backgroundColor: BLUE },
  bottomStripe: { height: 3, backgroundColor: BLUE, marginTop: "auto" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottom: `1.5pt solid ${BLUE}`,
    gap: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: LBLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 16, fontFamily: "Helvetica-Bold", color: BLUE },
  headerRight: { flex: 1 },
  cvLabel: { fontSize: 6, color: BLUE, fontFamily: "Helvetica-Bold", letterSpacing: 1.5, marginBottom: 2 },
  name: { fontSize: 18, fontFamily: "Helvetica-Bold", color: BLUE, lineHeight: 1.2 },
  subTitle: { fontSize: 8, color: MID, marginTop: 2 },

  // Body
  body: { flexDirection: "row", flex: 1 },

  // Sidebar
  sidebar: {
    width: 140,
    backgroundColor: SIDE,
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 14,
  },
  sideSection: { gap: 6 },
  sideSectionLabel: {
    fontSize: 5.5,
    fontFamily: "Helvetica-Bold",
    color: BLUE,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    paddingBottom: 3,
    borderBottom: `0.5pt solid ${LINE}`,
    marginBottom: 4,
  },
  contactRow: { flexDirection: "row", gap: 4, alignItems: "flex-start", marginBottom: 2 },
  contactIcon: { fontSize: 7, color: BLUE, width: 8 },
  contactText: { fontSize: 7, color: DARK, flex: 1 },
  langName: { fontSize: 7, fontFamily: "Helvetica-Bold", color: DARK },
  langLevel: { fontSize: 6, color: LIGHT },
  skillChip: {
    backgroundColor: LBLUE,
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    marginRight: 3,
    marginBottom: 3,
  },
  skillChipText: { fontSize: 6, color: BLUE },
  skillsWrap: { flexDirection: "row", flexWrap: "wrap" },

  // Main
  main: { flex: 1, paddingHorizontal: 16, paddingVertical: 14, gap: 14 },
  mainSection: { gap: 6 },
  mainSectionHeader: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 4 },
  mainSectionBar: { width: 4, height: 10, backgroundColor: BLUE, borderRadius: 1 },
  mainSectionLabel: {
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    color: BLUE,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  mainSectionLine: { flex: 1, height: 0.5, backgroundColor: LINE },

  // Entry row (date | content)
  entryRow: { flexDirection: "row", gap: 10, marginBottom: 6 },
  entryDate: { width: 80, fontSize: 6.5, color: LIGHT, paddingTop: 1 },
  entryContent: { flex: 1 },
  entryTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: DARK },
  entrySubtitle: { fontSize: 7, color: LIGHT, marginTop: 1 },
  entryBody: { fontSize: 7, color: MID, marginTop: 2, lineHeight: 1.4 },

  // About / bio
  bioText: { fontSize: 7.5, color: MID, lineHeight: 1.5 },

  // References
  refText: { fontSize: 7.5, color: LIGHT, fontStyle: "italic" },
});

// ─── Sub-components ──────────────────────────────────────────
function SideSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={s.sideSection}>
      <Text style={s.sideSectionLabel}>{label}</Text>
      {children}
    </View>
  );
}

function MainSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={s.mainSection}>
      <View style={s.mainSectionHeader}>
        <View style={s.mainSectionBar} />
        <Text style={s.mainSectionLabel}>{label}</Text>
        <View style={s.mainSectionLine} />
      </View>
      {children}
    </View>
  );
}

// ─── Document ────────────────────────────────────────────────
interface Props { cv: CvDto }

export default function EuropassPdf({ cv }: Props) {
  return (
    <Document title={`${cv.fullName ?? "CV"} – Europass`} author="Scholify">
      <Page size="A4" style={s.page}>
        {/* Top stripe */}
        <View style={s.topStripe} />

        {/* Header */}
        <View style={s.header}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{initials(cv.fullName)}</Text>
          </View>
          <View style={s.headerRight}>
            <Text style={s.cvLabel}>CURRICULUM VITAE</Text>
            <Text style={s.name}>{cv.fullName ?? "Your Name"}</Text>
            {cv.fieldOfStudy && cv.degreeLevel && (
              <Text style={s.subTitle}>{cv.fieldOfStudy} · {cv.degreeLevel}</Text>
            )}
          </View>
        </View>

        {/* Body */}
        <View style={s.body}>
          {/* Sidebar */}
          <View style={s.sidebar}>
            {/* Contact */}
            <SideSection label="Contact">
              <View style={s.contactRow}>
                <Text style={s.contactIcon}>✉</Text>
                <Text style={s.contactText}>{cv.email}</Text>
              </View>
              {cv.phone && (
                <View style={s.contactRow}>
                  <Text style={s.contactIcon}>☏</Text>
                  <Text style={s.contactText}>{cv.phone}</Text>
                </View>
              )}
              {cv.city && (
                <View style={s.contactRow}>
                  <Text style={s.contactIcon}>⌖</Text>
                  <Text style={s.contactText}>{cv.city}, {cv.country}</Text>
                </View>
              )}
              {cv.dateOfBirth && (
                <View style={s.contactRow}>
                  <Text style={s.contactIcon}>⁂</Text>
                  <Text style={s.contactText}>{cv.dateOfBirth}</Text>
                </View>
              )}
            </SideSection>

            {/* Languages */}
            {cv.languages.length > 0 && (
              <SideSection label="Languages">
                {cv.languages.map((l) => (
                  <View key={l.id} style={{ marginBottom: 4 }}>
                    <Text style={s.langName}>{l.language}</Text>
                    <Text style={s.langLevel}>{l.level}</Text>
                  </View>
                ))}
              </SideSection>
            )}

            {/* Skills */}
            {cv.skills.length > 0 && (
              <SideSection label="Skills">
                <View style={s.skillsWrap}>
                  {cv.skills.map((skill, i) => (
                    <View key={i} style={s.skillChip}>
                      <Text style={s.skillChipText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </SideSection>
            )}
          </View>

          {/* Main content */}
          <View style={s.main}>
            {/* Profile / bio */}
            {cv.bio && (
              <MainSection label="Profile">
                <Text style={s.bioText}>{cv.bio}</Text>
              </MainSection>
            )}

            {/* Work experience */}
            {cv.workExperience.length > 0 && (
              <MainSection label="Work Experience">
                {cv.workExperience.map((e) => (
                  <View key={e.id} style={s.entryRow}>
                    <Text style={s.entryDate}>{period(e)}</Text>
                    <View style={s.entryContent}>
                      <Text style={s.entryTitle}>{e.title}</Text>
                      <Text style={s.entrySubtitle}>
                        {e.company}{e.city ? `, ${e.city}` : ""}
                      </Text>
                      {e.description && (
                        <Text style={s.entryBody}>{e.description}</Text>
                      )}
                    </View>
                  </View>
                ))}
              </MainSection>
            )}

            {/* Education */}
            {cv.university && (
              <MainSection label="Education">
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
                    <Text style={s.entrySubtitle}>{cv.university}</Text>
                    {cv.cgpa && (
                      <Text style={s.entryBody}>CGPA: {cv.cgpa} / 4.0</Text>
                    )}
                  </View>
                </View>
              </MainSection>
            )}

            {/* Certifications */}
            {cv.certifications.length > 0 && (
              <MainSection label="Certifications">
                {cv.certifications.map((c) => (
                  <View key={c.id} style={s.entryRow}>
                    <Text style={s.entryDate}>{c.year ?? ""}</Text>
                    <View style={s.entryContent}>
                      <Text style={s.entryTitle}>{c.name}</Text>
                      {c.issuer && <Text style={s.entrySubtitle}>{c.issuer}</Text>}
                    </View>
                  </View>
                ))}
              </MainSection>
            )}

            {/* References */}
            <MainSection label="References">
              <Text style={s.refText}>Available on request.</Text>
            </MainSection>
          </View>
        </View>

        {/* Bottom stripe */}
        <View style={s.bottomStripe} />
      </Page>
    </Document>
  );
}
