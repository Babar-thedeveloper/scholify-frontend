# Component Consistency Audit — scholify/frontend

## ✅ FINAL PASS — gaps closed to ~100% (2026-07-17)

Primitive capabilities added so the last raw elements could route through components:
- **`Card` now supports `asChild`** (radix `Slot`) → can render as `<form>`, `<button>`, `<a>`, etc. while keeping card styling.
- **`Badge` now has `size` variants** (`xs` / `sm` / `md`; default `sm` = unchanged, so all existing badges are byte-identical).

Converted the remaining exceptions:
- `admin/postings/create` **form container** → `<Card asChild><form>` (tsc-verified; admin-only route).
- `org/postings/new` **2 card-selector buttons** → `<Card asChild><button>` (tsc-verified; wizard doesn't return to step 1 for a live look).
- `PostingCard` **"N new" pill** → `<Badge size="xs">` (live-verified on /org/postings).
- `deadlines` **"days left"** → `<Badge>`; `profile` **"Verified student"** → `<Badge size="md">`; `ai-cv` **"Coming Soon"** → `<Badge size="md">` (ai-cv live-verified).
- `tsc --noEmit` → **exit 0, zero errors.**

**Only remaining non-component UI (intentional):** removable **input-token chips** (skill / field-of-study tags that embed a ✕ remove `<Button>`) in `dashboard/cv`, `org/postings/new`, `admin/postings/create`. These are an interactive *tag* pattern, not display badges — the correct home is a dedicated `Tag`/`Chip` component, not `Badge`. Left as-is pending that component.

---

## ✅ RESOLVED (2026-07-17)

The card & badge bypasses below have been fixed. `<Card>` is now the single source of truth.

| Metric | Before | After |
|--------|--------|-------|
| Files importing `<Card>` (in `app/`) | 1 | **30** |
| Hand-rolled card divs (`app/`) | 91 | **3** (intentional — see below) |
| `dash-card` orphan class usages | ~106 | **0** (folded into `<Card hover>`) |

- **`card.tsx`** — `<Card>` is now `border border-border bg-card rounded-xl` (the app's real look) + opt-in `hover` prop for the lift effect. Ring style dropped.
- **~63 card divs** across ~30 pages → `<Card>` / `<Card hover>`; **~6 pills** → `<Badge>`.
- **Card-rendering components now wrap `<Card>`:** `StatsCard`, `ApplicationCard`, and `PostingCard` (the last also converts its status pill → `<Badge>`). `ScholarshipCard`/`InternshipCard` already used `<Card>`.
- **Verified:** `tsc --noEmit` clean on every migrated file (all imports resolve, tags balance, props valid). One unrelated pre-existing error in `components/home/CountUp.tsx` (regex-flag/target config) is untouched by this work.
- **Live-verified in the browser:** all 8 student pages (`/dashboard/*`) and all org pages (`/org/*`) — every card/badge renders with the consistent border, zero console errors, skipped elements (avatars, odd-sized pills, `bg-muted`/alert panels) intact.
- **3 intentional exceptions** (documented, not misses): `org/postings/new` — 2 large custom clickable *card-selector* `<button>`s with `border-2`/focus-ring; `admin/postings/create` — a `<form>` container (Card renders a `<div>`, which would drop form semantics).

> Now editing `card.tsx` / `badge.tsx` propagates site-wide — the original goal. Remaining follow-ups: a few odd-sized status pills left as-is to avoid visual regressions (candidates for new `Badge`/`StatusBadge` size variants), and the raw primitives noted in the Minor section.

---



**Goal:** one source of truth in `components/ui/` so a change to a primitive reflects everywhere.
**Scanned:** ~50 pages under `app/` + 109 files under `components/`.
**Date:** 2026-07-17

---

## Verdict

| Primitive | Source of truth | Adherence | Status |
|-----------|-----------------|-----------|--------|
| Button | `ui/button.tsx` | 153 `<Button>` vs 2 raw `<button>` | ✅ Excellent |
| Input / Textarea / Select | `ui/input,textarea,select.tsx` | 0 raw in pages | ✅ Excellent |
| Modal / Dialog | `ui/dialog,alert-dialog,sheet.tsx` | no ad-hoc `fixed inset-0` dialogs | ✅ Excellent |
| **Card** | `ui/card.tsx` | **1 file imports it; ~106 hand-rolled** | ❌ **Bypassed** |
| **Badge** | `ui/badge.tsx` | ~19 `<Badge>` vs ~18 custom pills | ⚠️ **Split** |

**Bottom line:** buttons, inputs, and modals already funnel through `ui/`. The theme is broken in two places — **Cards (critical)** and **Badges (moderate)**.

---

## 🔴 Critical: the Card component is abandoned

`components/ui/card.tsx` exists but is imported by **only one file — the theme demo page**
(`app/(public)/theme/page.tsx`). Every real screen builds its own card with a
`dash-card rounded-xl border bg-white p-5` div. There is effectively a **second, undocumented
card system** competing with `<Card>`.

Even your shared card *components* hand-roll it instead of wrapping `<Card>`:
- `components/dashboard/StatsCard.tsx` → `dash-card rounded-xl border border-border bg-white p-5`
- `components/dashboard/ApplicationCard.tsx` → `dash-card rounded-xl border bg-white p-4 ...`
- (contrast: `ScholarshipCard.tsx` and `InternshipCard.tsx` correctly use `<Card>`)

**Custom card divs: 91 occurrences across 37 pages** + ~15 in components.

Pages hand-rolling cards (count):
```
org/dashboard(3)  org/profile(3)  org/billing(2)  org/postings(1)  org/postings/[id](1)
org/postings/new(4)  org/search(1)  org/settings(4)  org/applicants(1)  org/applicants/[id](2)
org/team(2)  dashboard(3)  dashboard/settings(5)  dashboard/profile(5)  dashboard/cv(6)
dashboard/saved(2)  dashboard/applications(1)  dashboard/applications/[id](4)  dashboard/deadlines(1)
dashboard/reminders(1)  admin(1)  admin/users(2)  admin/students(2)  admin/orgs(2)  admin/orgs/[id](3)
admin/postings(2)  admin/postings/create(3)  admin/feature-flags(2)  admin/guide(2)
(public)/help(1)  (public)/internships(1)  (public)/scholarships(1)  (public)/postings/[slug](2)
(public)/postings/[slug]/apply-panel(9)  (public)/organizations/[slug](4)
(auth)/pending-verification(1)  (auth)/accept-invite(1)
```

**Fix:** route everything through `<Card>`. Highest leverage: convert `StatsCard` and
`ApplicationCard` first (they're reused on many screens), retire the `dash-card` class, then
replace the raw `rounded-xl border bg-white` divs page-by-page.

---

## ⚠️ Moderate: Badge is only half-adopted

`<Badge>` is used ~19× across 12 files (and correctly wrapped by
`components/dashboard/StatusBadge.tsx`, though `StatusBadge` is imported in only **2 pages**).
Meanwhile status/label pills are hand-rolled as `rounded-full px-2 py-0.5 text-xs` spans.

**Custom pills (padding + small text): ~18 across 13 pages:**
```
admin/students(2)  admin/postings/create(2)  org/postings/new(2)  org/profile(1)  org/postings/[id](1)
org/applicants/[id](1)  dashboard/saved(1)  dashboard/deadlines(1)  dashboard/cv(1)
(public)/postings/[slug](2)  (public)/organizations/[slug](2)  (public)/ai-cv(1)
```

**Fix:** use `<Badge variant=…>` for these. Where they're status chips, prefer the existing
`StatusBadge` wrapper so status→color mapping lives in one place.

---

## 🟢 Minor: raw primitives to tidy

- **Raw `<button>` in a page:** `app/org/postings/new/page.tsx` (lines 290, 307) → use `<Button variant="ghost">`.
- **Raw form elements inside components** (check — some may be legitimate custom widgets):
  `auth/OrgSignupFields.tsx`, `auth/StudentSignupFields.tsx`, `auth/UniversityCombobox.tsx`,
  `cv/CvEntryModal.tsx`, `shared/NotificationsList.tsx`. If these are plain text/checkbox
  inputs, swap for `<Input>` / `<Checkbox>`.
- Raw `<button>` in `home/HeroCarousel.tsx`, `shared/AvatarDropdown.tsx`,
  `shared/NotificationDropdown.tsx`, `auth/UserTypeToggle.tsx` are interactive triggers —
  likely fine to leave, but confirm styling matches `Button`.

---

## Recommended order of work

1. **Cards** — biggest payoff. Fix `StatsCard` + `ApplicationCard`, kill `dash-card`, migrate pages.
2. **Badges** — standardize on `<Badge>`/`StatusBadge`, remove custom pills.
3. **Primitives** — clean the handful of raw elements above.

After (1) and (2), a change to `card.tsx` / `badge.tsx` will actually propagate site-wide —
which is the whole point.
