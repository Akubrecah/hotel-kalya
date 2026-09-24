# Hospitality Website + Booking + Staff Management Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready, fully functional hospitality website, real-time booking engine with double-booking prevention, dynamic availability calendars, role-based staff portal (Reception, Housekeeping, Waiters, Kitchen KDS, Events, Catering), guest portal, contextual WhatsApp routing, and admin management.

**Architecture:** Next.js App Router with TypeScript. Persistent normalized filesystem JSON repository with ACID-style atomic writes in `.data/` directory (`src/lib/db.ts`), comprehensive REST APIs under `/api/*`, server-side availability & double-booking validation, role-based access control (RBAC), and mobile-responsive UI with Tailwind CSS v4 and Lucide icons.

**Tech Stack:** Next.js 16.3.6 (Turbopack, App Router), React 19, TypeScript 5, Tailwind CSS v4, Lucide React, Framer Motion.

---

## Global Constraints

- Every feature must be **functional**, not visual placeholders.
- Real room availability calendar driven by actual database records.
- Strict double-booking prevention implemented server-side.
- Separate Reservation Status (`AVAILABLE`, `RESERVED`, `CHECKED-IN`, `CHECKED-OUT`, `BLOCKED`, `MAINTENANCE`) and Housekeeping Status (`CLEAN`, `DIRTY`, `CLEANING`, `INSPECTED`, `READY`, `OUT_OF_ORDER`).
- `OUT_OF_ORDER` rooms must never be offered for booking.
- Responsible personnel WhatsApp numbers stored in database/config (no hardcoded phone numbers).
- Staff portal with role-based dashboards (`RECEPTIONIST`, `HOUSEKEEPING`, `WAITER`/`WAITRESS`, `CHEF`, `EVENT_COORDINATOR`, `CATERING_STAFF`, `ADMIN`, `MANAGER`).
- Housekeeping one-tap updates recording staff name, timestamp, and audit trail.
- Zero TypeScript errors (`npx tsc --noEmit`), zero ESLint warnings (`npm run lint`), passing `npm run build`.

---

## File Structure Plan

