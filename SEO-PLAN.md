# Scholify SEO Plan

Living checklist from the `/seo audit`. `[x]` = done + verified, `[~]` = partial, `[ ]` = pending.

## Critical
- [x] **XML sitemap** - `app/sitemap.ts` (static routes + postings via API, hourly revalidate, graceful fallback).

## High
- [x] **robots.txt** - `app/robots.ts` (disallow authed areas, reference sitemap).
- [x] **`metadataBase`** - set in `app/layout.tsx` (`SITE_URL`, override via `NEXT_PUBLIC_SITE_URL`).
- [x] **Site-wide JSON-LD** - `Organization` + `WebSite` (with `SearchAction`) in root layout.
- [x] **`JobPosting` JSON-LD** - internship detail pages (`type === "internship"`).
- [x] **Canonicals** - `/scholarships`, `/internships`, and `/postings/[slug]` (dedupes `?search`/`?page`).

## GEO / AI search
- [x] **Allow AI bots** - GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc. in `robots.ts`.
- [x] **`llms.txt` + `llm.txt`** - `public/` (site summary + key links + facts).
- [x] **Structured data coverage** - Organization / WebSite / JobPosting / BreadcrumbList.
- [~] **Passage citability** - headings + self-contained answers; deepen on marketing/FAQ copy over time.

## Medium
- [x] **OG image** - branded `public/og-image.svg` wired site-wide (OG + Twitter card).
- [x] **BreadcrumbList JSON-LD** - posting detail pages.
- [x] **Per-page Open Graph** - posting pages (`generateMetadata`); listing pages inherit the site-wide OG.
- [x] **Security headers** - `next.config.ts` (`nosniff`, `X-Frame-Options`, `Referrer-Policy`, HSTS, `Permissions-Policy`).
- [ ] **PNG OG fallback** - most social scrapers don't render SVG `og:image`; add a raster fallback (e.g. `app/opengraph-image.tsx` via `next/og`, or a static PNG) for FB/LinkedIn/X previews.
- [ ] **Title template** - `%s | Scholify` in root; deferred because child pages already embed `| Scholify` (needs a title-cleanup pass to avoid double suffix).
- [ ] **Explicit per-page OG** on `/scholarships` & `/internships` (currently inherit site-wide OG - acceptable).

## Needs a deployed URL (can't do from source)
- [ ] **Core Web Vitals** field data (LCP/INP/CLS) via CrUX - `/seo google` Tier 0. Watch INP given glassmorphism `backdrop-blur`.
- [ ] **Indexation status** via Google Search Console - Tier 1.
- [ ] **Live `/seo audit <url>`** for rendered content depth + real CWV once deployed.

## Config
- Set `NEXT_PUBLIC_SITE_URL` in production (defaults to `https://scholify.pk`). robots/sitemap/canonicals/JSON-LD all read from it.
