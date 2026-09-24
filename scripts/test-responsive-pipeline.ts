/**
 * Hotel Kalya - Automated Responsive & Cross-Device Experience Test Suite
 *
 * Validates:
 * 1. Global CSS responsive safeguards (overflow-x: clip, safe-areas, touch-action, touch-targets)
 * 2. Viewport height modal containment (max-h-[90vh] overflow-y-auto) across all modal dialogs
 * 3. Navigation drawer implementations (body scroll lock, route-change close, tap-outside backdrop)
 * 4. Responsive table representations (mobile stacked cards + responsive desktop tables)
 * 5. Mobile-first form collapsing and small viewport media scaling (320px safe geometry)
 */

import fs from "fs";
import path from "path";

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, testName: string, details?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ [PASS] ${testName}`);
  } else {
    console.error(`  ✗ [FAIL] ${testName}${details ? ` -> ${details}` : ""}`);
  }
}

const ROOT = path.join(__dirname, "..");

console.log("\n========================================================");
console.log("   HOTEL KALYA - RESPONSIVE & CROSS-DEVICE TEST SUITE");
console.log("========================================================\n");

// 1. Global CSS Verification
console.log("--- 1. GLOBAL CSS RESPONSIVE SAFEGUARDS ---");
const globalsCss = fs.readFileSync(path.join(ROOT, "src/app/globals.css"), "utf8");
assert(
  globalsCss.includes("overflow-x: clip") && globalsCss.includes("max-width: 100%"),
  "CSS html & body overflow-x clipped to prevent unwanted horizontal scrolling"
);
assert(
  globalsCss.includes("safe-area-inset-left") && globalsCss.includes("safe-area-inset-right"),
  "CSS notch & safe-area insets configured for edge-to-edge mobile devices"
);
assert(
  globalsCss.includes("touch-action: manipulation"),
  "CSS touch-action manipulation active on clickable elements (eliminates 300ms tap lag)"
);
assert(
  globalsCss.includes(".touch-target") && globalsCss.includes("min-height: 44px"),
  "CSS 44px minimum touch-target class defined for accessible touch elements"
);
assert(
  globalsCss.includes(".responsive-table-container") && globalsCss.includes("-webkit-overflow-scrolling: touch"),
  "CSS responsive table container with inertial momentum touch scrolling"
);

// 2. Modal Viewport Containment Verification
console.log("\n--- 2. MODAL VIEWPORT CONTAINMENT (MAX-H-[90VH] OVERFLOW-Y-AUTO) ---");
const mpesaModal = fs.readFileSync(path.join(ROOT, "src/components/payments/MpesaModal.tsx"), "utf8");
assert(
  mpesaModal.includes("max-h-[90vh]") && mpesaModal.includes("overflow-y-auto"),
  "M-Pesa payment modal bounded by max-h-[90vh] with internal scrolling"
);

const roomsPage = fs.readFileSync(path.join(ROOT, "src/app/rooms/page.tsx"), "utf8");
assert(
  roomsPage.includes("max-h-[90vh]") && roomsPage.includes("overflow-y-auto"),
  "Public Room Availability modal bounded by max-h-[90vh] with internal scrolling"
);
assert(
  roomsPage.includes("flex-col sm:flex-row"),
  "Public Room Availability modal actions wrap to single-column on mobile"
);

const adminRoomsPage = fs.readFileSync(path.join(ROOT, "src/app/admin/rooms/page.tsx"), "utf8");
assert(
  adminRoomsPage.includes("max-h-[90vh] overflow-y-auto"),
  "Admin Room Edit and Calendar modals bounded by max-h-[90vh] and scrollable"
);

const adminStaffPage = fs.readFileSync(path.join(ROOT, "src/app/admin/staff/page.tsx"), "utf8");
assert(
  adminStaffPage.includes("max-h-[90vh] overflow-y-auto"),
  "Admin Add Staff modal bounded by max-h-[90vh] and scrollable"
);
assert(
  adminStaffPage.includes("grid-cols-1 sm:grid-cols-2"),
  "Admin Add Staff form fields collapse to single-column on mobile viewports"
);

const staffLayout = fs.readFileSync(path.join(ROOT, "src/app/staff/layout.tsx"), "utf8");
assert(
  staffLayout.includes("max-h-[90vh] overflow-y-auto"),
  "Staff Portal Elevation modal bounded by max-h-[90vh] and scrollable"
);

// 3. Navigation Drawers & Mobile Gestures
console.log("\n--- 3. NAVIGATION DRAWERS & BACKDROP DISMISSAL ---");
assert(
  staffLayout.includes("document.body.style.overflow = mobileNavOpen ? \"hidden\" : \"auto\"") ||
  staffLayout.includes("overflow = \"hidden\""),
  "Staff Portal locks body scroll when mobile navigation drawer is open"
);
assert(
  staffLayout.includes("fixed inset-0 bg-black/60") && staffLayout.includes("onClick={() => setMobileNavOpen(false)}"),
  "Staff Portal mobile drawer has 1-tap backdrop outside dismissal"
);
assert(
  staffLayout.includes("setMobileNavOpen(false)") && staffLayout.includes("pathname"),
  "Staff Portal automatically closes drawer on route change"
);

const adminLayout = fs.readFileSync(path.join(ROOT, "src/app/admin/layout.tsx"), "utf8");
assert(
  adminLayout.includes("overflow = \"hidden\"") || adminLayout.includes("overflow = mobileNavOpen ? \"hidden\" : \"auto\""),
  "Admin Console locks body scroll when mobile navigation drawer is open"
);
assert(
  adminLayout.includes("fixed inset-0 bg-black/60") && adminLayout.includes("onClick={() => setMobileNavOpen(false)}"),
  "Admin Console mobile drawer has 1-tap backdrop outside dismissal"
);
assert(
  adminLayout.includes("setMobileNavOpen(false)") && adminLayout.includes("pathname"),
  "Admin Console automatically closes drawer on route change"
);

const navbar = fs.readFileSync(path.join(ROOT, "src/components/layout/Navbar.tsx"), "utf8");
assert(
  navbar.includes("overflow = \"hidden\""),
  "Public Navbar locks body scroll when mobile menu is open"
);
assert(
  navbar.includes("onClick={() => setMobileMenuOpen(false)}") && navbar.includes("stopPropagation"),
  "Public Navbar mobile menu has 1-tap backdrop outside dismissal"
);

// 4. Responsive Table Representations (Mobile Cards vs Desktop Tables)
console.log("\n--- 4. RESPONSIVE TABLE & KDS COLUMN REPRESENTATIONS ---");
const staffReservations = fs.readFileSync(path.join(ROOT, "src/app/staff/reservations/page.tsx"), "utf8");
assert(
  staffReservations.includes("block lg:hidden") && staffReservations.includes("hidden lg:block"),
  "Staff Reservations has dual view: mobile stacked cards (<lg) + desktop table (lg+)"
);

const adminReservations = fs.readFileSync(path.join(ROOT, "src/app/admin/reservations/page.tsx"), "utf8");
assert(
  adminReservations.includes("block lg:hidden") && adminReservations.includes("hidden lg:block"),
  "Admin Reservations has dual view: mobile stacked cards (<lg) + desktop table (lg+)"
);

const adminOrders = fs.readFileSync(path.join(ROOT, "src/app/admin/orders/page.tsx"), "utf8");
assert(
  adminOrders.includes("min-h-[160px] md:min-h-[500px]"),
  "Admin KDS Kanban columns collapse to min-h-[160px] on mobile to eliminate blank scroll space"
);

// 5. Small Viewport (320px) Safe Geometry
console.log("\n--- 5. SMALL VIEWPORT (320PX-414PX) SAFE GEOMETRY ---");
const cartPage = fs.readFileSync(path.join(ROOT, "src/app/cart/page.tsx"), "utf8");
assert(
  cartPage.includes("flex-col sm:flex-row"),
  "Cart items adapt to flex-col on small viewports so dish titles & controls never compress"
);

const heroSection = fs.readFileSync(path.join(ROOT, "src/components/sections/HeroSection.tsx"), "utf8");
assert(
  heroSection.includes("w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96"),
  "Hero circular graphic showcase scales proportionally from 256px on mobile to 384px on desktop"
);

const footer = fs.readFileSync(path.join(ROOT, "src/components/layout/Footer.tsx"), "utf8");
assert(
  footer.includes("text-center sm:text-left"),
  "Footer copyright and links center symmetrically when stacked on mobile"
);

// Summary
console.log("\n========================================================");
console.log(`  RESPONSIVE PIPELINE AUDIT: ${passedTests}/${totalTests} Tests Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log("========================================================\n");

if (passedTests !== totalTests) {
  process.exit(1);
} else {
  console.log("All responsive and cross-device requirements verified successfully!\n");
}
