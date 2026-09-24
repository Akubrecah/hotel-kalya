// =============================================================================
// Hotel Kalya — Production Hospitality Data Model & Types
// Covers Rooms, Double-Booking, Dual-Status, Staff RBAC, Housekeeping, and Contacts
// =============================================================================

export type RoomReservationStatus =
  | "AVAILABLE"
  | "RESERVED"
  | "CHECKED-IN"
  | "CHECKED-OUT"
  | "BLOCKED"
  | "MAINTENANCE";

export type HousekeepingStatus =
  | "CLEAN"
  | "DIRTY"
  | "CLEANING"
  | "INSPECTED"
  | "READY"
  | "OUT_OF_ORDER";

export type ReservationLifecycleStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED"
  | "NO_SHOW"
  | "COMPLETED";

export interface RoomCapacity {
  adults: number;
  children: number;
  maxGuests: number;
}

export interface SeasonalPricing {
  name: string;
  price: number;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

export interface Room {
  id: string; // e.g. "room-101"
  roomNumber: string; // e.g. "101"
  name: string; // e.g. "Deluxe Executive Suite 101"
  type: string; // e.g. "Executive Suite"
  typeSlug: string; // e.g. "deluxe-exec"
  floor: string; // e.g. "1st Floor - Hill View Wing"
  description: string;
  images: string[];
  capacity: RoomCapacity;
  bedConfiguration: string;
  amenities: string[];
  basePrice: number; // in KES per night
  seasonalPricing?: SeasonalPricing[];
  reservationStatus: RoomReservationStatus;
  housekeepingStatus: HousekeepingStatus;
  isActive: boolean;
  outOfOrderReason?: string;
  maintenanceNotes?: string;
}

export interface Booking {
  id: string; // e.g. "RES-2026-000142"
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  roomId: string;
  roomNumber: string;
  roomType: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  nights: number;
  adults: number;
  children: number;
  totalAmount: number; // in KES
  paymentStatus: "Paid" | "Deposit" | "Pay on Arrival";
  paymentMethod?: string;
  mpesaReceiptNumber?: string;
  status: ReservationLifecycleStatus;
  specialRequests?: string;
  guestNotes?: string;
  checkedInAt?: string;
  checkedOutAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type StaffRole =
  | "ADMIN"
  | "MANAGER"
  | "RECEPTIONIST"
  | "HOUSEKEEPING"
  | "WAITRESS"
  | "WAITER"
  | "CHEF"
  | "RESTAURANT_MANAGER"
  | "EVENT_COORDINATOR"
  | "CATERING_STAFF"
  | "ACCOUNTANT"
  | "MAINTENANCE";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: StaffRole;
  whatsapp: string;
  status: "ACTIVE" | "ON_LEAVE" | "INACTIVE";
  shift?: "Morning (6AM - 2PM)" | "Evening (2PM - 10PM)" | "Night (10PM - 6AM)";
  assignedRooms?: string[];
  assignedTables?: string[];
  joinedDate: string;
}

export interface ServiceContact {
  id: string;
  serviceKey: "accommodation" | "restaurant" | "conference" | "catering" | "garden" | "general";
  serviceTitle: string;
  department: string;
  responsibleStaff: string;
  roleTitle: string;
  whatsappNumber: string; // e.g. "254719766649"
  email: string;
  phone: string;
  availabilityHours: string;
  quickGreeting: string;
}

export interface HousekeepingTask {
  id: string;
  roomId: string;
  roomNumber: string;
  previousStatus: HousekeepingStatus;
  newStatus: HousekeepingStatus;
  staffName: string;
  timestamp: string;
  notes?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
}

export interface OperationalAnalytics {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  dirtyRooms: number;
  cleaningRooms: number;
  outOfOrderRooms: number;
  occupancyRatePercentage: number;
  todayArrivals: number;
  todayDepartures: number;
  activeReservationsCount: number;
  totalMonthlyRevenue: number;
  averageDailyRate: number;
  pendingKitchenOrders: number;
}

export interface ConferenceBooking {
  id: string;
  clientName: string;
  organization: string;
  phone: string;
  email: string;
  hallName: string;
  startDate: string;
  endDate: string;
  delegates: number;
  seatingLayout: "Boardroom" | "U-Shape" | "Classroom" | "Theatre" | "Banquet";
  cateringPackage: string;
  avEquipment: string[];
  totalAmount: number;
  status: "INQUIRY" | "QUOTED" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  createdAt: string;
}

export interface CateringBooking {
  id: string;
  clientName: string;
  phone: string;
  email: string;
  eventType: string;
  location: string;
  eventDate: string;
  guestCount: number;
  menuPackage: string;
  staffAssigned: string[];
  totalAmount: number;
  status: "INQUIRY" | "QUOTED" | "CONFIRMED" | "PREPARING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  createdAt: string;
}

export interface EventBooking {
  id: string;
  clientName: string;
  eventType: string;
  venueArea: string; // e.g., "Grand Lawns & Terrace", "Upper Gazebo", "Hillside Garden"
  phone: string;
  email: string;
  eventDate: string;
  timeSlot: string; // e.g., "Full Day (8AM - 6PM)", "Evening Reception (4PM - 10PM)"
  guestCount: number;
  setupRequirements: string;
  responsibleStaff: string;
  totalAmount: number;
  status: "INQUIRY" | "QUOTED" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  createdAt: string;
}

