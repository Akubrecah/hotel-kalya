# Black Template Pack — Executive Client Handover & Content Collection

Welcome to the **Black Template Pack** for the **Hotel Kalya Web Platform**.

This pack provides a standardized, professional Dark/Black visual foundation paired with a complete, field-by-field content collection kit designed for client handover, brand customization, and design system instantiation.

---

## What is in this Pack?

| Document / Asset | Purpose & Scope |
| :--- | :--- |
| [README.md](file:///Users/Akubrecah/Desktop/HOTEL%20KALYA/WEBSITE-PROJECT-DOCUMENTATION-PACK/BLACK-TEMPLATE-PACK/README.md) | Overview, architecture guide, and quick start instructions. |
| [00-CLIENT-CONTENT-COLLECTION-GUIDE.md](file:///Users/Akubrecah/Desktop/HOTEL%20KALYA/WEBSITE-PROJECT-DOCUMENTATION-PACK/BLACK-TEMPLATE-PACK/00-CLIENT-CONTENT-COLLECTION-GUIDE.md) | Step-by-step instructions for the client/marketing team on how to fill out the templates. |
| [01-BRAND-AND-IDENTITY-TEMPLATE.md](file:///Users/Akubrecah/Desktop/HOTEL%20KALYA/WEBSITE-PROJECT-DOCUMENTATION-PACK/BLACK-TEMPLATE-PACK/01-BRAND-AND-IDENTITY-TEMPLATE.md) | Business name, taglines, color codes, logo assets, brand voice, and social handles. |
| [02-HEADER-AND-NAVIGATION-TEMPLATE.md](file:///Users/Akubrecah/Desktop/HOTEL%20KALYA/WEBSITE-PROJECT-DOCUMENTATION-PACK/BLACK-TEMPLATE-PACK/02-HEADER-AND-NAVIGATION-TEMPLATE.md) | TopBar announcements, main navigation links, action buttons, and mobile drawer content. |
| [03-HERO-AND-HOMEPAGE-SECTIONS-TEMPLATE.md](file:///Users/Akubrecah/Desktop/HOTEL%20KALYA/WEBSITE-PROJECT-DOCUMENTATION-PACK/BLACK-TEMPLATE-PACK/03-HERO-AND-HOMEPAGE-SECTIONS-TEMPLATE.md) | Hero headline, sub-headline, booking bar, value props, statistics, and highlights. |
| [04-ACCOMMODATION-AND-ROOMS-TEMPLATE.md](file:///Users/Akubrecah/Desktop/HOTEL%20KALYA/WEBSITE-PROJECT-DOCUMENTATION-PACK/BLACK-TEMPLATE-PACK/04-ACCOMMODATION-AND-ROOMS-TEMPLATE.md) | Room categories, descriptions, nightly rates, capacity, bed types, and amenity badges. |
| [05-DINING-AND-MENU-TEMPLATE.md](file:///Users/Akubrecah/Desktop/HOTEL%20KALYA/WEBSITE-PROJECT-DOCUMENTATION-PACK/BLACK-TEMPLATE-PACK/05-DINING-AND-MENU-TEMPLATE.md) | Restaurant concept, bar features, breakfast times, menu sections, and signature dishes. |
| [06-SERVICES-AND-FACILITIES-TEMPLATE.md](file:///Users/Akubrecah/Desktop/HOTEL%20KALYA/WEBSITE-PROJECT-DOCUMENTATION-PACK/BLACK-TEMPLATE-PACK/06-SERVICES-AND-FACILITIES-TEMPLATE.md) | Conference halls, outside catering, garden event packages, and wellness facilities. |
| [07-GALLERY-AND-MEDIA-TEMPLATE.md](file:///Users/Akubrecah/Desktop/HOTEL%20KALYA/WEBSITE-PROJECT-DOCUMENTATION-PACK/BLACK-TEMPLATE-PACK/07-GALLERY-AND-MEDIA-TEMPLATE.md) | Photo requirements, resolution guidelines, category tags, and video tour assets. |
| [08-TESTIMONIALS-AND-REVIEWS-TEMPLATE.md](file:///Users/Akubrecah/Desktop/HOTEL%20KALYA/WEBSITE-PROJECT-DOCUMENTATION-PACK/BLACK-TEMPLATE-PACK/08-TESTIMONIALS-AND-REVIEWS-TEMPLATE.md) | Guest reviews, star ratings, reviewer names/locations, and OTA badges (TripAdvisor, Google). |
| [09-CONTACT-AND-WHATSAPP-TEMPLATE.md](file:///Users/Akubrecah/Desktop/HOTEL%20KALYA/WEBSITE-PROJECT-DOCUMENTATION-PACK/BLACK-TEMPLATE-PACK/09-CONTACT-AND-WHATSAPP-TEMPLATE.md) | Front desk phone, WhatsApp number, email addresses, department routing, and Google Map link. |
| [10-FOOTER-AND-LEGAL-TEMPLATE.md](file:///Users/Akubrecah/Desktop/HOTEL%20KALYA/WEBSITE-PROJECT-DOCUMENTATION-PACK/BLACK-TEMPLATE-PACK/10-FOOTER-AND-LEGAL-TEMPLATE.md) | Footer summary, quick links, copyright notice, privacy policy, and terms & conditions. |
| [client-content-payload.json](file:///Users/Akubrecah/Desktop/HOTEL%20KALYA/WEBSITE-PROJECT-DOCUMENTATION-PACK/BLACK-TEMPLATE-PACK/client-content-payload.json) | Complete machine-readable JSON representation ready for automated ingestion into database/CMS. |

---

## Interactive Live Version

In addition to these markdown templates, an interactive live preview version is built directly into the web application:

- **Route:** `http://localhost:3000/template` (or `https://your-domain/template`)
- **Features:**
  - **Live Executive Dark Mode Preview:** Built with the exact black tokens (`#09090B` background, `#121214` surface cards, gold accents, and high-contrast typography).
  - **JSON Schema Viewer:** Instant export/copy of the structured JSON data schema.
  - **In-App Client Guide:** Step-by-step fill-in guidance available directly to stakeholders.

---

## Design System Philosophy: The Black Foundation

Unlike basic "dark mode toggles" that merely flip backgrounds to `#000000`, this Black Template Pack uses a calibrated multi-surface hierarchy:

1. **Deep Zinc Base (`#09090B` / `--color-black-bg`):** Ground-level viewport canvas.
2. **Elevated Surface (`#121214` / `--color-black-surface`):** Structural cards, modal dialogs, and navigation containers.
3. **Secondary Surface (`#18181B` / `--color-black-surface-elevated`):** Interactive sub-cards, dropdown menus, and form inputs.
4. **Precision Borders (`#27272A` / `--color-black-border`):** 1px subtle separation preventing muddy contrast.
5. **Warm Gold Accent (`#D4AF37` / `--color-black-accent`):** Premium focal points, active states, and call-to-action highlights.
6. **Optical White Typography (`#FAFAFA` heading, `#A1A1AA` muted body):** Strict AAA WCAG accessibility standards across all viewports.
