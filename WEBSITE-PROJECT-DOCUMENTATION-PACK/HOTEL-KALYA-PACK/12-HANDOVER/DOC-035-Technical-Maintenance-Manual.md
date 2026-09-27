# DOC-035: Technical Operations & Maintenance Manual — Hotel Kalya

**Document ID:** `DOC-035-HK`  
**Version:** `1.0`  
**Status:** `VERIFIED RUNBOOK`  

---

## 1. Hotel Kalya Operations Runbook

### Key Directory Structure:
```text
hotel-kalya/
├── src/
│   ├── app/                    # 49 Canonical Routes
│   │   ├── admin/             # Operations Console & KDS
│   │   ├── api/               # Bookings, Orders & M-Pesa Handlers
│   │   ├── book/              # Booking Engine & Confirmation Voucher
│   │   ├── cart/              # Digital Food Ordering Checkout
│   │   ├── menu/              # Filterable Culinary Catalog
│   │   ├── rooms/             # Accommodation Directory
│   │   └── services/          # Detailed Facility Showcases
│   ├── components/            # Reusable UI, Map & Layout Components
│   ├── context/               # AuthContext & CartContext Providers
│   └── lib/                   # Menu Data & Brand Token Constants
└── public/                    # Optimized Static Imagery & Favicon
```

---

## 2. Sign-Off

**Lead System Architect:** `Lead System Architect` Date: `2026-09-24`  
