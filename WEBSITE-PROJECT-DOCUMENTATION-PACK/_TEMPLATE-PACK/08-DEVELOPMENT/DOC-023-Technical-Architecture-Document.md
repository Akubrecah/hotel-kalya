# DOC-023: Technical Architecture & Infrastructure Document

**Document ID:** `DOC-023`  
**Version:** `1.0`  
**Status:** `ARCHITECTURE BASELINE`  

---

## 1. System Architecture Diagram

```mermaid
graph TD
    Client[Browser / Mobile Client] --> Edge[Cloudflare / Vercel Edge CDN]
    Edge --> AppRouter[Next.js App Router (SSR / Static / Client)]
    AppRouter --> UI[Tailwind CSS & React 19 Components]
    AppRouter --> API[API Route Handlers /api/*]
    API --> Daraja[Safaricom Daraja M-Pesa Gateway]
    API --> DB[(Primary Database / Storage)]
    API --> Mail[Transactional Email / WhatsApp API]
```

---

## 2. Technology Stack Selection

- **Web Framework:** Next.js (App Router, Turbopack)
- **Language:** TypeScript (Strict compiler flags)
- **Styling:** Tailwind CSS with CSS Variables
- **Icons:** Lucide React
- **Hosting:** Vercel Global Edge Network
- **DNS & CDN:** Cloudflare / Vercel Edge

---

## 3. Environment Variables Specification

Documented in `.env.example`:
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_GOOGLE_MAPS_KEY`
- `DARAJA_CONSUMER_KEY`
- `DARAJA_CONSUMER_SECRET`
- `DARAJA_PASSKEY`
- `DARAJA_SHORTCODE`
- `DARAJA_CALLBACK_URL`

---

## 4. Sign-Off

**Lead System Architect:** `___________________________` Date: `__________`  
