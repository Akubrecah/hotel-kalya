# DOC-029: User Acceptance Testing (UAT) Plan & Results — Hotel Kalya

**Document ID:** `DOC-029-HK`  
**Version:** `1.0`  
**Status:** `ALL TEST CASES VERIFIED (7/7 PASS)`  

---

## 1. Verified Live Test Cases

| Case ID | Feature Tested | Execution Details | Result | Status |
| :---: | :--- | :--- | :--- | :---: |
| **`UAT-001`** | Multi-Page Navigation | Tested `/about`, `/services`, `/rooms`, `/events`, `/location` | Direct URL loading & active underline | **PASS** |
| **`UAT-002`** | Google Map & Routing | Clicked "Get Directions" on `/location` | Opened native Google Maps navigation | **PASS** |
| **`UAT-003`** | Menu & Dietary Pills | Filtered Breakfast, Lunch, Dinner, Halal, Farm-to-Table | Instant client-side filtering | **PASS** |
| **`UAT-004`** | Cart Order Flow | Ordered Kienyeji Chicken & Spiced Tea via `/cart` | Dispatched to `/api/orders` & WhatsApp | **PASS** |
| **`UAT-005`** | Booking Voucher | Reserved Executive Suite from 2026-10-01 to 2026-10-04 | Generated `/book/confirmation/[id]` with print CSS | **PASS** |
| **`UAT-006`** | Lipa na M-Pesa STK | Tested with phone `0719766649` in simulation mode | 60s countdown & receipt `MPESA-8492019` | **PASS** |
| **`UAT-007`** | Admin Operations | Logged in as `admin@hotelkalya.com` | Verified 4 KPIs, checked in guest, advanced KDS ticket | **PASS** |

---

## 2. Sign-Off

**Client UAT Lead:** `Sarah Chebet (General Manager)` Date: `2026-09-24`  
