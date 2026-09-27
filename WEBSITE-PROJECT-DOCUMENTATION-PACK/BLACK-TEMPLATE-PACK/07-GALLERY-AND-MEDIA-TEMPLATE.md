# 07 — Gallery & Media Asset Template

This template outlines the visual media assets needed to populate the interactive gallery, room carousels, and lightbox viewer.

---

## 1. Media Asset Categories

Organize your photo uploads into the following categories:

### Category A: Exterior & Architecture
- [ ] Daytime facade view (showing property entry, grounds, and signage): `[UPLOAD IMAGE: filename or cloud link]`
- [ ] Evening / twilight architectural view (warm exterior lighting): `[UPLOAD IMAGE: filename or cloud link]`
- [ ] Aerial drone shot (overview of property and serene neighborhood): `[UPLOAD IMAGE: filename or cloud link]`

### Category B: Rooms & Accommodation
- [ ] Deluxe Single / Double Room angle 1 (bed and headboard): `[UPLOAD IMAGE]`
- [ ] Deluxe Single / Double Room angle 2 (wardrobe, TV, and work desk): `[UPLOAD IMAGE]`
- [ ] Executive Suite living area: `[UPLOAD IMAGE]`
- [ ] Executive Suite master bedroom: `[UPLOAD IMAGE]`
- [ ] Bathrooms (clean, well-lit, showing shower/tub fixtures): `[UPLOAD IMAGE]`

### Category C: Dining & Bar Experience
- [ ] Main restaurant dining hall during service: `[UPLOAD IMAGE]`
- [ ] Breakfast buffet presentation: `[UPLOAD IMAGE]`
- [ ] Outdoor garden terrace dining: `[UPLOAD IMAGE]`
- [ ] Cocktail bar and wine selection: `[UPLOAD IMAGE]`
- [ ] Plated food close-up 1 (African specialty): `[UPLOAD IMAGE]`
- [ ] Plated food close-up 2 (Grill / Continental): `[UPLOAD IMAGE]`

### Category D: Conferences & Events
- [ ] Main conference hall arranged in Theatre style: `[UPLOAD IMAGE]`
- [ ] Executive boardroom meeting in session: `[UPLOAD IMAGE]`
- [ ] Coffee break station with tea pastries: `[UPLOAD IMAGE]`
- [ ] Garden wedding or cocktail reception setup: `[UPLOAD IMAGE]`

### Category E: Gardens & Grounds
- [ ] Lush garden greenery and walking paths: `[UPLOAD IMAGE]`
- [ ] Outdoor seating under garden umbrellas: `[UPLOAD IMAGE]`
- [ ] Water features or landscaping accents: `[UPLOAD IMAGE]`

---

## 2. Technical Asset Specifications

To ensure fast load times and Core Web Vitals optimization, our build pipeline automatically processes images into WebP/AVIF formats. Please deliver original sources matching these specs:

- **Format:** High quality `.jpg`, `.png`, or `.webp`
- **Orientation:** Majority landscape (16:9 or 3:2 aspect ratios); portrait only for mobile-specific features
- **Color Profile:** sRGB
- **Compression:** High resolution originals (ideally 2000px to 3840px wide). We compress them during build.
- **Naming Convention:** `[category]-[subject]-[number].jpg` (e.g., `rooms-executive-suite-01.jpg`, `dining-buffet-01.jpg`)

---

## 3. Video Assets (Optional)

- **Property Walkthrough Video URL (YouTube / Vimeo):** `[https://youtube.com/watch?v=yourid]`
- **Hero Video Background Loop (MP4/WebM, silent, < 6MB, 15 seconds max):** `[UPLOAD VIDEO: link or filename]`
