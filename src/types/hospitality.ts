// =============================================================================
// Hotel Kalya — Production Hospitality Data Model & Types
// Covers Rooms, Double-Booking, Dual-Status, Staff RBAC, Housekeeping, and Contacts
// =============================================================================

export type RoomReservationStatus =
  | "AVAILABLE"
  | "RESERVED"
  | "OCCUPIED"
  | "CHECKED-IN"
  | "CHECKED-OUT"
  | "BLOCKED"
  | "MAINTENANCE"
  | "OUT_OF_ORDER";

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
  discountPrice?: number;
  size?: string;
  bedType?: string;
  featured?: boolean;
  featuredImage?: string;
  publishStatus?: "published" | "draft" | "archived";
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
  totalPrice?: number; // alias
  amountPaid?: number; // amount paid upfront via M-Pesa or deposit
  balanceDue?: number; // remaining balance payable at check-in
  paymentPercentage?: number; // e.g. 100, 50, 25
  serviceName?: string;
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
  | "MAINTENANCE"
  | string;

export type PermissionKey =
  | "reservations:read"
  | "reservations:write"
  | "rooms:read"
  | "rooms:write"
  | "housekeeping:read"
  | "housekeeping:write"
  | "restaurant:orders"
  | "kitchen:kds"
  | "conference:manage"
  | "catering:manage"
  | "events:manage"
  | "reports:view"
  | "staff:manage"
  | "roles:manage"
  | "settings:manage"
  | "audit:view"
  | "menu:manage"
  | "inquiries:manage"
  | "reviews:manage"
  | "offers:manage"
  | "gallery:manage"
  | "announcements:manage"
  | "airbnb:manage"
  | "documents:manage";

