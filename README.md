# TRIBLEERA VAIBHAVAM — Frontend

A premium frontend for **TRIBLEERA VAIBHAVAM**, a Tamil wedding & event services marketplace
launching in **Jaffna, Sri Lanka**. Built with Next.js (App Router), TypeScript and Tailwind CSS v4,
using clean mock data — ready to wire up to the NestJS + PostgreSQL backend described in the
project's development plan.

> தேர்வின் செம்மை, வைபவத்தின் பெருமை — *the elegance of choice, the grandeur of celebration.*

## Current build status

The **homepage and global navigation** (steps 1–7 of the build order) have been rebuilt around the
approved **dark-luxury design system** — Playfair Display + Inter, a near-black burgundy ground with
champagne-gold accents, glassmorphism, and Framer Motion throughout. See "Design system" below.

**Customer/vendor/admin dashboards, the booking flow, and the services/vendor listing pages still
use the earlier light "Luxury Minimalism" (ivory/burgundy) system** — this is a deliberate, not
accidental, split: dense transactional UI (forms, tables, payment, dashboards) stays on a light
ground for legibility and usability, the same way Stripe, Apple and Airbnb keep their dark "story"
moments to marketing pages and run checkout/account screens light. Bringing the remaining screens
(steps 8–11: services, vendor marketplace, booking flow, the three dashboards) onto the new system
is the natural next milestone.

## Tech stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui patterns (cva + Radix primitives +
`tailwind-merge`) · Framer Motion · Lucide React · React Hook Form + Zod (wired in as form-bearing
screens are rebuilt) · `next/image`.

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Production build: `npm run build && npm run start`.

Requires Node.js 18.18+ (built and tested on Node 22 / Next.js 16 / React 19).

---

## What's included

**Phase 1 categories:** Photography, Cakes, Decoration, Bridal Makeup, Invitation — with Venues,
Catering and Music shown as a muted "coming soon" section, per the brief. Currency throughout is
**LKR** (Sri Lankan Rupees).

18 screens, fully responsive (mobile-first, desktop-complete):

| Customer | Vendor | Admin |
|---|---|---|
| Landing (`/`) | Vendor dashboard (`/dashboard/vendor`) | Admin dashboard (`/dashboard/admin`) |
| Service categories (`/services`) | Availability status (`/dashboard/vendor/availability`) | Vendor approvals (`/dashboard/admin/vendors`) |
| Vendor listing + filters (`/vendors`) | Vendor registration (`/vendor/register`) | Booking & payment monitoring (`/dashboard/admin/bookings`) |
| Vendor profile (`/vendors/[id]`) | | Category management (`/dashboard/admin/categories`) |
| Package selection (`/vendors/[id]/packages`) | | Disputes & cancellations (`/dashboard/admin/disputes`) |
| Booking cart (`/booking/cart`) | | |
| Payment summary (`/booking/payment`) | | |
| Booking confirmation (`/booking/confirmation`) | | |
| Customer dashboard (`/dashboard/customer`) | | |
| Booking status tracking (`/booking/track/[id]`) | | |

There's no auth yet (frontend-only stage), so the header's **Dashboards** menu links straight into
each dashboard for demo purposes.

---

## Folder structure

```
app/                  Routes (Next.js App Router)
  services/             Service category page
  vendors/[id]/          Vendor profile + packages
  booking/               Cart → Payment → Confirmation → Status tracking
  dashboard/             Customer / Vendor (+availability) / Admin (+categories, disputes)
  vendor/register/       Vendor onboarding
components/
  ui/                   Design-system primitives (Button, Badge, Field, Table, Tabs, SmartImage…)
  layout/               Header, Footer, Mobile bottom nav
  vendor/               VendorCard, PackageCard, filters
  booking/              Cart item, price summary, lifecycle tracker, step indicator
  dashboard/            Status badges, admin/vendor interactive panels (requests, disputes, categories)
  sections/             Landing-page sections (Hero, CategoryGrid, Testimonials, PaymentExplainer…)
context/
  CartContext.tsx       Booking cart state (persisted to localStorage)
lib/
  data/                 Mock data: categories, vendors, bookings, users, disputes, images
  utils/                booking.ts (pricing math), format.ts (LKR), cn.ts
types/                  Shared TypeScript interfaces (mirrors the future Prisma schema)
```

---

## Design system (dark-luxury, homepage + nav)

Tokens live in `app/globals.css` under `@theme`, layered alongside the existing light tokens
(nothing was removed — both systems coexist):

