# Al Nakheel Premium — Project Requirements & Specifications

---

## 1. Project Overview

**Al Nakheel Premium** is Bahrain's leading premium fitness center — self-described as "the fitness centre of the elite." The brand operates multiple branches across Bahrain, each a large-scale, fully equipped premium facility. This website serves as the central digital hub — "one fit for all" — unifying all branch locations under a single, cohesive brand experience. Visitors should be able to discover the brand, explore any branch's unique details (timings, pricing, gallery, location), and take action (inquiry, visit, membership sign-up).

**Hero Copy (use verbatim on the website):**
> "Bahrain's Leading Premium Fitness Center for the Elite of Bahrain. All the equipment, trainers, classes, and facilities to help you meet your goals."

**Primary Goals:**
- Project a premium, high-trust brand identity across every page and interaction
- Present all branches with branch-specific data in a consistent, scalable layout
- Drive foot traffic and membership inquiries through clear CTAs
- Be fully SEO-optimized and performant on mobile and desktop
- Rank for local Bahrain fitness search terms (e.g., "best gym in Bahrain", "premium gym Bahrain Bay")

---

## 2. Tech Stack Recommendations

### Recommended Stack: Next.js + Tailwind CSS + Sanity CMS

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR/SSG for SEO, fast page loads, file-based routing |
| Styling | Tailwind CSS | Utility-first, consistent design tokens, fast iteration |
| CMS | Sanity.io | Structured content, branch-specific data schemas, real-time preview |
| Hosting | Vercel | Zero-config Next.js deployment, edge CDN |
| Maps | Google Maps Embed API | Branch-specific embedded maps |
| Forms | React Hook Form + Resend | Lightweight inquiry forms with email delivery |
| Analytics | Vercel Analytics + Google Analytics 4 | SEO and traffic insights |
| Image CDN | Next.js Image + Sanity CDN | Automatic optimization, lazy loading |

### Why Not WordPress/Webflow?
- **Webflow** is viable for a purely marketing site but limits custom data modeling for multi-branch schemas
- **WordPress** adds plugin complexity and maintenance overhead
- **Next.js + Sanity** gives full control, better performance scores, and a clean separation between content and code — recommended for a scalable multi-branch product

---

## 3. Sitemap & Page Structure

```
/                          → Home
/about                     → About Us
/branches                  → All Branches (overview grid)
/branches/[slug]           → Individual Branch Page (dynamic template)
/memberships               → Memberships & Pricing (cross-branch or per-branch filter)
/gallery                   → Global Gallery (filterable by branch)
/contact                   → Contact / General Inquiry
/privacy-policy            → Legal
/terms                     → Legal
```

### Page Descriptions

#### `/` — Home
- Hero section with full-screen video/image background and tagline
- "One Fit For All" value proposition section
- Branch cards grid (quick overview of all locations)
- Featured membership tiers (CTA → /memberships)
- Testimonials / social proof
- Instagram feed embed or curated photo strip
- Sticky CTA bar ("Find Your Branch")

#### `/about`
- Brand story and mission statement
- Timeline or milestone section
- Core values (icons + short text)
- Team/management section (optional)
- Awards or certifications

#### `/branches`
- Filterable/searchable grid of all branches
- Each card: branch name, city, hero image, quick timings, "View Branch" CTA

#### `/branches/[slug]` — Branch Template (core reusable page)
- Branch hero image + name + tagline
- Operating timings table
- Amenities/features list
- Pricing / membership tiers specific to this branch
- Photo gallery (filterable: interior, equipment, classes)
- Embedded Google Map
- Contact details (phone, WhatsApp, email)
- Inquiry form pre-tagged with branch name

#### `/memberships`
- Branch selector dropdown or tab filter
- Pricing table per branch (or unified if pricing is shared)
- Comparison table (optional: Basic vs. Premium vs. VIP)
- FAQ accordion
- CTA: "Join Now" / "Book a Tour"

#### `/gallery`
- Masonry or grid gallery
- Filter by branch tag
- Lightbox on click

#### `/contact`
- General inquiry form
- Branch selector field
- Interactive map showing all branch pins
- Social media links

---

## 4. Component Architecture

All components are written in React and styled with Tailwind. Components are organized into three tiers: **Layout**, **Section**, and **UI**.

