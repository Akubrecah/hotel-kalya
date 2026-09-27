# DOC-006: Scope of Work (SOW)

**Document ID:** `DOC-006`  
**Version:** `1.0`  
**Status:** `DRAFT / APPROVED`  
**Date:** `[YYYY-MM-DD]`  
**Project Code:** `[PRJ-XXX]`  

---

## 1. Purpose of this Document

This Scope of Work (SOW) defines the strict boundary of deliverables agreed between **`[AGENCY_NAME]`** ("Developer") and **`[CLIENT_NAME]`** ("Client").

Any feature, integration, service, or asset not explicitly listed in **Section 2 (Included in Scope)** is deemed **Out of Scope** and subject to the formal Change Request process (`DOC-021`).

---

## 2. In-Scope Deliverables

### A. Architectural & Route Engineering
- [ ] True multi-page web architecture (Next.js App Router).
- [ ] Dedicated canonical routes for all approved pages (Minimum `[XX]` pages).
- [ ] Responsive navigation bar with active parent highlighting and mobile off-canvas drawer.
- [ ] Global footer with contact links, social icons, newsletter signup, and copyright notices.
- [ ] Dynamic breadcrumb trails on all inner pages with `aria-current="page"` and schema markup.

### B. Core Functional Features
- [ ] Interactive catalog/directory with client-side filtering and search.
- [ ] Contact form with real-time field validation and email/WhatsApp dispatch.
- [ ] Interactive Google Maps integration with custom coordinates and turn-by-turn navigation.
- [ ] Verified customer reviews hub with external Google Business profile linkage.
- [ ] Digital ordering/cart system with local storage persistence.
- [ ] Local payment trigger (M-Pesa STK Push) with phone normalization and simulation mode.
- [ ] Customer authentication suite (Sign in, Sign up, Password recovery, Account Folios).
- [ ] Operational management dashboard for client staff (KPIs, queue management).

### C. Technical, SEO & Compliance
- [ ] 100% strict TypeScript types (zero `any` types).
- [ ] Production build optimization, code splitting, and dynamic asset imports.
- [ ] Custom 404 Not Found page with quick destination navigation.
- [ ] Root and route-level error boundaries (`error.tsx`, `global-error.tsx`).
- [ ] Route-level loading skeleton states (`loading.tsx`).
- [ ] Complete XML sitemap (`sitemap.xml`) and crawl control (`robots.txt`).
- [ ] Legal compliance pages (Privacy Policy, Terms of Service, Cookie Notice).

---

## 3. Explicitly Out of Scope

The following items are NOT included in this contract and will NOT be provided unless negotiated via a formal change order:

1. **Third-Party Subscription & API Fees:** Safaricom Daraja transaction fees, Google Cloud Maps API overages, domain registration, hosting fees, SMS gateway units.
2. **Media Production:** On-site professional photography, drone videography, physical brochure printing.
3. **External Digital Marketing:** Paid Google Ads management, social media community management, ongoing content marketing.
4. **Custom Mobile Applications:** Native iOS (Swift) or Android (Kotlin) app store packages.
5. **Legacy Database Migration:** Manual cleanup of unstructured paper guest logbooks prior to project kickoff.

---

## 4. Change Management Rules

- Any request to add new pages, third-party payment gateways, or custom backend databases must be submitted using a formal **Change Request Form**.
- Minor text edits during UAT are included; structural layout changes after Design Approval (`DOC-022`) are billed at **`[KES / USD Rate per hour]`**.

---

## 5. Scope Sign-Off

**Client Representative:**  
Name: `___________________________` | Signature: `_______________` | Date: `__________`  

**Developer Representative:**  
Name: `___________________________` | Signature: `_______________` | Date: `__________`  
