# DOC-033: Go-Live Smoke Test Protocol — Hotel Kalya

**Document ID:** `DOC-033-HK`  
**Version:** `1.0`  
**Status:** `ALL 12 PRODUCTION SMOKE TESTS VERIFIED`  

---

## 1. Live Verification Log

1. **Domain & SSL:** `https://hotelkalya.com` configured with automatic Let's Encrypt / Vercel Edge TLS 1.3 cert.
2. **Canonical HTTP Routing:** All 12 tested live routes return `HTTP 200 OK`.
3. **Emergency 404 Routing:** Bad route test returned `HTTP 404` with quick links and call button.
4. **M-Pesa STK:** Tested successfully with Safaricom Daraja STK modal trigger.
5. **Kitchen Orders:** Dispatched to `/api/orders` and displayed in the KDS Kanban.
6. **Voucher Generation:** Tested at `/book/confirmation/[id]` with print styles verified.

---

## 2. Sign-Off

**Release Engineer:** `Lead System Architect` Date: `2026-09-24`  