```text
hotel-kalya/
├── .data/                                    # Persistent JSON database storage
│   ├── rooms.json
│   ├── reservations.json
│   ├── housekeeping.json
│   ├── staff.json
│   ├── orders.json
│   ├── service_contacts.json
│   ├── conferences.json
│   ├── catering.json
│   ├── events.json
│   ├── audit_logs.json
│   └── settings.json
├── src/
│   ├── types/
│   │   └── hospitality.ts                    # Master types for Rooms, Reservations, Housekeeping, Staff, RBAC, etc.
│   ├── lib/
│   │   ├── db.ts                             # Normalized persistence layer with atomic write operations
│   │   └── whatsapp.ts                       # Contextual WhatsApp URL generator from service contacts
│   ├── app/
│   │   ├── api/
│   │   │   ├── rooms/
│   │   │   │   ├── route.ts                  # List rooms with date availability filter & CRUD
│   │   │   │   └── [id]/route.ts             # Room detail + monthly calendar endpoint
│   │   │   ├── bookings/
│   │   │   │   ├── route.ts                  # Search bookings, create booking with double-booking check
│   │   │   │   └── [id]/route.ts             # Update status, check-in, check-out, cancel
│   │   │   ├── housekeeping/route.ts         # Room cleaning status transitions + audit log
│   │   │   ├── staff/route.ts                # Staff profiles, departments, roles, shift status
│   │   │   ├── service-contacts/route.ts     # Configurable department WhatsApp contacts
│   │   │   ├── conferences/route.ts          # Conference hall reservations
│   │   │   ├── catering/route.ts             # Outside catering lifecycle
│   │   │   ├── analytics/route.ts            # Live occupancy, ADR, revenue stats
│   │   │   └── audit-logs/route.ts           # Operational audit trail
│   │   │
│   │   ├── rooms/
│   │   │   ├── page.tsx                      # Enhanced Rooms listing with real-time status & filter
│   │   │   └── [roomId]/page.tsx             # Room Detail Page with live month calendar & booking modal
│   │   ├── availability/page.tsx             # Interactive guest room search engine
│   │   │
│   │   ├── guest/                            # Guest Self-Service Portal
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── bookings/page.tsx
│   │   │   ├── bookings/[id]/page.tsx
│   │   │   ├── messages/page.tsx
│   │   │   └── profile/page.tsx
│   │   │
│   │   ├── staff/                            # Multi-Department Staff Portal (RBAC)
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── reservations/page.tsx         # Front Desk / Reception arrivals, check-in/out
│   │   │   ├── rooms/page.tsx                # Room inventory & live status matrix
│   │   │   ├── housekeeping/page.tsx         # Housekeeping cleaning board with one-tap status
│   │   │   ├── restaurant/page.tsx           # Waiter table order manager
│   │   │   ├── orders/page.tsx               # Kitchen Display System (KDS)
│   │   │   ├── conference/page.tsx           # Conference & seminar management
│   │   │   ├── catering/page.tsx             # Outside catering management
│   │   │   ├── events/page.tsx               # Garden & celebration events
│   │   │   ├── messages/page.tsx             # Staff communication desk
│   │   │   └── profile/page.tsx              # Shift & attendance status
│   │   │
│   │   └── admin/                            # Master Admin Operations Portal
│   │       ├── dashboard/page.tsx            # Full operational overview with live charts
│   │       ├── staff/page.tsx                # Staff roster, role assignment, WhatsApp config
│   │       ├── rooms/page.tsx                # Room CRUD, pricing, maintenance toggles
│   │       ├── reservations/page.tsx         # Master reservation register & room assignment
│   │       ├── services/page.tsx             # Service-specific WhatsApp contacts management
│   │       ├── housekeeping/page.tsx         # Housekeeping supervisor overview
│   │       ├── restaurant/page.tsx           # Restaurant operations & table sales
│   │       ├── events/page.tsx               # Conference & outside catering oversight
│   │       ├── reports/page.tsx              # Occupancy, revenue, and ADR reports
│   │       ├── settings/page.tsx             # Operational rules, check-in/out times
│   │       └── audit-log/page.tsx            # Immutable audit logging browser
│   │
│   └── components/
│       ├── rooms/
│       │   ├── RoomCalendar.tsx              # Dynamic month availability calendar component
│       │   ├── RoomBookingModal.tsx          # Step-by-step guest booking modal
│       │   └── WhatsAppButton.tsx            # Contextual WhatsApp consultation button
│       ├── staff/
│       │   ├── RoleSwitcher.tsx              # Quick staff role preview switch
│       │   └── HousekeepingBadge.tsx         # Color-coded housekeeping status badge
│       └── layout/
│           └── Navbar.tsx                    # Updated navbar with Availability, Guest, Staff links
```

---

## Task Decomposition

### Task 1: Comprehensive Hospitality Data Models & Types
**Files:**
- Create: `src/types/hospitality.ts`
- Modify: `src/types/index.ts`

- [ ] Define `Room`, `RoomType`, `ReservationStatus`, `HousekeepingStatus`, `Reservation`, `StaffMember`, `StaffRole`, `ServiceContact`, `HousekeepingTask`, `AuditLog`, `ConferenceBooking`, `CateringBooking`, `HospitalitySettings`.
- [ ] Ensure strict TypeScript typing without `any`.

---

### Task 2: Normalized Persistent Database Engine (`src/lib/db.ts`)
**Files:**
- Create: `src/lib/db.ts`
- Create: `src/lib/whatsapp.ts`

- [ ] Implement atomic file persistence in `.data/` directory with automatic seeding for Hotel Kalya (41 rooms across executive, standard, cottages, and airbnb; seed reservations, initial staff roster, service contacts, and operational settings).
- [ ] Implement query & mutation functions:
  - `getRooms()`, `getRoomById()`, `updateRoom()`, `checkRoomAvailability()`, `searchAvailableRooms()`
  - `getReservations()`, `createReservation()` with **server-side double-booking prevention**
  - `updateReservationStatus()`, `checkInGuest()`, `checkOutGuest()`, `cancelReservation()`
  - `getHousekeepingRooms()`, `updateHousekeepingStatus()` with audit logging
  - `getStaff()`, `createStaff()`, `updateStaff()`
  - `getServiceContacts()`, `updateServiceContact()`
  - `getAuditLogs()`, `logAuditEvent()`
  - `getAnalytics()`: dynamic calculation of occupancy rate, revenue, ADR, room status counts.
