# DOC-010: Software Requirements Specification (SRS)

**Document ID:** `DOC-010`  
**Version:** `1.0`  
**Status:** `APPROVED SPECIFICATION`  
**Date:** `[YYYY-MM-DD]`  
**Project Code:** `[PRJ-XXX]`  

---

## 1. Project Overview & Scope

This document specifies the complete functional and non-functional requirements for the **`[CLIENT_WEBSITE_NAME]`** web application platform. Every requirement has a permanent identifier (`REQ-xxx`) for traceability through testing and UAT.

---

## 2. Functional Requirements (FR)

### 2.1 Navigation & Structure
- **`REQ-001`**: The platform shall implement a true multi-page architecture with independent App Router routes.
- **`REQ-002`**: The top navigation bar shall highlight the currently active route and active parent categories.
- **`REQ-003`**: The system shall provide an accessible mobile navigation drawer that closes on link navigation.
- **`REQ-004`**: Every sub-page shall provide a semantic breadcrumb trail terminating with `aria-current="page"`.

### 2.2 Catalog & Product / Service Discovery
- **`REQ-005`**: The system shall provide a filterable catalog allowing users to filter by category and dietary/service pills.
- **`REQ-006`**: The system shall include an instant client-side search input filtering items in real-time.
- **`REQ-007`**: Product/Room cards shall display high-resolution imagery, pricing, badges, and quick-action buttons.

### 2.3 Cart & Direct Ordering
- **`REQ-008`**: The platform shall maintain shopping cart state across page transitions using local storage.
- **`REQ-009`**: Users shall be able to adjust item quantities, specify instructions, and view itemized cost breakdowns.
- **`REQ-010`**: The checkout form shall validate customer phone number, delivery/table location, and special requests.

### 2.4 Payments & Confirmation
- **`REQ-011`**: The system shall trigger M-Pesa STK Push prompts to customer mobile numbers (`2547XXXXXXXX`).
- **`REQ-012`**: The payment modal shall display a 60-second countdown with visual pulsing and receipt generation.
- **`REQ-013`**: On successful booking, the system shall render an official printable confirmation voucher with unique ref ID.

### 2.5 Front-Desk & Operational Management
- **`REQ-014`**: The platform shall provide a secure operations console (`/admin`) for staff members.
- **`REQ-015`**: The admin portal shall display 4 real-time KPI metrics and an incoming arrivals feed.
- **`REQ-016`**: The Kitchen Display System (KDS) shall manage ticket progression across 4 Kanban columns.
- **`REQ-017`**: The inventory manager shall allow toggling room/product status (Available / Occupied / Maintenance).

---

## 3. Non-Functional Requirements (NFR)

### 3.1 Performance & Core Web Vitals
- **`NFR-001`**: Largest Contentful Paint (LCP) shall be under 2.5 seconds on 4G mobile connections.
- **`NFR-002`**: Cumulative Layout Shift (CLS) shall be 0.00 across all responsive breakpoints.
- **`NFR-003`**: Next.js production build shall prerender 100% of static and dynamic catalog routes.

### 3.2 Accessibility (A11y)
- **`NFR-004`**: All interactive elements shall possess visible `:focus-visible` outline rings.
- **`NFR-005`**: All `Image` elements shall specify descriptive `alt` text.
- **`NFR-006`**: Contrast ratio between body text and backgrounds shall meet WCAG 2.1 AA standards (minimum 4.5:1).

### 3.3 Security & Privacy
- **`NFR-007`**: Zero hardcoded credentials, API keys, or private database strings in Git repositories.
- **`NFR-008`**: Administrative paths (`/admin/*`) and private folios (`/account/*`) shall be disallowed in `robots.txt`.
- **`NFR-009`**: Input validation on both client and API route handler layers.

---

## 4. SRS Sign-Off

**Client Approval:** `___________________________` Date: `__________`  
**Lead Engineer:** `___________________________` Date: `__________`  
