# DOC-026: Comprehensive Website QA & Testing Checklist

**Document ID:** `DOC-026`  
**Version:** `1.0`  
**Status:** `QUALITY GATES AUDITED`  

---

## 1. Multi-Dimensional Verification Matrix

### 1.1 Functional Quality
- [ ] Navigation links route correctly without 404 dead ends.
- [ ] Active links and parent category dropdowns highlight accurately.
- [ ] Contact & inquiry forms validate phone, email, and required fields.
- [ ] Cart item additions, quantity updates, and deletions reflect accurately.
- [ ] Date pickers prevent checkout dates occurring prior to check-in dates.
- [ ] M-Pesa phone number validation enforces country code conventions.

### 1.2 Responsive Breakpoint Quality
- [ ] Mobile Viewport (375px - iPhone SE): No horizontal scrollbar overflow.
- [ ] Tablet Viewport (768px - iPad): Clean 2-column wrapping.
- [ ] Laptop Viewport (1024px): Persistent navigation bar renders.
- [ ] Desktop Viewport (1440px+): Max container width centered at 1280px.

### 1.3 Cross-Browser Compatibility
- [ ] Google Chrome (Blink)
- [ ] Apple Safari (WebKit / iOS & macOS)
- [ ] Mozilla Firefox (Gecko)
- [ ] Microsoft Edge (Chromium)

### 1.4 Accessibility & SEO
- [ ] All interactive elements accessible via `Tab` keyboard navigation.
- [ ] Alt attributes present on all images.
- [ ] Heading hierarchy starts with a single `h1` per page.
- [ ] `robots.txt` and `sitemap.xml` return valid XML/text payloads.

---

## 2. Sign-Off

**QA Lead:** `___________________________` Date: `__________`  