- [ ] Implement `generateContextualWhatsAppUrl()` in `src/lib/whatsapp.ts`.

---

### Task 3: Backend REST APIs for Full Hospitality Lifecycle
**Files:**
- Create/Modify: `src/app/api/rooms/route.ts`
- Create/Modify: `src/app/api/rooms/[id]/route.ts`
- Create/Modify: `src/app/api/bookings/route.ts`
- Create/Modify: `src/app/api/bookings/[id]/route.ts`
- Create: `src/app/api/housekeeping/route.ts`
- Create: `src/app/api/staff/route.ts`
- Create: `src/app/api/service-contacts/route.ts`
- Create: `src/app/api/conferences/route.ts`
- Create: `src/app/api/catering/route.ts`
- Create: `src/app/api/analytics/route.ts`
- Create: `src/app/api/audit-logs/route.ts`

- [ ] Wire each API endpoint to `db.ts` functions.
- [ ] Implement robust error responses (400 for conflicts/invalid dates, 404 for missing entities, 500 for server issues).
- [ ] Verify double booking prevention returns 409 Conflict with clear message: *"Room is already reserved for the selected dates."*

---

### Task 4: Room Visual Availability Calendar & Contextual WhatsApp Components
**Files:**
- Create: `src/components/rooms/RoomCalendar.tsx`
- Create: `src/components/rooms/WhatsAppConsultButton.tsx`
- Create: `src/components/rooms/RoomBookingModal.tsx`

- [ ] Build `RoomCalendar`: Interactive month view with previous/next month navigation, color coded (🟢 Available, 🔴 Reserved, 🟡 Pending, 🔵 Checked In, ⚫ Maintenance/Out of Order), accessible legend with text labels.
- [ ] Build `WhatsAppConsultButton`: Pulls responsible contact for the service from API/config, builds structured pre-filled text (Room name, dates, guests, quote), opens WhatsApp with zero hardcoded phone numbers.
- [ ] Build `RoomBookingModal`: 4-step wizard (Dates & Guests $\to$ Live availability verification $\to$ Guest info & special requests $\to$ Reservation confirmation with unique `RES-2026-xxxxxx` reference number).

---

### Task 5: Room Detail Page (`/rooms/[roomId]`) & Guest Availability Search (`/availability`)
**Files:**
- Create: `src/app/rooms/[roomId]/page.tsx`
- Create: `src/app/availability/page.tsx`
- Modify: `src/app/rooms/page.tsx` (Add live status badges, availability indicators, and direct links to `/rooms/[id]`)

- [ ] `/rooms/[roomId]`: Image gallery, amenities, capacity, bed configuration, base and seasonal pricing, live monthly availability calendar, "Book This Room" modal, and contextual WhatsApp consultation.
- [ ] `/availability`: Date range picker, guest counter, room type filter, real-time availability search with instant server check, displaying available rooms with pricing breakdown and out-of-order/reserved indicators.

---

### Task 6: Guest Self-Service Portal (`/guest/*`)
**Files:**
- Create: `src/app/guest/layout.tsx`
- Create: `src/app/guest/dashboard/page.tsx`
- Create: `src/app/guest/bookings/page.tsx`
- Create: `src/app/guest/bookings/[id]/page.tsx`
- Create: `src/app/guest/messages/page.tsx`
- Create: `src/app/guest/profile/page.tsx`

- [ ] `/guest/dashboard`: Active stay details, upcoming check-ins, room number, check-in instructions, one-click room service ordering.
- [ ] `/guest/bookings`: Complete booking history with filter by status (`CONFIRMED`, `CHECKED_IN`, `COMPLETED`, `CANCELLED`).
- [ ] `/guest/bookings/[id]`: Full reservation breakdown, cancellation policy, printable booking voucher PDF, direct WhatsApp help desk button.
- [ ] `/guest/messages`: In-platform communication channel and direct WhatsApp link to front desk.
- [ ] `/guest/profile`: Guest profile, dietary preferences, and saved contact information.

---

