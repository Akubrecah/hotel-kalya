# DOC-032: Production Deployment & Rollback Plan — Hotel Kalya

**Document ID:** `DOC-032-HK`  
**Version:** `1.0`  
**Status:** `READY FOR INSTANT PROMOTION`  

---

## 1. Production Target Parameters

- **Target Domain:** `https://hotelkalya.com`
- **Hosting Platform:** Vercel Global Edge Network
- **Build Command:** `next build` (Turbopack enabled)
- **Node Runtime:** Node.js 20.x LTS
- **Output:** Standalone optimized static bundle + serverless edge handlers.

---

## 2. Rollback Verification

- Previous stable git commit: `966c3ca feat: implement admin dashboard, KDS pipeline, reservations desk...`
- Current release candidate: `f71d6e2 fix: complete production readiness remediation...`
- Rollback execution time: **< 15 seconds** via Vercel instant deployment promotion.

---

## 3. Sign-Off

**Release Engineer:** `Lead System Architect` Date: `2026-09-24`  
