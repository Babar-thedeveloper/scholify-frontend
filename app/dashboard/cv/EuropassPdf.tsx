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
import { sortByRecency, type CvDto, type WorkExperienceEntry } from "@/lib/api/cv";

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
    paddingTop: 8,
    paddingBottom: 10,
  },
  // Fixed decorative stripes (repeat on every page).
  topStripe: { position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: BLUE },
  bottomStripe: { position: "absolute", bottom: 0, left: 0, right: 0, height: 3, backgroundColor: BLUE },

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
  // Header inside the main column (page 1 top).
  headerMain: { borderBottom: `1.5pt solid ${BLUE}`, paddingBottom: 8, marginBottom: 4 },
  cvLabel: { fontSize: 6, color: BLUE, fontFamily: "Helvetica-Bold", letterSpacing: 1.5, marginBottom: 2 },
  name: { fontSize: 18, fontFamily: "Helvetica-Bold", color: BLUE, lineHeight: 1.2 },
  subTitle: { fontSize: 8, color: MID, marginTop: 2 },

  // Fixed left band (full page height, repeats on every page). This
  // is what makes multi-page output paginate cleanly- the main column
  // is a normal single-column flow beside it.
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 150,
    backgroundColor: SIDE,
    paddingHorizontal: 12,
    paddingTop: 18,
    paddingBottom: 16,
    gap: 12,
    borderRight: `1pt solid ${LINE}`,
  },
  sideAvatar: { alignSelf: "center", marginBottom: 4 },
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

  // Main flowing column- sits to the right of the fixed 150pt band.
  main: { marginLeft: 150, paddingHorizontal: 18, paddingTop: 10, gap: 13 },
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

  // Entry- stacked: bold title (+ right period) / subtitle / body.
  entryBlock: { marginBottom: 7 },
  entryHeadRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 10 },
  entryTitle: { flex: 1, fontSize: 8, fontFamily: "Helvetica-Bold", color: DARK, lineHeight: 1.3 },
  entryMeta: { fontSize: 6.8, color: LIGHT, paddingTop: 0.5 },
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
      <View style={s.mainSectionHeader} minPresenceAhead={50}>
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
        {/* Fixed stripes + left band- repeat on every page for clean pagination */}
        <View fixed style={s.topStripe} />
        <View fixed style={s.bottomStripe} />

        <View fixed style={s.sidebar}>
          <View style={[s.avatar, s.sideAvatar]}>
            <Text style={s.avatarText}>{initials(cv.fullName)}</Text>
          </View>
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
              <SideSection label="Language skills">
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

          {/* Main flowing column- single column beside the fixed band */}
          <View style={s.main}>
            <View style={s.headerMain}>
              <Text style={s.cvLabel}>CURRICULUM VITAE</Text>
              <Text style={s.name}>{cv.fullName ?? "Your Name"}</Text>
              {(cv.headline || (cv.fieldOfStudy && cv.degreeLevel)) && (
                <Text style={s.subTitle}>{cv.headline || `${cv.fieldOfStudy} · ${cv.degreeLevel}`}</Text>
              )}
            </View>
            {/* About Me */}
            {(cv.aboutMe || cv.bio) && (
              <MainSection label="About Me">
                <Text style={s.bioText}>{cv.aboutMe || cv.bio}</Text>
              </MainSection>
            )}

            {/* Work experience */}
            {cv.workExperience.length > 0 && (
              <MainSection label="Work Experience">
                {sortByRecency(cv.workExperience).map((e) => (
                  <View key={e.id} wrap={false} style={s.entryBlock}>
                    <View style={s.entryHeadRow}>
                      <Text style={s.entryTitle}>{e.title}</Text>
                      <Text style={s.entryMeta}>{period(e)}</Text>
                    </View>
                    <Text style={s.entrySubtitle}>{e.company}{e.city ? `, ${e.city}` : ""}</Text>
                    {e.description && <Text style={s.entryBody}>{e.description}</Text>}
                  </View>
                ))}
              </MainSection>
            )}

            {/* Education */}
            {cv.university && (
              <MainSection label="Education and Training">
                <View wrap={false} style={s.entryBlock}>
                  <View style={s.entryHeadRow}>
                    <Text style={s.entryTitle}>
                      {cv.degreeLevel && cv.fieldOfStudy ? `${cv.degreeLevel} in ${cv.fieldOfStudy}` : (cv.degreeLevel || cv.fieldOfStudy || "Education")}
                    </Text>
                    {cv.expectedGraduationYear ? <Text style={s.entryMeta}>{cv.expectedGraduationYear}</Text> : null}
                  </View>
                  <Text style={s.entrySubtitle}>{cv.university}</Text>
                  {cv.cgpa && <Text style={s.entryBody}>CGPA: {cv.cgpa} / 4.0</Text>}
                </View>
              </MainSection>
            )}

            {/* Certifications */}
            {cv.certifications.length > 0 && (
              <MainSection label="Certifications">
                {cv.certifications.map((c) => (
                  <View key={c.id} wrap={false} style={s.entryBlock}>
                    <View style={s.entryHeadRow}>
                      <Text style={s.entryTitle}>{c.name}</Text>
                      {c.year ? <Text style={s.entryMeta}>{c.year}</Text> : null}
                    </View>
                    {c.issuer && <Text style={s.entrySubtitle}>{c.issuer}</Text>}
                  </View>
                ))}
              </MainSection>
            )}

            {/* Custom sections */}
            {(cv.customSections ?? []).map((sec) =>
              sec.items.length > 0 ? (
                <MainSection key={sec.id} label={sec.title}>
                  {sec.items.map((it) => (
                    <View key={it.id} wrap={false} style={s.entryBlock}>
                      <View style={s.entryHeadRow}>
                        <Text style={s.entryTitle}>{it.heading}</Text>
                      </View>
                      {it.subtitle && <Text style={s.entrySubtitle}>{it.subtitle}</Text>}
                      {it.description && <Text style={s.entryBody}>{it.description}</Text>}
                    </View>
                  ))}
                </MainSection>
              ) : null
            )}

            {/* References */}
            <MainSection label="References">
              <Text style={s.refText}>Available on request.</Text>
            </MainSection>
          </View>
      </Page>
    </Document>
  );
}