### Layout Components
```
<RootLayout />           — Global header, footer, meta tags
<PageHeader />           — Reusable hero banner (title, subtitle, bg image)
<SectionWrapper />       — Consistent padding/max-width container
```

### Section Components
```
<HeroSection />          — Full-screen hero with video/image bg, headline, CTA buttons
<BranchGrid />           — Grid of <BranchCard /> components with optional filter
<MembershipsSection />   — Branch-filtered pricing display
<TestimonialsSection />  — Carousel of member reviews
<GallerySection />       — Filterable photo grid with lightbox
<ContactSection />       — Inquiry form + map embed
<AboutSection />         — Brand story, values, milestones
```

### UI / Atomic Components
```
<BranchCard />
  props: name, city, slug, heroImage, shortTimings, amenitiesCount

<PricingTable />
  props: branchSlug, tiers[] (name, price, duration, features[])

<TimingsTable />
  props: schedule[] (day, openTime, closeTime, isHoliday)

<ImageGallery />
  props: images[], filterTags[], layout ("grid" | "masonry")

<MapEmbed />
  props: embedUrl, branchName, address

<InquiryForm />
  props: defaultBranch (pre-selects branch in dropdown)

<AmenitiesList />
  props: amenities[] (icon, label)

<CTAButton />
  props: label, href, variant ("primary" | "secondary" | "ghost")

<SectionHeading />
  props: eyebrow, title, subtitle, alignment ("left" | "center")

<Breadcrumb />
  props: items[] (label, href)

<WhatsAppButton />       — Fixed floating button linking to branch WhatsApp
```

---

## 5. Data Structure (Mock Schema)

### Branch Schema (Sanity or JSON)

The schema supports a `timings` array with an optional `section` field to handle branches that have separate mix/ladies floors with different hours (e.g., Al Liwan).

---

#### Branch 1 — Al Liwan, Hamala (LIVE DATA)

```json
{
  "id": "branch-alliwan",
  "slug": "al-liwan",
  "name": "Al Nakheel Premium — Al Liwan",
  "shortName": "Al Liwan",
  "location": "Al Liwan, Hamala, Bahrain",
  "tagline": "Where Bahrain's Elite Train",
  "heroImage": "/images/branches/al-liwan/hero.jpg",
  "contact": {
    "phone": "+97338833663",
    "whatsapp": "+97338833663",
    "instagram": "https://instagram.com/alnakheelpremium_alliwan",
    "instagramHandle": "@alnakheelpremium_alliwan",
    "address": "Al Liwan, Hamala, Kingdom of Bahrain"
  },
  "location": {
    "lat": null,
    "lng": null,
    "googleMapsEmbedUrl": "PENDING"
  },
  "timings": [
    {
      "section": "mix",
      "label": "Mixed Floor",
      "days": [
        { "day": "Saturday",  "open": "05:00", "close": "23:00" },
        { "day": "Sunday",    "open": "05:00", "close": "23:00" },
        { "day": "Monday",    "open": "05:00", "close": "23:00" },
        { "day": "Tuesday",   "open": "05:00", "close": "23:00" },
        { "day": "Wednesday", "open": "05:00", "close": "23:00" },
        { "day": "Thursday",  "open": "05:00", "close": "23:00" },
        { "day": "Friday",    "open": "08:00", "close": "20:00" }
      ]
    },
    {
      "section": "ladies",
      "label": "Ladies Floor",
      "days": [
        { "day": "Saturday",  "open": "06:00", "close": "22:00" },
        { "day": "Sunday",    "open": "06:00", "close": "22:00" },
        { "day": "Monday",    "open": "06:00", "close": "22:00" },
        { "day": "Tuesday",   "open": "06:00", "close": "22:00" },
        { "day": "Wednesday", "open": "06:00", "close": "22:00" },
        { "day": "Thursday",  "open": "06:00", "close": "22:00" },
        { "day": "Friday",    "open": "08:00", "close": "20:00" }
      ]
    }
  ],
  "memberships": [
    {
      "tier": "Monthly",
      "priceFrom": 70,
      "currency": "BHD",
      "duration": "1 month",
      "highlighted": false
    },
    {
      "tier": "3 Months",
      "priceFrom": 190,
      "currency": "BHD",
      "duration": "3 months",
      "highlighted": false
    },
    {
      "tier": "6 Months",
      "priceFrom": 290,
      "currency": "BHD",
      "duration": "6 months",
      "highlighted": true
    },
    {
      "tier": "Annual",
      "priceFrom": 420,
      "currency": "BHD",
      "duration": "12 months",
      "highlighted": false
    },
    {
      "tier": "Couples Annual",
      "priceFrom": 737,
      "currency": "BHD",
      "duration": "12 months",
      "note": "For two members",
      "highlighted": false
    }
  ],
  "amenities": [
    { "icon": "dumbbell",   "label": "Free Weights Zone" },
    { "icon": "running",    "label": "Cardio Area" },
    { "icon": "users",      "label": "Group Classes" },
    { "icon": "user",       "label": "Ladies-Only Floor" },
    { "icon": "person-standing", "label": "Personal Trainers" },
    { "icon": "eye",        "label": "Premium Views" }
  ],
  "gallery": [
    { "url": "/images/branches/al-liwan/interior-1.jpg", "tag": "interior", "alt": "Main gym floor at Al Liwan" },
    { "url": "/images/branches/al-liwan/interior-2.jpg", "tag": "interior", "alt": "Cardio and track area" },
    { "url": "/images/branches/al-liwan/equipment-1.jpg", "tag": "equipment", "alt": "Free weights section" }
  ],
  "isNew": false,
  "comingSoon": false
}
```

