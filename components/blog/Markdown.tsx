// ─────────────────────────────────────────────────────────────
// Minimal, dependency-free Markdown renderer for blog content.
// Supports: ## / ### headings, paragraphs, - and 1. lists,
// | tables |, > blockquotes, **bold**, and [links](/url).
// Server component - safe to render in RSC.
// ─────────────────────────────────────────────────────────────
import Link from "next/link";
import type { ReactNode } from "react";

// ── Inline formatting: **bold** and [text](url) ──────────────
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // Split on links and bold while keeping the delimiters.
  const regex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g;
  const parts = text.split(regex);
  parts.forEach((part, i) => {
    if (!part) return;
    const key = `${keyPrefix}-${i}`;
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      const [, label, href] = link;
      const internal = href.startsWith("/") || href.startsWith("#");
      if (internal) {
        nodes.push(
          <Link key={key} href={href} className="font-medium text-emerald-600 underline underline-offset-2 hover:text-emerald-700 dark:text-emerald-400">
            {label}
          </Link>
        );
      } else {
        nodes.push(
          <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-emerald-600 underline underline-offset-2 hover:text-emerald-700 dark:text-emerald-400">
            {label}
          </a>
        );
      }
      return;
    }
    const bold = /^\*\*([^*]+)\*\*$/.exec(part);
    if (bold) {
      nodes.push(<strong key={key} className="font-semibold text-foreground">{bold[1]}</strong>);
      return;
    }
    nodes.push(<span key={key}>{part}</span>);
  });
  return nodes;
}

function splitRow(line: string): string[] {
  return line.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
}

export function Markdown({ content }: { content: string }) {
  const blocks = content.trim().split(/\n{2,}/);
  const out: ReactNode[] = [];

  blocks.forEach((raw, bi) => {
    const block = raw.trim();
    if (!block) return;
    const lines = block.split("\n");

    // Headings
    if (block.startsWith("### ")) {
      out.push(<h3 key={bi} className="mt-8 mb-3 text-xl font-bold tracking-tight text-foreground">{renderInline(block.slice(4), `h3-${bi}`)}</h3>);
      return;
    }
    if (block.startsWith("## ")) {
      out.push(<h2 key={bi} className="mt-10 mb-3 text-2xl font-bold tracking-tight text-foreground">{renderInline(block.slice(3), `h2-${bi}`)}</h2>);
      return;
    }

    // Table: header row + separator row + body rows
    if (lines.length >= 2 && lines[0].includes("|") && /^\s*\|?[\s:|-]+\|?\s*$/.test(lines[1])) {
      const headers = splitRow(lines[0]);
      const rows = lines.slice(2).map(splitRow);
      out.push(
        <div key={bi} className="my-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border">
                {headers.map((h, i) => (
                  <th key={i} className="px-3 py-2 text-left font-semibold text-foreground">{renderInline(h, `th-${bi}-${i}`)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri} className="border-b border-border/60">
                  {r.map((c, ci) => (
                    <td key={ci} className="px-3 py-2 text-muted-foreground">{renderInline(c, `td-${bi}-${ri}-${ci}`)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      return;
    }

    // Unordered list
    if (lines.every((l) => /^[-*]\s+/.test(l))) {
      out.push(
        <ul key={bi} className="my-4 list-disc space-y-1.5 pl-6 text-muted-foreground">
          {lines.map((l, i) => <li key={i}>{renderInline(l.replace(/^[-*]\s+/, ""), `li-${bi}-${i}`)}</li>)}
        </ul>
      );
      return;
    }

    // Ordered list
    if (lines.every((l) => /^\d+\.\s+/.test(l))) {
      out.push(
        <ol key={bi} className="my-4 list-decimal space-y-1.5 pl-6 text-muted-foreground">
          {lines.map((l, i) => <li key={i}>{renderInline(l.replace(/^\d+\.\s+/, ""), `ol-${bi}-${i}`)}</li>)}
        </ol>
      );
      return;
    }

    // Blockquote
    if (lines.every((l) => l.startsWith(">"))) {
      out.push(
        <blockquote key={bi} className="my-6 border-l-4 border-emerald-500 pl-4 italic text-muted-foreground">
          {renderInline(lines.map((l) => l.replace(/^>\s?/, "")).join(" "), `bq-${bi}`)}
        </blockquote>
      );
      return;
    }

    // Paragraph (join wrapped lines)
    out.push(
      <p key={bi} className="my-4 leading-relaxed text-muted-foreground">
        {renderInline(lines.join(" "), `p-${bi}`)}
      </p>
    );
  });

  return <div className="text-[15px]">{out}</div>;
}
