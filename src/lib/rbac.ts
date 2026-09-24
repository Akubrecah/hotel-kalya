import { UserProfile } from "@/types";
import { StaffMember } from "@/types/hospitality";

export type DepartmentCode =
  | "KITCHEN"
  | "SERVICE"
  | "HOUSEKEEPING"
  | "FRONT_OFFICE"
  | "CONFERENCES"
  | "CATERING"
  | "EVENTS"
  | "MAINTENANCE"
  | "MANAGEMENT"
  | "EXECUTIVE";

export interface DepartmentInfo {
  code: DepartmentCode;
  name: string;
  description: string;
  defaultRole: string;
  primaryRoutes: string[];
}

export const DEPARTMENTS: Record<DepartmentCode, DepartmentInfo> = {
  KITCHEN: {
    code: "KITCHEN",
    name: "Kitchen Operations",
    description: "Food preparation, chef stations, prep times, and dietary execution",
    defaultRole: "CHEF",
    primaryRoutes: ["/staff/orders"],
  },
  SERVICE: {
    code: "SERVICE",
    name: "Food & Beverage / Waitstaff",
    description: "Restaurant tables, dining orders, guest requests, and bill requests",
    defaultRole: "WAITER",
    primaryRoutes: ["/staff/restaurant", "/staff/orders"],
  },
  HOUSEKEEPING: {
    code: "HOUSEKEEPING",
    name: "Housekeeping",
    description: "Room cleaning cycles, sanitation boards, linen tasks, and room readiness",
    defaultRole: "HOUSEKEEPING",
    primaryRoutes: ["/staff/housekeeping", "/staff/rooms"],
  },
  FRONT_OFFICE: {
    code: "FRONT_OFFICE",
    name: "Front Office",
    description: "Guest arrivals, departures, folios, check-ins, and reservations desk",
    defaultRole: "RECEPTIONIST",
    primaryRoutes: ["/staff/reservations", "/staff/rooms", "/staff/messages"],
  },
  CONFERENCES: {
    code: "CONFERENCES",
    name: "Events & Conferences",
    description: "Mount Elgon & Cherang'any plenary halls, delegate packages, and setups",
    defaultRole: "EVENT_COORDINATOR",
    primaryRoutes: ["/staff/conference", "/staff/events"],
  },
  CATERING: {
    code: "CATERING",
    name: "Outside Catering",
    description: "Offsite county summits, banqueting packages, and transport dispatch",
    defaultRole: "CATERING_STAFF",
    primaryRoutes: ["/staff/catering"],
  },
  EVENTS: {
    code: "EVENTS",
    name: "Gardens & Events",
    description: "Kalya botanical gardens, photo sessions, weddings, and lawn parties",
    defaultRole: "EVENT_COORDINATOR",
    primaryRoutes: ["/staff/events", "/staff/conference"],
  },
  MAINTENANCE: {
    code: "MAINTENANCE",
    name: "Engineering & Maintenance",
    description: "Room maintenance tickets, out-of-order repairs, and facilities",
    defaultRole: "MAINTENANCE",
    primaryRoutes: ["/staff/rooms"],
  },
  MANAGEMENT: {
    code: "MANAGEMENT",
    name: "Operations Management",
    description: "Cross-department operational oversight, room inventory, and team metrics",
    defaultRole: "MANAGER",
    primaryRoutes: ["/staff/dashboard", "/staff/reservations", "/staff/rooms", "/staff/housekeeping", "/staff/orders"],
  },
  EXECUTIVE: {
    code: "EXECUTIVE",
    name: "Executive Management",
    description: "Full platform administration, system settings, RBAC, and analytics",
    defaultRole: "ADMIN",
    primaryRoutes: ["/admin"],
  },
};

