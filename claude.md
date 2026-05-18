# Al Nakheel Premium — Project Requirements & Specifications

---

## 1. Project Overview

**Al Nakheel Premium** is a multi-branch premium gym network. This website serves as the central digital hub — "one fit for all" — unifying all branch locations under a single, cohesive brand experience. Visitors should be able to discover the brand, explore any branch's unique details (timings, pricing, gallery, location), and take action (inquiry, visit, membership sign-up).

**Primary Goals:**
- Project a premium, high-trust brand identity across every page and interaction
- Present all branches with branch-specific data in a consistent, scalable layout
- Drive foot traffic and membership inquiries through clear CTAs
- Be fully SEO-optimized and performant on mobile and desktop

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

```json
{
  "id": "branch-riyadh-north",
  "slug": "riyadh-north",
  "name": "Al Nakheel Premium — Riyadh North",
  "shortName": "Riyadh North",
  "city": "Riyadh",
  "tagline": "Elite Training in the Heart of the North",
  "heroImage": "/images/branches/riyadh-north/hero.jpg",
  "contact": {
    "phone": "+966-XX-XXXXXXX",
    "whatsapp": "+966XXXXXXXXX",
    "email": "riyadhnorth@alnakheel.com",
    "address": "Building 12, King Fahd Road, North Riyadh, Saudi Arabia"
  },
  "location": {
    "lat": 24.7136,
    "lng": 46.6753,
    "googleMapsEmbedUrl": "https://www.google.com/maps/embed?pb=..."
  },
  "timings": [
    { "day": "Sunday",    "open": "06:00", "close": "23:00", "isHoliday": false },
    { "day": "Monday",    "open": "06:00", "close": "23:00", "isHoliday": false },
    { "day": "Tuesday",   "open": "06:00", "close": "23:00", "isHoliday": false },
    { "day": "Wednesday", "open": "06:00", "close": "23:00", "isHoliday": false },
    { "day": "Thursday",  "open": "06:00", "close": "00:00", "isHoliday": false },
    { "day": "Friday",    "open": "14:00", "close": "00:00", "isHoliday": false },
    { "day": "Saturday",  "open": "08:00", "close": "23:00", "isHoliday": false }
  ],
  "memberships": [
    {
      "tier": "Basic",
      "price": 199,
      "currency": "SAR",
      "duration": "monthly",
      "features": [
        "Gym floor access",
        "Locker room",
        "2 group classes/month"
      ]
    },
    {
      "tier": "Premium",
      "price": 349,
      "currency": "SAR",
      "duration": "monthly",
      "features": [
        "All Basic features",
        "Unlimited group classes",
        "Personal trainer session (1x/month)",
        "Sauna access"
      ],
      "highlighted": true
    },
    {
      "tier": "VIP",
      "price": 599,
      "currency": "SAR",
      "duration": "monthly",
      "features": [
        "All Premium features",
        "Dedicated locker",
        "4 PT sessions/month",
        "Guest passes (2x/month)",
        "Priority booking"
      ]
    }
  ],
  "amenities": [
    { "icon": "dumbbell",      "label": "Free Weights Zone" },
    { "icon": "running",       "label": "Cardio Area" },
    { "icon": "users",         "label": "Group Classes" },
    { "icon": "droplet",       "label": "Sauna" },
    { "icon": "shield",        "label": "24/7 Security" },
    { "icon": "parking",       "label": "Free Parking" },
    { "icon": "wifi",          "label": "High-Speed WiFi" },
    { "icon": "coffee",        "label": "Protein Bar" }
  ],
  "gallery": [
    { "url": "/images/branches/riyadh-north/interior-1.jpg", "tag": "interior", "alt": "Main gym floor" },
    { "url": "/images/branches/riyadh-north/equipment-1.jpg", "tag": "equipment", "alt": "Cable machine section" },
    { "url": "/images/branches/riyadh-north/classes-1.jpg",  "tag": "classes",   "alt": "Yoga class" }
  ],
  "isNew": false,
  "comingSoon": false
}
```

### Global Site Settings Schema

```json
{
  "siteName": "Al Nakheel Premium",
  "tagline": "One Fit For All",
  "logo": {
    "light": "/brand/logo-light.svg",
    "dark": "/brand/logo-dark.svg"
  },
  "socialLinks": {
    "instagram": "https://instagram.com/alnakheelpremium",
    "twitter": "https://twitter.com/alnakheelpremium",
    "snapchat": "https://snapchat.com/add/alnakheelpremium"
  },
  "globalWhatsapp": "+966XXXXXXXXX",
  "branches": ["branch-riyadh-north", "branch-jeddah-corniche", "..."]
}
```

---

## 6. Design & UI/UX Guidelines

### 6.1 Brand Identity Principles

Al Nakheel Premium targets an affluent, fitness-conscious audience. Every design decision must reinforce three adjectives: **Premium. Powerful. Precise.**

### 6.2 Color Palette

