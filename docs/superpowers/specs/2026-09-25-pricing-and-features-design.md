# Technical Specification: Pricing & Features Experience (180K Total Platform)

**Document ID:** `SPEC-2026-09-25-PRICING`  
**Status:** `READY FOR REVIEW`  
**Approved Budget Target:** `KES 180,000 Total Investment`  
**Target Release:** `Hotel Kalya Digital Platform v1.1`  

---

## 1. Executive Summary & Objective

This specification defines the production implementation of the **Pricing & Features** experience for Hotel Kalya. The pricing model is structured around a total development investment of **KES 180,000**, with clean tier differentiation based **strictly on functionality, modules, services, roles, and integrations that actually exist in this repository**.

Zero unsupported features or third-party integrations are fabricated. The system provides:
1. A public-facing pricing page (`/pricing`) featuring interactive billing/investment toggles, tier cards, a full feature matrix across 6 real categories, and direct action routing to real flows.
2. A centralized, configuration-driven data model (`src/lib/pricing-data.ts`) and persistent JSON store (`.data/pricing_plans.json`).
3. A REST API (`/api/pricing`) for querying and updating plans.
4. An Admin Pricing Management console (`/admin/pricing`) seamlessly integrated into the operations dashboard.
5. Consistent navigation, mobile responsiveness, accessibility, and SEO.

---

## 2. Pricing Tiers & Package Structure (180K Total Model)

### Summary Matrix

