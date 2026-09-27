# DOC-014: Acceptance Criteria & Definition of Done (DoD)

**Document ID:** `DOC-014`  
**Version:** `1.0`  
**Status:** `APPROVED CRITERIA`  

---

## 1. Definition of Done (DoD)

A user story, feature, or page is considered **"Done"** only when it meets the following seven criteria:
1. **Design Conformance:** Matches approved typography, color palette, responsive breakpoints, and brand guidelines.
2. **Type Safety:** 100% strict TypeScript types with zero compiler errors (`tsc --noEmit`).
3. **Lint Quality:** ESLint passes with 0 errors and 0 warnings (`npm run lint`).
4. **Resiliency:** Handles Loading, Error, Empty, and Success states gracefully.
5. **SEO & Accessibility:** Valid metadata, proper heading hierarchy (`h1` $\to$ `h2`), semantic HTML, `:focus-visible`, and image `alt` text.
6. **Cross-Device Performance:** Verified on Mobile (375px), Tablet (768px), and Desktop (1440px+).
7. **Production Build:** `npm run build` succeeds without warnings or dynamic bailouts.

---

## 2. Feature Acceptance Criteria (Gherkin Style)

### Criteria 1: Direct Room Booking
- **Given** a guest is on the `/book` page,
- **When** they choose a valid date range, room category, and enter guest details,
- **Then** the booking is saved, a unique reference ID is generated, and they are directed to their official voucher.

### Criteria 2: Food Menu Checkout
- **Given** a customer adds items to their digital cart,
- **When** they click "Proceed to Checkout" in `/cart`,
- **Then** the total amount is calculated with packaging fees, and they can dispatch the order via WhatsApp or trigger M-Pesa.

### Criteria 3: Staff Front-Desk Security
- **Given** an unauthenticated visitor tries to access `/admin`,
- **When** they do not possess staff credentials,
- **Then** access is restricted, and login is required.

---

## 3. Sign-Off

**Client Approval:** `___________________________` Date: `__________`  