---

#### Branch 2 — The Park, Bahrain Bay (LIVE DATA)

```json
{
  "id": "branch-bahrainbay",
  "slug": "bahrain-bay",
  "name": "Al Nakheel Premium — Bahrain Bay",
  "shortName": "Bahrain Bay",
  "location": "The Park, Bahrain Bay, Bahrain",
  "tagline": "Train With a View. Live at the Bay.",
  "heroImage": "/images/branches/bahrain-bay/hero.jpg",
  "contact": {
    "phone": "+97338833012",
    "whatsapp": "+97338833012",
    "instagram": "https://instagram.com/alnakheelpremium_bahrainbay",
    "instagramHandle": "@alnakheelpremium_bahrainbay",
    "address": "The Park, Bahrain Bay, Kingdom of Bahrain"
  },
  "location": {
    "lat": null,
    "lng": null,
    "googleMapsEmbedUrl": "PENDING"
  },
  "timings": [
    {
      "section": "mix",
      "label": "All Members",
      "days": [
        { "day": "Saturday",  "open": "05:00", "close": "22:00" },
        { "day": "Sunday",    "open": "05:00", "close": "22:00" },
        { "day": "Monday",    "open": "05:00", "close": "22:00" },
        { "day": "Tuesday",   "open": "05:00", "close": "22:00" },
        { "day": "Wednesday", "open": "05:00", "close": "22:00" },
        { "day": "Thursday",  "open": "05:00", "close": "22:00" },
        { "day": "Friday",    "open": "08:00", "close": "20:00" }
      ]
    }
  ],
  "memberships": [
    {
      "tier": "Monthly",
      "priceFrom": 60,
      "currency": "BHD",
      "duration": "1 month",
      "highlighted": false
    },
    {
      "tier": "3 Months",
      "priceFrom": 165,
      "currency": "BHD",
      "duration": "3 months",
      "highlighted": false
    },
    {
      "tier": "6 Months",
      "priceFrom": 255,
      "currency": "BHD",
      "duration": "6 months",
      "highlighted": true
    },
    {
      "tier": "Annual",
      "priceFrom": 350,
      "currency": "BHD",
      "duration": "12 months",
      "highlighted": false
    },
    {
      "tier": "Couples Annual",
      "priceFrom": 690,
      "currency": "BHD",
      "duration": "12 months",
      "note": "For two members",
      "highlighted": false
    }
  ],
  "amenities": [
    { "icon": "dumbbell",   "label": "Free Weights Zone" },
    { "icon": "running",    "label": "Cardio Area" },
    { "icon": "users",      "label": "Group Classes" },
    { "icon": "person-standing", "label": "Personal Trainers" },
    { "icon": "waves",      "label": "Waterfront Views" },
    { "icon": "building-2", "label": "Bay Location" }
  ],
  "gallery": [
    { "url": "/images/branches/bahrain-bay/interior-1.jpg", "tag": "interior", "alt": "Main gym floor at Bahrain Bay" },
    { "url": "/images/branches/bahrain-bay/interior-2.jpg", "tag": "interior", "alt": "Upper mezzanine level" },
    { "url": "/images/branches/bahrain-bay/equipment-1.jpg", "tag": "equipment", "alt": "Equipment area with bay views" }
  ],
  "isNew": false,
  "comingSoon": false
}
```