```
--color-ink            #15040C   page ground for marketing surfaces
--color-burgundy-950    #220714
--color-burgundy-900    #380C1E
--color-burgundy-800    #56102C
--color-gold            #D4AF6A   primary accent
--color-gold-light      #E9CE9C
--color-cream           #F7EEE2   body text on dark
--color-cream-dim / -faint        muted text on dark
--shadow-glow            gold glow, used on the logo mark + glass elements
```

Utility classes: `.glass` (the floor for every glassmorphic surface — `rgba(247,238,226,.06)` fill,
gold-tinted `1px` border, `20px` blur) and `.glow-gold`. `Button` gained two variants for this
system: `gold` (gradient fill CTA) and `glass` (frosted ghost button) — see
`components/ui/Button.tsx`.

`components/home/*` holds the new homepage sections (Hero, ServiceShowcase, WhyTribleera,
FeaturedVendors, WeddingStory, BookingJourney, PremiumCTA), each animated with Framer Motion
(`whileInView` scroll reveals, the hero's scroll-linked parallax via `useScroll`/`useTransform`, and
the animated logo-reveal/glow on load). The old `components/sections/*` (the previous light
homepage) and `components/ui/Reveal.tsx` (the IntersectionObserver-based reveal it used) have been
removed — fully superseded, not dead code left behind.

`components/ui/sheet.tsx` is a genuine shadcn-pattern Sheet (Radix Dialog underneath) replacing the
hand-rolled mobile nav drawer — proper focus trap and Escape-to-close for free.

## Audit pass (accessibility, SEO, security, forms)

A full codebase audit was run and the following were fixed directly in this build:

- **Forms now actually validate.** `react-hook-form` + `zod` were installed earlier but unused —
  both the vendor registration form and the payment page's customer-details form now use real
  schemas (`lib/schemas.ts`): required fields, Sri Lankan mobile format, email format, future-date
  check on the event date. `Input`/`Textarea`/`Select` (`components/ui/Field.tsx`) were upgraded to
  `forwardRef` with `aria-invalid`/`aria-describedby`/inline error text, which RHF's `register()`
  requires.
- **Accessibility:** added a skip-to-content link and `id="main-content"` in `app/layout.tsx`;
  wrapped the app in Framer Motion's `<MotionConfig reducedMotion="user">` so the new homepage
  animations honour OS-level reduced-motion (the old CSS-keyframe animations already did, via a
  media query — the new `motion.*` components didn't, until now).
- **SEO:** the homepage now exports its own `metadata` instead of relying on the root default;
  the four client-component pages that can't export metadata directly (`booking/cart`,
  `booking/payment`, `booking/confirmation`, `vendor/register`) each got a sibling `layout.tsx` to
  carry it; added `Organization` JSON-LD in the root layout.
- **Security:** `next.config.ts` now sets `X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy` and HSTS on every response. A real Content-Security-Policy
  was deliberately *not* added here — getting one right requires testing against the actual font/
  image/payment-gateway origins in a real browser, and a wrong CSP silently breaks pages rather than
  failing loudly.
- **Responsiveness:** the homepage's 4-up stat bar and booking-journey steps jumped straight from a
  2-column mobile layout to 4 columns at `md` (768px) — a real tablet, not a stretched phone, now
  gets the 2-column layout through `lg` (1024px). The service showcase grid got the same treatment.

**What's flagged but not auto-fixed** — each needs a real browser/tooling, not just code:
Lighthouse hasn't actually been run (no headless Chrome in this sandbox) so the "95+" performance
target is unverified, not confirmed; font loading still uses a `<link>` tag instead of `next/font/
google` because this sandbox can't reach `fonts.gstatic.com` to self-host them at build time — in a
real deploy environment, switching to `next/font/google` is a five-minute change and strictly better
(self-hosted, no extra request, no layout shift); and a tuned CSP, as above.

## Design decisions worth knowing about

**1. Booking math lives in one place.**
`lib/utils/booking.ts` is the single source of truth for the 20% advance + 3% platform fee
calculation. Every screen that shows a price breakdown (package selection, cart, payment summary,
customer/admin dashboards, booking tracking) calls `lineItemBreakdown()` or `cartBreakdown()` from
there.

```
Service value:      LKR 100,000
Advance (20%):       LKR 20,000
Platform fee (3%):    LKR 3,000
Payable now:         LKR 23,000
Remaining balance:   LKR 80,000
```

