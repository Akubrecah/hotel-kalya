# DOC-018: Sitemap & Information Architecture — Hotel Kalya

**Document ID:** `DOC-018-HK`  
**Version:** `1.0`  
**Status:** `PRERENDERED (49 ROUTES VERIFIED)`  

---

## 1. Complete Canonical Route Inventory

```text
/ (Homepage)
├── /about (Heritage, Facilities, County Leadership)
├── /services (Services Directory Hub)
│   ├── /services/accommodation (Suites, Cottages, Policies)
│   ├── /services/food-service (Dining, Opening Hours)
│   ├── /services/conferences (Halls, Packages, AV Equipment)
│   ├── /services/outside-catering (Mobile Banqueting)
│   ├── /services/airbnb (Extended Stays & Serviced Apartments)
│   └── /services/garden-experience (Kalya Gardens & Photoshoots)
├── /rooms (Filterable Accommodation Catalog)
├── /events (Conferences, Capacity Matrices, Banquets)
├── /gallery (Filterable Lightbox Image Showcase)
├── /location (Interactive Google Map, GPS, Highway Routes)
├── /reviews (Google Business Profile & Guest Feedback Intake)
├── /contact (24/7 Reception, Inquiries, Map)
├── /book (Direct Reservation Engine)
│   └── /book/confirmation/[id] (Printable Official Voucher)
├── /menu (Digital Food Menu Hub)
│   ├── /menu/breakfast
│   ├── /menu/lunch
│   ├── /menu/dinner
│   ├── /menu/drinks
│   └── /menu/specials
├── /cart (Food Ordering & Kitchen Dispatch)
├── /login (Guest & Staff Sign-In)
├── /signup (New Account Registration)
├── /forgot-password
├── /reset-password
├── /account (Customer Portal Dashboard)
│   ├── /account/profile
│   ├── /account/bookings
│   ├── /account/orders
│   ├── /account/favorites
│   └── /account/settings
├── /admin (Front-Desk Console)
│   ├── /admin/reservations (Guest Folios & Check-in/out)
│   ├── /admin/orders (Kitchen Display System Kanban)
│   └── /admin/rooms (Room Inventory & Housekeeping Flags)
├── /api (Backend Handlers)
│   ├── /api/bookings
│   ├── /api/orders
│   ├── /api/payments/mpesa
│   └── /api/payments/mpesa/callback
└── /legal
    ├── /privacy
    ├── /terms
    └── /cookies
```

---

## 2. Technical Sitemaps

- **XML Sitemap:** Verified at `https://hotelkalya.com/sitemap.xml` containing 26 canonical public URLs.
- **Robots Directives:** Verified at `https://hotelkalya.com/robots.txt` disallowing `/admin/`, `/account/`, and `/api/`.

---

## 3. Sign-Off

**Client Approval:** `Sarah Chebet (General Manager)` Date: `2026-09-24`  