// Aliases mapping between granular permissions and legacy codes
export const PERMISSION_ALIASES: Record<string, string[]> = {
  view_orders: ["view_orders", "kitchen:kds", "restaurant:orders"],
  create_order: ["create_order", "restaurant:orders"],
  update_order: ["update_order", "kitchen:kds", "restaurant:orders"],
  view_rooms: ["view_rooms", "rooms:read"],
  update_room_status: ["update_room_status", "rooms:write", "housekeeping:write"],
  view_housekeeping: ["view_housekeeping", "housekeeping:read"],
  manage_housekeeping: ["manage_housekeeping", "housekeeping:write"],
  view_reservations: ["view_reservations", "reservations:read"],
  create_reservation: ["create_reservation", "reservations:write"],
  update_reservation: ["update_reservation", "reservations:write"],
  view_menu: ["view_menu", "menu:read"],
  manage_menu: ["manage_menu", "menu:write"],
  view_inventory: ["view_inventory", "inventory:read"],
  manage_inventory: ["manage_inventory", "inventory:write"],
  view_conference: ["view_conference", "conference:manage"],
  manage_conference: ["manage_conference", "conference:manage"],
  view_catering: ["view_catering", "catering:manage"],
  manage_catering: ["manage_catering", "catering:manage"],
  view_events: ["view_events", "events:manage"],
  manage_events: ["manage_events", "events:manage"],
  view_maintenance: ["view_maintenance", "maintenance:manage"],
  manage_maintenance: ["manage_maintenance", "maintenance:manage"],
  view_reports: ["view_reports", "reports:view"],
  manage_staff: ["manage_staff", "staff:manage"],
  manage_roles: ["manage_roles", "roles:manage"],
  manage_settings: ["manage_settings", "settings:manage"],
  view_audit_logs: ["view_audit_logs", "audit:view"],
};

export const ROLE_DEFAULT_PERMISSIONS: Record<string, string[]> = {
  ADMIN: [
    "view_orders", "create_order", "update_order",
    "view_rooms", "update_room_status",
    "view_housekeeping", "manage_housekeeping",
    "view_reservations", "create_reservation", "update_reservation",
    "view_menu", "manage_menu",
    "view_inventory", "manage_inventory",
    "view_conference", "manage_conference",
    "view_catering", "manage_catering",
    "view_events", "manage_events",
    "view_maintenance", "manage_maintenance",
    "view_reports", "manage_staff", "manage_roles", "manage_settings", "view_audit_logs",
  ],
  MANAGER: [
    "view_orders", "update_order",
    "view_rooms", "update_room_status",
    "view_housekeeping", "manage_housekeeping",
    "view_reservations", "create_reservation", "update_reservation",
    "view_menu", "view_inventory",
    "view_conference", "manage_conference",
    "view_catering", "manage_catering",
    "view_events", "manage_events",
    "view_maintenance", "manage_maintenance",
    "view_reports", "view_audit_logs",
  ],
  CHEF: [
    "view_orders", "update_order", "view_menu", "manage_menu", "view_inventory",
  ],
  WAITER: [
    "view_orders", "create_order", "update_order", "view_menu",
  ],
  WAITRESS: [
    "view_orders", "create_order", "update_order", "view_menu",
  ],
  HOUSEKEEPING: [
    "view_housekeeping", "manage_housekeeping", "view_rooms", "update_room_status", "view_maintenance",
  ],
  RECEPTIONIST: [
    "view_reservations", "create_reservation", "update_reservation", "view_rooms", "update_room_status",
  ],
  EVENT_COORDINATOR: [
    "view_conference", "manage_conference", "view_events", "manage_events", "view_rooms",
  ],
  CATERING_STAFF: [
    "view_catering", "manage_catering", "view_menu",
  ],
  MAINTENANCE: [
    "view_rooms", "view_maintenance", "manage_maintenance",
  ],
};

export const ROUTE_PERMISSION_MAP: {
  pattern: RegExp;
  requiredPermission: string;
  department: DepartmentCode;
  name: string;
}[] = [
  {
    pattern: /^\/staff\/housekeeping/,
    requiredPermission: "view_housekeeping",
    department: "HOUSEKEEPING",
    name: "Housekeeping Cleanliness Board",
  },
  {
    pattern: /^\/staff\/orders/,
    requiredPermission: "view_orders",
    department: "KITCHEN",
    name: "Kitchen Display System (KDS)",
  },
  {
    pattern: /^\/staff\/restaurant/,
    requiredPermission: "view_orders",
    department: "SERVICE",
    name: "Waitstaff Restaurant Floor",
  },
  {
    pattern: /^\/staff\/reservations/,
    requiredPermission: "view_reservations",
    department: "FRONT_OFFICE",
    name: "Front Desk Reservations & Arrivals",
  },
  {
    pattern: /^\/staff\/rooms/,
    requiredPermission: "view_rooms",
    department: "FRONT_OFFICE",
    name: "Room Inventory & Occupancy Status",
  },
  {
    pattern: /^\/staff\/conference/,
    requiredPermission: "view_conference",
    department: "CONFERENCES",
    name: "Conference & Meeting Halls",
  },
  {
    pattern: /^\/staff\/catering/,
    requiredPermission: "view_catering",
    department: "CATERING",
    name: "Outside Catering Banqueting",
  },
  {
    pattern: /^\/staff\/events/,
    requiredPermission: "view_events",
    department: "EVENTS",
    name: "Gardens & Event Lawns",
  },
  {
    pattern: /^\/admin/,
    requiredPermission: "manage_settings",
    department: "EXECUTIVE",
    name: "Executive Administration Desk",
  },
];

