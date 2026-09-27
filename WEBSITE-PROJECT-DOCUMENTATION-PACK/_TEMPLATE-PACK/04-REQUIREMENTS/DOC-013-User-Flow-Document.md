# DOC-013: User Flow & System Journey Maps

**Document ID:** `DOC-013`  
**Version:** `1.0`  
**Status:** `APPROVED`  

---

## 1. Primary Guest Booking Journey

```mermaid
graph TD
    A[Visitor Lands on Homepage] --> B[Browse Rooms Catalog /rooms]
    B --> C[Select Room Category & Check Amenities]
    C --> D[Navigate to Direct Booking /book]
    D --> E[Select Check-in / Out Dates & Guest Count]
    E --> F[Enter Personal Contact & Special Requests]
    F --> G{Select Payment Method}
    G -->|M-Pesa STK Push| H[Enter Phone Number & Submit STK]
    H --> I[Handset PIN Prompt & Verification]
    G -->|Pay on Arrival| J[Submit Reservation Request]
    I --> K[System Generates Unique Booking Ref ID]
    J --> K
    K --> L[Redirect to Official Voucher /book/confirmation/id]
    L --> M[Print / Save PDF Voucher with Map & Directions]
```

---

## 2. Digital Menu & Food Ordering Journey

```mermaid
graph TD
    A[Diner Opens Menu /menu] --> B[Filter by Category Breakfast/Lunch/Dinner/Drinks]
    B --> C[Search Dishes & Dietary Filter Halal/Vegetarian]
    C --> D[Add Dish with Special Note to Cart]
    D --> E[Open Cart Drawer /cart]
    E --> F[Select Order Type: Room Service / Table / Takeaway]
    F --> G[Enter Room Number or Table Identification]
    G --> H{Dispatch Option}
    H -->|M-Pesa STK Push| I[Trigger STK Modal & Complete Payment]
    H -->|Direct Kitchen| J[Format Structured Order Text]
    I --> K[API Sync to /api/orders & WhatsApp Kitchen Hotline]
    J --> K
    K --> L[Kitchen KDS Kanban Receives Ticket in New Orders]
```

---

## 3. Front-Desk Operations Journey

```mermaid
graph TD
    A[Staff Logs in at /login] --> B[Auto-Redirect to /admin Console]
    B --> C[Review Real-Time KPIs & Today's Arrivals Feed]
    C --> D{Operational Task}
    D -->|Guest Check-In| E[Navigate to /admin/reservations -> Mark Checked-In]
    D -->|Kitchen Orders| F[Navigate to /admin/orders -> Advance Ticket to In-Prep/Ready]
    D -->|Room Turnover| G[Navigate to /admin/rooms -> Toggle Housekeeping to Clean]
```

---

## 4. Sign-Off

**Client Approval:** `___________________________` Date: `__________`  
