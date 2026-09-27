# DOC-023: Technical Architecture & Infrastructure — Hotel Kalya

**Document ID:** `DOC-023-HK`  
**Version:** `1.0`  
**Status:** `PRODUCTION LIVE ARCHITECTURE`  

---

## 1. Verified Architecture

The Hotel Kalya platform is engineered as a modern, decoupled web application deployed on Vercel's global edge network:

- **Next.js 16.3.6 (Turbopack):** 49 total routes with static generation for all public content and on-demand server rendering for dynamic routes (`/api/*`, `/book/confirmation/[id]`).
- **State Management:**
  - `CartContext.tsx`: LocalStorage backed shopping cart supporting dish customizations, quantities, and service types.
  - `AuthContext.tsx`: Dual-role session state (`customer` and `staff`), managing persistent logins and route protections.
- **Backend Handlers:**
  - `/api/bookings`: CRUD operations for guest folios.
  - `/api/orders`: KDS food order queue management.
  - `/api/payments/mpesa`: Safaricom Daraja STK trigger with phone normalization (`2547XXXXXXXX`).
  - `/api/payments/mpesa/callback`: Asynchronous payment webhook processor.

---

## 2. Sign-Off

**Solution Architect:** `Lead System Architect` Date: `2026-09-24`  