export interface RoleDefinition {
  id: string;
  roleCode: string; // e.g. "RECEPTIONIST", "HOUSEKEEPING"
  title: string; // e.g. "Front Desk Receptionist"
  department: string;
  description: string;
  permissions: PermissionKey[];
  isSystemRole?: boolean;
  isSystem?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  additionalDepartments?: string[];
  role: StaffRole;
  permissions?: string[];
  whatsapp: string;
  status: "ACTIVE" | "ON_LEAVE" | "INACTIVE";
  shift?: "Morning (6AM - 2PM)" | "Evening (2PM - 10PM)" | "Night (10PM - 6AM)";
  assignedRooms?: string[];
  assignedTables?: string[];
  assignedLocation?: string;
  profilePhoto?: string;
  lastLogin?: string;
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
  department?: string;
  action: string;
  target: string;
  details: string;
  status?: "SUCCESS" | "DENIED" | "FAILURE";
  ip?: string;
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

// =============================================================================
// CMS & Dynamic Content Entities
// =============================================================================

export type PublishStatus = "published" | "draft" | "archived";

export interface MenuCategoryEntity {
  id: string;
  slug: string;
  label: string;
  name?: string;
  description: string;
  order: number;
  isActive: boolean;
}

export interface MenuItemEntity {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  categoryLabel?: string;
  image?: string;
  imageUrl?: string;
  images?: string[];
  ingredients?: string[];
  allergens?: string[];
  portionSize?: string;
  dietary?: string[];
  prepTime?: string;
  preparationTimeMinutes?: number;
  available?: boolean;
  isAvailable?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  featured?: boolean;
  isFeatured?: boolean;
  isSpicy?: boolean;
  publishStatus: PublishStatus;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GardenExperience {
  id: string;
  name: string;
  slug: string;
  description: string;
  capacity: { minGuests: number; maxGuests: number };
  pricing: { perDay: number; halfDay?: number; photographySession?: number };
  images: string[];
  featuredImage: string;
  facilities: string[];
  eventSuitability: string[];
  features: string[];
  openingHours: string;
  bookingRequirements: string;
  location: string;
  publishStatus: PublishStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConferenceHall {
  id: string;
  name: string;
  slug: string;
  description: string;
  capacity: { minGuests: number; maxGuests: number };
  dimensions?: string;
  pricing: { fullDay: number; halfDay: number; hourly?: number; perDelegatePackage?: number };
  images: string[];
  featuredImage: string;
  equipment: string[];
  seatingConfigurations?: Array<{
    layout: "Theatre" | "Classroom" | "U-Shape" | "Boardroom" | "Banquet" | "Cabaret";
    capacity: number;
    image?: string;
  }>;
  seatingLayouts?: Array<{
    layoutName: string;
    maxCapacity: number;
    image?: string;
  }>;
  cateringAvailable?: boolean;
  parkingAvailable?: boolean;
  publishStatus: PublishStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventSpace {
  id: string;
  name: string;
  slug: string;
  description: string;
  capacity: { minGuests: number; maxGuests: number };
  pricing: { basePrice?: number; baseHire?: number; perGuest?: number; perGuestPackage?: number };
  images: string[];
  featuredImage: string;
  amenities: string[];
  eventTypes?: string[];
  suitableEventTypes?: string[];
  cateringOptions: string[];
  decorationOptions: string[];
  bookingStatus?: string;
  publishStatus: PublishStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CateringPackage {
  id: string;
  title?: string;
  name?: string;
  slug: string;
  description: string;
  pricePerPerson: number;
  minGuests: number;
  maxGuests?: number;
  includedServices: string[];
  menuSelections: string[];
  equipment?: string[];
  equipmentProvided?: string[];
  staffServices?: string[];
  staffProvided?: string[];
  deliveryTerms: string;
  eventTypes?: string[];
  images: string[];
  featuredImage: string;
  publishStatus: PublishStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface AirbnbApartment {
  id: string;
  name: string;
  slug: string;
  propertyType: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  capacity: number | { maxGuests: number; minGuests?: number };
  pricePerNight: number;
  pricing?: { perNight?: number; perMonth?: number };
  amenities: string[];
  houseRules: string[];
  checkInTime: string;
  checkOutTime: string;
  images: string[];
  featuredImage: string;
  location: string;
  bookingStatus?: "AVAILABLE" | "RESERVED" | "OCCUPIED" | "MAINTENANCE";
  publishStatus: PublishStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface HospitalityOffer {
  id: string;
  title: string;
  slug?: string;
  subtitle?: string;
  description?: string;
  category: "accommodation" | "dining" | "conference" | "wedding" | "weekend" | string;
  originalPrice?: number;
  offerPrice: number;
  discountPercentage?: number;
  discountBadge?: string;
  validUntil: string;
  inclusions: string[];
  image?: string;
  featuredImage?: string;
  images?: string[];
  publishStatus: PublishStatus;
  featured?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  url?: string;
  thumbnailUrl?: string;
  altText: string;
  caption?: string;
  featured?: boolean;
  isFeatured?: boolean;
  publishStatus: PublishStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  bannerType: "info" | "promo" | "urgent" | "event" | "warning";
  linkUrl?: string;
  linkText?: string;
  ctaText?: string;
  ctaLink?: string;
  targetAudience?: string;
  publishStatus?: PublishStatus;
  isActive: boolean;
  active?: boolean;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerReview {
  id: string;
  authorName: string;
  authorLocation?: string;
  rating: number; // 1-5
  date?: string;
  category?: string;
  comment: string;
  source: "Google Reviews" | "TripAdvisor" | "Direct Guest Feedback" | "Google" | "Verified Guest" | string;
  isApproved: boolean;
  isFeatured: boolean;
  serviceType?: string;
  stayDate?: string;
  publishStatus?: PublishStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface HotelSettings {
  name: string;
  tagline: string;
  officialWhatsApp: string;
  primaryPhone: string;
  secondaryPhone: string;
  phone?: string;
  phoneClean?: string;
  email: string;
  address: string;
  coordinates: { lat: number; lng: number };
  latitude?: number;
  longitude?: number;
  googleMapsEmbedUrl: string;
  googleMapsDirectionsUrl: string;
  checkInTime: string;
  checkOutTime: string;
  receptionHours: string;
  restaurantHours: string;
  operatingHours?: { reception: string; restaurant: string };
  wifiNetwork: string;
  updatedAt?: string;
}



