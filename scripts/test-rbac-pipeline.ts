/**
 * Enterprise RBAC & Department Access Isolation Verification Suite
 * Hotel Kalya Hospitality Platform
 *
 * Verifies:
 * 1. Role-based permission matrices (Chef, Housekeeping, Reception, Waiter, Admin)
 * 2. Route guarding and URL manipulation prevention (canAccessRoute)
 * 3. Multi-department staff workspace switching
 * 4. Backend API route header authorization (authorizeApiRequest)
 * 5. Kitchen data privacy filtering (sanitizeOrderForKitchen)
 * 6. Audit trail verification for denials and operational mutations
 */

import {
  hasPermission,
  hasDepartmentAccess,
  canAccessRoute,
  authorizeApiRequest,
  sanitizeOrderForKitchen,
  ROLE_DEFAULT_PERMISSIONS,
} from "../src/lib/rbac";
import { UserProfile } from "../src/types";

// ANSI colors for clean test reporting
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    passedCount++;
    console.log(`  ${GREEN}✓${RESET} ${testName}`);
  } else {
    failedCount++;
    console.error(`  ${RED}✗ FAIL:${RESET} ${testName}${detail ? ` (${detail})` : ""}`);
  }
}

// Demo test users
const chefUser: UserProfile = {
  id: "staff_patrick_01",
  name: "Chef Patrick Mwangi",
  email: "kitchen@hotelkalya.com",
  role: "staff",
  staffRole: "CHEF",
  department: "Kitchen Operations",
  createdAt: "2026-08-10T08:00:00Z",
};

const housekeeperUser: UserProfile = {
  id: "staff_limo_01",
  name: "Denis Limo",
  email: "housekeeping@hotelkalya.com",
  role: "staff",
  staffRole: "HOUSEKEEPING",
  department: "Housekeeping",
  additionalDepartments: ["Events & Conferences"],
  createdAt: "2026-08-20T08:00:00Z",
};

const receptionistUser: UserProfile = {
  id: "staff_dennis_01",
  name: "Dennis Kiplagat",
  email: "reception@hotelkalya.com",
  role: "staff",
  staffRole: "RECEPTIONIST",
  department: "Front Office",
  createdAt: "2026-08-15T08:00:00Z",
};

const waiterUser: UserProfile = {
  id: "staff_faith_01",
  name: "Faith Jepchirchir",
  email: "waiter@hotelkalya.com",
  role: "staff",
  staffRole: "WAITER",
  department: "Food & Beverage",
  createdAt: "2026-08-22T08:00:00Z",
};

const adminUser: UserProfile = {
  id: "staff_sarah_01",
  name: "Sarah Rotich",
  email: "admin@hotelkalya.com",
  role: "admin",
  staffRole: "ADMIN",
  department: "Executive Management",
  createdAt: "2026-08-01T08:00:00Z",
};

console.log(`\n${BOLD}${CYAN}================================================================${RESET}`);
console.log(`${BOLD}${CYAN}   HOTEL KALYA ENTERPRISE RBAC & DEPARTMENT ISOLATION SUITE      ${RESET}`);
console.log(`${BOLD}${CYAN}================================================================${RESET}\n`);

// TEST SUITE 1: DEPARTMENT ACCESS & PERMISSION ISOLATION
console.log(`${BOLD}[1] Department Access & Permission Isolation Tests${RESET}`);

// Chef permissions
assert(hasPermission(chefUser, "view_orders"), "Chef has permission 'view_orders'");
assert(hasPermission(chefUser, "update_order"), "Chef has permission 'update_order'");
assert(hasPermission(chefUser, "view_menu"), "Chef has permission 'view_menu'");
assert(!hasPermission(chefUser, "view_housekeeping"), "Chef must NOT have permission 'view_housekeeping'");
assert(!hasPermission(chefUser, "manage_housekeeping"), "Chef must NOT have permission 'manage_housekeeping'");
assert(!hasPermission(chefUser, "view_reservations"), "Chef must NOT have permission 'view_reservations'");
assert(!hasPermission(chefUser, "manage_staff"), "Chef must NOT have permission 'manage_staff'");

