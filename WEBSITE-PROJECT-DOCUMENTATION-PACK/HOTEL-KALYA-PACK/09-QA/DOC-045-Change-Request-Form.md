# DOC-045: Formal Project Change Request (CR) — Hotel Kalya

**Document ID:** `DOC-045-HK`  
**Change Request No:** `CR-2026-HK-001`  
**Phase:** `Phase 22 — Scope & Change Management`  
**Date Submitted:** `2026-09-22`  
**Status:** `APPROVED & INCORPORATED (IN SCOPE)`  

---

## 1. Change Request Overview

| Field | Description |
| :--- | :--- |
| **Title of Requested Change** | Add Front-Desk Operations Portal, KDS Kanban, and Printable Vouchers |
| **Requesting Stakeholder** | Sarah Chebet (General Manager, Hotel Kalya Limited) |
| **Urgency / Business Need** | High — Staff need a unified operational console to manage reservations and kitchen orders |

---

## 2. Scope Comparison

```text
CURRENT APPROVED SCOPE (Phase 1 Baseline):
Public marketing website, room catalog, digital menu, and WhatsApp inquiries.

REQUESTED REVISED SCOPE:
1. Operational Front-Desk Dashboard at /admin with 4 KPI cards and arrivals feed.
2. Kitchen Display System (KDS) Kanban board at /admin/orders.
3. Searchable Reservations Desk table at /admin/reservations with check-in/out toggles.
4. Room Inventory management table at /admin/rooms.
5. Official printable/downloadable guest booking confirmation voucher at /book/confirmation/[id].
```

---

## 3. Impact Assessment & Settlement

- **Technical Impact:** Creation of dedicated `/admin` layout, 4 operational sub-routes, and 4 backend API handlers (`/api/bookings`, `/api/orders`, `/api/payments/mpesa`, `/api/payments/mpesa/callback`).
- **Commercial Settlement:** Fully incorporated within the approved KES 650,000 master contract without cost penalty.
- **Delivery Timeline:** Delivered on schedule (2026-09-24).

---

## 4. Formal Authorization

**FOR HOTEL KALYA LIMITED:**  
Name: `Sarah Chebet (General Manager)` Date: `2026-09-22`  

**FOR ANTIGRAVITY DIGITAL SYSTEMS LTD:**  
Name: `Lead System Architect` Date: `2026-09-22`  
