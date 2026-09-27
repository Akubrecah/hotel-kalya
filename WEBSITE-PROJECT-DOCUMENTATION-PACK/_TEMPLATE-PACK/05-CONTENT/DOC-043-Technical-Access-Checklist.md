# DOC-043: Technical Access & Delegation Protocol

**Document ID:** `DOC-043`  
**Phase:** `Phase 9 — Technical Access & Delegation`  
**Version:** `1.0`  
**Status:** `ACTIVE PROTOCOL`  

---

## 1. Secure Access Policy

> **CRITICAL SECURITY RULE:** Never send master passwords or root credentials over WhatsApp, SMS, or unencrypted chat. Technical access must be granted strictly via **delegated user invitations** or through secure password managers.

---

## 2. Technical Infrastructure Access Register

| System / Provider | Access Method | Delegated Email / Role | Permission Level | Status |
| :--- | :--- | :--- | :--- | :---: |
| **Domain Registrar** | Delegate Access / Nameserver edit | `[developer@agency.com]` | DNS Management Only | `[Granted]` |
| **Cloud Hosting / CDN** | Vercel / Cloudflare Team Member | `[developer@agency.com]` | Admin / Developer | `[Granted]` |
| **Google Search Console**| Add User via Ownership Panel | `[developer@agency.com]` | Full User | `[Granted]` |
| **Google Analytics 4** | User Management in Property Admin| `[developer@agency.com]` | Editor | `[Granted]` |
| **Google Maps Platform**| Cloud Console IAM Role | `[developer@agency.com]` | API Viewer / Admin | `[Granted]` |
| **Payment Gateway** | Safaricom Daraja Portal | `[developer@agency.com]` | Developer Account | `[Granted]` |
| **Corporate Email / DNS**| MX / TXT verification records | Developer provides records | DNS Entry by Client | `[Configured]` |

---

## 3. Revocation & Post-Handover Protocol

1. Upon final project acceptance (`DOC-040`), temporary developer administrative privileges shall be downgraded or revoked.
2. The Client retains sole primary master ownership of all third-party subscriptions.

---

## 4. Sign-Off

**Client IT Representative:** `___________________________` Date: `__________`  
**Developer Security Lead:** `___________________________` Date: `__________`  