---

### Global Site Settings Schema

```json
{
  "siteName": "Al Nakheel Premium",
  "tagline": "One Fit For All",
  "heroCopy": "Bahrain's Leading Premium Fitness Center for the Elite of Bahrain",
  "country": "Bahrain",
  "currency": "BHD",
  "logo": {
    "dark": "/brand/logo-dark.svg",
    "light": "/brand/logo-light.svg"
  },
  "contact": {
    "generalPhone1": "+97338833663",
    "generalPhone2": "+97338833990"
  },
  "socialLinks": {
    "instagram": "https://instagram.com/alnakheelpremium",
    "snapchat": "PENDING"
  },
  "branches": ["branch-alliwan", "branch-bahrainbay"]
}
```

---

## 6. Design & UI/UX Guidelines

### 6.1 Brand Identity — Observed from Assets

The following is derived directly from the provided logo and interior photography. All design decisions must align with these observations.

**Logo Mark:** A fluid, calligraphic white ribbon that forms an abstract figure — simultaneously suggesting the letter "A", a human in motion, and a palm frond (نخيل). It is monochromatic white on black. The mark has an organic, athletic energy.

**Wordmark:** "ALNAKHEEL" set in a wide-tracked, thin-to-medium weight geometric sans-serif in full caps, with "PREMIUM" below in lighter weight and even wider tracking. The typography is clean, architectural, and restrained.

**Logo Variants:**
- `logo-dark.svg` — white mark + white wordmark on black (primary, used on dark backgrounds and hero)
- `logo-light.svg` — black mark + black wordmark on white (used on light sections and print)

**Physical Brand Signatures (must translate to digital):**
- Signature motivational wall: **"WHAT DOESN'T KILL YOU MAKES YOU STRONGER"** — bold black type with select words in red. This typographic bold-statement pattern is a core brand element.
- Signature structural detail: **red industrial pipes** running across raw exposed concrete ceilings — red is the brand's sole accent color
- Signature flooring: **dark rubber athletic tracks** with white painted lane markings — inspires a horizontal stripe/track motif for dividers and section accents
- Signature scale: **vast, double-height open floor plans** with floor-to-ceiling glass — photography must convey this sense of scale

**Three adjectives every design decision must pass:** Raw. Powerful. Premium.

---

### 6.2 Color Palette

The brand is strictly **black, white, and red**. There is no gold. No gradients. No third accent color.

```
Brand Black       #0D0D0D    — Logo background, dark section backgrounds, text on white
Pure White        #FFFFFF    — Logo mark, headings on dark, light section backgrounds
Brand Red         #CC1A1A    — The ONLY accent color: CTAs, highlights, active states,
                               key words in typographic quotes, hover indicators
Off-White         #F5F4F2    — Subtle light backgrounds, cards on white sections
Concrete Grey     #2A2A2A    — Dark card backgrounds, footer
Mid-Grey          #6B6B6B    — Secondary body text, placeholder text, dividers
Light Grey        #E5E5E5    — Borders on light sections, input borders
Closed Red        #CC1A1A    — Same as Brand Red; used for "closed" timing states
Open Green        #1A7A3C    — "Open now" indicator only — used sparingly
```

**Do not introduce any other colors.** The brand power comes from this severe restraint.

---

### 6.3 Design Direction: Dual-Zone Layout

The website alternates between two distinct zone types, mirroring the brand's physical contrast between its bold black exterior and bright white interior:

```
DARK ZONES  — Black (#0D0D0D) background, white text, red accent
             Used for: hero sections, navbar, footer, quote blocks, CTA banners

LIGHT ZONES — White (#FFFFFF) or Off-White (#F5F4F2) background, black text, red accent
             Used for: branch info, pricing, timings, gallery, about sections
```