### Task 7: Staff Operations Portal (`/staff/*`) with Role-Based Access Control
**Files:**
- Create: `src/app/staff/layout.tsx`
- Create: `src/app/staff/dashboard/page.tsx`
- Create: `src/app/staff/reservations/page.tsx` (Front Desk / Reception)
- Create: `src/app/staff/rooms/page.tsx` (Room Status Matrix)
- Create: `src/app/staff/housekeeping/page.tsx` (Housekeeping Board)
- Create: `src/app/staff/restaurant/page.tsx` (Waitstaff Orders)
- Create: `src/app/staff/orders/page.tsx` (Kitchen Display System)
- Create: `src/app/staff/conference/page.tsx` (Events & Seminar Coordinator)
- Create: `src/app/staff/catering/page.tsx` (Outside Catering Pipeline)
- Create: `src/app/staff/events/page.tsx` (Garden & Social Events)
- Create: `src/app/staff/messages/page.tsx`
- Create: `src/app/staff/profile/page.tsx`

- [ ] `/staff/layout.tsx`: Role switcher allowing switching between `RECEPTIONIST`, `HOUSEKEEPING`, `WAITER`, `CHEF`, `EVENT_COORDINATOR`, `MANAGER` to preview and test dedicated views.
- [ ] `/staff/reservations`: Today's arrivals and departures, check-in button, check-out button, room assignment, guest notes, contact guest.
- [ ] `/staff/housekeeping`: Rooms grouped by cleaning status (`READY`, `DIRTY`, `CLEANING`, `INSPECTED`, `OUT_OF_ORDER`), one-tap status updates recording staff member name, timestamp, and audit trail.
- [ ] `/staff/restaurant` & `/staff/orders`: Waiter table manager + live kitchen KDS updating order state (`received` $\to$ `preparing` $\to$ `ready` $\to$ `delivered`).
- [ ] `/staff/conference` & `/staff/catering`: Specialized departmental management dashboards.

---

### Task 8: Master Admin Portal Expansion (`/admin/*`)
**Files:**
- Modify: `src/app/admin/layout.tsx`
- Create/Modify: `src/app/admin/dashboard/page.tsx` (or update `/admin/page.tsx`)
- Create: `src/app/admin/staff/page.tsx`
- Create: `src/app/admin/rooms/page.tsx`
- Create: `src/app/admin/services/page.tsx` (WhatsApp & Department contacts configuration)
- Create: `src/app/admin/housekeeping/page.tsx`
- Create: `src/app/admin/reports/page.tsx`
- Create: `src/app/admin/settings/page.tsx`
- Create: `src/app/admin/audit-log/page.tsx`

- [ ] `/admin/staff`: Add staff member, set department, role, WhatsApp phone, and employment status.
- [ ] `/admin/rooms`: Room inventory management, create new room, edit capacity, bed configuration, base and seasonal rates, block room for maintenance.
- [ ] `/admin/services`: Configure responsible personnel and WhatsApp phone numbers for Accommodation, Restaurant, Conferences, Outside Catering, and Garden Events.
- [ ] `/admin/reports`: Live occupancy rates, average daily rate (ADR), revenue breakdown by service, and booking velocity.
- [ ] `/admin/settings`: Hotel operating hours, check-in time (e.g. 2:00 PM), check-out time (e.g. 10:00 AM), tax rates, cancellation rules.
- [ ] `/admin/audit-log`: Filterable timeline of all operational changes (room status updates, bookings created, staff changes, check-ins).

---

### Task 9: Global Navigation & Cross-Linking
**Files:**
- Modify: `src/components/layout/Navbar.tsx`

- [ ] Add links for "Availability" (`/availability`), "Rooms" (`/rooms`), "Guest Portal" (`/guest/dashboard`), and "Staff Portal" (`/staff/dashboard`) to the main navigation and mobile menu.
- [ ] Ensure active state highlighting correctly highlights parent and sub-routes.

---

### Task 10: Comprehensive Verification, Testing & Build
**Commands:**
- `npm run lint` $\to$ 0 errors, 0 warnings
- `npx tsc --noEmit` $\to$ 0 type errors
- `npm run build` $\to$ verify all static and dynamic routes compile
- `curl` test endpoints for booking creation, double-booking rejection, room availability, housekeeping updates, and WhatsApp link generation.
