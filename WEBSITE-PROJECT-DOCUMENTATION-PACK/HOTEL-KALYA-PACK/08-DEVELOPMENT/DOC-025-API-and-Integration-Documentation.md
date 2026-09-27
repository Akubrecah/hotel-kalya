# DOC-025: API & Third-Party Integration — Hotel Kalya

**Document ID:** `DOC-025-HK`  
**Version:** `1.0`  
**Status:** `VERIFIED & OPERATIONAL`  

---

## 1. Verified Live Endpoints

All 4 API routes are live and tested on the Next.js runtime:

1. `GET /api/bookings` $\to$ Returns current reservation folios (HTTP 200).
2. `POST /api/bookings` $\to$ Creates reservation, assigns `KL-XXXXXX` reference (HTTP 201).
3. `PATCH /api/bookings` $\to$ Updates room allocation & check-in/out status (HTTP 200).
4. `GET /api/orders` $\to$ Returns active kitchen orders for KDS Kanban (HTTP 200).
5. `POST /api/orders` $\to$ Adds order to queue with `ORD-XXXXXX` ID (HTTP 201).
6. `PATCH /api/orders` $\to$ Advances status: `received` $\to$ `preparing` $\to$ `ready` $\to$ `delivered` (HTTP 200).
7. `POST /api/payments/mpesa` $\to$ Dispatches Daraja STK Push trigger (HTTP 200).
8. `POST /api/payments/mpesa/callback` $\to$ Handles Daraja callback payload (HTTP 200).

---

## 2. Sign-Off

**Lead System Architect:** `Lead System Architect` Date: `2026-09-24`  