Sections alternate between zones to create rhythm. Never place two dark zones or two light zones back to back without a deliberate break.

---

### 6.4 Typography

The logo wordmark uses a geometric sans-serif with very wide letter-spacing. Match this character in all digital typography.

```
Display / Wordmark : Montserrat — Black (900) for "ALNAKHEEL"-style headings,
                                  Light (300) for "PREMIUM"-style subtitles
Body / UI          : Inter — Regular (400) for body, SemiBold (600) for labels/nav
Impact / Quote     : Bebas Neue — for motivational quote blocks and large stats only
```

**Type Scale (Desktop):**
```
Hero H1     : 96px / Montserrat Black / tracking: 0.15em / all-caps
Page H1     : 64px / Montserrat Black / tracking: 0.1em / all-caps
H2          : 48px / Montserrat Bold (700) / tracking: 0.05em
H3          : 28px / Montserrat SemiBold (600)
H4          : 20px / Inter SemiBold (600)
Body        : 16px / Inter Regular (400) / line-height: 1.7
Small       : 14px / Inter Regular (400)
Quote Block : 72–120px / Bebas Neue / tracking: 0.02em
Pricing Num : 56px / Bebas Neue
```

**Mobile scale:** Hero H1 → 48px, Page H1 → 40px, H2 → 32px, Quote → 48–72px.

**Typographic Quote Pattern (key brand element):**
Replicate the wall art digitally. Large all-caps quote text, most words in black (on white) or white (on black), with 1–2 power words set in Brand Red `#CC1A1A`.

```
Example:
WHAT DOESN'T KILL [black/white]
YOU [RED]
MAKES YOU [black/white]
STRONGER [RED]
```

Use this pattern in hero sections, section dividers, and CTA banners.

---

### 6.5 Spacing System

Use an 8-point grid exclusively.
```
4px   — xs (badge padding, tight gaps)
8px   — sm
16px  — md
24px  — lg
32px  — xl
48px  — 2xl
64px  — 3xl
96px  — 4xl (section padding top/bottom)
128px — 5xl (hero padding top/bottom)
```

---

### 6.6 UI Design Patterns

**Cards (on light zones):**
- Background: `#FFFFFF`
- Border: `1px solid #E5E5E5`
- Hover: left border becomes `4px solid #CC1A1A`, slight `translateY(-4px)` + box-shadow
- Border-radius: `0px` — no rounded corners. The brand is architectural, not soft.

**Cards (on dark zones):**
- Background: `#2A2A2A`
- Border: `1px solid rgba(255,255,255,0.08)`
- Hover: left border `4px solid #CC1A1A`

**Buttons:**
```
Primary   : bg #CC1A1A, text #FFFFFF, font Montserrat Bold, px-8 py-3,
            tracking: 0.1em, all-caps, border-radius: 0px
            Hover: bg #AA1414

Secondary : border 2px solid #CC1A1A, text #CC1A1A, transparent bg, same sizing
            Hover: bg #CC1A1A, text #FFFFFF

Ghost     : text #FFFFFF (on dark) or #0D0D0D (on light), no border,
            underline grows on hover via CSS clip-path animation
```

**No rounded buttons.** Sharp rectangle edges only — consistent with the industrial aesthetic.

**Dividers & Track Motif:**
Use the athletic track floor pattern as a decorative element between sections:
```css
/* Track stripe divider */
border-top: 3px solid #0D0D0D;
margin: 0;
/* Optionally add a 1px red line 8px below for a double-stripe effect */
```

**Section separators:** A bold `3px` black line (on light) or white line (on dark), full-width, with no padding — mimicking the track floor line markings.

**Imagery Rules:**
- Only use real photography from the actual branches — never stock imagery
- Hero images: apply `rgba(0,0,0,0.5)` overlay to ensure white text legibility
- Showcase scale: wide-angle shots of the full gym floor are preferred over closeups
- The natural light through floor-to-ceiling windows is a strong visual — prioritize shots that capture it
- Image aspect ratios: hero 16:9 or cinematic 21:9, gallery cards 4:3, branch cards 3:2

