# DOC-021: UI Design System & Component Specification — Hotel Kalya

**Document ID:** `DOC-021-HK`  
**Version:** `1.0`  
**Status:** `IMPLEMENTED IN CSS & TAILWIND`  

---

## 1. Concrete Design Tokens (`src/app/globals.css`)

```css
@theme inline {
  --color-brand-amber: #F2AE1C;
  --color-brand-amber-dark: #D8930F;
  --color-brand-amber-light: #FDEEC8;
  --color-brand-maroon: #7C1322;
  --color-brand-maroon-dark: #580B16;
  --color-brand-maroon-light: #9B1A2C;
  --color-brand-sage: #7A9A8B;
  --color-brand-cream: #FDFBF7;
  --color-brand-dark: #1E0B0F;

  --font-serif: "Playfair Display", Georgia, serif;
  --font-sans: "Inter", system-ui, sans-serif;
}
```

---

## 2. Component System Library

- `<BrandLogo />`: Vector Hexagon monogram with dual-line typography.
- `<Breadcrumbs />`: Responsive navigation breadcrumb trail with schema.org JSON-LD.
- `<GoogleMap />`: Responsive map container with loading skeletons and GPS marker.
- `<DirectionsButton />`: Native Google Maps directions trigger.
- `<ReviewSummary />`, `<ReviewCard />`, `<ReviewCTA />`: Verified review proof elements.
- `<MenuItemCard />`: Digital menu item with dietary badges and quick cart add.
- `<MpesaModal />`: Lipa na M-Pesa interactive prompt with countdown timer.
- `<Lightbox />`: Fullscreen modal gallery with keyboard navigation.

---

## 3. Sign-Off

**Client Approval:** `Sarah Chebet (General Manager)` Date: `2026-09-24`  
