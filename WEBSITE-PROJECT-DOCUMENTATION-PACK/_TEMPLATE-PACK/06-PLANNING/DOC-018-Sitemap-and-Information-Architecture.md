# DOC-018: Sitemap & Information Architecture (IA)

**Document ID:** `DOC-018`  
**Version:** `1.0`  
**Status:** `APPROVED IA`  

---

## 1. Information Architecture Tree

```text
/ (Homepage)
├── /about (Heritage, Mission, Team, Values)
├── /services (Services Directory)
│   ├── /services/service-one
│   ├── /services/service-two
│   └── /services/service-three
├── /catalog (Product / Accommodation Catalog)
├── /events (Events, Conferences, Bookings)
├── /gallery (Media & Lightbox Grid)
├── /location (Interactive Map, Directions, Landmarks)
├── /reviews (Customer Testimonials & Verification Hub)
├── /contact (Inquiries, Reception Lines, Form)
├── /book (Booking Engine)
│   └── /book/confirmation/[id] (Official Printable Voucher)
├── /cart (Shopping / Food Order Cart)
├── /auth
│   ├── /login
│   ├── /signup
│   ├── /forgot-password
│   └── /reset-password
├── /account (Customer Portal)
│   ├── /account/profile
│   ├── /account/bookings
│   ├── /account/orders
│   ├── /account/favorites
│   └── /account/settings
├── /admin (Operations Suite)
│   ├── /admin/reservations
│   ├── /admin/orders (KDS Kanban)
│   └── /admin/inventory
└── /legal
    ├── /privacy
    ├── /terms
    └── /cookies
```

---

## 2. Navigation Taxonomy Rules

1. **Maximum Depth:** No content deeper than 3 clicks from homepage.
2. **Breadcrumb Hierarchy:** Every inner page must show clear parent-child trails.
3. **Canonical Slugs:** Lowercase, hyphen-separated, descriptive English slugs.

---

## 3. Sign-Off

**Client Approval:** `___________________________` Date: `__________`  
