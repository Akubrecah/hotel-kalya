# DOC-004: Website Project Proposal — Hotel Kalya

**Document ID:** `DOC-004-HK`  
**Version:** `1.0`  
**Status:** `ACCEPTED & EXECUTED`  
**Date:** `2026-09-20`  
**Validity:** `30 Days from Date of Issue`  
**Project Code:** `PRJ-HK-2026-01`  

---

## 1. Executive Summary

This proposal establishes the comprehensive plan for engineering Hotel Kalya’s digital hospitality platform. Built for West Pokot County’s leading hotel and conference center, the platform transitions Hotel Kalya from offline marketing into a state-of-the-art web application featuring direct booking, interactive digital menus, M-Pesa STK push integration, customer folios, and a real-time Front-Desk Operations Portal.

---

## 2. Understanding of Hotel Kalya’s Objectives & Challenges

- **Brand Digitalization:** Capture growing regional demand from county governments, NGOs, corporate travelers, and highway transit motorists along the Kitale-Lodwar corridor.
- **Direct Reservations:** Eliminate manual booking mistakes by providing online availability, dynamic booking references, and printable guest confirmation vouchers.
- **Dining Optimization:** Introduce a categorized digital food menu with dietary filters and a direct kitchen dispatch mechanism for room service and dine-in guests.
- **Front-Desk Efficiency:** Equip duty managers with real-time KPI metrics, arrivals queue, and a Kitchen Display System (KDS) Kanban board.

---

## 3. Proposed Strategic Solution

1. **49 Prerendered Static & Dynamic Routes:** Independent page components for all facilities (Accommodation, Dining, Conferences, Outside Catering, Airbnb, Kalya Gardens, Events, Location, Reviews).
2. **Interactive Google Maps Integration:** Custom `<GoogleMap>` with coordinates `1.2415° N, 35.1185° E`, location highlights, and turn-by-turn routing from Kitale and Eldoret.
3. **Lipa na M-Pesa STK Push:** Integrated Safaricom Daraja STK modal (`2547XXXXXXXX`) with live 60s countdown and sandbox simulation toggle.
4. **Printable Booking Voucher:** Dynamic `/book/confirmation/[id]` route generating branded guest vouchers with map directions and print CSS.
5. **Front-Desk Operations Suite:** Complete `/admin` operations console, reservations manager, KDS Kanban, and room inventory controller.

---

## 4. Key Deliverables

- **31 Client-Facing Pages:** Homepage, About, 6 Service Pages, Rooms Catalog, Events Hall Matrix, Gallery, Book, Location, Contact, Reviews, 6 Digital Menu Categories, Cart, 4 Auth Pages, 6 Customer Account Pages, 3 Legal Pages.
- **4 Admin Operations Views:** `/admin`, `/admin/reservations`, `/admin/orders` (KDS), `/admin/rooms`.
- **4 Type-Safe API Routes:** `/api/bookings`, `/api/orders`, `/api/payments/mpesa`, `/api/payments/mpesa/callback`.
- **System Assets:** Sitemap (`sitemap.xml`), Robots directives (`robots.txt`), JSON-LD Structured Data, Brand Tokens.

---

## 5. Technology Stack

- **Frontend & App Framework:** Next.js 16 (App Router with Turbopack)
- **Language:** TypeScript 5+ (Strict Type Checking, Zero Any)
- **Styling:** Vanilla CSS & Tailwind CSS 4 with custom brand tokens (Amber `#F2AE1C`, Maroon `#7C1322`, Sage `#7A9A8B`, Cream `#FDFBF7`)
- **Icons:** Lucide React
- **Deployment Platform:** Vercel Edge Global Network / Cloudflare Edge CDN

---

## 6. Commercial Investment Summary

Total Project Investment: **KES 650,000** (Exclusive of standard VAT).

### Payment Milestones:
- **40% (KES 260,000):** Project Commencement & Architecture Execution *(Paid)*
- **30% (KES 195,000):** Design Approval & Multi-Page Feature Delivery *(Paid)*
- **20% (KES 130,000):** User Acceptance Testing Approval on Staging *(Paid)*
- **10% (KES 65,000):** Production Launch, Staff Training & Handover *(Pending Final Sign-Off)*

---

## 7. Proposal Acceptance

**Client Acceptance:**  
Name: `Sarah Chebet (General Manager)` | Signature: `[Signed Electronically]` | Date: `2026-09-20`  

**Agency Director:**  
Name: `Lead System Architect` | Signature: `[Signed Electronically]` | Date: `2026-09-20`  
