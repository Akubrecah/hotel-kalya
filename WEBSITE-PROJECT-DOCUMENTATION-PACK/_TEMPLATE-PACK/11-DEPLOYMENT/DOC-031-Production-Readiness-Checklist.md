# DOC-031: Production Readiness & Pre-Deployment Audit

**Document ID:** `DOC-031`  
**Version:** `1.0`  
**Status:** `AUDITED & CERTIFIED`  

---

## 1. 26-Point Pre-Deployment Checklist

- [ ] 01. Client UAT formally approved (`DOC-030`).
- [ ] 02. Design freeze certificate executed (`DOC-022`).
- [ ] 03. All P0 and P1 defects resolved and closed in defect register (`DOC-027`).
- [ ] 04. TypeScript compiler check passes cleanly (`npx tsc --noEmit`).
- [ ] 05. ESLint quality check passes with 0 errors and 0 warnings (`npm run lint`).
- [ ] 06. Production build passes and generates static pages (`npm run build`).
- [ ] 07. Custom 404 page tested and operational (`not-found.tsx`).
- [ ] 08. Global and route-level error boundaries active (`error.tsx`, `global-error.tsx`).
- [ ] 09. Route-level loading states implemented (`loading.tsx`).
- [ ] 10. Canonical domain configured (`https://domain.com`).
- [ ] 11. DNS records pointed and SSL certificate active (TLS 1.3).
- [ ] 12. Non-www to www (or vice versa) 301 redirect configured.
- [ ] 13. Dynamic XML sitemap verified (`/sitemap.xml`).
- [ ] 14. Crawler directives verified (`/robots.txt`).
- [ ] 15. Schema.org JSON-LD microdata validated.
- [ ] 16. Google Search Console ownership verified via DNS TXT record.
- [ ] 17. Google Analytics / Tag Manager tracking container configured.
- [ ] 18. Google Maps Platform API key restricted to authorized domain.
- [ ] 19. M-Pesa Daraja production credentials and webhook callback URL configured.
- [ ] 20. Form submissions deliver inquiries to client email and WhatsApp.
- [ ] 21. Favicon icons installed (32x32, 180x180 Apple touch icon).
- [ ] 22. Focus-visible outline rings verified on all interactive elements.
- [ ] 23. Image alt attributes verified on 100% of images.
- [ ] 24. Zero secrets, private tokens, or passwords in Git repository.
- [ ] 25. Database backups automated with point-in-time recovery.
- [ ] 26. Rollback plan documented and tested (`DOC-032`).

---

## 2. Sign-Off

**Release Engineer:** `___________________________` Date: `__________`  