type UserLike = Partial<UserProfile> & Partial<StaffMember>;

/**
 * Checks if a user has a specific granular permission.
 */
export function hasPermission(user: UserLike | null | undefined, permission: string): boolean {
  if (!user) return false;

  // Executive Admin bypass
  if (user.role === "admin" || user.staffRole === "ADMIN" || (user as StaffMember).role === "ADMIN") {
    return true;
  }

  const normalizedRequested = permission.toLowerCase().trim();
  const validKeys = PERMISSION_ALIASES[normalizedRequested] || [normalizedRequested];

  // 1. Check direct user-level custom permissions array if present
  if (user.permissions && Array.isArray(user.permissions)) {
    for (const p of user.permissions) {
      const pNorm = p.toLowerCase().trim();
      if (validKeys.includes(pNorm)) return true;
    }
  }

  // 2. Check role-level default permissions
  const roleCode = (user.staffRole || (user as StaffMember).role || "").toUpperCase();
  const rolePermissions = ROLE_DEFAULT_PERMISSIONS[roleCode] || [];

  for (const rp of rolePermissions) {
    const rpNorm = rp.toLowerCase().trim();
    if (validKeys.includes(rpNorm)) return true;
  }

  return false;
}

/**
 * Checks if a user has access to a specific department.
 */
export function hasDepartmentAccess(
  user: UserLike | null | undefined,
  departmentCodeOrName: string
): boolean {
  if (!user) return false;

  // Executive admin has access to all departments
  if (user.role === "admin" || user.staffRole === "ADMIN" || (user as StaffMember).role === "ADMIN") {
    return true;
  }

  const target = departmentCodeOrName.toUpperCase().trim();

  // Helper matcher
  const matches = (deptStr?: string) => {
    if (!deptStr) return false;
    const upper = deptStr.toUpperCase();
    if (upper === target) return true;
    // Map common words
    if (target === "KITCHEN" && (upper.includes("KITCHEN") || upper.includes("CHEF"))) return true;
    if (target === "HOUSEKEEPING" && upper.includes("HOUSEKEEPING")) return true;
    if (target === "FRONT_OFFICE" && (upper.includes("FRONT") || upper.includes("RECEPTION"))) return true;
    if (target === "SERVICE" && (upper.includes("FOOD") || upper.includes("RESTAURANT") || upper.includes("BAR") || upper.includes("WAITER"))) return true;
    if (target === "CONFERENCES" && (upper.includes("CONFERENCE") || upper.includes("EVENT"))) return true;
    if (target === "CATERING" && upper.includes("CATERING")) return true;
    if (target === "EVENTS" && (upper.includes("EVENT") || upper.includes("GARDEN"))) return true;
    if (target === "MAINTENANCE" && (upper.includes("MAINTENANCE") || upper.includes("ENGINEERING"))) return true;
    if (target === "MANAGEMENT" && (upper.includes("MANAGEMENT") || upper.includes("OPERATIONS"))) return true;
    return false;
  };

  // Primary department
  if (matches(user.department)) return true;

  // Additional departments (multi-department staff)
  if (user.additionalDepartments && Array.isArray(user.additionalDepartments)) {
    if (user.additionalDepartments.some((d) => matches(d))) return true;
  }

  // Active workspace department override
  if (user.activeWorkspaceDepartment && matches(user.activeWorkspaceDepartment)) {
    return true;
  }

  return false;
}

/**
 * Evaluates whether a user can access a specific route.
 */
export function canAccessRoute(user: UserLike | null | undefined, pathname: string): {
  allowed: boolean;
  requiredPermission?: string;
  department?: DepartmentCode;
  routeName?: string;
  reason?: string;
} {
  if (!user) {
    return {
      allowed: false,
      reason: "Authentication required.",
    };
  }

  // Admin access to everything
  if (user.role === "admin" || user.staffRole === "ADMIN" || (user as StaffMember).role === "ADMIN") {
    return { allowed: true };
  }

  const matchingRule = ROUTE_PERMISSION_MAP.find((rule) => rule.pattern.test(pathname));

  if (!matchingRule) {
    // If not specifically restricted (e.g. /staff/profile or /staff/dashboard), allow staff
    return { allowed: true };
  }

  // Check permission
  const hasPerm = hasPermission(user, matchingRule.requiredPermission);
  if (!hasPerm) {
    return {
      allowed: false,
      requiredPermission: matchingRule.requiredPermission,
      department: matchingRule.department,
      routeName: matchingRule.name,
      reason: `You do not have the required permission (${matchingRule.requiredPermission}) to access ${matchingRule.name}.`,
    };
  }

  return { allowed: true, requiredPermission: matchingRule.requiredPermission, department: matchingRule.department };
}