| Plan Tier | One-Time Development Investment | Monthly Managed Retainer (SLA) | Target Client Profile | Key Scope Inclusions |
| :--- | :---: | :---: | :--- | :--- |
| **Starter** | **KES 60,000** | KES 6,000 / month | Boutique Lodges & Guesthouses | Core website, direct booking engine, availability calendar, printable vouchers, Google Maps, WhatsApp desk, Lipa na M-Pesa STK push. |
| **Professional** *(Recommended)* | **KES 120,000** | KES 12,000 / month | Full-Service Hotels & Restaurants | Everything in Starter + 6-category digital menu, food cart (room delivery/dine-in/takeaway), Kitchen Display System (KDS), housekeeping dual-status board, waitstaff orders, Airbnb apartments, 5 staff dashboards. |
| **Enterprise** *(Full Platform)* | **KES 180,000** | KES 18,000 / month | Premier Convention Resorts (Hotel Kalya) | Everything in Professional + Conference hall manager (Mount Elgon Ballroom, Cherang'any Suite, VIP Boardroom) with delegate packages, outside catering logistics, garden venues, dynamic CMS (all 11 entities), 10-role RBAC, audit trail, WhatsApp roster, document center. |

---

### Itemized Scope Schedule (Totaling KES 180,000)

| Item # | Work Package / Deliverable | Scope Description | Total Price (KES) |
| :---: | :--- | :--- | :---: |
| **01** | **UI/UX Strategy & Brand Design System** | Custom typography (Playfair/Inter), brand color tokens (Amber/Maroon/Sage/Cream), mobile layouts | 25,000 |
| **02** | **Multi-Page App Architecture** | 40+ static and dynamic routes on Next.js 16 App Router, responsive navbar, mobile drawer | 45,000 |
| **03** | **Digital Menu & Kitchen Display System (KDS)** | 6 menu categories, dietary filter pills, 3-mode food cart, live 4-stage KDS Kanban pipeline | 30,000 |
| **04** | **Direct Booking & Voucher Engine** | Availability calendar, server-side double-booking check, printable voucher (`/book/confirmation/[id]`) | 25,000 |
| **05** | **Safaricom Lipa na M-Pesa STK Gateway** | Daraja STK Push modal (`/api/payments/mpesa`), phone normalization, countdown, sandbox simulation | 20,000 |
| **06** | **Front-Desk Operations & Staff Portal** | Arrivals feed, 4 KPI cards, reservations desk, housekeeping matrix, 10-role switcher | 20,000 |
| **07** | **Google Maps, SEO & Compliance** | Kapenguria GPS embed, driving directions, reviews hub, sitemap.xml, robots.txt, Kenya DPA policy | 10,000 |
| **08** | **Production Deployment & Training** | Domain DNS, Vercel Edge CDN setup, operations manual, 30-day bug warranty | 5,000 |
| **—** | **TOTAL PLATFORM INVESTMENT:** | **Full 8-Module Turnkey Delivery** | **KES 180,000** |

---

## 3. Detailed Feature Comparison Categories (Consuming Same Source of Truth)

The feature matrix is organized into 6 real categories:

1. **Architecture, Design & Pages**
   * Multi-page Next.js App Router (Starter: 15 pages; Pro: 25 pages; Enterprise: 40+ pages)
   * Bespoke Kalya Brand System & Tokens (All)
   * Mobile-first responsive layout (All)
   * Project Documentation & PDF Export Engine (Enterprise only)

2. **Direct Booking & Accommodation**
   * Real-time Room Availability Search & Filters (All)
   * Server-Side Double-Booking Prevention & Date Validation (All)
   * Printable Guest Booking Voucher with Map (`/book/confirmation/[id]`) (All)
   * Serviced AirBnB Apartments Inventory (`/services/airbnb`) (Pro & Enterprise)
   * Room Inventory Occupancy & Maintenance Blocking (Pro & Enterprise)

3. **Dining, Menu & Kitchen Operations**
   * 6-Category Digital Food Menu with Real-Time Search (Pro & Enterprise)
   * Dietary Filter Pills (*Vegetarian, Halal, Farm to Table, Chef Special, Gluten-Free*) (Pro & Enterprise)
   * Persistent Food Cart (*Room Service, Table Dine-in, Takeaway*) (Pro & Enterprise)
   * Kitchen Display System (KDS) Live Kanban Ticket Board (Pro & Enterprise)
   * Waitstaff Table Order Management Desk (Pro & Enterprise)

4. **Conferences, Catering & Grounds**
   * Conference Hall & Seminar Space Manager with Delegate Packages (Enterprise only)
   * Outside Mobile Catering Logistics & Buffet Tiers (Enterprise only)
   * Lush Garden Experience & Photoshoot Venue Management (Enterprise only)
   * Special Packages & Promotional Offers (Enterprise only)

5. **Staff, Administration & Security**
   * Customer Self-Service Account Portal (All)
   * Front-Desk Arrivals & KPI Metrics Console (All)
   * Housekeeping Dual-Status Turnover Board (Pro & Enterprise)
   * Multi-Role Staff Portal (5 roles for Pro; all 10 roles for Enterprise)
   * 16 Granular RBAC Permissions & Custom Role Editor (Enterprise only)
   * Immutable Operational Audit Trail Logging (Enterprise only)
   * Master Dynamic Hospitality CMS (all 11 entities) (Enterprise only)

6. **Integrations, Payments & Communications**
   * Safaricom Lipa na M-Pesa STK Push Gateway (All)
   * Contextual WhatsApp Front-Desk Routing (All)
   * Dynamic Multi-Department WhatsApp Roster (Enterprise only)
   * Interactive Google Maps with Kapenguria Coordinates & GPS Routing (All)
   * Search Engine Optimization (Schema.org JSON-LD, Sitemap, Robots) (All)

---

## 4. Architectural Components & Implementation Files

### A. Central Configuration
* **File:** `src/lib/pricing-data.ts`
* Defines TypeScript interfaces: `PricingPlan`, `PricingFeatureCategory`, `PricingFeatureItem`, `PricingSettings`.
* Exported constants: `PRICING_PLANS`, `FEATURE_CATEGORIES`, `PRICING_FAQS`, `PRICING_SUMMARY`.

### B. Persistent Database Storage
* **File:** `.data/pricing_plans.json`
* Seeds initial data matching the KES 180K model.
* Provides read/write access via `src/lib/cms-db.ts` or `src/lib/db.ts` with atomic swap file writes.

### C. Backend API Handlers
* **File:** `src/app/api/pricing/route.ts`
  * `GET`: Returns active plans and comparison categories.
  * `PATCH` / `PUT`: Validates payload and updates plan pricing, descriptions, and feature statuses.

### D. Public Pricing Experience
* **File:** `src/app/pricing/page.tsx`
  * Hero Section: Highlighting transparency, KES 180K full platform investment, and 0 hidden costs.
  * Billing / Investment Toggle: **One-Time Development Build** vs. **Monthly Managed SLA Retainer**.
  * 3 Responsive Plan Cards with "Popular" badge on Professional.
  * Collapsible/Expandable Feature Matrix across the 6 categories.
  * Interactive FAQ Section addressing timelines, M-Pesa integration, and training.
  * Direct CTAs routing to `/book`, `/contact`, `/signup`, and M-Pesa STK modal.

### E. Admin Management Console
* **File:** `src/app/admin/pricing/page.tsx`
  * Integrated into `ADMIN_NAV_GROUPS` under "Settings & Administration".
  * Allows General Manager to adjust plan names, prices, active status, and recommended flags.

### F. Navigation & Global Cross-Links
* Update `src/lib/constants.ts` (`NAV_LINKS`).
* Update `src/components/layout/Navbar.tsx` (desktop nav and mobile drawer).
* Update `src/components/layout/Footer.tsx`.
* Update `src/app/sitemap.ts` with `/pricing`.

---

## 5. Non-Negotiable Standards & Verification

* Zero `any` types in new TypeScript code.
* `npx tsc --noEmit` must pass with 0 errors.
* `npm run lint` must pass with 0 errors.
* `npm run build` must successfully compile the new `/pricing` and `/admin/pricing` routes.
* Mobile, tablet, and desktop responsive validation.
