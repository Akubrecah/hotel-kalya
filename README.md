# Hotel Kalya — Production Hospitality Business Platform

> **Hospitality Redefined** • Kapenguria, West Pokot County, Kenya • [https://hotelkalya.com](https://hotelkalya.com)

A modern, production-ready, full-stack multi-page hospitality enterprise web platform for **Hotel Kalya**, Kapenguria's premier destination for executive accommodation, authentic Kenyan and continental dining, county conferences, lush outdoor garden banqueting, and outside catering.

---

## 🏛️ Platform Architecture Overview

The platform is engineered as a **true multi-page architecture** built on the Next.js App Router with strict TypeScript typings, zero simulated scrolling anchors, real active route highlighting, and an integrated operational backend layer.

```text
hotel-kalya/
├── src/
│   ├── app/
│   │   ├── (public marketing)
│   │   │   ├── /about                      # Heritage, mission, county leadership & amenities
│   │   │   ├── /services                   # Services directory hub
│   │   │   │   ├── /accommodation          # Suites, rooms, cottages, and booking policies
│   │   │   │   ├── /food-service           # Farm-to-table dining, local specialties, operating hours
│   │   │   │   ├── /conferences            # Halls, boardrooms, delegate packages, AV equipment
│   │   │   │   ├── /outside-catering       # Mobile banqueting for county summits & private galas
│   │   │   │   ├── /airbnb                 # Extended stays & serviced self-catering apartments
│   │   │   │   └── /garden-experience      # Kalya Gardens, photography, and open-air receptions
│   │   │   ├── /rooms                      # Dedicated accommodation catalog with tier filters
│   │   │   ├── /events                     # Meetings & celebration venue matrix
│   │   │   ├── /gallery                    # Categorized lightbox photo gallery
│   │   │   ├── /location                   # Google Maps guide, driving routes (A1 Highway), landmarks
│   │   │   ├── /reviews                    # Authentic Google Business reviews hub & feedback form
│   │   │   ├── /contact                    # 24/7 reception desk, direct phone, email & WhatsApp
│   │   │   └── /book                       # Direct reservation engine with location & WhatsApp dispatch
│   │   │       └── /confirmation/[id]      # Printable / downloadable official booking voucher
│   │   │
│   │   ├── (digital menu & ordering)
│   │   │   ├── /menu                       # Digital menu with live search & dietary filter pills
│   │   │   │   ├── /breakfast              # Farmhouse breakfasts, Kalya spiced tea, Mahamri
│   │   │   │   ├── /lunch                  # Kienyeji chicken, Lake Victoria Tilapia, Beef stew
│   │   │   │   ├── /dinner                 # Kapenguria Goat Nyama Choma, BBQ platters
│   │   │   │   ├── /drinks                 # Highland juices, spiced chai, cold beverages
│   │   │   │   └── /specials               # Chef signature dishes & seasonal harvest
│   │   │   └── /cart                       # Room service, dine-in & takeaway ordering with M-Pesa STK
│   │   │
│   │   ├── (customer authentication & account)
│   │   │   ├── /login                      # Sign-in with fast demo guest & staff credentials
│   │   │   ├── /signup                     # New guest account registration
│   │   │   ├── /forgot-password            # Password recovery flow
│   │   │   ├── /reset-password             # Password reset verification
│   │   │   └── /account                    # Customer portal overview
│   │   │       ├── /profile                # Guest details & dietary preferences
│   │   │       ├── /bookings               # Active and past room & hall reservations
│   │   │       ├── /orders                 # Food & beverage order history
│   │   │       ├── /favorites              # Bookmarked suites & dishes
│   │   │       └── /settings               # Account security & notification preferences
│   │   │
│   │   ├── (staff & admin operations)
│   │   │   └── /admin                      # Front-desk management console
│   │   │       ├── /reservations           # Guest check-in, check-out, and folio manager
│   │   │       ├── /orders                 # Kitchen Display System (KDS) live Kanban board
│   │   │       └── /rooms                  # Live room occupancy toggle & nightly rates manager
│   │   │
│   │   ├── (api route handlers)
│   │   │   ├── /api/bookings               # GET, POST, and PATCH reservation endpoints
│   │   │   ├── /api/orders                 # GET, POST, and PATCH kitchen order endpoints
│   │   │   └── /api/payments/mpesa         # Safaricom Daraja STK Push trigger & callback webhook
│   │   │
│   │   └── (legal & compliance)
│   │       ├── /privacy                    # Kenya Data Protection Act 2019 compliance policy
│   │       ├── /terms                      # Reservation terms, check-in rules & garden guidelines
│   │       └── /cookies                    # Local browser storage & cookie notice
│   │
│   ├── components/                         # Atomic, layout, map, review, and payment components
│   ├── context/                            # Client providers (AuthContext, CartContext)
│   ├── lib/                                # Design tokens, constants, and typed menu items
│   └── types/                              # Unified TypeScript schemas
```

---

## 🌟 Key Functional Highlights

### 1. Interactive Google Maps & Turn-by-Turn Directions
- Verified geographic coordinates for Kapenguria, West Pokot County (`1.2415° N, 35.1185° E`).
- Embedded `<GoogleMap>` component with loading skeleton states and graceful offline fallback.
- `<DirectionsButton>` opens native Google Maps navigation on Android, iOS, and desktop browsers.
- Dedicated `/location` guide with detailed driving directions along the A1 highway from Kitale and Eldoret.

### 2. Authentic Reviews & Google Business Transparency
- Strictly authentic review architecture with **zero fabricated or manufactured reviews**.
- Live Google Business presence linking directly to Hotel Kalya's verified listing.
- Dedicated `/reviews` page supporting category ratings across Service, Food, Accommodation, Cleanliness, Location, and Value.

### 3. Digital Menu & Kitchen Display System (KDS)
- Filterable digital menu with instant real-time search, category tabs, and dietary tags (*Vegetarian*, *Halal*, *Farm to Table*, *Chef Special*, *Gluten-Free*).
- Shopping cart with quantity management, delivery types (*Room Service*, *Table Dine-in*, *Takeaway*), and kitchen special instructions.
- Kitchen Display System (KDS) Kanban board in the Admin portal (`/admin/orders`) to manage order preparation stages in real time.

### 4. M-Pesa STK Push Payment Gateway
- Safaricom Daraja STK Push integration architecture (`/api/payments/mpesa`).
- Interactive `<MpesaModal>` prompting guests for their Kenyan mobile number, showing live countdown, sending PIN prompt to their handset, and generating instant receipt verification.

### 5. Staff & Front-Desk Operations Portal (`/admin`)
- Operations dashboard displaying live metrics: Today's arrivals, room occupancy percentage, active kitchen queue, and daily revenue.
- Reservations desk with one-click Check-In, Check-Out, and room assignment.
- Room inventory controller with live toggle between *Available*, *Occupied*, and *Maintenance*.

### 6. Official Guest Booking Voucher (`/book/confirmation/[id]`)
- Printable and PDF-friendly voucher with check-in instructions, mini Google Map, directions button, and reservation reference code.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+ or Node.js 20+
- npm or pnpm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/hotel-kalya.git
cd hotel-kalya

# Install dependencies
npm install
```

### Environment Configuration
Copy `.env.example` to `.env.local` and configure your credentials:
```bash
cp .env.example .env.local
```

| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Canonical website URL (`https://hotelkalya.com`) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Browser-restricted Google Maps JavaScript API key |
| `MPESA_ENVIRONMENT` | `sandbox` or `production` |
| `MPESA_CONSUMER_KEY` | Safaricom Daraja Consumer Key |
| `MPESA_CONSUMER_SECRET` | Safaricom Daraja Consumer Secret |
| `MPESA_PASSKEY` | Safaricom Daraja Online Passkey |
| `MPESA_BUSINESS_SHORTCODE` | Safaricom Paybill / Till Number |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase PostgreSQL project URL (future persistence) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anonymous API key |

### Running the Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Quality Assurance

### TypeScript Verification
```bash
npx tsc --noEmit
# 0 errors
```

### ESLint Verification
```bash
npm run lint
# 0 errors, 0 warnings
```

### Production Build & Static Pre-rendering
```bash
npm run build
# Compiles all 40+ routes as static HTML (SSG) and dynamic API route handlers
```

---

## 👥 Demo User Credentials

To test customer and staff workflows immediately without database setup:

| Account Type | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Demo Guest (James)** | `guest@hotelkalya.com` | `kalya2026` | Customer Account Portal (`/account`) |
| **Staff Manager (Sarah)** | `admin@hotelkalya.com` | `kalya2026` | Front-Desk Operations (`/admin`) |

*One-click quick-fill buttons for both accounts are available on the [Sign In Page](https://hotelkalya.com/login).*

---

## 📜 License & Ownership
Copyright © 2026 Hotel Kalya Kapenguria. All rights reserved.
Developed for professional hospitality operations in West Pokot County, Kenya.
