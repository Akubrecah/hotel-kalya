# DOC-013: User Flow & System Journey Maps — Hotel Kalya

**Document ID:** `DOC-013-HK`  
**Version:** `1.0`  
**Status:** `IMPLEMENTED & AUDITED`  

---

## 1. Verified Live Journeys

All 3 core user flows detailed below are fully functional and verified on the live Hotel Kalya deployment:

1. **Guest Room Booking Flow:** Tested from `/rooms` $\to$ `/book` $\to$ `/api/bookings` $\to$ `/book/confirmation/[id]` (HTTP 200).
2. **Food Order Flow:** Tested from `/menu` $\to$ `/cart` $\to$ `/api/orders` $\to$ WhatsApp dispatch to `+254 719 766649` and Kitchen KDS Kanban.
3. **Staff Admin Operations:** Tested from `/login` (`admin@hotelkalya.com`) $\to$ `/admin` $\to$ `/admin/reservations` $\to$ `/admin/orders` $\to$ `/admin/rooms`.

---

## 2. Technical Handshakes

- **M-Pesa Flow:** `MpesaModal.tsx` normalizes Kenyan numbers (`0719766649` $\to$ `254719766649`), initiates POST to `/api/payments/mpesa`, triggers 60s countdown, and delivers simulation receipt `MPESA-8492019`.
- **Voucher Generation Flow:** Client generates dynamic reference `KL-XXXXXX`, saves to state/backend, and renders `/book/confirmation/[id]` featuring an embedded `<GoogleMap>` and print CSS.

---

## 3. Sign-Off

**Client Approval:** `Sarah Chebet (General Manager)` Date: `2026-09-24`  
