// ─────────────────────────────────────────────────────────────
// Client-side resume parser. Extracts text from a PDF in the
// browser (pdfjs-dist, loaded lazily) and heuristically pulls out
// contact info, skills, work experience, languages and
// certifications. Format-agnostic best-effort — the user reviews
// and edits everything after import.
// ─────────────────────────────────────────────────────────────
import type {
  CertificationEntry,
  CvCustomSection,
  CvCustomSectionItem,
  LanguageEntry,
  WorkExperienceEntry,
} from "@/lib/api/cv";

export interface ParsedResume {
  fullName?: string;
  email?: string;
  phone?: string;
  skills: string[];
  workExperience: WorkExperienceEntry[];
  languages: LanguageEntry[];
  certifications: CertificationEntry[];
  customSections: CvCustomSection[];
  rawText: string;
}

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

/** Extract plain text (line-aware) from a PDF File. */
export async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const data = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data }).promise;
  let text = "";
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    for (const item of content.items) {
      const it = item as { str?: string; hasEOL?: boolean };
      if (typeof it.str === "string") text += it.str + (it.hasEOL ? "\n" : " ");
    }
    text += "\n";
  }
  return text.replace(/\t/g, "  ").replace(/ {3,}/g, "  ");
}

// ─── Section detection (keyword-based, format-agnostic) ──────
type SectionKey =
  | "experience" | "education" | "skills" | "languages"
  | "certifications" | "projects" | "summary" | "achievements"
  | "publications" | "interests" | "additional" | "_top";

const HEADING_PATTERNS: [SectionKey, RegExp][] = [
  ["experience", /\b(work experience|professional experience|employment history|employment|work history|experience|career history)\b/i],
  ["education", /\b(education|qualifications?|academic)\b/i],
  ["skills", /\b(technical skills|core skills|key skills|skills?(?:\s*&\s*\w+)?|competenc|technologies)\b/i],
  ["languages", /\b(languages?)\b/i],
  ["certifications", /\b(certifications?|licen[cs]es?|courses|credentials)\b/i],
  ["projects", /\b(projects?|portfolio)\b/i],
  ["summary", /\b(summary|profile|objective|about me|professional summary)\b/i],
  ["achievements", /\b(achievements?|awards?|honou?rs?|accomplishments)\b/i],
  ["publications", /\b(publications?)\b/i],
  ["interests", /\b(interests?|hobbies)\b/i],
  ["additional", /\b(additional information|other information|miscellaneous)\b/i],
];

/** Return the canonical section for a line if it looks like a heading, else null. */
function headingOf(line: string): SectionKey | null {
  const t = line.trim();
  // Headings are short lines, few words, no sentence punctuation.
  if (t.length === 0 || t.length > 40) return null;
  const words = t.replace(/[:•|–—-]+$/, "").trim().split(/\s+/);
  if (words.length > 5) return null;
  if (/[.,;]/.test(t)) return null;
  for (const [key, re] of HEADING_PATTERNS) {
    if (re.test(t)) return key;
  }
  return null;
}

function splitSections(lines: string[]): Record<string, string[]> {
  const sections: Record<string, string[]> = { _top: [] };
  let current: SectionKey = "_top";
  for (const line of lines) {
    const h = headingOf(line);
    if (h) {
      current = h;
      sections[current] ??= [];
    } else {
      (sections[current] ??= []).push(line);
    }
  }
  return sections;
}

// ─── Contact ─────────────────────────────────────────────────
function extractEmail(text: string): string | undefined {
  return text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0];
}