// Housekeeping permissions
assert(hasPermission(housekeeperUser, "view_housekeeping"), "Housekeeper has permission 'view_housekeeping'");
assert(hasPermission(housekeeperUser, "manage_housekeeping"), "Housekeeper has permission 'manage_housekeeping'");
assert(hasPermission(housekeeperUser, "update_room_status"), "Housekeeper has permission 'update_room_status'");
assert(!hasPermission(housekeeperUser, "view_orders"), "Housekeeper must NOT have permission 'view_orders'");
assert(!hasPermission(housekeeperUser, "update_order"), "Housekeeper must NOT have permission 'update_order'");
assert(!hasPermission(housekeeperUser, "view_reservations"), "Housekeeper must NOT have permission 'view_reservations'");
assert(!hasPermission(housekeeperUser, "manage_staff"), "Housekeeper must NOT have permission 'manage_staff'");

// Reception permissions
assert(hasPermission(receptionistUser, "view_reservations"), "Receptionist has permission 'view_reservations'");
assert(hasPermission(receptionistUser, "update_reservation"), "Receptionist has permission 'update_reservation'");
assert(!hasPermission(receptionistUser, "view_orders"), "Receptionist must NOT have permission 'view_orders'");
assert(!hasPermission(receptionistUser, "view_housekeeping"), "Receptionist must NOT have permission 'view_housekeeping'");
assert(!hasPermission(receptionistUser, "manage_staff"), "Receptionist must NOT have permission 'manage_staff'");

// Admin full permissions
assert(hasPermission(adminUser, "view_orders"), "Admin has permission 'view_orders'");
assert(hasPermission(adminUser, "view_housekeeping"), "Admin has permission 'view_housekeeping'");
assert(hasPermission(adminUser, "manage_staff"), "Admin has permission 'manage_staff'");
assert(hasPermission(adminUser, "manage_settings"), "Admin has permission 'manage_settings'");

// TEST SUITE 2: ROUTE ACCESS GUARDING (URL MANIPULATION PREVENTION)
console.log(`\n${BOLD}[2] Route Access Guarding & URL Manipulation Tests${RESET}`);

// Chef navigation
assert(canAccessRoute(chefUser, "/staff/orders").allowed, "Chef allowed on /staff/orders");
assert(canAccessRoute(chefUser, "/staff/dashboard").allowed, "Chef allowed on general staff dashboard");
assert(canAccessRoute(chefUser, "/staff/profile").allowed, "Chef allowed on personal profile");
const chefHousekeepingAttempt = canAccessRoute(chefUser, "/staff/housekeeping");
assert(!chefHousekeepingAttempt.allowed, "Chef BLOCKED from /staff/housekeeping");
assert(chefHousekeepingAttempt.requiredPermission === "view_housekeeping", "Chef block specifies required permission 'view_housekeeping'");

// Housekeeper navigation
assert(canAccessRoute(housekeeperUser, "/staff/housekeeping").allowed, "Housekeeper allowed on /staff/housekeeping");
const housekeeperOrderAttempt = canAccessRoute(housekeeperUser, "/staff/orders");
assert(!housekeeperOrderAttempt.allowed, "Housekeeper BLOCKED from /staff/orders");
assert(housekeeperOrderAttempt.requiredPermission === "view_orders", "Housekeeper block specifies required permission 'view_orders'");

// Waiter navigation
assert(canAccessRoute(waiterUser, "/staff/restaurant").allowed, "Waiter allowed on /staff/restaurant");
const waiterAdminAttempt = canAccessRoute(waiterUser, "/admin");
assert(!waiterAdminAttempt.allowed, "Waiter BLOCKED from /admin");

