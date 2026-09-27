# DOC-035: Technical Operations & Maintenance Manual

**Document ID:** `DOC-035`  
**Version:** `1.0`  
**Status:** `TECHNICAL MANUAL`  

---

## 1. Local Development & Build Runbook

```bash
# Clone the repository
git clone [REPOSITORY_URL]
cd [PROJECT_DIR]

# Install dependencies strictly matching lockfile
npm ci

# Launch local development server
npm run dev
# Server accessible at http://localhost:3000

# Run static quality checks
npm run lint
npx tsc --noEmit

# Compile production release build
npm run build
```

---

## 2. Environment Variables Configuration

Create `.env.local` based on `.env.example`:
```env
NEXT_PUBLIC_APP_URL=https://www.clientdomain.com
DARAJA_CONSUMER_KEY=your_key_here
DARAJA_CONSUMER_SECRET=your_secret_here
DARAJA_PASSKEY=your_passkey_here
DARAJA_SHORTCODE=your_shortcode_here
DARAJA_CALLBACK_URL=https://www.clientdomain.com/api/payments/mpesa/callback
```

---

## 3. Routine Maintenance Tasks

- **Monthly:** Audit `npm audit` for dependency security patches.
- **Quarterly:** Review SSL certificates and Google Search Console performance.
- **Bi-Annually:** Refresh static photography assets and review sitemap coverage.

---

## 4. Sign-Off

**Lead System Architect:** `___________________________` Date: `__________`  