function extractPhone(text: string): string | undefined {
  const candidates = text.match(/\+?\(?\d[\d\s().\-]{7,}\d/g) ?? [];
  for (const c of candidates) {
    const digits = c.replace(/\D/g, "");
    // Real phone numbers have 9-15 digits; this rejects year ranges like "2000 - 2003".
    if (digits.length >= 9 && digits.length <= 15) return c.replace(/\s{2,}/g, " ").trim();
  }
  return undefined;
}

function extractName(lines: string[], email?: string): string | undefined {
  for (const raw of lines.slice(0, 6)) {
    const line = raw.trim();
    if (!line || line.length > 48) continue;
    if (/[@\d]/.test(line)) continue;
    if (headingOf(line)) continue;
    const words = line.split(/\s+/);
    if (words.length >= 2 && words.length <= 4 && words.every((w) => /^[A-Za-z'.-]+$/.test(w))) {
      return words.join(" ");
    }
  }
  if (email) {
    const local = email.split("@")[0].replace(/[._\d]+/g, " ").trim();
    if (local && local.includes(" ")) return local.replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return undefined;
}

// ─── Dates (2-digit + 4-digit, Mon-YY, MM/DD/YYYY, ranges) ───
function normYear(n: number): number {
  if (n >= 1000) return n;
  const cur = new Date().getFullYear() % 100;
  return n <= cur + 1 ? 2000 + n : 1900 + n;
}

const MON_RE = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s*[-/\s]?\s*'?(\d{2,4})\b/i;
const DMY_RE = /\b(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{2,4})\b/;
const YEAR_RE = /\b(19|20)\d{2}\b/;

function lineHasDate(line: string): boolean {
  return MON_RE.test(line) || DMY_RE.test(line) || YEAR_RE.test(line);
}

interface DatePoint { index: number; month?: number; year: number; }

function datePoints(text: string): { points: DatePoint[]; present: boolean; firstStart: number; lastEnd: number } {
  const present = /\b(present|current|ongoing|to\s?date|till\s?date|now)\b/i.test(text);
  const points: DatePoint[] = [];
  let firstStart = Infinity, lastEnd = -1;
  let m: RegExpExecArray | null;

  const mon = new RegExp(MON_RE.source, "gi");
  while ((m = mon.exec(text))) {
    points.push({ index: m.index, month: MONTHS[m[1].slice(0, 3).toLowerCase()], year: normYear(Number(m[2])) });
    firstStart = Math.min(firstStart, m.index); lastEnd = Math.max(lastEnd, m.index + m[0].length);
  }
  const dmy = new RegExp(DMY_RE.source, "g");
  while ((m = dmy.exec(text))) {
    const mo = Number(m[1]);
    points.push({ index: m.index, month: mo >= 1 && mo <= 12 ? mo : undefined, year: normYear(Number(m[3])) });
    firstStart = Math.min(firstStart, m.index); lastEnd = Math.max(lastEnd, m.index + m[0].length);
  }
  const yr = new RegExp(YEAR_RE.source, "g");
  while ((m = yr.exec(text))) {
    if (points.some((p) => Math.abs(p.index - m!.index) < 6)) continue;
    points.push({ index: m.index, year: Number(m[0]) });
    firstStart = Math.min(firstStart, m.index); lastEnd = Math.max(lastEnd, m.index + m[0].length);
  }
  points.sort((a, b) => a.index - b.index);
  return { points, present, firstStart: firstStart === Infinity ? -1 : firstStart, lastEnd };
}

// ─── Skills ──────────────────────────────────────────────────
function extractSkills(sections: Record<string, string[]>): string[] {
  const block = [...(sections["skills"] ?? [])];
  if (!block.length) return [];
  const out: string[] = [];
  for (const raw of block) {
    // Drop "Category:" labels and leading "Category  " (wide-space) labels.
    let line = raw.replace(/[A-Za-z][A-Za-z0-9 &/+#.-]*:\s*/g, ", ");
    line = line.replace(/^([A-Z][A-Za-z]+(?:\s[A-Z][A-Za-z]+){0,2})\s{2,}(?=[A-Za-z])/, "");
    for (const tok of line.split(/[,•|·;]|\s{2,}/)) {
      const s = tok.trim().replace(/^[-–—•\s]+|[.\s]+$/g, "");
      if (s.length >= 2 && s.length <= 32 && /[A-Za-z]/.test(s) && !/^\d+$/.test(s)) out.push(s);
    }
  }
  return Array.from(new Set(out)).slice(0, 30);
}

// ─── Work experience ─────────────────────────────────────────
function cleanCompany(text: string): string {
  // Company sits before a wide-space location or a ", City, Country".
  let c = text.split(/\s{2,}/)[0].trim();
  c = c.replace(/\s*[,|–-]\s*(remote|onsite|hybrid).*$/i, "");
  return c.trim();
}

function extractWorkExperience(sections: Record<string, string[]>): WorkExperienceEntry[] {
  const block = (sections["experience"] ?? []).filter((l) => l.trim());
  if (!block.length) return [];

  // Group into entries: a new entry begins on a line that contains a date.
  const groups: string[][] = [];
  for (const line of block) {
    if (lineHasDate(line)) groups.push([line]);
    else if (groups.length) groups[groups.length - 1].push(line);
    // lines before the first dated line are ignored (usually stray text)
  }

  const now = new Date().getFullYear();
  const result: WorkExperienceEntry[] = [];

  for (const group of groups.slice(0, 12)) {
    const headLine = group[0];
    const { points, present, firstStart, lastEnd } = datePoints(headLine);
    if (!points.length) continue;

    const start = points[0];
    const startYear = start.year >= 1950 && start.year <= 2100 ? start.year : now;
    const endYear = present ? undefined : (points.length > 1 ? points[points.length - 1].year : undefined);

    // Text on the date-line before / after the date region.
    const before = headLine.slice(0, firstStart).replace(/[|–—-]+\s*$/, "").trim();
    const after = headLine.slice(lastEnd)
      .replace(/^[\s|–—-]*(present|current|to date|till date)?[\s|–—-]*/i, "")
      .trim();

    // The "other" of title/company is the first line after the date-line
    // that is NOT a bullet point (works for both CV layouts).
    const rest = group.slice(1).map((l) => l.trim()).filter(Boolean);
    const adjIdx = rest.findIndex((l) => !/^[•\-–—*▪·●○]/.test(l));
    const adjacent = adjIdx >= 0 ? rest[adjIdx] : "";

    let title = "", company = "";
    if (before) {
      // Date at end of line → text before it is the title (software-CV style),
      // company is the next line.
      title = before;
      company = cleanCompany(after || adjacent);
    } else {
      // Date at start → text after it is the company (template style),
      // title is the next line.
      company = cleanCompany(after);
      title = adjacent || after;
    }

    // Description = the remaining lines (drop the one used as title/company).
    const descLines = rest.filter((_, i) => i !== adjIdx);
    const description = descLines
      .map((l) => l.replace(/^[•\-–—*▪·●○]\s*/, "").trim())
      .filter(Boolean)
      .join("\n")
      .slice(0, 1000) || undefined;

    title = title.replace(/[|]+/g, " ").replace(/\s{2,}/g, " ").trim().slice(0, 200);
    company = company.replace(/\s{2,}/g, " ").trim().slice(0, 200);
    if (!title && !company) continue;

    result.push({
      id: crypto.randomUUID(),
      title: title || company || "Role",
      company: title ? company : "",
      city: undefined,
      startMonth: start.month ?? 1,
      startYear,
      endMonth: undefined,
      endYear: endYear && endYear >= 1950 && endYear <= 2100 ? endYear : undefined,
      isCurrent: present,
      description,
    });
  }
  return result;
}

// ─── Languages ───────────────────────────────────────────────
const LEVEL_MAP: [RegExp, LanguageEntry["level"]][] = [
  [/native|mother\s?tongue|bilingual/i, "Native"],
  [/fluent|proficient|c2/i, "C2"],
  [/advanced|c1/i, "C1"],
  [/upper.?intermediate|b2/i, "B2"],
  [/intermediate|b1|conversational/i, "B1"],
  [/elementary|basic|a2/i, "A2"],
  [/beginner|a1/i, "A1"],
];

function mapLevel(text: string): LanguageEntry["level"] {
  for (const [re, lvl] of LEVEL_MAP) if (re.test(text)) return lvl;
  return "B2";
}

function extractLanguages(sections: Record<string, string[]>, rawText: string): LanguageEntry[] {
  let block = [...(sections["languages"] ?? [])];
  // Also catch an inline "Languages: ..." line (e.g. under "Additional Information").
  if (!block.length) {
    const inline = rawText.split("\n").find((l) => /^\s*languages?\s*[:\-]/i.test(l));
    if (inline) block = [inline.replace(/^\s*languages?\s*[:\-]\s*/i, "")];
  }
  if (!block.length) return [];

  const out: LanguageEntry[] = [];
  for (const raw of block.join(", ").split(/[,;•|·\n]/)) {
    const seg = raw.trim();
    if (seg.length < 2) continue;
    // "German (fluent)" | "German - fluent" | "German: C1" | "German"
    const m = seg.match(/^([A-Za-z][A-Za-z\s]{1,24}?)\s*[([:—–-]?\s*([A-Za-z0-9 ]+)?\)?$/);
    const name = (m?.[1] ?? seg).trim().replace(/\s{2,}/g, " ");
    if (!/^[A-Za-z ]{2,25}$/.test(name)) continue;
    if (/other than|ability level|e\.?g\.?/i.test(name)) continue; // template placeholder
    out.push({ id: crypto.randomUUID(), language: name, level: mapLevel(seg) });
    if (out.length >= 10) break;
  }
  // dedupe by language
  const seen = new Set<string>();
  return out.filter((l) => { const k = l.language.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });
}

// ─── Certifications ──────────────────────────────────────────
function extractCertifications(sections: Record<string, string[]>): CertificationEntry[] {
  const block = (sections["certifications"] ?? []).filter((l) => l.trim());
  if (!block.length) return [];
  const out: CertificationEntry[] = [];
  for (const raw of block) {
    const line = raw.replace(/^[•\-–—*▪·●○]\s*/, "").trim();
    if (line.length < 3 || line.length > 160) continue;
    const yearM = line.match(YEAR_RE);
    const name = line.replace(/[,–-]?\s*(19|20)\d{2}.*$/, "").trim() || line;
    out.push({
      id: crypto.randomUUID(),
      name: name.slice(0, 200),
      issuer: undefined,
      year: yearM ? Number(yearM[0]) : undefined,
    });
    if (out.length >= 15) break;
  }
  return out;
}

// ─── Custom sections (Projects / Achievements / Publications) ─
function extractCustomSections(sections: Record<string, string[]>): CvCustomSection[] {
  const MAP: [SectionKey, string][] = [
    ["projects", "Projects"],
    ["achievements", "Achievements"],
    ["publications", "Publications"],
  ];
  const out: CvCustomSection[] = [];
  for (const [key, title] of MAP) {
    const lines = (sections[key] ?? []).filter((l) => l.trim());
    if (!lines.length) continue;

    const items: CvCustomSectionItem[] = [];
    for (const raw of lines) {
      const isBullet = /^[•\-–—*▪·●○]/.test(raw.trim());
      const text = raw.replace(/^[•\-–—*▪·●○]\s*/, "").trim();
      if (!text) continue;
      if (isBullet || items.length === 0) {
        // Split "Name - description" into heading + description where possible.
        const m = text.match(/^(.{2,60}?)\s+[–—-]\s+(.+)$/);
        items.push(
          m
            ? { id: crypto.randomUUID(), heading: m[1].trim().slice(0, 200), description: m[2].trim().slice(0, 2000) }
            : { id: crypto.randomUUID(), heading: text.slice(0, 200) }
        );
      } else {
        const last = items[items.length - 1];
        last.description = `${last.description ? `${last.description} ` : ""}${text}`.slice(0, 2000);
      }
    }
    if (items.length) out.push({ id: crypto.randomUUID(), title, items: items.slice(0, 20) });
  }
  return out;
}

/** Parse extracted resume text into structured, best-effort CV data. */
export function parseResumeText(text: string): ParsedResume {
  const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
  const sections = splitSections(lines);
  const email = extractEmail(text);
  return {
    email,
    phone: extractPhone(text),
    fullName: extractName(lines, email),
    skills: extractSkills(sections),
    workExperience: extractWorkExperience(sections),
    languages: extractLanguages(sections, text),
    certifications: extractCertifications(sections),
    customSections: extractCustomSections(sections),
    rawText: text,
  };
}
