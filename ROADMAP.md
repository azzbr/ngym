# Al Nakheel Premium — Full Site Audit & Product Roadmap

> **Status:** Draft for review · **Date:** 2026-06-10
> **Produced by:** 30-agent audit + design workflow (7 audit dimensions with adversarial verification, 5 feature design specs, 1 completeness critique) over the live codebase.
> **Scope:** Everything needed to evolve the current marketing site into a professional platform for **three audiences**: public visitors & members, gym admins/owners, and staff (receptionists, trainers, maintenance).

---

## 0. Executive Summary

The site today is a well-built **brochure**: 8 branch pages, strong brand system, good route hygiene, solid metadata basics, zero server attack surface. The audit found **no broken links and no missing images** — but it also found:

- **2 critical defects** — the Tailwind design-token config is silently dead (the 1280 px page container generates no CSS, so every page stretches full-width on large screens), and `/gallery` eagerly downloads **~12.7 MB** of full-resolution images.
- **A lead-losing contact form** — it discards everything the user types and then says "Thanks for reaching out."
- **SEO gaps that undercut the project's #1 stated goal** (local Bahrain rankings): no canonical URLs, no og:image anywhere, branch JSON-LD missing opening hours.
- **Accessibility failures** against the project's own spec (reduced-motion never honored, AA contrast failures, carousel with no pause).

The road to "professional and helpful" has **eight phases**. The ordering principle: *fix the foundation first, ship the zero-backend marquee feature early (the calculator — it runs in parallel with backend work starting), build the Supabase backbone that admins, members, and staff all share, then automate revenue.*

| Phase | Name | Outcome | Build effort |
|---|---|---|---|
| **0** | Fix the Foundation | Audit criticals/highs fixed; site actually does what the spec claims | 1–2 weeks |
| **1** | The Lab — Calculator Suite | Public marquee feature: cut/bulk plan generator + 4 calculators; SEO magnet | 2 weeks |
| **2** | Backend Foundation + Admin Core | Supabase live; staff record members & subscriptions; leads pipeline; trial funnel | 3–4 weeks |
| **3** | Member Portal | Members log in, see **days remaining**, get expiry reminders, renew via WhatsApp | 3 weeks |
| **4** | Check-ins + Maintenance | QR door check-in; QR fault reporting on every machine; ticket queue; preventive maintenance | 3 weeks |
| **5** | Online Revenue | Tap Payments renewals (BenefitPay/cards/Apple Pay); receipts; class schedules | 4–6 weeks |
| **6** | Arabic & Growth | Full AR/RTL site; Google reviews; referrals; blog | 6–8 weeks |
| **7** | Evaluate & Extend | Progress tracking, gift memberships, saved plans; data-driven pruning | ongoing |

Cross-cutting workstream (starts Phase 0, never stops): **Bahrain compliance & culture** — PDPL data protection, Ramadan-aware hours, VAT receipts, ladies-branch privacy, Arabic-script member data. See §12.

---

## 1. Audit — Current State

### 1.1 Scorecard

| Dimension | Verdict | Criticals | Highs | Mediums | Lows |
|---|---|---|---|---|---|
| Routes & UX | Solid skeleton, broken promises (form, 404) | 0 | 2 | 5 | 5 |
| SEO & structured data | Basics fine, growth levers all missing | 0 | 3 | 2 | 4 |
| Accessibility | Fails its own spec | 0 | 5 | 4 | 2 |
| Performance | One whale (/gallery), one LCP trap | 1 | 2 | 3 | 2 |
| Architecture | One silent config failure, hygiene debt | 1 | 0* | 7 | 2 |
| Data & content | Clean integrity, 5/8 branches empty | 0 | 0 | 6 | 3 |
| Security & forms | Decent for static; headers missing | 0 | 2 | 1 | 3 |

\* One "high" (unvalidated JSON loading) was **refuted** during adversarial verification — TypeScript and the static build catch the worst cases; it remains a medium hardening item. The Highs columns sum to 14 because the contact form was flagged independently by both Routes & UX and Security; the deduplicated register below lists 13.

### 1.2 Critical & High findings (fix in Phase 0)

