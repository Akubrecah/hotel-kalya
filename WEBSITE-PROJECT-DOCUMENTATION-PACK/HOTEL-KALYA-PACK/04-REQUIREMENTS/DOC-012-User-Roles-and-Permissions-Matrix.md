# DOC-012: User Roles & Permissions Matrix — Hotel Kalya

**Document ID:** `DOC-012-HK`  
**Version:** `1.0`  
**Status:** `IMPLEMENTED & VERIFIED`  

---

## 1. Verified Role Accounts in Production

| Role Name | Demo Identifier / Email | Assigned Permissions | Default Landing Page |
| :--- | :--- | :--- | :--- |
| **Guest User** | `james@example.com` (James Mwangi) | Customer profile, active bookings, food orders, saved favorites | `/account` |
| **Staff Member** | `admin@hotelkalya.com` (Sarah Chebet) | Front-desk console, reservations desk, kitchen display, room inventory | `/admin` |
| **Anonymous** | Unauthenticated Website Visitors | Public marketing, room directory, digital menu, booking submission | `/` |

---

## 2. Technical Implementation Evidence

- Implemented in `src/context/AuthContext.tsx`:
  - `DEMO_USER`: Guest role (`customer`).
  - `DEMO_ADMIN`: Operations role (`staff`).
- Implemented in `src/app/login/page.tsx`:
  - Instant One-Click Demo Guest Fill (`james@example.com`).
  - Instant One-Click Duty Manager Fill (`admin@hotelkalya.com`).
- Header integration in `src/components/layout/Navbar.tsx`:
  - Renders gold shield "Admin Portal" link in desktop user dropdown and mobile drawer when logged in as `staff`.

---

## 3. Sign-Off

**Client Approval:** `Sarah Chebet (General Manager)` Date: `2026-09-24`  
