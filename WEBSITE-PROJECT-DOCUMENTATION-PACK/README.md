# Standard Website Project Documentation & Delivery System (SOP)

> **Enterprise Web Development Delivery Framework**  
> A standardized, repeatable, client-grade documentation pack spanning the entire project lifecycle:  
> **Client Onboarding → Discovery → Requirements → Design → Development → QA & UAT → Production → Handover → Warranty & Maintenance**.

---

## 1. System Overview & Purpose

The purpose of this documentation system is to eliminate scope creep, ambiguous assumptions, unrecorded change requests, payment disputes, and unstructured handovers. By implementing mandatory documentation gates, no development begins without signed approval of scope, architecture, and design.

### Directory Structure

```text
WEBSITE-PROJECT-DOCUMENTATION-PACK/
├── README.md                      # This Master SOP & Governance Manual
├── _TEMPLATE-PACK/                # Reusable, fillable templates for new agency/freelance clients
│   ├── 01-CLIENT-ONBOARDING/
│   ├── 02-PROPOSAL/
│   ├── 03-CONTRACT/
│   ├── 04-REQUIREMENTS/
│   ├── 05-CONTENT/
│   ├── 06-PLANNING/
│   ├── 07-DESIGN/
│   ├── 08-DEVELOPMENT/
│   ├── 09-QA/
│   ├── 10-UAT/
│   ├── 11-DEPLOYMENT/
│   ├── 12-HANDOVER/
│   ├── 13-WARRANTY/
│   └── 14-CLOSURE/
└── HOTEL-KALYA-PACK/              # Fully instantiated reference implementation for Hotel Kalya
    ├── 01-CLIENT-ONBOARDING/
    ├── 02-PROPOSAL/
    ├── 03-CONTRACT/
    ├── 04-REQUIREMENTS/
    ├── 05-CONTENT/
    ├── 06-PLANNING/
    ├── 07-DESIGN/
    ├── 08-DEVELOPMENT/
    ├── 09-QA/
    ├── 10-UAT/
    ├── 11-DEPLOYMENT/
    ├── 12-HANDOVER/
    ├── 13-WARRANTY/
    └── 14-CLOSURE/
```

---

## 2. The 32-Phase End-to-End Client Lifecycle

```text
PHASE 01: Client Inquiry & Intake Form
PHASE 02: Discovery & Detailed Questionnaire
PHASE 03: Requirements Specification (SRS)
PHASE 04: Scope of Work (SOW - In Scope / Out of Scope)
PHASE 05: Formal Project Proposal
PHASE 06: Commercial Quotation & Tax Invoicing
PHASE 07: Development Agreement & NDA Sign-Off
PHASE 08: Deposit Settlement (40% Milestone Gate)
PHASE 09: Content & Asset Collection
PHASE 10: Technical Access & Delegation Protocol
PHASE 11: Information Architecture & Sitemap Approval
PHASE 12: User Roles & Permissions Matrix
PHASE 13: End-to-End User Flow Mapping
PHASE 14: Structural Wireframing
PHASE 15: High-Fidelity UI/UX Design System
PHASE 16: Formal Design Sign-Off (Design Freeze Gate)
PHASE 17: Technical Architecture & Environment Setup
PHASE 18: Milestone 2 Development (Vertical Slices)
PHASE 19: Content Implementation & Data Verification
PHASE 20: Internal Quality Assurance (Function, A11y, SEO, Security)
PHASE 21: Staging Environment Deployment
PHASE 22: Client User Acceptance Testing (UAT)
PHASE 23: Bug Triaging & Change Request Evaluation
PHASE 24: Formal UAT Sign-Off (20% Milestone Gate)
PHASE 25: Pre-Production Security & SAIF Readiness Audit
PHASE 26: Production Deployment & DNS Propagation
PHASE 27: Go-Live Smoke Testing Protocol
PHASE 28: Final Payment Settlement (10% Milestone Gate)
PHASE 29: Source Code & Account Handover
PHASE 30: Administrative & Staff Training Session
PHASE 31: 30-Day Post-Launch Warranty Commencement
PHASE 32: SLA Maintenance Contract Transition
```

---

## 3. The 10 Mandatory Pre-Development Gates

**Zero Code Policy:** Never write a single line of application code until the following 10 artifacts are formally executed and approved:

1. **Client Intake Form** (`DOC-001`) — Business context and key decision makers identified.
2. **Discovery Questionnaire** (`DOC-002`) — Precise goals, target audience, and business challenges.
3. **Project Proposal** (`DOC-004`) — High-level strategic solution agreed.
4. **Official Quotation** (`DOC-005`) — Commercial pricing and payment schedule documented.
5. **Signed Development Agreement** (`DOC-007`) — Legally binding contract with IP terms executed.
6. **Scope of Work (SOW)** (`DOC-006`) — Explicit boundaries between included and excluded deliverables.
7. **Requirements Specification (SRS)** (`DOC-010`) — Tagged requirement IDs (`REQ-xxx`).
8. **Sitemap & Architecture** (`DOC-018`) — Canonical page hierarchy approved.
9. **Content & Asset Checklist** (`DOC-015`) — High-res brand assets and copy received.
10. **Design Approval & Sign-Off** (`DOC-022`) — Visual design freeze signed by client.

---

## 4. Payment Milestone Model

Standard commercial disbursement schedule:

| Milestone | Stage | Trigger | Release % |
| :--- | :--- | :--- | :--- |
| **M1** | Project Commencement | Contract execution & technical setup | **40%** |
| **M2** | Design & Core Development | Design freeze & core functional milestone | **30%** |
| **M3** | User Acceptance Testing | UAT approval on staging environment | **20%** |
| **M4** | Production Handover | Production launch, training & final certificate | **10%** |

---

## 5. Scope Creep & Change Request Protocol

Any modification to requirements after execution of `DOC-007` and `DOC-022`:
1. **Never** accept verbal or WhatsApp requests as binding.
2. Every request must be submitted via `Change Request Form` (`CR-xxx`).
3. Technical lead evaluates impact on: **Budget (KES / USD)**, **Timeline (Days)**, and **Architecture**.
4. Client signs the change request and settles any associated change fee before implementation starts.