**2. Real photography, with a graceful fallback.**
Category and vendor imagery is hot-linked from Unsplash (free for any use under the Unsplash
License) via `lib/data/images.ts`. Every image goes through `<SmartImage>`
(`components/ui/SmartImage.tsx`), which automatically falls back to the brand's `MotifArt` line-art
illustration if a specific photo URL ever fails to load — so the UI never shows a broken-image icon,
even with placeholder data. **To swap in real vendor photography:** set `imageUrl` /
`galleryUrls` on a vendor in `lib/data/vendors.ts` to a Cloudinary/S3 URL; no component changes
needed.

**3. Fonts load via `<link>`, not `next/font/google`.**
Playfair Display (display/headlines) and Inter (body/UI) load via standard `<link>` tags in
`app/layout.tsx`, keeping font loading purely client-side.

**4. Cart state is local-first.**
`CartContext` persists the booking cart to `localStorage` so a customer's selections survive a
refresh, with no backend required yet.

**5. The admin "decision logic" states are unified under Disputes & Cancellations.**
`lib/data/disputes.ts` + `/dashboard/admin/disputes` cover all seven states from the brief:
cancellation, refund, vendor no-response, vendor cancellation, duplicate payment, user misuse and
general disputes — each with Investigate / Reject / Resolve actions.

**6. Booking lifecycle.**
`components/booking/LifecycleTracker.tsx` visualises the Draft → Request → Payment → Booked →
Completed flow described in the brief, mapped from the internal `BookingStatus` enum used across
the cart/payment/dashboard screens.

**7. Visual design is matched against the Stitch reference, screen by screen.**
Colors, type scale, radii (4px controls / 8px cards), shadow formula, badge tones, and component
patterns (compact step indicators, em-dash section headers, icon-box payment method rows, the
celebratory confirmation layout, the bordered Trust Score card) all follow the project's
`DESIGN.md` token spec and the corresponding Stitch mobile mockups. Desktop layouts are original
extrapolations of that same system, since the reference export only includes desktop mockups in an
unrelated dark "Gladiator" theme.

---

## What's mocked (by design, at this stage)

- All vendor/booking/user/dispute data — no backend yet.
- Login/auth — dashboards are reachable directly from the nav for demo purposes.
- Payment gateway — "Pay securely" simulates a short delay, then writes a confirmation record to
  `localStorage` and routes to `/booking/confirmation`.
- Vendor approval, dispute resolution, booking-request accept/decline — state changes live only in
  the browser tab.

## Next steps

**Immediate (continuing the dark-luxury build order):**

8. Services page + vendor marketplace listing, on the dark-luxury system
9. Booking flow (cart → payment → confirmation), on the dark-luxury system
10. Customer, vendor and admin dashboards, on the dark-luxury system

**Longer-term (per the dev plan):**

1. Stand up the NestJS + PostgreSQL + Prisma backend; mirror `types/index.ts` in `schema.prisma`.
2. Replace `lib/data/*.ts` reads with API calls (most pages are already `async` server components).
3. Add authentication and gate the three dashboards by role.
4. Wire Cloudinary/S3 for real vendor photography (see decision #2 above).
5. Connect a real payment gateway at `/booking/payment`.
## Bug fixes

- Removed public dashboard links from desktop and mobile navigation, replaced them with a temporary `Sign In` button, and kept shortlist/cart as icon-only actions.
- Updated the homepage hero with honest trust stats, a simpler search flow, and clearer onboarding and trust nudges.
- Fixed the vendor gallery note, trust page Open Graph metadata, and the wedding story CTA destination.
- Added a saved tab to the mobile bottom nav and made vendor cards fully clickable while preserving shortlist interaction.
- Improved package selection so choosing a package adds it to cart, shows a confirmation toast, and routes to the booking cart.
- Added category vendor counts on the vendors page and expanded vendor reviews for stronger social proof.

## V2 marketplace refresh

- Expanded the marketplace to 25 vendors total, with 5 vendors in each launch category: photography, cakes, decoration, bridal makeup, and invitation.
- Added a global typography scale in `app/globals.css` with display, body, caption, and overline utilities for more consistent premium layouts.
- Added package-level cover images for every vendor tier and upgraded package cards with 16:9 imagery plus motif-art fallback.
- Upgraded homepage motion with staggered reveal systems, floating hero particles, a scroll indicator, and animated hero stat count-ups.
- Added a magnetic hover tilt to vendor cards, a softer crossfade gallery lightbox transition, and a homepage-only logo glow pulse.
