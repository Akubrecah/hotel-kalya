# DOC-006: Scope of Work (SOW) — Hotel Kalya

**Document ID:** `DOC-006-HK`  
**Version:** `1.0`  
**Status:** `APPROVED & LOCKED`  
**Date:** `2026-09-20`  
**Project Code:** `PRJ-HK-2026-01`  

---

## 1. Purpose of this Document

This Scope of Work defines the exact boundaries, deliverables, and operational parameters for the Hotel Kalya web platform engineering project executed by Antigravity Digital Systems Ltd for Hotel Kalya Limited.

---

## 2. In-Scope Deliverables

### A. Architectural & Route Engineering (49 Canonical Routes)
- [x] **Public Pages (31 routes):**
  - Marketing: `/`, `/about`, `/services`, `/gallery`, `/contact`, `/location`, `/reviews`, `/rooms`, `/events`.
  - Service Sub-pages: `/services/accommodation`, `/services/food-service`, `/services/conferences`, `/services/outside-catering`, `/services/airbnb`, `/services/garden-experience`.
  - Digital Menu: `/menu`, `/menu/breakfast`, `/menu/lunch`, `/menu/dinner`, `/menu/drinks`, `/menu/specials`, `/cart`.
  - Booking: `/book`, `/book/confirmation/[id]` (Printable Official Voucher).
  - Auth: `/login`, `/signup`, `/forgot-password`, `/reset-password`.
  - Account: `/account`, `/account/profile`, `/account/bookings`, `/account/orders`, `/account/favorites`, `/account/settings`.
  - Legal: `/privacy`, `/terms`, `/cookies`.
- [x] **Operations Portal (4 routes):**
  - `/admin` (Front-Desk Console with 4 real-time KPI cards & arrivals feed).
  - `/admin/reservations` (Searchable guest folios table with check-in/out toggles).
  - `/admin/orders` (Kitchen Display System Kanban: Received, Preparing, Ready, Delivered).
  - `/admin/rooms` (Room inventory occupancy and housekeeping status controller).

### B. Functional & Integration Modules
- [x] Reusable `<GoogleMap>`, `<LocationCard>`, and `<DirectionsButton>` with verified Kapenguria coordinates (`1.2415° N, 35.1185° E`).
- [x] Authentic Google Reviews hub (zero manufactured testimonials) with direct Google link.
- [x] Safaricom Lipa na M-Pesa STK Push modal (`MpesaModal.tsx`) with Kenyan phone normalization and sandbox simulation.
- [x] Dual-role authentication (`guest` and `staff`) with auto-redirect to `/admin` for duty managers.
- [x] WhatsApp hotline integration dispatching structured booking and kitchen orders directly to `+254 719 766649`.

### C. System & Quality Deliverables
- [x] Strict TypeScript typing across all components and handlers (0 errors).
- [x] ESLint configuration passing with 0 errors and 0 warnings.
- [x] Dynamic XML sitemap (`sitemap.xml`) with canonical base `https://hotelkalya.com`.
- [x] Search engine crawler directives (`robots.txt`) with `/admin/` and `/account/` disallowed.
- [x] Custom branded 404 page (`not-found.tsx`), root `error.tsx`, and `global-error.tsx`.
- [x] Route-level loading states (`/loading.tsx`, `/menu/loading.tsx`, `/rooms/loading.tsx`, `/admin/loading.tsx`).

---

## 3. Explicitly Out of Scope

1. **Third-Party Telecommunication Charges:** Safaricom Daraja STK transaction fee tariffs.
2. **Custom Hardware Provisioning:** Touchscreen Android KDS tablets or thermal receipt printers for the kitchen (web application runs on standard browser hardware).
3. **Physical Photography Services:** Provision of professional camera crews for physical on-site reshoots.
4. **Third-Party OTA Commission Accounts:** Direct automated API synchronization to Booking.com or Expedia channel managers (future Phase 3 consideration).

---

## 4. Scope Sign-Off

**Client Representative:**  
Name: `Sarah Chebet (General Manager)` | Signature: `[Signed Electronically]` | Date: `2026-09-20`  

**Developer Representative:**  
Name: `Lead System Architect` | Signature: `[Signed Electronically]` | Date: `2026-09-20`  