```
Primary Gold      #C9A84C    — CTAs, highlights, accents, active states
Deep Black        #0A0A0A    — Primary background (dark-first design)
Off-White         #F5F0E8    — Body text on dark, card backgrounds
Charcoal          #1A1A1A    — Card/section backgrounds
Mid-Grey          #4A4A4A    — Secondary text, borders, dividers
Success Green     #2D6A4F    — Availability, success states
Alert Red         #C1121F    — Closed/holiday states, error messages
```

**Design Direction:** Dark-first. The primary experience is a dark-background website with gold accents, not a light theme with dark text.

### 6.3 Typography

```
Display / Hero    : Playfair Display (serif) — for hero headings, branch names
Body / UI         : Inter (sans-serif) — for all body copy, labels, UI text
Accent / Numbers  : Bebas Neue (display) — for pricing, stats, large numbers
```

**Scale (Desktop):**
```
H1  : 72px / 900 weight / Playfair Display
H2  : 48px / 700 weight / Playfair Display
H3  : 32px / 600 weight / Inter
H4  : 24px / 600 weight / Inter
Body: 16px / 400 weight / Inter
Small: 14px / 400 weight / Inter
```

**Mobile: scale down H1 → 42px, H2 → 32px, maintain body at 16px.**

### 6.4 Spacing System

Use an 8-point grid exclusively.
```
4px   — xs (tight spacing, badge padding)
8px   — sm
16px  — md
24px  — lg
32px  — xl
48px  — 2xl
64px  — 3xl
96px  — 4xl (section padding)
128px — 5xl (hero vertical padding)
```

### 6.5 UI Design Patterns

**Cards:**
- Background: `#1A1A1A` (Charcoal)
- Border: `1px solid rgba(201, 168, 76, 0.2)` (subtle gold)
- Hover: border opacity → 0.6, slight upward `translateY(-4px)` with shadow
- Border-radius: `12px`

**Buttons:**
```
Primary   : bg #C9A84C, text #0A0A0A, font-weight 700, px-8 py-3, rounded-full
Secondary : border 1px #C9A84C, text #C9A84C, transparent bg, same sizing
Ghost     : text #F5F0E8, no border, underline on hover
```

**Section Separators:** Use sparse, thin gold horizontal lines (`<hr>` styled with `border-color: #C9A84C, opacity: 0.15`) rather than heavy dividers.

**Imagery:**
- High-contrast, dramatic gym photography
- Avoid stock-photo feel — use real branch images wherever possible
- Apply a subtle dark overlay (`rgba(0,0,0,0.4)`) on all hero images to ensure text legibility
- Image aspect ratios: hero 16:9, gallery cards 4:3, branch cards 3:2

**Icons:** Use [Lucide React](https://lucide.dev) — clean, consistent, and tree-shakeable.

**Animations:**
- Use `framer-motion` for page transitions and scroll-triggered reveals
- Entrance: `opacity: 0 → 1` + `translateY(20px → 0)`, duration `0.5s`, ease `easeOut`
- Stagger child elements by `0.1s`
- Never animate more than 3 elements simultaneously to avoid visual noise

### 6.6 Layout Guidelines

- Max content width: `1280px`, centered
- Full-bleed sections (hero, dark feature sections): `100vw`
- Side padding on mobile: `16px`
- Side padding on tablet: `32px`
- Side padding on desktop: auto (handled by max-width container)

### 6.7 Navigation

- **Desktop:** Fixed top navbar, transparent on hero → solid `#0A0A0A` on scroll, logo left, links center, CTA right
- **Mobile:** Hamburger menu → full-screen overlay with gold accents
- Active link: gold underline indicator
- Include a persistent "Find a Branch" CTA button in the nav

### 6.8 Accessibility

- Minimum contrast ratio: 4.5:1 for all body text
- All interactive elements must have `:focus-visible` outlines in gold
- All images must have descriptive `alt` attributes
- Semantic HTML throughout (`<main>`, `<nav>`, `<article>`, `<section>`)
- ARIA labels on icon-only buttons

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

## 8. Branch Page JSON-LD Example

```json
{
  "@context": "https://schema.org",
  "@type": "HealthClub",
  "name": "Al Nakheel Premium — Riyadh North",
  "image": "https://alnakheelpremium.com/images/branches/riyadh-north/hero.jpg",
  "url": "https://alnakheelpremium.com/branches/riyadh-north",
  "telephone": "+966-XX-XXXXXXX",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Building 12, King Fahd Road",
    "addressLocality": "Riyadh",
    "addressCountry": "SA"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      "opens": "06:00",
      "closes": "23:00"
    }
  ],
  "priceRange": "SAR 199–599"
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

## 11. Placeholder Branches (To Be Updated)

```
- Branch 1: [Name / City / Slug] — data pending
- Branch 2: [Name / City / Slug] — data pending
- Branch 3: [Name / City / Slug] — data pending
- Branch 4: [Name / City / Slug] — data pending
- Branch 5: [Name / City / Slug] — add as needed
```

Each branch must supply: hero image, 6+ gallery images, full timings, pricing tiers, amenities list, Google Maps embed URL, and contact details before their page can go live.

---

*This document is the single source of truth for the Al Nakheel Premium website build. All decisions made during development should reference and remain consistent with these specifications.*
