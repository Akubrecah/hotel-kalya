# DOC-033: Go-Live Smoke Test Protocol

**Document ID:** `DOC-033`  
**Version:** `1.0`  
**Status:** `SMOKE TEST PROTOCOL`  

---

## 1. Post-Deployment Verification (Go-Live Smoke Test)

Execute immediately following production domain cutover:

- [ ] 01. Domain resolves over HTTPS with valid SSL certificate without browser warnings.
- [ ] 02. Non-www correctly redirects to canonical URL (or vice-versa).
- [ ] 03. Homepage renders all hero graphics, typography, and primary CTAs.
- [ ] 04. Top navigation links route directly to their respective pages.
- [ ] 05. Contact form submission sends inquiry to client inbox.
- [ ] 06. WhatsApp floating button opens chat window with pre-filled message.
- [ ] 07. Google Maps embed renders pinpoint marker at correct coordinates.
- [ ] 08. Digital menu displays prices and enables item cart addition.
- [ ] 09. M-Pesa modal opens and triggers STK prompt.
- [ ] 10. Admin portal accepts staff login and renders real-time dashboard.
- [ ] 11. Google Search Console XML sitemap submission confirmed.
- [ ] 12. 404 test confirms custom error page on bad URL.

---

## 2. Sign-Off

**Release Engineer:** `___________________________` Date: `__________`  