| # | Sev | Finding | File | Fix | Effort |
|---|---|---|---|---|---|
| C1 | 🔴 Critical | `tailwind.config.ts` never loads under Tailwind v4 (no `@config`/`@theme`) — `max-w-site` (33 usages) and all design tokens generate **no CSS**; pages render full-width on wide screens | [tailwind.config.ts](tailwind.config.ts), [app/globals.css](app/globals.css) | Move tokens to a v4 `@theme` block in globals.css; verify `.max-w-site` exists in compiled CSS | S |
| C2 | 🔴 Critical | `/gallery` eagerly loads ~12 MB — 31 branch-gallery images served full-res as 2560 px WebP via raw `<img>` (no lazy, no srcset; 37 such files on disk); Swiper `effect="fade"` keeps all 31 slides mounted with double images + blur | [components/ui/GalleryGrid.tsx](components/ui/GalleryGrid.tsx), [components/sections/BranchGalleryShowcase.tsx](components/sections/BranchGalleryShowcase.tsx) | next/image with `sizes` everywhere; 2560 px only in lightbox; drop fade effect | M |
| H1 | 🟠 High | Contact form discards input, then implies delivery ("Thanks for reaching out") — lost leads | [components/ui/ContactForm.tsx](components/ui/ContactForm.tsx) | Interim: carry typed message into `wa.me/?text=`, target the selected branch's number, honest copy. Real fix in Phase 2 (leads table) | S |
| H2 | 🟠 High | No `not-found.tsx` / `error.tsx` anywhere — default white 404 renders the transparent navbar white-on-white | `app/` | Branded dark-zone 404 + error pages with recovery CTAs | S |
| H3 | 🟠 High | No `metadataBase`, zero canonical URLs site-wide — `*.vercel.app` duplicate-host indexing risk | [app/layout.tsx](app/layout.tsx) | `metadataBase` + `alternates.canonical`; extract `SITE_URL` into `lib/site.ts` | S |
| H4 | 🟠 High | No og:image / twitter card anywhere — every WhatsApp/Instagram share of this photo-driven brand has no preview image | [app/layout.tsx](app/layout.tsx) | Default 1200×630 brand OG image + per-branch `openGraph.images` from `heroImage` | M |
| H5 | 🟠 High | Branch JSON-LD omits `openingHoursSpecification` + `image` despite data existing — forfeits local rich results (the project's #1 goal) | [app/branches/[slug]/page.tsx](app/branches/[slug]/page.tsx) | Map `timings` → hours spec, add image, `sameAs` Instagram, bounded priceRange | S |
| H6 | 🟠 High | `prefers-reduced-motion` not honored by **any** JS animation (framer-motion, GSAP, Lenis, cursor) — violates CLAUDE.md §6.7/6.10 | [app/globals.css](app/globals.css), providers | `<MotionConfig reducedMotion="user">`, `gsap.matchMedia()`, skip Lenis + cursor under reduced motion | S |
| H7 | 🟠 High | Mobile menu overlay: no dialog semantics, no focus trap, no Escape, no scroll lock | [components/layout/Navbar.tsx](components/layout/Navbar.tsx) | `role="dialog"` + focus trap + Escape + `lenis.stop()` | M |
| H8 | 🟠 High | Contact form a11y: labels not associated, focus outline suppressed, success never announced | [components/ui/ContactForm.tsx](components/ui/ContactForm.tsx) | `id`/`htmlFor` pairs, focus-visible outline, `role="status"` on success | S |
| H9 | 🟠 High | Brand red on black = **3.45:1** (fails AA 4.5:1) on 12 px bold eyebrows + secondary hero CTA | [components/ui/SectionHeading.tsx](components/ui/SectionHeading.tsx), [components/ui/CTAButton.tsx](components/ui/CTAButton.tsx) | Lighter red tint (e.g. `#F25C5C` ≈ 6.0:1) for small text on dark only | S |
| H10 | 🟠 High | Gallery carousel auto-advances 31 slides every 4 s, no pause control (WCAG 2.2.2) | [components/sections/BranchGalleryShowcase.tsx](components/sections/BranchGalleryShowcase.tsx) | Pause/play toggle, `pauseOnMouseEnter`, disable under reduced motion, Keyboard module | S |
| H11 | 🟠 High | Homepage LCP (hero headline) is SSR'd at `opacity:0` by framer-motion — black screen until full JS hydration | [components/sections/HeroSection.tsx](components/sections/HeroSection.tsx) | Render hero text visible in SSR; CSS-keyframe entrance for above-the-fold | S |
| H12 | 🟠 High | ~52–56 MB of unreferenced raw PNG masters tracked in git under `data/branches/` (incl. a byte-identical duplicate Muharraq set) | `data/branches/*.png` | `git rm` masters (keep locally in the gitignored `test-image/`), commit the 2 pending deletions | S |
| H13 | 🟠 High | Zero security headers — no CSP, X-Frame-Options, Referrer-Policy, X-Content-Type-Options, Permissions-Policy | [next.config.ts](next.config.ts) | `headers()` block; CSP report-only first | S |

### 1.3 Medium/low findings register (fold into Phase 0/1 as capacity allows)

**Routes & UX:** per-branch WhatsApp numbers in data never used (floating button always messages the main line — wrong branch on branch pages); off-brand hero slang ("Plus, pretty bangin' views." — spec mandates verbatim copy); legal pages render bracketed template placeholders ("[Add official contact email…]") + a visible "this is a template" disclaimer; 3 internal links use raw `<a>` (full reloads) in [app/contact/page.tsx](app/contact/page.tsx), [components/ui/PricingTable.tsx](components/ui/PricingTable.tsx), [components/sections/MembershipsTeaser.tsx](components/sections/MembershipsTeaser.tsx); conflicting `max-w-site max-w-2xl` on contact form/FAQ; memberships branch tab not deep-linkable (`?branch=` param needed); no `loading.tsx`.

**SEO:** hero h1 ("One Fit For All") carries zero target keywords; 5 pendingData branch pages are thin near-duplicates with a malformed meta-description template (double space + dangling fragment when memberships empty); sitemap omits `/privacy-policy` + `/terms` and stamps `lastModified: new Date()` on every deploy; no Organization/WebSite JSON-LD on the homepage; `og:locale "en_BH"` is not a valid OG locale.

**A11y:** footer Privacy/Terms links at 2.6:1 (`text-white/30`) — the only navigation to those pages; `cursor: none !important` site-wide with a JS-only replacement (no pointer when JS fails; hover detection breaks after first client-side navigation — static `querySelectorAll` on mount); filter/tab buttons (gallery, branches, memberships, timings) expose no `aria-pressed`/tab semantics; no skip-to-content link; WhatsApp button icon ≈2.0:1 non-text contrast; footer heading levels skip h2→h4.

**Performance:** 37 generated `*-1280.webp` variants (4.8 MB) shipped but referenced by zero code; navbar/footer logo `<img>` without dimensions (CLS); Montserrat weight 400 loaded but never used.

**Architecture:** production domain hardcoded in 3 files; phone numbers hardcoded in 8 files (spec's Global Site Settings never implemented → create `lib/site.ts`); ~110 redundant inline `fontFamily` styles papering over the dead `font-*` utilities + a `:root` font-variable block that conflicts with next/font; client components (`MembershipsClient`, `BranchGrid`) bundle the entire branch dataset at module scope; dead export `getBranchesByType`; JSON loading hardening (assert required keys + unique slugs at module load — *the original "high" was refuted: tsc/SSG already catch the worst cases*).

**Data & content:** 5 of 8 branches have `pendingData: true` with empty timings/memberships (4 on the inferred main phone line, 3 with generic addresses); `CLAUDE.md` §11 is stale (lists nonexistent `budaiya` slug — code ships `jannusan`; wrong pending count; phantom hero.mp4 placeholder; missing Day Pass row); Bahrain Bay `membershipNote` contradicts the memberships FAQ ("branch-specific") **and names a branch that doesn't exist ("Barbar Ladies")**; Al Liwan Ladies gallery reuses the same 4 photo files as the mixed branch, reordered (rendered back-to-back on /gallery — a brand-trust problem for a ladies-only facility); jannusan has only 3 gallery images (all branches below the 6+ checklist); `pendingData` flag is read by no component (UI keys off empty arrays); tier naming "1 Year" vs "Annual".

**Security:** JSON-LD `dangerouslySetInnerHTML` doesn't escape `<` (inert today, stored-XSS vector the day a CMS feeds it — apply the one-line `<` escape now); Maps iframe uses loosest referrer policy, no sandbox, and `googleMapsEmbedUrl` override is un-validated; npm audit: 2 moderate (postcss vendored in next@16.2.6, build-time only — do **not** `audit fix --force` onto the preview release).

---

## 2. Decisions Required Before Building (resolve in Phase 0)

The five feature specs are individually sound but contradict each other in seven places. Each needs one decision, recorded here:

| # | Conflict | **Recommendation** |
|---|---|---|
| **D1** | Branch content source of truth: local JSON (today) vs Sanity CMS (CLAUDE.md plan) vs Supabase CRUD (growth spec) | **Supabase admin CRUD; kill the Sanity plan.** One backend for members *and* content; Sanity cannot store members. JSON stays as-is until Phase 3, then migrates behind the same `lib/branches.ts` API. |
| **D2** | Leads destination: Resend email (CLAUDE.md TODO) vs Supabase `leads` table (admin spec) | **Both, one truth:** form inserts a `leads` row (system of record); Resend sends the notification email. Until Phase 2, the interim WhatsApp-carry fix (H1) applies. |
| **D3** | WhatsApp numbers: branch personal numbers (wa.me deep links, staffed) vs Meta WhatsApp Business API (automated templates) — converting a number to WABA removes it from the staff phone app | **Two-number strategy:** branch numbers stay personal/staffed for human chat; register **one new dedicated number** for WABA automated templates (OTP, expiry reminders, claim invites). Apply for Meta business verification at the very start of Phase 2 — 2–4 week lead time. |
| **D4** | QR check-in has no QR issuer (admin spec scans it; portal spec never generates it) | **Admin issues the QR at member creation** (`qr_code` nanoid → `/m/[code]` pass page, sent via WhatsApp); the portal *also* displays it once live. Check-in never depends on the portal shipping. |
| **D5** | Branch registry inconsistent: CLAUDE.md says `budaiya`, code ships `jannusan`; Bahrain Bay grants access to "Barbar Ladies" (doesn't exist); cross-branch entitlements unspecced | **Fix the registry first** (CLAUDE.md §11 → jannusan), confirm the real cross-branch access policy with the owner, model it as an `access_grants` concept on subscriptions before check-in ships. |
| **D6** | Abuse protection specced only for the contact form, while the public QR fault-report form (photo upload, no login) is a larger surface | **One shared protection standard** for all public forms: zod validation + length caps, honeypot, per-IP rate limit, env-gated Turnstile, photo compression + private bucket. **Photo upload disabled by default at ladies branches** (see §12). |
| **D7** | Calculator CTAs deep-link to per-branch WhatsApp numbers that are unverified for 5 of 8 branches | **Verified branches only** get branch-scoped WhatsApp deep links — the rule applies to *every* branch-scoped link (calculator CTAs, floating button, contact-form handoff); pending branches fall back to the main line until the **CLAUDE.md §11** branch checklist passes. |

---

## 3. Phase Plan Overview

```
Month:    1         2         3         4         5         6         7         8         9         10        11        12
          ├─ P0 ─┤├─── P1 ───┤
                  ├──────── P2 ────────┤
                  │  (WABA + Tap onboarding paperwork runs in background from here)
                                        ├────── P3 ──────┤
                                                 ├────── P4 ──────┤
                                                                   ├────────── P5 ──────────┤
                                                                                             ├────────── P6 ──────────┤
                                                                                                                       ├─ P7 →
Compliance workstream (PDPL, Ramadan model, VAT, ladies privacy): ════════════════════════════════════════════════════════►
```

**Reading the chart:** bars show **calendar time**, not build effort — they absorb the external lead times (Meta WABA verification, Tap KYC), branch content collection, pilots and per-branch training, and parallel tracks. The §0 table lists pure build effort; the gap between the two is deliberate slack, not scope growth. P1 and P2 run as parallel tracks (P1 is zero-backend by design).

Dependencies: P1 needs nothing but P0's fixed foundation. P2 unlocks P3/P4/P5 (they all sit on the same Supabase schema). P5 needs Tap merchant KYC + WABA approval started in P2. P6's Arabic retrofit is far cheaper if P0–P5 use logical Tailwind properties (`ps-*`/`pe-*`) from now on.

---

## 4. Phase 0 — Fix the Foundation (1–2 weeks)

**Goal:** the site the public already sees stops lying (form), stops failing its own spec (tokens, motion, contrast), and starts earning its SEO goal. Every later phase stacks on this.

### 4.1 Tasks

| Group | Tasks | Effort |
|---|---|---|
| **Design system** | C1: Tailwind v4 `@theme` migration (tokens, `max-w-site`, `font-*` utilities); delete `:root` font conflict; sweep the ~110 inline `fontFamily` styles; adopt logical properties (`ps-*`/`pe-*`) as the convention for all new/refactored styles (pre-RTL groundwork for P6) | 1–2 d |
| **Images & LCP** | C2: next/image across gallery/showcase/about with `sizes`; H11: hero SSR-visible + CSS entrance; logo dimensions; decide fate of the 37 unused 1280px variants | 1–2 d |
| **Trust & copy** | H1 interim form fix (WhatsApp carry-over, per-branch number, honest copy); hero copy → verbatim spec; legal pages → real contact details, remove "template" disclaimers; H2: branded 404/error pages | 1 d |
| **SEO** | H3 `lib/site.ts` + metadataBase + canonicals; H4 OG images (default + per-branch); H5 JSON-LD hours/image/sameAs; Organization JSON-LD on home; sitemap legal pages + stable lastModified; fix pendingData meta-description template; `og:locale` | 1–2 d |
| **A11y** | H6 reduced-motion (MotionConfig + GSAP matchMedia + Lenis skip + cursor off); H7 mobile menu dialog; H8 form labels; H9 red-on-dark tint; H10 carousel pause; skip link; `aria-pressed` on filters; footer link contrast; cursor event delegation + scoped `cursor:none` | 2 d |
| **Security** | H13 security headers; JSON-LD `<` escape; Maps iframe referrer/sandbox + URL validation | 0.5 d |
| **Repo hygiene** | H12 remove ~52 MB PNG masters + duplicate set; commit pending deletions; resolve CLAUDE.md/claude.md case-collision; delete scaffold SVGs; update CLAUDE.md §11 (jannusan, Day Pass, pending count) | 0.5 d |
| **Quick UX** | next/link sweep; memberships `?branch=` deep-link; max-width conflict; tier naming "Annual"; WhatsApp button per-branch on branch pages (verified branches only, main-line fallback — D7) | 1 d |
| **Time model** | Add `seasonalTimings` (date-ranged Ramadan/Eid/National Day overrides) to the branch schema + TimingsTable display, so hours and JSON-LD stay honest in Ramadan (§12) | 0.5 d |
| **Decisions** | Sign off D1–D7 with the owner; confirm cross-branch access policy and the Barbar Ladies mystery | meeting |

### 4.2 Acceptance criteria

- Lighthouse mobile on `/`, `/gallery`, `/branches/al-liwan`: Performance ≥ 85, A11y ≥ 95, SEO = 100.
- `/gallery` transfer < 2 MB on first load. LCP < 2.5 s on 4G throttle.
- `.max-w-site` exists in compiled CSS; pages constrained at 1280 px.
- Form submission path carries user text into WhatsApp; no false "delivered" copy.
- A keyboard user can open/close the mobile menu and operate every filter; reduced-motion users see no animation.
- securityheaders.com grade ≥ A−.

**Content task (parallel, non-engineering):** collect verified hours, pricing, phones, addresses, and ladies-floor photography for the 5 pending branches; 6+ gallery images per branch; flip `pendingData`.

---

## 5. Phase 1 — "The Lab": Calculator Suite + Plan Generator (2 weeks)

**The marquee public feature.** 100% client-side (zero backend dependency — ships regardless of Supabase timeline), each tool a unique SEO landing page, every result card funneling into WhatsApp consultations.

### 5.1 Routes

| Route | Tool |
|---|---|
| `/tools` | Hub: card grid + quote banner ("STRONGER STARTS WITH A **NUMBER**") |
| `/tools/plan-calculator` | **The Plan Generator** — 5-step wizard (About You → Activity → Goal → Rate → Plan) |
| `/tools/bmi` | BMI |
| `/tools/body-fat` | US Navy body-fat estimate |
| `/tools/one-rep-max` | 1RM (Epley + Brzycki) + percentage training loads |
| `/tools/plate-calculator` | Barbell plate breakdown (kg) |

All math in **`lib/calculators.ts`** as pure functions with Vitest unit tests. Plan state serialized into the URL (base64) → shareable/bookmarkable with zero storage. Components: `PlanWizard`, `UnitToggle` (kg/lb), `StepperInput`, `RateSelector`, `MacroBar`, `WeightCurveChart` (inline SVG, no chart lib), `PlanResultCard` (print stylesheet + Web Share API), `TrainerCTA`, `MedicalDisclaimer`.

### 5.2 The math (implemented exactly; also rendered on-page for SEO/E-E-A-T)

- **BMR** — Mifflin-St Jeor: `10·kg + 6.25·cm − 5·age + 5` (male) / `− 161` (female). When body-fat % known, switch to Katch-McArdle: `370 + 21.6·LBM`, `LBM = kg·(1 − BF/100)` (BF entered as percent, e.g. 25).
- **TDEE** = BMR × activity: sedentary 1.2 · light 1.375 · moderate 1.55 · very 1.725 · athlete 1.9.
- **Goal modes** — cut / maintain / lean bulk / recomp. Rates: cut 0.5 (relaxed) / 0.75 (moderate) / 1.0 (aggressive) % of bodyweight per week; bulk +0.25–0.5 % of bodyweight per week (novice pace — advanced trainees nearer 0.125–0.25 %).
- **Calories from rate** — weeklyΔkg = rate% × current weight; daily Δ = weeklyΔkg × 7700 ÷ 7; target = TDEE ∓ Δ. **Floors:** never below BMR; never below 1500 kcal (men) / 1200 (women) — if clamped, extend the timeline and show a warning.
- **Macros** — protein **2.2 g/kg of TARGET weight** on a cut (1.8–2.4 adjustable); fat max(0.8 g/kg, 25% kcal); carbs = remaining kcal ÷ 4; fiber 14 g/1000 kcal; water ≈ 35 ml/kg.
- **Plan loop** — recompute BMR/TDEE/rate every 4 weeks as weight drops; insert a maintenance **diet-break week every ~10 weeks** on cuts longer than 12 weeks; plateau rule displayed: *2 stalled weeks → −10% kcal or +1 activity step*.
- **Extras** — US Navy BF, **centimeter inputs only** (convert imperial to cm before applying — the inch variant uses different constants): men `495/(1.0324 − 0.19077·log10(waist−neck) + 0.15456·log10(height)) − 450`, women `495/(1.29579 − 0.35004·log10(waist+hip−neck) + 0.221·log10(height)) − 450`. 1RM: Epley `w·(1+reps/30)`, Brzycki `w·36/(37−reps)` — return `w` at reps = 1, clamp reps to 1–12 (estimates invalid beyond). BMI `kg/m²`.

### 5.3 Worked example (ships as the pre-filled demo and a unit-test fixture)

**Male, 30 y, 180 cm, 100 kg → target 80 kg, moderate activity, moderate rate (0.75 %/wk):**

| Metric | Value |
|---|---|
| BMR (Mifflin-St Jeor) | 10·100 + 6.25·180 − 5·30 + 5 = **1,980 kcal** |
| TDEE | 1,980 × 1.55 = **3,069 kcal** |
| Daily deficit | 0.75 kg/wk × 7700 ÷ 7 = **825 kcal** |
| **Daily target** | **2,244 kcal** (above both floors ✓) |
| Protein | 2.2 × 80 kg = **176 g** (704 kcal) |
| Fat | 0.8 × 100 kg = **80 g** (720 kcal) |
| Carbs | (2244 − 1424) ÷ 4 = **205 g** |
| Fiber / water | ≈ 31 g / ≈ 3.5 L |
| **Timeline** | ~30 dieting weeks + 2 diet-break weeks ≈ **32 weeks (~7.5 months)**; 90 kg milestone ≈ week 14 (≈ week 15 counting the first diet break). Weekly loss tapers 0.75 → 0.60 kg as TDEE recomputes. |

### 5.4 Conversion & guardrails

- `TrainerCTA`: branch select → `wa.me/<branch whatsapp>?text=<plan summary>` — **verified branches only** (D7), others fall back to the main line.
- Visible medical disclaimer; pregnancy/under-18 exclusions; curve labeled an *estimate*; decode URL plan state defensively.
- `FAQPage` + `WebApplication` JSON-LD per tool; add routes to sitemap; navbar gains **TOOLS**.

**Success:** top-10 Bahrain SERP for "calorie calculator Bahrain"-class queries in 3 months; ≥60% wizard completion; 8–12% of completed plans click the WhatsApp consultation CTA.

---

## 6. Phase 2 — Backend Foundation + Admin Core (3–4 weeks)

**The real unlock.** Supabase (Postgres + Auth + RLS + Storage) becomes the single backend for members, staff, leads — and later content (D1). Front-desk manual entry is the **primary** flow (cash/Benefit card machine reality); everything else builds on this ledger.

### 6.1 Core schema (Phases 2–3) — Phase 4 adds the equipment/ticket/walkthrough tables (§8.2); Phase 5 adds classes + renewal-token storage (§9)

| Table | Key fields | Notes |
|---|---|---|
| `branches` | id, slug **unique**, name, type mixed/ladies, phone, whatsapp | Seeded from `data/branches/*.json` via `scripts/seed-branches.ts`; slugs immutable. **FK-only in Phase 2** — the public site keeps reading JSON until the Phase 3 content migration (D1) |
| `staff_profiles` | user_id → auth.users, full_name, role **owner / branch_manager / receptionist / trainer / maintenance_staff**, branch_id (NULL = HQ), active | Deactivate, never delete (audit integrity) |
| `members` | id, branch_id, full_name, **full_name_ar**, phone unique (E.164 +973), whatsapp, gender, email, dob, notes, photo_url, qr_code unique (nanoid-12), auth_user_id NULL, claimed_at, created_by | Photos in private bucket, signed URLs; trainers see a column-limited view (no phone/notes/payments) |
| `plans` | id, branch_id, tier, duration_months, price_bhd `numeric(7,3)`, active | **BHD has 3 decimals — never float** |
| `subscriptions` | id, member_id (primary holder), branch_id, plan_id, starts_on, ends_on, status (**terminal states only**, e.g. cancelled — active/expiring/expired/frozen are *derived*, §6.3), price_paid_bhd, payment_method **cash / benefit_card / benefitpay / bank_transfer / tap_online / complimentary**, created_by | Lifecycle state is **derived** (see 6.3), not cron-flipped |
| `subscription_members` | subscription_id, member_id | Couples Annual: one purchase, two members — additional members on a shared subscription get a row here; the primary holder stays on `subscriptions.member_id` |
| `subscription_freezes` | id, subscription_id, starts_on, ends_on, reason, created_by | Effective end = ends_on + Σ freeze days |
| `access_grants` | subscription_id, granted_branch_id | Cross-branch entitlements (D5 — e.g. Bahrain Bay → Jannusan) |
| `check_ins` | id, member_id, branch_id, checked_in_at, method qr/manual, staff_id | Partial unique index blocks duplicates within 4 h |
| `leads` | id, kind **contact / trial / day_pass / corporate**, branch_id?, name, phone, message, preferred_date, source, status **new → contacted → toured → joined / lost**, assigned_to, member_id? | One funnel table for every public form |
| `payments` | id, subscription_id, member_id, amount_bhd, method, paid_at, recorded_by, tap_charge_id?, receipt_no | Receipt numbering from day 1 (§12 VAT) |
| `notifications` | id, member_id, subscription_id, kind **claim_invite / expiry_7 / expiry_3 / expired**, channel, sent_at, `unique(subscription_id, kind)` | Idempotent reminder log |
| `audit_log` | id, staff_id, branch_id, action, entity, entity_id, diff jsonb | Trigger-driven + app rows (e.g. `whatsapp_renewal_sent`); INSERT-only |

**RLS:** helper `is_staff_for(branch)` — staff scoped to their branch, HQ sees all; members see only their own rows; service role only in cron/webhook routes. **Ladies-branch privacy by design:** member rows in ladies branches readable only by staff assigned to that branch or HQ (§12). Write per-role RLS tests *before* real data enters; run Supabase advisors.

### 6.2 Admin routes (`/admin` route group, same app — one repo, one deploy, RLS is the boundary)

`/admin/login` (email/password, owner invites, no public signup) · `/admin` dashboard (today's check-ins, expiring soon, new leads) · `/admin/members` + `/new` + `/[id]` (search by phone/name, MemberForm creates member + first subscription + payment in one server action — **target: under 2 minutes**) · `/admin/expiring` (next-14-days list + one-tap `WhatsAppRenewalButton`, audit-logged) · `/admin/leads` (pipeline board) · `/admin/staff` · `/admin/audit` (owner) · `/admin/reports` (active members, new joins, recorded revenue — labeled *recorded*, reconciled monthly against the Benefit machine — churn).

Plus the **public `/m/[code]` QR pass page (D4)**, built in this phase: `qr_code` is generated at member creation, "Send pass" opens WhatsApp with the link, the page renders the QR client-side. This is the artifact Phase 4's kiosk scans and Phase 3's portal re-surfaces — neither depends on the other shipping first.

### 6.3 Subscription state machine (derived, no cron)

`effective_end = ends_on + Σ freeze_days` → today in freeze ⇒ **frozen** · today > effective_end ⇒ **expired** · effective_end − today ≤ 7 ⇒ **expiring_soon** · else **active**. `days_remaining = effective_end − today`. Stored facts only (dates, freezes) — nothing to flip.

### 6.4 Also in this phase

- **Wire the contact form** for real: server action → `leads` insert + Resend notification (D2), with the shared protection standard (D6): zod + length caps + newline rejection, honeypot, min-time-to-submit, per-IP rate limit, generic errors, key server-side only.
- **Trial / day-pass funnel** (`/trial` + IG bio deep links `/branches/[slug]?trial=1`) → `leads(kind='trial'|'day_pass')` per the visitor's choice, WhatsApp confirm CTA. Lowest-friction Instagram → foot-traffic converter.
- **Corporate page** (`/corporate`) → `leads(kind='corporate')`. One Bahraini bank wellness contract pays for the build.
- **Data migration & cutover** (critique gap): import existing member records (Excel/paper/whatever exists today) — dedupe by phone, per-branch sequencing, 2-week parallel run before the ledger is trusted.
- **Backup & export**: enable Supabase PITR; owner-facing CSV/Excel export of members/subscriptions/payments (the accountant will demand it); documented restore procedure.
- **Kick off external paperwork now:** Meta WABA business verification + template approval (EN **and AR** — separate approvals, 2–4 wk) on a dedicated number (D3); Tap Payments merchant KYC (needs Bahraini CR, takes weeks).

**Success:** 100% of new sign-ups entered in `/admin` by end of month 3 · member+subscription entry < 2 min (timed at the Al Liwan pilot) · ≥50 day-pass leads/month within 60 days · lead first-response < 4 business hours · zero cross-branch RLS findings.

---

## 7. Phase 3 — Member Portal: "My Membership" (3 weeks)

**The headline number is days remaining.**

- **Auth:** phone OTP — **WhatsApp channel primary, SMS fallback** (Twilio Verify supports both on one integration through Supabase phone auth). Gym audience is phone-first; desk already collects phones; emails are stale. Rate-limit OTP per phone/IP (~$0.05/login budget).
- **Claim flow:** staff creates the member → WhatsApp claim invite ("Your account is ready — alnakheelpremium.com/portal") → member logs in with the same phone → signup trigger links `auth.users` → `members` by E.164 match, stamps `claimed_at`. No match → "No membership found, message your branch" (never auto-create). Unclaimed members surface in `/admin`.
- **Portal** (`/portal`): `DaysRemainingCard` (giant Bebas Neue number, red when ≤ 7) · tier/branch/expiry/`FreezeBadge` · `RenewCTA` → `wa.me/<branch>?text=Hi, I'd like to renew my <tier> at <branch> — <name>` · payment history · the member's QR pass (issued in Phase 2, D4) · fault-report entry point (lights up once Phase 4's form ships).
- **Branch content migration (delivers D1):** move `data/branches/*.json` content into the `branches` table behind the same `lib/branches.ts` API + an `/admin/branches` editor. Until this lands, the Phase 2 `branches` table is FK-only and the public site keeps reading JSON.
- **Expiry notifications:** daily Vercel Cron (09:00 Bahrain) sends WABA templates at T-7 / T-3 / day 0; `unique(subscription_id, kind)` dedupes; **dry-run mode mandatory** before live (double-sends damage a premium brand).
- Navbar gains **MY MEMBERSHIP**.

**Phone-identity edge cases (critique):** +973 prepaid numbers are heavily recycled among the expat workforce — claim requires an *existing* member row (never auto-link to subscriptions on number match alone); staff re-verify identity on number change; Couples Annual = two member rows sharing one subscription (model as `subscription_members` join or second FK); account recovery = staff-assisted at the desk.

**Success:** ≥60% of new members claim within 14 days · ≥40% of expiring members tap RenewCTA in their final week · OTP delivery ≥97% · measurable drop in "when does my membership expire?" calls.

---

## 8. Phase 4 — Check-ins + Maintenance Reporting (3 weeks)

### 8.1 QR door check-in

Kiosk = any logged-in phone/tablet at `/admin/check-in`: `@zxing/browser` camera scan of the member's `/m/[code]` pass (or manual name/phone search) → server action validates active non-frozen subscription **+ `access_grants` for cross-branch visits (D5)** → full-screen **green** (name, photo, plan, days left) or **red** (expired → renew CTA / frozen / unknown) in < 2 s. 4-hour duplicate block. Offline reality (critique): manual fallback + retry queue — **the door is never blocked by wifi**; paper reconciliation procedure documented.

### 8.2 Equipment maintenance system

- **Registry:** every machine in 8 branches → `equipment` row (name, category, brand, serial, purchase/warranty dates, status incl. `out_of_order`); printable `QrStickerSheet` (black/white/red stickers) linking to `/report/<public_code>`.
- **Flow 1 — public QR report (no login):** issue type as 4 sharp-edged tiles (broken / damaged / needs service / other), optional photo, optional +973 phone → ticket. Second scanner sees **"Already reported — being fixed"** (dedupe + `report_count`). Anti-abuse per D6; **photo upload OFF by default in ladies branches** (§12).
- **Flow 2 — member portal report** (reuses the same form, `source='member'`).
- **Flow 3 — staff walkthrough:** weekly checklist per branch, OK/Issue per machine, issues auto-create tickets.
- **Tickets:** open → acknowledged → in_progress → fixed / wont_fix; priority; assignment to maintenance staff; photos in private bucket (signed URLs, purge 90 days after fix); `ticket_events` timeline; out-of-order toggle; Resend email on high/critical.
- **Preventive maintenance:** `pm_schedules` ("treadmill belt every 90 days") → idempotent daily Vercel Cron creates `source='preventive'` tickets + manager digest.
- **SLA stats:** avg/median time-to-fix and downtime per branch.

**Success:** ≥80% of equipment registered within 30 days · median acknowledge < 24 h, fix < 7 days · ≥50% of tickets from QR scans · ≥70% of door visits logged by month 2 · spam < 5%.

---

## 9. Phase 5 — Online Revenue (4–6 weeks; gated on Tap KYC + WABA from Phase 2)

- **Tap Payments hosted checkout** (BenefitPay + Apple Pay + cards — **Stripe does not operate in Bahrain**): `/renew/[token]` linked from expiry reminders and the portal RenewCTA → webhook (HMAC-verified, idempotent on `tap_charge_id`, service role) records payment + extends subscription. Amounts in **fils (integer)** in API calls.
- **Receipts & VAT (§12):** every payment — desk or online — generates a numbered receipt (10% VAT line if NBR-registered); end-of-day cash reconciliation view per branch; refund/credit policy (Benefit network refunds are awkward — manual credit flow).
- **Reconciliation** view in `/admin` for online payments.
- **Class schedules** (`/classes` + branch pages): read-only per-branch timetables first; booking with capacity after.
- **Trainer profiles** (`/trainers/[slug]`): trainers are Instagram personalities — profile pages convert followers; PT booking stays "WhatsApp this trainer" until demand proves more.

**Success:** ≥15% of renewals paid online by month 9 (stretch: 20%) · reminded members renew ≥15 pts above baseline · zero double-charges.

---

## 10. Phase 6 — Arabic & Growth (6–8 weeks)

- **Arabic i18n + RTL** (`next-intl`, `/[locale]`, `dir="rtl"`): the site is English-only in a bilingual market — this doubles the local SEO surface. Professional translation (not machine); hreflang; AR metadata + AR local-SEO copy per branch. **Budget a dedicated RTL QA pass** — the GSAP/Lenis/transform-heavy layout will not flip for free; x-axis animations audited. Operational surfaces too (critique): the public report form and WhatsApp templates ship AR variants; admin UI AR is optional but member-facing text is not.
- **Google reviews:** `ReviewStrip` per branch (Places API, cached) + post-visit WhatsApp review-generation flow. Cheap, compounds the local pack ("best gym in Bahrain").
- **Referral program:** manual codes at the desk first (member refers friend → free month), tracked in `/admin`; automate only if volume proves.
- **Blog / content hub:** MDX in-repo (no CMS), first 6 Bahrain-keyword articles; slow-burn organic.

**Success:** ≥25% of organic sessions on `/ar` within 3 months · top-3 local pack for "gym <area> Bahrain" for 4+ branches · ≥30 new Google reviews per branch in 6 months.

---

## 11. Phase 7 — Evaluate & Extend (ongoing)

Data decides: **saved calculator plans** (`saved_plans` + RLS, "Save plan" button — ties The Lab to the portal) · **member progress tracking** (weight log charts vs plan curve) · **gift memberships** (Ramadan/Eid/National Day seasonal — only once Tap volume justifies) · **PWA/push — recommend skipping** (WhatsApp owns re-engagement in Bahrain; iOS opt-in is poor) · prune anything `/admin` analytics show unused.

---

## 12. Cross-Cutting: Bahrain Compliance & Culture (starts Phase 0, never stops)

| Area | Requirement | Lands in |
|---|---|---|
| **PDPL (Law 30/2018)** | The roadmap turns a brochure into a system of record for names, phones, payments, check-ins — and saved cut-plans are arguably **health data (sensitive)**. Need: lawful basis, consent capture for automated WhatsApp marketing, data-subject rights (access/correction/deletion) honored via `/admin`, retention schedule, documented cross-border transfer basis (Supabase region choice — pick the nearest region and record the justification), and a **real privacy policy** (the live one renders "[Add official contact email…]"). | Policy P0 · consent P2 · rights tooling P2–3 |
| **Ramadan time model** | Bahraini gyms shift hours in Ramadan, plus Eid + National Day closures — **zero support in the schema today**; timings tables, "open now", and JSON-LD will all be wrong ~1 month/year. Add a `seasonalTimings` override (date-ranged) to the branch schema + UI badge. | Schema P0/P2, before the first Ramadan after launch |
| **VAT & receipts** | 10% VAT; NBR-compliant numbered invoices if registered; end-of-day cash reconciliation; recording "cash/Benefit" without receipts is not bookkeeping. | Receipt numbers P2 · full invoicing P5 |
| **Ladies-branch privacy** | 4 of 8 branches. No-photo policy inside ladies facilities constrains: QR-report photo upload (off by default), walkthrough photos, member photos (consent + signed URLs), and **gallery content** (the audit found Al Liwan Ladies showing the mixed floor's photos — fix in P0 content work). Staff access to ladies-branch member data is branch-scoped by RLS; consider gender-scoping admin roles with the owner. | D6 + P2 RLS + P4 forms |
| **Arabic-script data** | Dual-script member names (`full_name_ar`) + transliteration-tolerant search (Mohammed/Muhammad/محمد) for desk lookup; AR WhatsApp templates approved separately by Meta. | P2 schema · P3 templates · P6 UI |
| **Payments reality** | Benefit (debit network) ≠ BenefitPay (wallet) — both at the desk; Tap needs a Bahraini CR for KYC; Benefit refunds are awkward → manual credit policy. | P2 enums · P5 flows |
| **Phone identity** | +973 prepaid recycling among expat workforce → never auto-link by number alone; staff-assisted recovery; OTP sender-ID registration and per-message cost (Batelco/stc/Zain) budgeted. | P3 |

---

## 13. Top Risks

1. **Front-desk adoption is the real P0 risk.** If `/admin` entry feels slower than the paper ledger, the member DB stays empty and Phases 3/5/6 collapse. Design for < 60 s entry; pilot at Al Liwan; train per branch.
2. **RLS misconfiguration leaking member PII across branches** (worst case: ladies-branch data). Per-role policy tests + Supabase advisors before any real data.
3. **External lead times block the revenue loop.** WABA approval + Tap KYC take weeks — start both at the very start of Phase 2 or Phase 5 slips.
4. **WhatsApp automation bugs** (double-sends, wrong numbers) damage a premium brand — idempotency log + dry-run mode are mandatory, not optional.
5. **Data migration is the riskiest assumption** — the specs implicitly assume a greenfield member base; reality is a ledger/Excel/WhatsApp history that must be imported, deduped, and parallel-run.
6. **Calculator math errors destroy credibility** — unit-test against published reference values, not just the demo fixture.
7. **RTL retrofit underestimated** — use logical properties from Phase 0 onward; budget a real QA pass in Phase 6.
8. **BHD is 3-decimal** — `numeric(7,3)` and integer fils everywhere; a float bug in money math is unrecoverable trust damage.

---

## 14. Consolidated Success Metrics

| Audience | Metric | Target |
|---|---|---|
| Public | Lighthouse mobile (all key pages) | ≥ 85 perf / ≥ 95 a11y / 100 SEO |
| Public | "calorie calculator Bahrain" SERP | Top 10 within 3 months of P1 |
| Public | Local pack "gym <area> Bahrain" | Top 3 for 4+ branches by P6 |
| Members | Account claim rate | ≥ 60% within 14 days |
| Members | Renewal via portal/reminders | +15 pts vs pre-launch baseline |
| Admins | New sign-ups digitally recorded | 100% by end of month 3 |
| Admins | Lead first response | < 4 business hours |
| Staff | Door visits logged | ≥ 70% by month 2 of P4 |
| Staff | Median equipment time-to-fix | < 7 days, visible per branch |
| Business | Online renewals via Tap | ≥ 15% by month 9 (stretch 20%) |
| Compliance | Cross-branch RLS violations | Zero, continuously tested |

---

## 15. Horizon 2 — The Future-of-Gym Layer (2026–2030)

> Added 2026-06-11 from a 4-track research sweep (industry trends, shipping AI, open-API hardware, competitor gap-check vs GymNation / Fitness First ME / Equinox+ / Basic-Fit / PureGym / Crunch). Horizon 2 items layer ON TOP of Phases 0–7 — none replace them. Already shipped ahead of schedule and referenced below: the 16-calculator Tools hub, the local-first My Progress system (streaks/badges/weight log/PRs), and Kiosk Mode for machine screens.

### 15.1 Competitive context

**GymNation entered Bahrain (Dec 2025)** running the regional "tech gym" playbook: an AI WhatsApp concierge ("Albus" — 87% conversation conversion, 75% automated tour booking), Boditrax body-scan kiosks at every club, a Middle-East HYROX partnership with monthly app leaderboards, and meal-plan partnerships (Kcal, Yalla Chef). They are the budget brand; Al Nakheel is the premium one — but the "smartest gym in Bahrain" narrative is up for grabs. Most of the counter-playbook is software this stack is already 70% positioned for.

### 15.2 H2-A — Software wins (no hardware; ride existing/planned infra)

| # | Feature | What it is | Rides on | Proven by |
|---|---|---|---|---|
| A1 | **AI workout-plan generator** | LLM endpoint consuming what we already store (calculator inputs, weight log, PRs, streak) → a branch-aware weekly plan, shareable to WhatsApp. Does in software what EGYM Genius needs six-figure equipment for. ~$50–200/mo API spend. | Tools hub + My Progress (shipped); portal (P3) for saved plans | EGYM Genius @ EoS, Planet Fitness pilot |
| A2 | **WhatsApp AI concierge** | RAG agent on the main WhatsApp number answering hours/pricing/ladies-branch questions + booking tours into the leads pipeline. Branch JSONs are the ready-made knowledge base. | WABA number (P2/D3), leads table (P2) | GymNation Albus; Equinox Agentforce |
| A3 | **Live occupancy / popular times** | "How busy is it right now" + predicted-crowd chart per branch. Entry events give live counts. **Highest value for ladies branches** (privacy windows). | QR check-in (P4) + Supabase (P2) | PureGym, Basic-Fit |
| A4 | **Challenges + prize leaderboards** | Time-boxed branch-vs-branch challenges with real prizes + monthly leaderboards, announced on Instagram. The direct GymNation/HYROX counter. | My Progress (shipped) synced via P3 accounts | GymNation, Dubai Fitness Challenge |
| A5 | **Guest pass / buddy bolt-on** | Recurring paid perk (e.g. 4 guest visits/mo): single-use QR the member shares over WhatsApp. Distinct from the P6 referral program. | QR check-in (P4), Tap (P5) | PureGym £3/mo bolt-on; Crunch tiers |
| A6 | **Multi-week training programs** | 6–12-week structured plans authored by our trainers, with completion ticks; extends calculators + progress into progression. | Tools hub (shipped), trainer profiles (P5) | PureGym 8-week plans, Equinox+ |
| A7 | **Perks marketplace + meal-plan partner** | Member-only partner discounts hub (10–20 premium Bahrain brands) + one meal-prep partnership. Natural funnel: macro calculator result → "get this as a meal plan". Near-zero code; all BD work. | Portal gate (P3) | Crunch Perks (1,600 partners); GymNation × Kcal |
| A8 | **Churn scoring** | Visit-frequency-decay score per member → at-risk queue in /admin → planned WhatsApp outreach. No ML needed at 8-branch scale; this is the "brain" on the P4 check-in pipes. | Check-ins (P4), WABA (P3) | Keepme (95% claimed accuracy), ABC Fitness |

### 15.3 H2-B — Hardware with open APIs (one purchase, three strategies)

- **InBody scanner per flagship (~$8–15k; start Al Liwan + Bahrain Bay) — the standout pick.** LookinBody Web has a documented API keyed by **phone number** — literally our WhatsApp-first member identity — so scan history flows into the portal's weight log (proven by TrainerMetrics/EGYM integrations). One purchase powers: free member scan days (premium perk), the paid **Longevity Assessment** product (15.4), and the GLP-1 positioning (15.4).
- **Myzone group heart-rate** (MZ-Switch belts + studio screens): MEPs gamification made for an Instagram-driven community; **free API tier (10k calls/mo)** pipes effort points into the existing badges/streaks. Quote-based club license; fits group classes.
- **Budget alternative:** Fit3D SNAP tablet scanning (~$200 + ~$100/mo per branch) if InBody capex stalls.
- **If smart strength ever tempts:** pilot EGYM (lease ≈ €95–150/machine/mo, open developer API) at one flagship — never the closed Technogym ecosystem buy-in.

### 15.4 H2-C — Positioning bets (2026–2030)

1. **The GLP-1/Ozempic era — the big one.** 25–40% of drug-induced weight loss is muscle; gyms worldwide are repositioning as the muscle-preservation layer of medical weight loss. Ship a "Strength on GLP-1s" program page (nobody owns this query in Bahrain) and upgrade progress tracking to **body-composition-first** (muscle kept, not just kg lost — InBody fields on the weight log).
2. **Recovery as a paid tier.** Sauna/cold plunge/compression at flagships sold as a +BD 15–25/mo add-on through the P5 Tap stack; recovery rooms model as bookable resources in the P5 booking engine. Red-light/recovery is an especially strong ladies-branch fit. (Crunch 3.0, Planet Fitness 2026, Life Time.)
3. **Longevity Assessment product.** InBody scan + VO₂ estimate (the calculator exists) + movement screen, bookable per branch, results timeline in the portal. The Equinox-Optimize/Life-Time-MIORA trend at Bahrain prices. Any bloodwork tier needs a licensed local clinic partner.
4. **Small-group training zones.** Coached, capped, premium-priced SGT at flagships (~40% higher LTV industry-wide); program pages + waitlist now, capacity booking when P5 ships.
5. **Corporate wellness, accelerated.** No Wellhub-style aggregator dominates Bahrain; 8 branches = island-wide coverage no single gym can pitch. (Already P2 — raise its priority.)

### 15.5 Explicit skips (decided, with reasons)

Camera-based form coaching (nothing production-grade on commercial floors; privacy non-starter in ladies branches) · licensed on-demand video libraries (too heavy at 8 branches — film 20–30 trainer demo clips via the Instagram pipeline instead) · wearable sync (requires a native app; revisit only if one ships — Terra/Open Wearables are the integration route then) · Technogym ecosystem (capex lock-in) · padel/court add-ons (facilities decision, not a website gap) · lost & found / parking features (no major operator productizes these — WhatsApp handles it).

**Design constraint for everything above:** only ~10% of consumers prefer AI-led coaching over humans (Les Mills 2026). AI stays invisible — concierge, churn scoring, plan drafting reviewed by trainers — while the brand keeps showing human coaches' faces.

### 15.6 Suggested sequencing

| When | Items |
|---|---|
| Alongside P2–P3 | A2 concierge (same WABA setup), A7 perks/meal partner (BD work in parallel), GLP-1 program page (content only) |
| Alongside P4–P5 | A3 occupancy, A5 guest passes, A8 churn scoring (all ride check-in data); first InBody + Longevity Assessment page; recovery add-on tier with booking |
| After P5 | A1 plan generator (richest once portal data syncs — or earlier as a free teaser), A4 prize challenges, A6 programs, Myzone pilot, SGT zones |

---

*This roadmap supersedes the "Deferred / TODO" and "Development Phases" sections of CLAUDE.md where they conflict (notably: Sanity CMS is dropped per D1; the Resend contact form becomes the Phase 2 leads pipeline per D2). Keep both documents in sync as phases land.*
