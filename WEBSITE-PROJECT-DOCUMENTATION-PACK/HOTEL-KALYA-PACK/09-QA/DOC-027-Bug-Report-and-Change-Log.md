# DOC-027: Bug Tracking & Defect Management — Hotel Kalya

**Document ID:** `DOC-027-HK`  
**Version:** `1.0`  
**Status:** `ALL REMEDIATED DEFECTS CLOSED (0 OPEN DEFECTS)`  

---

## 1. Resolved Remediation Register

| Bug ID | Severity | Route / File | Issue Description | Root Cause & Resolution | Status |
| :---: | :---: | :--- | :--- | :--- | :---: |
| **`BUG-001`** | **P0** | `Navbar.tsx:218` | Services parent link bottom border missing on child pages | Fixed operator precedence `(isServicesParent || active)` | **CLOSED** |
| **`BUG-002`** | **P1** | `cart/page.tsx:40` | `handleCheckout` used `await` without async function keyword | Added `async` to event handler function signature | **CLOSED** |
| **`BUG-003`** | **P1** | `robots.ts:10` | Private `/admin/` and `/account/` paths missing from disallow | Added `/admin/` and `/account/` to crawl disallow array | **CLOSED** |
| **`BUG-004`** | **P2** | `globals.css:135` | Focus-visible forced background override on buttons | Removed `background-color` from focus selector | **CLOSED** |
| **`BUG-005`** | **P2** | `src/app/` | Lack of root and route-level error/loading boundaries | Implemented `global-error.tsx`, `error.tsx`, and 4 `loading.tsx` | **CLOSED** |

---

## 2. Sign-Off

**QA Lead:** `Lead System Architect` Date: `2026-09-24`  
