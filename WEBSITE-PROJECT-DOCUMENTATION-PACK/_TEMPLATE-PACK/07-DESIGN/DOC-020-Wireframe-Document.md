# DOC-020: Low-Fidelity Wireframe Specification

**Document ID:** `DOC-020`  
**Version:** `1.0`  
**Status:** `APPROVED WIREFRAMES`  

---

## 1. Key Structural Wireframe Schemas

### 1.1 Homepage Wireframe Schema
```text
+-------------------------------------------------------------+
| TopBar: Phone | Email | Address              [Book Direct]  |
| Navbar: [Logo]  About  Services (v)  Rooms  Menu (v) [Cart] |
+-------------------------------------------------------------+
| HERO SECTION                                                |
| [H1 Headline: Hospitality Redefined]                        |
| [Subhead: Luxury Suites & Conference Center in Kapenguria]  |
| [Primary CTA: Explore Rooms]   [Secondary CTA: View Menu]   |
+-------------------------------------------------------------+
| QUICK BOOKING SEARCH BAR                                    |
| [Check-In Date] [Check-Out Date] [Guests] [Search Availability]
+-------------------------------------------------------------+
| FEATURED SERVICES GRID (3 Columns)                          |
| [Accommodation]    [Conferences]      [Garden Experience]   |
| [Food Service]     [Outside Catering] [AirBnB Cottages]     |
+-------------------------------------------------------------+
| AUTHENTIC REVIEWS & GOOGLE LOCATION MAP                     |
| [Verified Google Review Score] | [Interactive Map Embed]    |
+-------------------------------------------------------------+
| FOOTER: Links | Social Icons | Newsletter | Legal Notice    |
+-------------------------------------------------------------+
```

### 1.2 Administrative Console Wireframe Schema (`/admin`)
```text
+-------------------------------------------------------------+
| Admin Sidebar | [Top Header: Welcome Duty Manager | Alert]  |
| - Dashboard   +---------------------------------------------+
| - Reservations| [4 KPI CARDS: Occupancy | Queue | Folios | $]|
| - KDS Orders  +---------------------------------------------+
| - Rooms       | [Today's Arrivals Table] | [Active Tickets] |
| - Back to Site|                                             |
+-------------------------------------------------------------+
```

---

## 2. Responsive Breakpoint Rules

- **Mobile (< 640px):** Single column stack, sticky navigation bar with hamburger trigger, bottom action bar.
- **Tablet (640px - 1024px):** Two column cards grid, compact horizontal filters.
- **Desktop (> 1024px):** Three/four column grid, persistent navigation, expandable mega-dropdowns.

---

## 3. Sign-Off

**Client Approval:** `___________________________` Date: `__________`  
