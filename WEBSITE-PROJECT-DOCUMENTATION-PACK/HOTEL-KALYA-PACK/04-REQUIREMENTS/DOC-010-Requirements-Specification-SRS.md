# DOC-010: Software Requirements Specification (SRS) — Hotel Kalya

**Document ID:** `DOC-010-HK`  
**Version:** `1.0`  
**Status:** `VERIFIED & DELIVERED`  
**Date:** `2026-09-20`  
**Project Code:** `PRJ-HK-2026-01`  

---

## 1. Traceability Matrix & Requirements Register

| Req ID | Category | Requirement Description | Verification Method | Status |
| :---: | :--- | :--- | :---: | :---: |
| **`REQ-001`** | Architecture | Prerender 49 distinct static, SSG, dynamic, and API routes | `npm run build` | **PASS (49/49)** |
| **`REQ-002`** | Navigation | Highlight active routes and parent services dropdown underline | Chrome DevTools inspection | **PASS** |
| **`REQ-003`** | Navigation | Mobile drawer with accordion and auto-close on navigation | User click test | **PASS** |
| **`REQ-004`** | Navigation | Semantic `<Breadcrumbs>` with `aria-current="page"` on all 31 pages | Automated grep & DOM audit | **PASS** |
| **`REQ-005`** | Dining | 6 Menu category tabs with live search and dietary filter pills | Client UI interaction | **PASS** |
| **`REQ-006`** | Cart | Persistent food cart with Room Service / Table Dine-in / Takeaway | LocalStorage verification | **PASS** |
| **`REQ-007`** | WhatsApp | Direct kitchen hotline dispatch with formatted order breakdown | WhatsApp URI generation | **PASS** |
| **`REQ-008`** | Payments | Lipa na M-Pesa STK modal (`2547XXXXXXXX`) with countdown & simulation | API test `/api/payments/mpesa` | **PASS** |
| **`REQ-009`** | Booking | Direct room reservation engine with date selection and ref generator | Booking submission flow | **PASS** |
| **`REQ-010`** | Voucher | Printable official voucher (`/book/confirmation/[id]`) with map & directions | Route curl & print CSS | **PASS (HTTP 200)** |
| **`REQ-011`** | Admin | Front-Desk console (`/admin`) with 4 KPI cards and arrivals feed | Staff login session | **PASS (HTTP 200)** |
| **`REQ-012`** | Admin | Reservations Desk table with status filter & check-in/out toggles | `/admin/reservations` | **PASS (HTTP 200)** |
| **`REQ-013`** | Admin | Kitchen Display System Kanban board advancing order tickets | `/admin/orders` | **PASS (HTTP 200)** |
| **`REQ-014`** | Admin | Room Inventory manager toggling status and housekeeping clean flags | `/admin/rooms` | **PASS (HTTP 200)** |
| **`REQ-015`** | Location | Interactive Google Map at `1.2415° N, 35.1185° E` and driving routes | `/location` | **PASS (HTTP 200)** |
| **`REQ-016`** | Reviews | Authentic reviews hub linking to genuine Google Business Profile | `/reviews` | **PASS (HTTP 200)** |
| **`REQ-017`** | Security | Disallow `/admin/` and `/account/` in `robots.txt` and provide `sitemap.xml` | Curl audit on live endpoints | **PASS (HTTP 200)** |
| **`REQ-018`** | Resiliency | Branded custom 404 page, root `error.tsx`, and `global-error.tsx` | Error boundary tests | **PASS (404/200)** |

---

## 2. Non-Functional Verification

- **TypeScript:** `npx tsc --noEmit` exited with 0 errors.
- **ESLint:** `npm run lint` exited with 0 errors and 0 warnings.
- **Accessibility:** Tested `:focus-visible` outlines and confirmed `alt` text on 100% of images.
- **SEO Schema:** Injected JSON-LD `Hotel` and `BreadcrumbList` microdata.

---

## 3. SRS Sign-Off

**Client Approval:** `Sarah Chebet (General Manager)` Date: `2026-09-24`  
**Lead Engineer:** `Lead System Architect` Date: `2026-09-24`  
