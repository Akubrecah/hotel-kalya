# 00 — Client Content Collection & Onboarding Guide

## Overview

This guide explains how your team can provide the necessary textual, graphical, and contact information to fully personalize your web platform.

All fields have been prepared with explicit placeholder tags:
- `[BUSINESS NAME]`
- `[PHONE NUMBER]`
- `[WHATSAPP NUMBER]`
- `[EMAIL ADDRESS]`
- `[BUSINESS ADDRESS]`
- `[SERVICE DESCRIPTION]`
- `[UPLOAD IMAGE]`

Simply replace the bracketed `[PLACEHOLDER]` text in each markdown file or in the companion `client-content-payload.json` file.

---

## Content Submission Checklist

Before submitting your content, please ensure you have prepared:

1. **Brand Identity:**
   - [ ] High-resolution logo in vector format (`.svg` or transparent `.png` min 1000px wide)
   - [ ] Dark-background variant of your logo (for the Black Template)
   - [ ] Brand tagline and mission statement
   - [ ] Brand primary & secondary color hex codes (if different from default Gold/Maroon/Black)

2. **Rooms & Accommodation:**
   - [ ] Names for all room categories
   - [ ] High-resolution photography (at least 3 photos per room type: bed, bathroom, seating area)
   - [ ] Room capacities (adults / children) and bed configurations
   - [ ] Published rack rates and discounted direct rates
   - [ ] Full list of in-room amenities

3. **Dining & Menus:**
   - [ ] Restaurant and bar names
   - [ ] Operating hours (Breakfast, Lunch, Dinner, Room Service)
   - [ ] Food & beverage menu items with descriptions and prices
   - [ ] Signature dishes with photos

4. **Conferences & Events:**
   - [ ] Hall names and maximum capacities by seating layout (Theatre, U-Shape, Classroom, Banquet)
   - [ ] Day delegate package (DDR) pricing and inclusions
   - [ ] Outside catering package options and garden wedding pricing

5. **Contact & Social Verification:**
   - [ ] Official dedicated WhatsApp business number (with international dial code e.g., `+254...`)
   - [ ] Official reservation phone line and front desk phone line
   - [ ] Official inquiry email address
   - [ ] Exact Google Maps pin URL or GPS coordinates

---

## File Format & Asset Delivery Guidelines

| Asset Type | Recommended Format | Minimum Dimensions | Notes |
| :--- | :--- | :--- | :--- |
| **Header Logo** | `.svg` or transparent `.png` | 600 × 200 px | Must contrast cleanly against dark (`#09090B`) and light backgrounds |
| **Hero Background** | `.webp` or `.jpg` | 1920 × 1080 px | Landscape aspect ratio (16:9), high resolution, optimized < 800 KB |
| **Room Photos** | `.webp` or `.jpg` | 1200 × 800 px | Natural warm lighting, showing bed and room space |
| **Dining / Dish Photos** | `.webp` or `.jpg` | 1000 × 750 px | Appetizing close-up or spread |
| **PDF Menus / Packages**| `.pdf` | Printable A4 / Letter | Downloadable conference brochures, wine lists, or catering menus |

---

## Handover Workflow

```
1. Download or clone this BLACK-TEMPLATE-PACK folder
2. Open each numbered file (01 through 10) in any text editor or markdown viewer
3. Replace every [PLACEHOLDER] tag with your verified business data
4. Collect image assets into a shared drive folder (Google Drive / Dropbox)
5. Return the completed files and asset link to the development team
6. Developer ingests data into the live platform and verifies via http://localhost:3000/template
```