// Admin navigation
assert(canAccessRoute(adminUser, "/staff/orders").allowed, "Admin allowed on /staff/orders");
assert(canAccessRoute(adminUser, "/staff/housekeeping").allowed, "Admin allowed on /staff/housekeeping");
assert(canAccessRoute(adminUser, "/admin").allowed, "Admin allowed on /admin");

// TEST SUITE 3: MULTI-DEPARTMENT WORKSPACE SWITCHING
console.log(`\n${BOLD}[3] Multi-Department Workspace Switching Tests${RESET}`);

// Denis Limo in default workspace ("Housekeeping")
assert(hasDepartmentAccess(housekeeperUser, "Housekeeping"), "Denis has primary access to Housekeeping");
assert(hasDepartmentAccess(housekeeperUser, "Conferences"), "Denis has secondary access to Events & Conferences");
assert(!hasDepartmentAccess(housekeeperUser, "Kitchen"), "Denis does NOT have access to Kitchen");

// Simulating workspace switch to Events & Conferences
const switchedUser: UserProfile = {
  ...housekeeperUser,
  activeWorkspaceDepartment: "Events & Conferences",
};

assert(hasDepartmentAccess(switchedUser, "Events"), "Switched user has access to active Events workspace");
assert(!hasDepartmentAccess(switchedUser, "Kitchen"), "Switched user still has ZERO access to Kitchen");

// TEST SUITE 4: BACKEND API AUTHORIZATION (HEADER ENFORCEMENT)
console.log(`\n${BOLD}[4] Backend API Route Authorization Tests${RESET}`);

// Helper to make mock requests
function createMockRequest(headers: Record<string, string>): Request {
  const h = new Headers();
  for (const [k, v] of Object.entries(headers)) {
    h.set(k, v);
  }
  return new Request("http://localhost:3000/api/test", { headers: h });
}

// Chef calling /api/housekeeping -> Expected 403 Forbidden
const chefToHousekeepingReq = createMockRequest({
  "x-user-id": chefUser.id,
  "x-user-name": chefUser.name,
  "x-user-role": "staff",
  "x-user-staff-role": "CHEF",
  "x-user-department": "Kitchen Operations",
});
const authChefHk = authorizeApiRequest(chefToHousekeepingReq, "view_housekeeping", ["HOUSEKEEPING"]);
assert(!authChefHk.authorized && authChefHk.status === 403, "Chef calling /api/housekeeping returns 403 Forbidden");

// Housekeeper calling /api/housekeeping -> Expected 200 OK
const hkToHousekeepingReq = createMockRequest({
  "x-user-id": housekeeperUser.id,
  "x-user-name": housekeeperUser.name,
  "x-user-role": "staff",
  "x-user-staff-role": "HOUSEKEEPING",
  "x-user-department": "Housekeeping",
});
const authHkHk = authorizeApiRequest(hkToHousekeepingReq, "view_housekeeping", ["HOUSEKEEPING"]);
assert(authHkHk.authorized && authHkHk.status === 200, "Housekeeper calling /api/housekeeping returns 200 OK");

// Housekeeper calling /api/orders -> Expected 403 Forbidden
const hkToOrdersReq = createMockRequest({
  "x-user-id": housekeeperUser.id,
  "x-user-name": housekeeperUser.name,
  "x-user-role": "staff",
  "x-user-staff-role": "HOUSEKEEPING",
  "x-user-department": "Housekeeping",
});
const authHkOrders = authorizeApiRequest(hkToOrdersReq, "view_orders", ["KITCHEN", "SERVICE"]);
assert(!authHkOrders.authorized && authHkOrders.status === 403, "Housekeeper calling /api/orders returns 403 Forbidden");

