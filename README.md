# 🏨 Hotel Kalya — Enterprise Hospitality Business Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Safaricom M-Pesa](https://img.shields.io/badge/M--Pesa-Daraja_STK_Push-00A651?style=for-the-badge)](https://developer.safaricom.co.ke/)
[![Status](https://img.shields.io/badge/Production-Ready-success?style=for-the-badge)]()

> **Hospitality Redefined** • Kapenguria, West Pokot County, Kenya  
> **Official Website**: [https://hotelkalya.com](https://hotelkalya.com) • **Location**: A1 Highway, Kapenguria (`1.2415° N, 35.1185° E`)

A modern, production-grade, full-stack multi-page hospitality enterprise platform engineered for **Hotel Kalya**, Kapenguria's premier destination for executive accommodation, authentic Kenyan and continental dining, county conferences, lush outdoor garden banqueting, and mobile outside catering.

---

## 📑 Table of Contents

1. [🏛️ Master Architecture & Tech Stack](#️-master-architecture--tech-stack)
2. [📚 Master Documentation Directory & Access Navigator](#-master-documentation-directory--access-navigator)
   - [Part 1: Enterprise 14-Stage Client Delivery Documentation Pack](#part-1-enterprise-14-stage-client-delivery-documentation-pack)
   - [Part 2: Platform Architecture & AI Agent Governance (.agents)](#part-2-platform-architecture--ai-agent-governance-agents)
   - [Part 3: Project Root Documentation](#part-3-project-root-documentation)
3. [✨ Key Functional Highlights](#-key-functional-highlights)
4. [👥 Staff Portal & Enterprise RBAC System](#-staff-portal--enterprise-rbac-system)
5. [📄 Automated PDF & Document Generation Engine](#-automated-pdf--document-generation-engine)
6. [🎨 Brand Design System & Typography](#-brand-design-system--typography)
7. [🗺️ Complete Application Route Sitemap](#️-complete-application-route-sitemap)
8. [🚀 Getting Started & Local Setup](#-getting-started--local-setup)
9. [🧪 Testing, Type Checking & Verification](#-testing-type-checking--verification)
10. [🔐 Demo Accounts & Authentication Credentials](#-demo-accounts--authentication-credentials)
11. [📜 Ownership & Compliance](#-ownership--compliance)

---

## 🏛️ Master Architecture & Tech Stack

Hotel Kalya is engineered with a **true multi-page architecture** using the Next.js App Router, strict TypeScript typings, zero artificial single-page scrolling anchors, hardware-accelerated animations, and a secure local-first backend with enterprise RBAC:

- **Frontend Core**: Next.js 15 (App Router with Server & Client Component separation), React 19.
- **Styling & Design System**: TailwindCSS v4 with custom brand tokens, Vanilla CSS micro-animations, glassmorphism, and responsive layouts.
- **Typography**: Google Fonts — **Playfair Display** (`font-serif`) for luxury headings, **Inter** (`font-sans`) for legible operational data.
- **Payment Gateway**: Safaricom M-Pesa Daraja API STK Push (`/api/payments/mpesa`) with instant customer PIN trigger and automated webhook callbacks.
- **State & Context**: Reactive React Context architecture (`AuthContext`, `CartContext`) with persistent localStorage sync.
- **Mapping & Geolocation**: Verified Kapenguria coordinates (`1.2415° N, 35.1185° E`), Google Maps embed with fallback skeletons, and native OS turn-by-turn routing via A1 Highway.
- **Enterprise PDF Engine**: Server-rendered, print-ready HTML/PDF generation route (`/api/documents/[id]/pdf`) with official letterhead, QR verification codes, tax stamps, and signatures.

---

## 📚 Master Documentation Directory & Access Navigator

This repository includes a comprehensive, dual-tiered documentation system:
1. **The 14-Stage Client Delivery Lifecycle Pack** located at `../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK` (45 exhaustive specification documents covering proposal to warranty).
2. **The Autonomous Agent Architecture & Governance System** located at `.agents/` (architecture, memory logs, rules, workflows, and 20 specialized agent definitions).

Below is the complete navigator with direct links to every markdown document:

### Part 1: Enterprise 14-Stage Client Delivery Documentation Pack

Located at `../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/`:

| Stage | Doc ID | Document Title & Link | Purpose & Description |
| :--- | :--- | :--- | :--- |
| **01. Client Onboarding** | `DOC-001` | [Client Intake Form](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/01-CLIENT-ONBOARDING/DOC-001-Client-Intake-Form.md) | Business identity, decision-makers, primary goals, brand requirements. |
| | `DOC-002` | [Discovery Questionnaire](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/01-CLIENT-ONBOARDING/DOC-002-Discovery-Questionnaire.md) | Deep discovery: target audience, competition, pain points, hospitality workflows. |
| | `DOC-003` | [Stakeholder Matrix](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/01-CLIENT-ONBOARDING/DOC-003-Stakeholder-Matrix.md) | RACI matrix, key department heads, signing authorities, escalations. |
| **02. Proposal & SOW** | `DOC-004` | [Project Proposal](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/02-PROPOSAL/DOC-004-Project-Proposal.md) | Strategic commercial proposal, architectural solution, deliverable scope. |
| | `DOC-005` | [Official Quotation](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/02-PROPOSAL/DOC-005-Official-Quotation.md) | Itemized commercial pricing, milestone payment schedule (40/30/20/10). |
| | `DOC-006` | [Scope of Work (SOW)](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/02-PROPOSAL/DOC-006-Scope-of-Work-SOW.md) | In-scope vs. out-of-scope boundaries, change request triggers, deliverable gates. |
| **03. Legal Contracts** | `DOC-007` | [Website Development Agreement](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/03-CONTRACT/DOC-007-Website-Development-Agreement.md) | Binding contract, IP rights transfer, warranties, liabilities, termination terms. |
| | `DOC-008` | [Non-Disclosure Agreement (NDA)](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/03-CONTRACT/DOC-008-Non-Disclosure-Agreement-NDA.md) | Mutual confidentiality, proprietary business logic, guest data protection. |
| | `DOC-009` | [Terms & Conditions](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/03-CONTRACT/DOC-009-Terms-and-Conditions.md) | Standard terms of engagement, hosting responsibilities, third-party APIs. |
| **04. Requirements** | `DOC-010` | [Software Requirements (SRS)](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/04-REQUIREMENTS/DOC-010-Requirements-Specification-SRS.md) | Functional and non-functional specifications, performance thresholds, security. |
| | `DOC-011` | [Feature List & Prioritization](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/04-REQUIREMENTS/DOC-011-Feature-List-and-Prioritization.md) | MoSCoW feature breakdown (Must-Have, Should-Have, Could-Have, Won't-Have). |
| | `DOC-012` | [User Roles & Permissions Matrix](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/04-REQUIREMENTS/DOC-012-User-Roles-and-Permissions-Matrix.md) | Enterprise RBAC matrix across 9 staff roles and customer accounts. |
| | `DOC-013` | [User Flow Document](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/04-REQUIREMENTS/DOC-013-User-Flow-Document.md) | Step-by-step guest booking, dining order, check-in, and KDS workflows. |
| | `DOC-014` | [Acceptance Criteria](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/04-REQUIREMENTS/DOC-014-Acceptance-Criteria.md) | Given-When-Then criteria for feature sign-off and milestone delivery. |
| **05. Content & Assets**| `DOC-015` | [Content & Asset Checklist](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/05-CONTENT/DOC-015-Content-and-Asset-Checklist.md) | Copywriting checklist, room photography logs, restaurant menus, hall specs. |
| | `DOC-016` | [Brand Assets & Media Log](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/05-CONTENT/DOC-016-Brand-Assets-and-Media-Log.md) | Logos, brand color codes, typography files, photography copyright logs. |
| | `DOC-017` | [Legal & Compliance Documents](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/05-CONTENT/DOC-017-Legal-and-Compliance-Documents.md) | Privacy policy, Kenya Data Protection Act 2019, cookie consent, terms of service. |
| | `DOC-043` | [Technical Access Checklist](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/05-CONTENT/DOC-043-Technical-Access-Checklist.md) | DNS access, M-Pesa Daraja credentials, hosting credentials, SSL certs. |
| | `DOC-044` | [Content Approval Document](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/05-CONTENT/DOC-044-Content-Approval-Document.md) | Sign-off form confirming all website copy, rates, and imagery are approved. |
| **06. Planning & IA** | `DOC-018` | [Sitemap & Information Architecture](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/06-PLANNING/DOC-018-Sitemap-and-Information-Architecture.md) | Complete multi-page taxonomy, route hierarchy, breadcrumb architecture. |
| | `DOC-019` | [Project Timeline & Milestones](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/06-PLANNING/DOC-019-Project-Timeline-and-Milestones.md) | 32-phase timeline, sprint schedules, milestone payment checkpoints. |
| **07. UI/UX Design** | `DOC-020` | [Wireframe Document](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/07-DESIGN/DOC-020-Wireframe-Document.md) | Low-fidelity structural wireframes for desktop, tablet, and mobile views. |
| | `DOC-021` | [UI Design System Specification](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/07-DESIGN/DOC-021-UI-Design-System-Specification.md) | Complete visual guide: Maroon/Gold palette, fonts, spacing, shadows, tokens. |
| | `DOC-022` | [Design Approval & Sign-Off](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/07-DESIGN/DOC-022-Design-Approval-and-Sign-Off.md) | Formal design freeze sign-off certificate prior to production development. |
| **08. Development** | `DOC-023` | [Technical Architecture Document](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/08-DEVELOPMENT/DOC-023-Technical-Architecture-Document.md) | System design, App Router structure, API patterns, state flow, security layers. |
| | `DOC-024` | [Development & Coding Standards](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/08-DEVELOPMENT/DOC-024-Development-and-Coding-Standards.md) | Strict TypeScript standards, Next.js proxy rules, linting, git commit conventions. |
| | `DOC-025` | [API & Integration Documentation](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/08-DEVELOPMENT/DOC-025-API-and-Integration-Documentation.md) | REST API endpoints, payload contracts, M-Pesa webhook specs, error codes. |
| **09. QA & Security** | `DOC-026` | [Website QA & Testing Checklist](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/09-QA/DOC-026-Website-QA-and-Testing-Checklist.md) | Cross-browser, responsive (375px/768px/1440px), performance, and form validation tests. |
| | `DOC-027` | [Bug Report & Change Log](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/09-QA/DOC-027-Bug-Report-and-Change-Log.md) | Defect tracking log, severity levels, resolutions, and deployment patch notes. |
| | `DOC-028` | [Security & SAIF Assessment](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/09-QA/DOC-028-Security-and-SAIF-Assessment.md) | Cloudflare security audit, SAIF compliance, OWASP Top 10 mitigation. |
| | `DOC-045` | [Change Request Form](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/09-QA/DOC-045-Change-Request-Form.md) | Formal change management template for scope adjustments and cost impacts. |
| **10. Client UAT** | `DOC-029` | [UAT Plan & Test Cases](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/10-UAT/DOC-029-UAT-Plan-and-Test-Cases.md) | Client user acceptance test scripts for reservations, food orders, and check-in. |
| | `DOC-030` | [UAT Client Approval & Sign-Off](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/10-UAT/DOC-030-UAT-Client-Approval-and-Sign-Off.md) | Formal client sign-off certificate confirming software acceptance. |
| **11. Deployment** | `DOC-031` | [Production Readiness Checklist](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/11-DEPLOYMENT/DOC-031-Production-Readiness-Checklist.md) | Pre-deployment verification: environment variables, DNS, SSL, security headers. |
| | `DOC-032` | [Deployment & Rollback Plan](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/11-DEPLOYMENT/DOC-032-Production-Deployment-and-Rollback-Plan.md) | Step-by-step production release protocol, rollback procedures, smoke testing. |
| | `DOC-033` | [Go-Live Verification Protocol](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/11-DEPLOYMENT/DOC-033-Go-Live-Verification-Protocol.md) | Post-release live smoke test protocol across all production customer journeys. |
| **12. Handover** | `DOC-034` | [Website Handover Document](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/12-HANDOVER/DOC-034-Website-Handover-Document.md) | Executive handover certificate transferring project control to Hotel Kalya. |
| | `DOC-035` | [Technical Maintenance Manual](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/12-HANDOVER/DOC-035-Technical-Maintenance-Manual.md) | Architecture operations guide: backup protocols, database maintenance, API updates. |
| | `DOC-036` | [Admin & CMS Training Guide](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/12-HANDOVER/DOC-036-Admin-and-CMS-Training-Guide.md) | Operational training manual for hotel receptionists, chefs, and floor managers. |
| | `DOC-037` | [Code Repository Handover](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/12-HANDOVER/DOC-037-Code-Repository-Handover.md) | Git repository credentials, branching models, build scripts, deploy keys. |
| **13. Warranty & SLA**| `DOC-038` | [Warranty & Bug Fix Policy](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/13-WARRANTY/DOC-038-Warranty-and-Bug-Fix-Policy.md) | 30-day post-launch warranty coverage, defect severity definitions, SLA targets. |
| | `DOC-039` | [Maintenance Agreement (SLA)](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/13-WARRANTY/DOC-039-Website-Maintenance-Agreement.md) | Ongoing technical support, uptime guarantees, monthly security patch agreement. |
| **14. Project Closure**| `DOC-040` | [Final Acceptance Certificate](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/14-CLOSURE/DOC-040-Final-Acceptance-Certificate.md) | Formal conclusion certificate confirming all contractual obligations are met. |
| | `DOC-041` | [Final Payment Settlement](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/14-CLOSURE/DOC-041-Final-Invoice-and-Payment-Settlement.md) | Final tax invoice, milestone reconciliation, and release of financial retention. |
| | `DOC-042` | [Project Closure Report](../WEBSITE-PROJECT-DOCUMENTATION-PACK/HOTEL-KALYA-PACK/14-CLOSURE/DOC-042-Project-Closure-Report.md) | Comprehensive retrospective: lessons learned, performance benchmarks, next roadmap. |

---

### Part 2: Platform Architecture & AI Agent Governance (.agents)

Located at `.agents/`:

| Directory / File | Description & Link | Purpose |
| :--- | :--- | :--- |
| **System Architecture** | [.agents/ARCHITECTURE.md](.agents/ARCHITECTURE.md) | Comprehensive technical architecture, directory topology, and layer boundaries. |
| **Dependency Graph** | [.agents/DEPENDENCY_GRAPH.md](.agents/DEPENDENCY_GRAPH.md) | Visual dependency map between routes, components, utilities, and data stores. |
| **Agent Memory Hub** | [.agents/memory/MEMORY.md](.agents/memory/MEMORY.md) | Active project state, completed milestones, ongoing task backlog, and history. |
| | [.agents/memory/tech-decisions.md](.agents/memory/tech-decisions.md) | Log of architectural choices (Next.js 15, Tailwind v4, Clerk Proxy, M-Pesa). |
| | [.agents/memory/user-preferences.md](.agents/memory/user-preferences.md) | Developer preferences, coding styles, design constraints, and UI tastes. |
| | [.agents/memory/project-conventions.md](.agents/memory/project-conventions.md) | Strict naming, vertical slicing rules, commit guidelines, and link standards. |
| | [.agents/memory/feedback-history.md](.agents/memory/feedback-history.md) | Log of user feedback and adjustments made across development iterations. |
| **Project Rules** | [.agents/rules/core-protocol.md](.agents/rules/core-protocol.md) | Core AI agent protocol: 9-step professional loop (Read, Understand, Plan, etc.). |
| | [.agents/rules/code-rules.md](.agents/rules/code-rules.md) | TypeScript strictness, zero untyped `any`, no DB calls in UI components. |
| | [.agents/rules/design-rules.md](.agents/rules/design-rules.md) | Hotel Kalya design system, luxury color palettes, typography, responsive rules. |
| | [.agents/rules/universal-rules.md](.agents/rules/universal-rules.md) | Critical safety rules, Clerk proxy rule (never use middleware.ts), zero secrets. |
| | [.agents/rules/request-routing.md](.agents/rules/request-routing.md) | Routing matrix for agent commands, skill handoffs, and debugging procedures. |
| | [.agents/rules/quick-reference.md](.agents/rules/quick-reference.md) | Fast lookup for project commands, directory mappings, and key test scripts. |
| **Workflows** | [.agents/workflows/](.agents/workflows/) | 12 guided workflows: [plan.md](.agents/workflows/plan.md), [brainstorm.md](.agents/workflows/brainstorm.md), [create.md](.agents/workflows/create.md), [enhance.md](.agents/workflows/enhance.md), [test.md](.agents/workflows/test.md), [verify.md](.agents/workflows/verify.md), [preview.md](.agents/workflows/preview.md), [deploy.md](.agents/workflows/deploy.md), [debug.md](.agents/workflows/debug.md), [orchestrate.md](.agents/workflows/orchestrate.md), [coordinate.md](.agents/workflows/coordinate.md), [status.md](.agents/workflows/status.md), [remember.md](.agents/workflows/remember.md). |
| **Agent Roles** | [.agents/agent/](.agents/agent/) | 20 specialist agent prompts: orchestrator, frontend-specialist, backend-specialist, security-auditor, qa-automation-engineer, database-architect, devops-engineer, seo-specialist, performance-optimizer, documentation-writer, product-manager, and more. |

---

### Part 3: Project Root Documentation

| File | Purpose |
| :--- | :--- |
| [README.md](README.md) | This master enterprise system manual and documentation navigator. |
| [AGENTS.md](AGENTS.md) | Core instructions and multi-agent coordination protocol for Antigravity AI agents. |
| [CLAUDE.md](CLAUDE.md) | Harmonized engineering instructions, 5-stage lifecycle, and vibe coding rules. |

---

## ✨ Key Functional Highlights

### 1. Interactive Google Maps & Turn-by-Turn Navigation
- Verified geographic coordinates for Hotel Kalya in Kapenguria, West Pokot County (`1.2415° N, 35.1185° E`).
- Embedded `<GoogleMap>` component with loading skeleton states and graceful offline fallback.
- `<DirectionsButton>` opens native Google Maps navigation on Android, iOS, and desktop browsers with exact route guidelines along the A1 highway from Kitale and Eldoret.
- Dedicated `/location` guide with detailed driving directions, landmarks, and regional distance tables.

### 2. Authentic Customer Reviews & Google Business Integration
- Strictly authentic review architecture with **zero fabricated or manufactured reviews**.
- Live Google Business presence linking directly to Hotel Kalya's verified listing.
- Dedicated `/reviews` page supporting category ratings across Service, Food, Accommodation, Cleanliness, Location, and Value.

### 3. Digital Menu & Kitchen Display System (KDS)
- Filterable digital menu with instant real-time search, category tabs, and dietary tags (*Vegetarian*, *Halal*, *Farm to Table*, *Chef Special*, *Gluten-Free*).
- Shopping cart with quantity management, delivery types (*Room Service*, *Table Dine-in*, *Takeaway*), and kitchen special instructions.
- Kitchen Display System (KDS) live Kanban board (`/staff/orders`) with status updates from received to preparing, ready on pass, and delivered.

### 4. Safaricom M-Pesa Daraja STK Push Gateway
- Production-ready M-Pesa STK Push integration (`/api/payments/mpesa`).
- Interactive `<MpesaModal>` prompting guests for their Kenyan mobile number, showing live countdown, sending PIN prompt to their handset, and generating instant receipt verification.

---

## 👥 Staff Portal & Enterprise RBAC System

The platform features an enterprise role-based operational suite under `/staff/*`, designed with the exact same luxury Warm Cream and Royal Maroon theme as the public website:

### Workstations & Capabilities:
- **Workstation Command Center** (`/staff/dashboard`): Live shift status, quick actions, today's arrivals count, in-house guests, active KDS tickets, and housekeeping urgency indicators.
- **Front Desk & Reservations** (`/staff/reservations`): Guest registry, check-in processing, check-out reconciliation, WhatsApp guest dispatch, and real-time room folio tracking.
- **Housekeeping Sanitation Board** (`/staff/housekeeping`): Real-time room status board (`DIRTY`, `CLEANING`, `CLEAN`, `READY`, `OUT_OF_ORDER`), attendant attribution, and live audit trail.
- **Waitstaff Dining Console** (`/staff/restaurant`): Interactive floor plan across Main Restaurant, Garden Terrace, and Upper Gazebo; table occupancy tracker, bill requester, and order taking.
- **Kitchen Display System (KDS)** (`/staff/orders`): Live ticket dispatch on hot line, preparation timers, waiter call signals, and dish completion toggles.
- **Department Access Guard**: Route-level security checking granular permissions (`reception.checkin`, `kitchen.manage`, `housekeeping.update`, `billing.folio`) with instant cross-department workspace switching.

---

## 📄 Automated PDF & Document Generation Engine

The platform features a dedicated document rendering endpoint (`/api/documents/[id]/pdf`) that renders printable, high-resolution official documents:

- **Official Booking Vouchers** (`/book/confirmation/[id]` & `/api/documents/[id]/pdf?type=voucher`)
- **Guest Folios & Tax Receipts**
- **Catering & Banquet Quotations**
- **Website Delivery Documents** (Instantly renders any of the 45 specification documents in `WEBSITE-PROJECT-DOCUMENTATION-PACK` into official PDF format with Hotel Kalya letterhead, QR verification code, and signature blocks).

---

## 🎨 Brand Design System & Typography

The entire platform strictly adheres to Hotel Kalya's signature visual identity:

### Color Palette

| Token | Hex Code | Utility Class | Usage |
| :--- | :--- | :--- | :--- |
| **Royal Maroon** | `#7C1322` | `bg-brand-maroon`, `text-brand-maroon` | Primary brand color, headers, CTAs, luxury accents |
| **Deep Maroon** | `#580B16` | `bg-brand-maroon-dark` | Header gradients, sidebar background, footer |
| **Warm Amber / Gold** | `#F2AE1C` | `bg-brand-amber`, `text-brand-amber` | Golden accents, badges, highlights, active states |
| **Deep Amber** | `#D8930F` | `bg-brand-amber-dark` | Hover states, icons, warnings |
| **Warm Cream** | `#FDFBF7` | `bg-brand-cream` | Canvas background, card containers, table headers |
| **Brand Dark** | `#1E0B0F` | `text-brand-dark` | Primary typography color (warm, readable dark) |
| **Subtle Border** | `rgba(124, 19, 34, 0.15)` | `border-brand-maroon/15` | Polished luxury borders and dividers |

### Typography
- **Headings**: `Playfair Display`, Georgia, serif (`font-serif`) — Used for all page titles, luxury suite names, workstation banners, and KPI values.
- **Body**: `Inter`, system-ui, sans-serif (`font-sans`) — Used for operational descriptions, tables, forms, and navigation links.

---

## 🗺️ Complete Application Route Sitemap

```text
src/app/
├── (public marketing)
│   ├── /page.tsx                       # Homepage (Hero, Rooms preview, Amenities, Reviews, Map)
│   ├── /about                          # Heritage, mission, county leadership & amenities
│   ├── /services                       # Services directory hub
│   │   ├── /accommodation              # Suites, cottages, and booking policies
│   │   ├── /food-service               # Farm-to-table dining, local specialties, hours
│   │   ├── /conferences                # Halls, boardrooms, delegate packages, AV
│   │   ├── /outside-catering           # Mobile banqueting for county summits & private galas
│   │   ├── /airbnb                     # Extended stays & serviced apartments
│   │   └── /garden-experience          # Kalya Gardens, photography, wedding receptions
│   ├── /rooms                          # Dedicated accommodation catalog with tier filters
│   ├── /events                         # Meetings & celebration venue matrix
│   ├── /gallery                        # Categorized lightbox photo gallery
│   ├── /location                       # Google Maps guide, driving routes (A1 Highway), landmarks
│   ├── /reviews                        # Authentic Google Business reviews hub & feedback form
│   ├── /contact                        # 24/7 reception desk, direct phone, email & WhatsApp
│   └── /book                           # Direct reservation engine with location & WhatsApp dispatch
│       └── /confirmation/[id]          # Printable / downloadable official booking voucher
│
├── (digital menu & ordering)
│   ├── /menu                           # Digital menu with live search & dietary filter pills
│   │   ├── /breakfast                  # Farmhouse breakfasts, Kalya spiced tea, Mahamri
│   │   ├── /lunch                      # Kienyeji chicken, Lake Victoria Tilapia, Beef stew
│   │   ├── /dinner                     # Kapenguria Goat Nyama Choma, BBQ platters
│   │   ├── /drinks                     # Highland juices, spiced chai, cold beverages
│   │   └── /specials                   # Chef signature dishes & seasonal harvest
│   └── /cart                           # Room service, dine-in & takeaway ordering with M-Pesa STK
│
├── (customer authentication & account)
│   ├── /login                          # Sign-in with fast demo guest & staff credentials
│   ├── /signup                         # New guest account registration
│   ├── /forgot-password                # Password recovery flow
│   ├── /reset-password                 # Password reset verification
│   └── /account                        # Customer portal overview
│       ├── /profile                    # Guest details & dietary preferences
│       ├── /bookings                   # Active and past room & hall reservations
│       ├── /orders                     # Food & beverage order history
│       ├── /favorites                  # Bookmarked suites & dishes
│       └── /settings                   # Account security & notification preferences
│
├── (staff operations portal)
│   └── /staff                          # Unified staff workstation portal
│       ├── /dashboard                  # Department KPI dashboard & shift control
│       ├── /reservations               # Front desk registry, guest check-in / check-out
│       ├── /housekeeping               # Sanitation board, room status machine, audit log
│       ├── /restaurant                 # Waitstaff dining console & table floor plans
│       ├── /orders                     # Kitchen Display System (KDS) live cooking board
│       ├── /conference                 # Conference halls & banquet manager
│       ├── /catering                   # Mobile outside catering booking desk
│       └── /profile                    # Staff permissions & workspace department switcher
│
├── (enterprise admin console)
│   └── /admin                          # Executive management dashboard
│       ├── /reservations               # Master reservations manager
│       ├── /orders                     # Master dining & room service orders
│       └── /rooms                      # Live room inventory & nightly rates manager
│
├── (api route handlers)
│   ├── /api/bookings                   # GET, POST, and PATCH reservation endpoints
│   ├── /api/bookings/[id]              # Single booking update & cancel handler
│   ├── /api/orders                     # GET, POST, and PATCH kitchen order endpoints
│   ├── /api/housekeeping               # GET and PATCH room sanitation cycle endpoints
│   ├── /api/documents/[id]/pdf         # Official PDF & letterhead document engine
│   └── /api/payments/mpesa             # Safaricom Daraja STK Push trigger & callback webhook
│
└── (legal & compliance)
    ├── /privacy                        # Kenya Data Protection Act 2019 compliance policy
    ├── /terms                          # Reservation terms, check-in rules & garden guidelines
    └── /cookies                        # Local browser storage & cookie notice
```

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- **Node.js**: v18.17+ or v20+ (Node v24.14 recommended)
- **Package Manager**: npm, pnpm, or yarn

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

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Canonical URL of the platform | `http://localhost:3000` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key | `AIzaSy...` |
| `MPESA_ENVIRONMENT` | Daraja environment mode | `sandbox` or `production` |
| `MPESA_CONSUMER_KEY` | Safaricom Daraja Consumer Key | Available in Daraja portal |
| `MPESA_CONSUMER_SECRET` | Safaricom Daraja Consumer Secret | Available in Daraja portal |
| `MPESA_PASSKEY` | Safaricom Daraja Online Passkey | Online STK push passkey |
| `MPESA_BUSINESS_SHORTCODE` | Paybill / Till Number | `174379` (Sandbox default) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase PostgreSQL project URL | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anonymous API key | Public client key |

### Starting the Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing, Type Checking & Verification

### 1. TypeScript Strict Verification
```bash
npx tsc --noEmit
# Expected output: 0 errors
```

### 2. ESLint Code Quality Verification
```bash
npm run lint
# Expected output: 0 errors, 0 warnings
```

### 3. Production Build Compilation
```bash
npm run build
# Compiles all public routes, staff workstations, and API handlers
```

---

## 🔐 Demo Accounts & Authentication Credentials

To test customer, staff, and executive workflows immediately without database configuration:

| Persona | Email | Password | Department / Role | Target Workspace |
| :--- | :--- | :--- | :--- | :--- |
| **Demo Guest (James)** | `guest@hotelkalya.com` | `kalya2026` | Registered Guest | Customer Account (`/account`) |
| **General Manager (Sarah)** | `sarah.cherono@hotelkalya.com` | `kalya2026` | Executive / All Depts | Executive Portal (`/admin`, `/staff`) |
| **Front Office Manager (Faith)** | `faith.rotich@hotelkalya.com` | `kalya2026` | Front Desk & Reservations | Reception Desk (`/staff/reservations`) |
| **Executive Chef (Kipchumba)** | `chef.kipchumba@hotelkalya.com` | `kalya2026` | Kitchen & Culinary | Kitchen KDS (`/staff/orders`) |
| **Restaurant Captain (Mercy)** | `mercy.chebet@hotelkalya.com` | `kalya2026` | Food & Beverage Service | Waitstaff Floor Plan (`/staff/restaurant`) |
| **Housekeeping Lead (Denis)** | `denis.limo@hotelkalya.com` | `kalya2026` | Housekeeping & Sanitation | Housekeeping Board (`/staff/housekeeping`) |
| **Conference Manager (Emmanuel)**| `emmanuel.kibet@hotelkalya.com`| `kalya2026` | Banqueting & Events | Conference Manager (`/staff/conference`) |
| **Outside Catering Lead (Gladys)**| `gladys.nanjala@hotelkalya.com`| `kalya2026`| Mobile Catering & Galas | Catering Operations (`/staff/catering`) |
| **Senior Maintenance (Peter)** | `peter.lokorio@hotelkalya.com` | `kalya2026` | Facilities & Maintenance | Facilities Workstation (`/staff/housekeeping`) |
| **Chief Accountant (Collins)** | `collins.pkemoi@hotelkalya.com`| `kalya2026` | Finance & Revenue | Finance Console (`/admin/reservations`) |

*One-click quick-fill buttons for key accounts are available directly on the [Sign In Page](http://localhost:3000/login).*

---

## 📜 Ownership & Compliance

- **Operating Body**: Hotel Kalya Ltd., Kapenguria, West Pokot County, Kenya.
- **Legal Compliance**: Kenya Data Protection Act 2019, Tourism Regulatory Authority (TRA) standards.
- **Copyright**: © 2026 Hotel Kalya. All rights reserved.
