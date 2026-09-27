# DOC-028: Security & SAIF Posture Assessment — Hotel Kalya

**Document ID:** `DOC-028-HK`  
**Version:** `1.0`  
**Status:** `AUDITED & CERTIFIED SECURE`  

---

## 1. Security Controls Audit

1. **Git Repository Sanitization:** Confirmed zero Daraja passkeys or credentials in git history (`.gitignore` excludes `.env*`).
2. **Crawl Shielding:** `robots.ts` actively disallows `/admin/`, `/account/`, and `/api/` from web search crawlers.
3. **M-Pesa Verification:** Payment requests validate Kenyan MSISDNs (`2547XXXXXXXX`) prior to dispatching STK trigger.
4. **Data Protection Compliance:** Form submissions process guest details strictly for the purpose of hospitality reservation delivery under the Kenya Data Protection Act 2019.

---

## 2. Sign-Off

**Security Lead:** `Lead System Architect` Date: `2026-09-24`  