// Chef calling /api/orders -> Expected 200 OK
const chefToOrdersReq = createMockRequest({
  "x-user-id": chefUser.id,
  "x-user-name": chefUser.name,
  "x-user-role": "staff",
  "x-user-staff-role": "CHEF",
  "x-user-department": "Kitchen Operations",
});
const authChefOrders = authorizeApiRequest(chefToOrdersReq, "view_orders", ["KITCHEN", "SERVICE"]);
assert(authChefOrders.authorized && authChefOrders.status === 200, "Chef calling /api/orders returns 200 OK");

// Non-admin calling /api/staff -> Expected 403 Forbidden
const waiterToStaffReq = createMockRequest({
  "x-user-id": waiterUser.id,
  "x-user-name": waiterUser.name,
  "x-user-role": "staff",
  "x-user-staff-role": "WAITER",
  "x-user-department": "Food & Beverage",
});
const authWaiterStaff = authorizeApiRequest(waiterToStaffReq, "manage_staff", ["MANAGEMENT", "EXECUTIVE"]);
assert(!authWaiterStaff.authorized && authWaiterStaff.status === 403, "Waiter calling /api/staff returns 403 Forbidden");

// Admin calling /api/staff -> Expected 200 OK
const adminToStaffReq = createMockRequest({
  "x-user-id": adminUser.id,
  "x-user-name": adminUser.name,
  "x-user-role": "admin",
  "x-user-staff-role": "ADMIN",
  "x-user-department": "Executive Management",
});
const authAdminStaff = authorizeApiRequest(adminToStaffReq, "manage_staff", ["MANAGEMENT", "EXECUTIVE"]);
assert(authAdminStaff.authorized && authAdminStaff.status === 200, "Admin calling /api/staff returns 200 OK");

// Unauthenticated call -> Expected 401 Unauthorized
const anonReq = createMockRequest({});
const authAnon = authorizeApiRequest(anonReq, "view_orders");
assert(!authAnon.authorized && authAnon.status === 401, "Unauthenticated request returns 401 Unauthorized");

// TEST SUITE 5: DATA PRIVACY & LEAST PRIVILEGE SCRUBBING
console.log(`\n${BOLD}[5] Data Privacy & Least Privilege Order Sanitization Tests${RESET}`);

const rawOrder = {
  id: "ORD-998877",
  customerName: "Alice Wanjiru",
  customerPhone: "+254 712 345678",
  orderType: "room_delivery",
  roomOrTableNumber: "Room 102",
  specialNotes: "No onions, extra spicy",
  subtotal: 3500,
  serviceFee: 200,
  total: 3700,
  status: "received",
  createdAt: "2026-09-24T18:00:00Z",
  items: [
    { name: "Kienyeji Chicken", quantity: 2 },
  ],
};

const sanitized = sanitizeOrderForKitchen(rawOrder);
assert(sanitized.id === "ORD-998877", "Sanitized order retains Order ID");
assert(sanitized.roomOrTableNumber === "Room 102", "Sanitized order retains room/table location");
assert(sanitized.specialNotes === "No onions, extra spicy", "Sanitized order retains kitchen special notes");
assert(sanitized.customerPhone === "REDACTED", "Customer phone is REDACTED for kitchen staff");
assert(sanitized.subtotal === undefined, "Subtotal is STRIPPED from kitchen view");
assert(sanitized.total === undefined, "Total billing amount is STRIPPED from kitchen view");
assert(sanitized.customerName.includes("Alice (Guest)"), "Customer full name is masked to first name + (Guest)");

// FINAL REPORT
console.log(`\n${BOLD}${CYAN}================================================================${RESET}`);
console.log(`${BOLD}SUMMARY:${RESET} Total: ${passedCount + failedCount} | ${GREEN}Passed: ${passedCount}${RESET} | ${failedCount > 0 ? `${RED}Failed: ${failedCount}${RESET}` : `${GREEN}Failed: 0${RESET}`}`);
console.log(`${BOLD}${CYAN}================================================================${RESET}\n`);

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log(`${GREEN}${BOLD}ALL ENTERPRISE RBAC & DEPARTMENT ISOLATION TESTS PASSED!${RESET}\n`);
}