**Icons:** Use [Lucide React](https://lucide.dev) — stroke-only, 1.5px weight, no fills.

**Texture / Industrial Motif (optional, use sparingly):**
A subtle SVG concrete texture overlay at `4% opacity` can be applied to dark section backgrounds to evoke the exposed concrete ceiling aesthetic.

---

### 6.7 Animations

- Library: `framer-motion`
- Entrance: `opacity: 0 → 1` + `translateY(24px → 0)`, duration `0.45s`, ease `[0.25, 0.1, 0.25, 1]`
- Stagger child items by `0.08s`
- Quote block words: reveal word by word with a stagger of `0.05s`
- No bounce, no spring, no playful easing — movements are direct and confident
- Respect `prefers-reduced-motion`: wrap all animations in a media query check

---

### 6.8 Layout Guidelines

- Max content width: `1280px`, centered
- Full-bleed sections (hero, quote banners): `100vw`
- Side padding on mobile: `16px`
- Side padding on tablet: `32px`
- Side padding on desktop: auto (max-width container)

---

### 6.9 Navigation

- **Desktop:** Fixed top navbar — transparent on hero, transitions to solid `#0D0D0D` on scroll
- Logo: left-aligned, always the dark variant (white on black navbar)
- Nav links: center, Montserrat SemiBold, tracking: 0.08em, all-caps, small size (14px)
- Active link: `2px solid #CC1A1A` bottom border
- CTA Button: right-aligned, red primary button — "JOIN NOW"
- **Mobile:** Hamburger (3 lines → X) → full-screen black overlay, links stacked vertically in large Bebas Neue type, red CTA at bottom
- Include a persistent "Find a Branch" link in the nav (links to `/branches`)

---

### 6.10 Accessibility

- Minimum contrast ratio: 4.5:1 for all body text (white on `#0D0D0D` = 19.5:1 ✓, white on `#CC1A1A` = 4.6:1 ✓)
- All interactive elements: `:focus-visible` outline `2px solid #CC1A1A` with `outline-offset: 4px`
- All images: descriptive `alt` attributes
- Semantic HTML: `<main>`, `<nav>`, `<article>`, `<section>`, `<header>`, `<footer>`
- ARIA labels on all icon-only buttons
- Motion: `@media (prefers-reduced-motion: reduce)` disables all `framer-motion` animations

---

## 7. SEO & Performance Requirements

- **Core Web Vitals targets:** LCP < 2.5s, CLS < 0.1, FID < 100ms
- Each branch page gets a unique `<title>`, `<meta description>`, and `og:image`
- `sitemap.xml` auto-generated including all branch slugs
- `robots.txt` configured to allow full crawl
- Structured data (`JSON-LD`) for `LocalBusiness` on each branch page including address, hours, phone
- All images served via Next.js `<Image>` with `priority` on above-the-fold assets
- Route-level code splitting (automatic with Next.js App Router)

---

## 8. Branch Page JSON-LD Examples

### Al Liwan Branch

```json
{
  "@context": "https://schema.org",
  "@type": "HealthClub",
  "name": "Al Nakheel Premium — Al Liwan",
  "image": "https://alnakheelpremium.com/images/branches/al-liwan/hero.jpg",
  "url": "https://alnakheelpremium.com/branches/al-liwan",
  "telephone": "+97338833663",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Al Liwan, Hamala",
    "addressLocality": "Hamala",
    "addressCountry": "BH"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      "opens": "05:00",
      "closes": "23:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Friday"],
      "opens": "08:00",
      "closes": "20:00"
    }
  ],
  "priceRange": "BHD 70–737"
}
```

### Bahrain Bay Branch

```json
{
  "@context": "https://schema.org",
  "@type": "HealthClub",
  "name": "Al Nakheel Premium — Bahrain Bay",
  "image": "https://alnakheelpremium.com/images/branches/bahrain-bay/hero.jpg",
  "url": "https://alnakheelpremium.com/branches/bahrain-bay",
  "telephone": "+97338833012",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "The Park, Bahrain Bay",
    "addressLocality": "Bahrain Bay",
    "addressCountry": "BH"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      "opens": "05:00",
      "closes": "22:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Friday"],
      "opens": "08:00",
      "closes": "20:00"
    }
  ],
  "priceRange": "BHD 60–690"
}
```

---

## 9. File & Folder Structure

```
/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                     ← Home
│   ├── about/page.tsx
│   ├── branches/
│   │   ├── page.tsx                 ← All branches
│   │   └── [slug]/page.tsx          ← Dynamic branch template
│   ├── memberships/page.tsx
│   ├── gallery/page.tsx
│   └── contact/page.tsx
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── PageHeader.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── BranchGrid.tsx
│   │   ├── MembershipsSection.tsx
│   │   ├── GallerySection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── ContactSection.tsx
│   └── ui/
│       ├── BranchCard.tsx
│       ├── PricingTable.tsx
│       ├── TimingsTable.tsx
│       ├── ImageGallery.tsx
│       ├── MapEmbed.tsx
│       ├── InquiryForm.tsx
│       ├── AmenitiesList.tsx
│       ├── CTAButton.tsx
│       ├── SectionHeading.tsx
│       └── WhatsAppButton.tsx
├── lib/
│   ├── sanity.ts                    ← Sanity client config
│   ├── queries.ts                   ← GROQ queries
│   └── utils.ts
├── data/
│   └── branches/
│       ├── riyadh-north.json        ← Local mock data (pre-CMS)
│       ├── jeddah-corniche.json
│       └── ...
├── public/
│   ├── brand/
│   │   ├── logo-light.svg
│   │   └── logo-dark.svg
│   └── images/
│       └── branches/
├── styles/
│   └── globals.css
├── tailwind.config.ts
├── next.config.ts
└── sanity.config.ts
```

---

## 10. Development Phases

| Phase | Scope | Deliverable |
|---|---|---|
| 1 — Foundation | Scaffold Next.js app, Tailwind config, design tokens, Navbar, Footer | Blank shell with brand system |
| 2 — Home Page | Hero, BranchGrid, Memberships teaser, Testimonials | Fully designed home |
| 3 — Branch Template | Dynamic `[slug]` page with all branch components | Reusable branch page |
| 4 — Supporting Pages | About, Gallery, Memberships, Contact | Full site content |
| 5 — CMS Integration | Connect Sanity schemas, migrate mock JSON data | Live editable content |
| 6 — SEO & Performance | JSON-LD, sitemap, image optimization, Core Web Vitals audit | Production-ready |
| 7 — QA & Launch | Cross-browser testing, mobile QA, accessibility audit, go live | Deployed on Vercel |

---

## 11. Branch Status Register

| # | Branch Name | Slug | Status | Missing Data |
|---|---|---|---|---|
| 1 | Al Nakheel Premium — Al Liwan | `al-liwan` | **Data complete** | Google Maps embed URL, hero + gallery images |
| 2 | Al Nakheel Premium — Bahrain Bay | `bahrain-bay` | **Data complete** | Google Maps embed URL, hero + gallery images |
| 3 | TBD | TBD | Pending | All data |
| 4 | TBD | TBD | Pending | All data |
| 5+ | TBD | TBD | Pending | All data |

### Branch Data Checklist (per branch, before go-live)

- [ ] Branch name, slug, city, address
- [ ] Hero image (min 1920×1080px)
- [ ] Gallery images (minimum 6 — mix of interior, equipment, classes)
- [ ] Full timings (all 7 days, per section if ladies/mix are separate)
- [ ] All membership tiers with prices in BHD
- [ ] Phone number (with country code +973)
- [ ] Instagram handle
- [ ] Google Maps embed URL
- [ ] WhatsApp number

### Pricing Quick Reference

| Tier | Al Liwan | Bahrain Bay |
|---|---|---|
| Monthly | BD 70 | BD 60 |
| 3 Months | BD 190 | BD 165 |
| 6 Months | BD 290 | BD 255 |
| Annual | BD 420 | BD 350 |
| Couples Annual | BD 737 | BD 690 |

### Timings Quick Reference

| Branch | Sat–Thu (Mix) | Sat–Thu (Ladies) | Friday |
|---|---|---|---|
| Al Liwan | 5:00 AM – 11:00 PM | 6:00 AM – 10:00 PM | 8:00 AM – 8:00 PM |
| Bahrain Bay | 5:00 AM – 10:00 PM | — (mixed only) | 8:00 AM – 8:00 PM |

---

*This document is the single source of truth for the Al Nakheel Premium website build. All decisions made during development should reference and remain consistent with these specifications.*