/**
 * Server-side / API route authorization helper.
 * Extracts authenticated user identity from request headers and verifies permissions.
 */
export function authorizeApiRequest(
  request: Request,
  requiredPermission: string,
  allowedDepartments?: DepartmentCode[]
): {
  authorized: boolean;
  user?: UserProfile;
  error?: string;
  status: number;
} {
  const userId = request.headers.get("x-user-id");
  const userRole = request.headers.get("x-user-role");
  const staffRole = request.headers.get("x-user-staff-role");
  const department = request.headers.get("x-user-department");
  const rawPermissions = request.headers.get("x-user-permissions");
  const authHeader = request.headers.get("authorization");

  let user: UserProfile | null = null;

  if (userId) {
    let permissions: string[] = [];
    if (rawPermissions) {
      try {
        permissions = JSON.parse(rawPermissions);
      } catch {
        permissions = rawPermissions.split(",").map((p) => p.trim());
      }
    }

    user = {
      id: userId,
      name: request.headers.get("x-user-name") || "Staff Member",
      email: request.headers.get("x-user-email") || "staff@hotelkalya.com",
      role: (userRole as "guest" | "staff" | "admin") || "staff",
      staffRole: staffRole || (userRole === "admin" ? "ADMIN" : undefined),
      department: department || undefined,
      permissions,
      createdAt: new Date().toISOString(),
    };
  } else if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.replace("Bearer ", "").trim();
    try {
      // Decode simulated bearer token payload or JSON
      const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
      user = decoded;
    } catch {
      // Plain text demo token or ID fallback
      if (token === "admin" || token.includes("sarah")) {
        user = {
          id: "staff_sarah_01",
          name: "Sarah Rotich",
          email: "admin@hotelkalya.com",
          role: "admin",
          staffRole: "ADMIN",
          department: "Executive Management",
          createdAt: new Date().toISOString(),
        };
      } else if (token === "chef" || token.includes("patrick")) {
        user = {
          id: "staff_patrick_01",
          name: "Chef Patrick Mwangi",
          email: "kitchen@hotelkalya.com",
          role: "staff",
          staffRole: "CHEF",
          department: "Kitchen Operations",
          createdAt: new Date().toISOString(),
        };
      } else if (token === "housekeeping" || token.includes("limo")) {
        user = {
          id: "staff_limo_01",
          name: "Denis Limo",
          email: "housekeeping@hotelkalya.com",
          role: "staff",
          staffRole: "HOUSEKEEPING",
          department: "Housekeeping",
          createdAt: new Date().toISOString(),
        };
      }
    }
  }

  if (!user) {
    return {
      authorized: false,
      error: "Unauthorized: Missing authentication headers. Please log in.",
      status: 401,
    };
  }

  // Admin always authorized
  if (user.role === "admin" || user.staffRole === "ADMIN") {
    return { authorized: true, user, status: 200 };
  }

  // Check required permission
  if (!hasPermission(user, requiredPermission)) {
    return {
      authorized: false,
      user,
      error: `Forbidden: Department access restricted. Your role (${user.staffRole || user.department}) does not have permission '${requiredPermission}'.`,
      status: 403,
    };
  }

  // Check department if specified
  if (allowedDepartments && allowedDepartments.length > 0) {
    const hasDept = allowedDepartments.some((d) => hasDepartmentAccess(user, d));
    if (!hasDept) {
      return {
        authorized: false,
        user,
        error: `Forbidden: This resource is restricted to [${allowedDepartments.join(", ")}].`,
        status: 403,
      };
    }
  }

  return { authorized: true, user, status: 200 };
}

/**
 * Kitchen Data Privacy Filter:
 * Strips customer personal phone number and billing breakdown so kitchen personnel
 * only see operational food preparation details (table/room, items, prep notes, allergies).
 */
export function sanitizeOrderForKitchen(order: any): any {
  if (!order) return order;
  return {
    id: order.id,
    orderType: order.orderType,
    roomOrTableNumber: order.roomOrTableNumber,
    items: order.items,
    specialNotes: order.specialNotes,
    status: order.status,
    createdAt: order.createdAt,
    // Sensitive personal information scrubbed:
    customerName: order.customerName ? order.customerName.split(" ")[0] + " (Guest)" : "Guest",
    customerPhone: "REDACTED",
    subtotal: undefined,
    serviceFee: undefined,
    total: undefined,
  };
}
