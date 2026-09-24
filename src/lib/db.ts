import fs from "fs/promises";
import path from "path";
import {
  Room,
  Booking,
  StaffMember,
  ServiceContact,
  HousekeepingTask,
  AuditLog,
  OperationalAnalytics,
  ConferenceBooking,
  CateringBooking,
  EventBooking,
  HousekeepingStatus,
  ReservationLifecycleStatus,
  RoleDefinition,
} from "@/types/hospitality";
import { DEFAULT_SERVICE_CONTACTS } from "./whatsapp";
import { IMAGES } from "./constants";

const DATA_DIR = path.resolve(process.cwd(), ".data");

// Helper to ensure .data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Already exists
  }
}

// Atomic file write using temporary swap file with random worker entropy
async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  await ensureDataDir();
  const targetPath = path.join(DATA_DIR, filename);
  const tempPath = path.join(
    DATA_DIR,
    `${filename}.tmp.${Date.now()}.${Math.random().toString(36).substring(2, 9)}`
  );
  try {
    await fs.writeFile(tempPath, JSON.stringify(data, null, 2), "utf-8");
    await fs.rename(tempPath, targetPath);
  } catch {
    try {
      await fs.writeFile(targetPath, JSON.stringify(data, null, 2), "utf-8");
      await fs.unlink(tempPath).catch(() => {});
    } catch {
      // ignore
    }
  }
}

// Safe file read with default fallback
async function readJsonFile<T>(filename: string, fallback: T): Promise<T> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    writeJsonFile(filename, fallback).catch(() => {});
    return fallback;
  }
}

// =============================================================================
// SEED DATA GENERATORS
// =============================================================================

function generateSeedRooms(): Room[] {
  const rooms: Room[] = [];

  // 1. Standard Executive Rooms (Room 101 - 110)
  for (let i = 1; i <= 10; i++) {
    const num = (100 + i).toString();
    const isMaint = i === 9; // Room 109 under scheduled plumbing maintenance
    const isDirty = i === 3 || i === 7;
    const isOccupied = i === 1 || i === 4;

    rooms.push({
      id: `room-${num}`,
      roomNumber: num,
      name: `Standard Executive Room ${num}`,
      type: "Standard Executive Room",
      typeSlug: "standard-comfort",
      floor: "Ground Floor - East Wing",
      description: "Quiet, peaceful room with garden views, queen-size bed, work desk, high-speed Wi-Fi, and sparkling en-suite shower.",
      images: [IMAGES.standardRoom, IMAGES.deluxeSuite, IMAGES.heroExterior],
      capacity: { adults: 2, children: 1, maxGuests: 2 },
      bedConfiguration: "1 Queen Bed",
      amenities: ["Free Wi-Fi", "Hot Shower", "Satellite TV", "Daily Housekeeping", "Balcony Access", "Work Desk"],
      basePrice: 5000,
      publishStatus: "published",
      reservationStatus: isMaint ? "MAINTENANCE" : isOccupied ? "CHECKED-IN" : "AVAILABLE",
      housekeepingStatus: isMaint ? "OUT_OF_ORDER" : isDirty ? "DIRTY" : "READY",
      isActive: true,
      outOfOrderReason: isMaint ? "Bathroom fixture upgrades" : undefined,
    });
  }

  // 2. Deluxe Executive Suites (Room 201 - 215)
  for (let i = 1; i <= 15; i++) {
    const num = (200 + i).toString();
    const isOccupied = i === 2 || i === 4 || i === 8;
    const isCleaning = i === 5;
    const isReserved = i === 6 || i === 11;

    rooms.push({
      id: `room-${num}`,
      roomNumber: num,
      name: `Deluxe Executive Suite ${num}`,
      type: "Deluxe Executive Suite",
      typeSlug: "deluxe-exec",
      floor: "1st & 2nd Floor - Hill View Wing",
      description: "Spacious master suite featuring panoramic hillside views of Kapenguria, king bed, lounge seating, smart TV, and complimentary breakfast.",
      images: [IMAGES.deluxeSuite, IMAGES.executiveRoom, IMAGES.buildingFacade],
      capacity: { adults: 2, children: 2, maxGuests: 3 },
      bedConfiguration: "1 King Bed",
      amenities: ["Free High-speed Wi-Fi", "Smart Flat TV", "Complimentary Breakfast", "Working Desk", "Room Service", "Mini Fridge", "Coffee Station"],
      basePrice: 8500,
      publishStatus: "published",
      reservationStatus: isOccupied ? "CHECKED-IN" : isReserved ? "RESERVED" : "AVAILABLE",
      housekeepingStatus: isCleaning ? "CLEANING" : isOccupied ? "READY" : "READY",
      isActive: true,
    });
  }

  // 3. Kalya Luxury Cottages (Cottage 1 - 8)
  for (let i = 1; i <= 8; i++) {
    const num = `Cottage ${i}`;
    const id = `cottage-${i}`;
    const isOccupied = i === 3;

    rooms.push({
      id,
      roomNumber: num,
      name: `Kalya Luxury Cottage ${i}`,
      type: "Kalya Luxury Cottage",
      typeSlug: "kalya-cottage",
      floor: "Garden Wing - Private Compound",
      description: "Standalone luxury cottage surrounded by lush manicured lawns, offering maximum privacy, outdoor veranda, and family-sized comfort.",
      images: [IMAGES.heroExterior, IMAGES.deluxeSuite, IMAGES.gardenLandscape],
      capacity: { adults: 4, children: 2, maxGuests: 5 },
      bedConfiguration: "1 King Bed + 1 Queen Bed",
      amenities: ["Private Veranda", "Free High-speed Wi-Fi", "Smart TV", "Complimentary Breakfast", "24/7 Security", "Direct Garden Access"],
      basePrice: 12500,
      publishStatus: "published",
      reservationStatus: isOccupied ? "CHECKED-IN" : "AVAILABLE",
      housekeepingStatus: "READY",
      isActive: true,
    });
  }

  // 4. AirBnB Serviced Stays (Apartment 1 - 8)
  for (let i = 1; i <= 8; i++) {
    const num = `AirBnB ${i}`;
    const id = `airbnb-${i}`;
    const isReserved = i === 1 || i === 4;

    rooms.push({
      id,
      roomNumber: num,
      name: `Kalya Serviced Apartment ${i}`,
      type: "AirBnB Serviced Stay",
      typeSlug: "kalya-airbnb",
      floor: "North Wing - Serviced Annex",
      description: "Self-contained serviced apartment complete with kitchenette, private living room, dining nook, and access to all hotel amenities.",
      images: [IMAGES.airbnbStay, IMAGES.standardRoom, IMAGES.gardenTerrace],
      capacity: { adults: 3, children: 1, maxGuests: 4 },
      bedConfiguration: "2 Double Beds",
      amenities: ["Equipped Kitchenette", "Lounge & Dining", "Dedicated Parking", "Garden Access", "24/7 Security", "Weekly Housekeeping"],
      basePrice: 9000,
      publishStatus: "published",
      reservationStatus: isReserved ? "RESERVED" : "AVAILABLE",
      housekeepingStatus: "READY",
      isActive: true,
    });
  }

  return rooms;
}

function generateSeedBookings(): Booking[] {
  return [
    {
      id: "RES-2026-000142",
      guestName: "James Chemosit",
      guestPhone: "+254 712 345678",
      guestEmail: "guest@hotelkalya.com",
      roomId: "room-204",
      roomNumber: "204",
      roomType: "Deluxe Executive Suite",
      checkInDate: "2026-09-28",
      checkOutDate: "2026-10-01",
      nights: 3,
      adults: 2,
      children: 0,
      totalAmount: 25500,
      paymentStatus: "Paid",
      paymentMethod: "M-Pesa STK Push",
      mpesaReceiptNumber: "SJB991204X",
      status: "CONFIRMED",
      specialRequests: "Quiet floor facing Kapenguria hills, late check-in at 7:00 PM.",
      createdAt: "2026-09-20T14:32:00Z",
      updatedAt: "2026-09-20T14:35:00Z",
    },
    {
      id: "RES-2026-000143",
      guestName: "David Kiprop",
      guestPhone: "+254 733 456123",
      guestEmail: "dkiprop@gmail.com",
      roomId: "cottage-3",
      roomNumber: "Cottage 3",
      roomType: "Kalya Luxury Cottage",
      checkInDate: "2026-09-23",
      checkOutDate: "2026-09-26",
      nights: 3,
      adults: 2,
      children: 1,
      totalAmount: 37500,
      paymentStatus: "Paid",
      paymentMethod: "Credit Card (Front Desk)",
      status: "CHECKED_IN",
      checkedInAt: "2026-09-23T14:20:00Z",
      specialRequests: "Baby cot requested, extra towels.",
      createdAt: "2026-09-21T11:00:00Z",
      updatedAt: "2026-09-23T14:20:00Z",
    },
    {
      id: "RES-2026-000144",
      guestName: "Mercy Wambui",
      guestPhone: "+254 701 987654",
      guestEmail: "mwambui@corp.ke",
      roomId: "room-104",
      roomNumber: "104",
      roomType: "Standard Executive Room",
      checkInDate: "2026-09-24",
      checkOutDate: "2026-09-27",
      nights: 3,
      adults: 1,
      children: 0,
      totalAmount: 15000,
      paymentStatus: "Pay on Arrival",
      status: "CHECKED_IN",
      checkedInAt: "2026-09-24T15:00:00Z",
      specialRequests: "Early breakfast packed at 6:30 AM for field visit.",
      createdAt: "2026-09-22T16:45:00Z",
      updatedAt: "2026-09-24T15:00:00Z",
    },
    {
      id: "RES-2026-000145",
      guestName: "Prof. Kenneth Chesire",
      guestPhone: "+254 722 998877",
      guestEmail: "kchesire@moi.ac.ke",
      roomId: "room-202",
      roomNumber: "202",
      roomType: "Deluxe Executive Suite",
      checkInDate: "2026-09-24",
      checkOutDate: "2026-09-28",
      nights: 4,
      adults: 2,
      children: 0,
      totalAmount: 34000,
      paymentStatus: "Paid",
      paymentMethod: "M-Pesa STK Push",
      mpesaReceiptNumber: "SKL488192M",
      status: "CHECKED_IN",
      checkedInAt: "2026-09-24T12:45:00Z",
      specialRequests: "Working desk lamp, daily national newspapers.",
      createdAt: "2026-09-19T08:30:00Z",
      updatedAt: "2026-09-24T12:45:00Z",
    },
    {
      id: "RES-2026-000146",
      guestName: "Sharon Jepchumba",
      guestPhone: "+254 714 990011",
      guestEmail: "sharon.j@safari-rift.co.ke",
      roomId: "room-206",
      roomNumber: "206",
      roomType: "Deluxe Executive Suite",
      checkInDate: "2026-10-02",
      checkOutDate: "2026-10-06",
      nights: 4,
      adults: 2,
      children: 0,
      totalAmount: 34000,
      paymentStatus: "Deposit",
      paymentMethod: "M-Pesa STK Push",
      status: "CONFIRMED",
      specialRequests: "Airport transport coordination from Kitale airstrip.",
      createdAt: "2026-09-23T15:45:00Z",
      updatedAt: "2026-09-23T15:45:00Z",
    },
  ];
}

function generateSeedStaff(): StaffMember[] {
  return [
    {
      id: "stf-01",
      name: "Sarah Rotich",
      email: "admin@hotelkalya.com",
      phone: "+254 719 766649",
      department: "Front Office",
      role: "MANAGER",
      whatsapp: "254719766649",
      status: "ACTIVE",
      shift: "Morning (6AM - 2PM)",
      joinedDate: "2024-03-15",
    },
    {
      id: "stf-02",
      name: "Dennis Kiplagat",
      email: "dennis.reception@hotelkalya.com",
      phone: "+254 721 334455",
      department: "Front Office",
      role: "RECEPTIONIST",
      whatsapp: "254719766649",
      status: "ACTIVE",
      shift: "Morning (6AM - 2PM)",
      joinedDate: "2025-01-10",
    },
    {
      id: "stf-03",
      name: "Beatrice Chebet",
      email: "housekeeping@hotelkalya.com",
      phone: "+254 723 445566",
      department: "Housekeeping",
      role: "HOUSEKEEPING",
      whatsapp: "254719766649",
      status: "ACTIVE",
      shift: "Morning (6AM - 2PM)",
      assignedRooms: ["101", "102", "103", "104", "105", "201", "202", "203"],
      joinedDate: "2024-06-01",
    },
    {
      id: "stf-04",
      name: "Wilson Kibet",
      email: "chef@hotelkalya.com",
      phone: "+254 725 667788",
      department: "Kitchen & Dining",
      role: "CHEF",
      whatsapp: "254719766649",
      status: "ACTIVE",
      shift: "Morning (6AM - 2PM)",
      joinedDate: "2023-11-20",
    },
    {
      id: "stf-05",
      name: "Faith Jepchirchir",
      email: "restaurant@hotelkalya.com",
      phone: "+254 726 778899",
      department: "Restaurant & Bar",
      role: "WAITRESS",
      whatsapp: "254719766649",
      status: "ACTIVE",
      shift: "Evening (2PM - 10PM)",
      assignedTables: ["1", "2", "3", "4", "5", "Garden 1"],
      joinedDate: "2025-02-01",
    },
    {
      id: "stf-06",
      name: "Kevin Lokor",
      email: "conferences@hotelkalya.com",
      phone: "+254 727 889900",
      department: "Events & Conferences",
      role: "EVENT_COORDINATOR",
      whatsapp: "254719766649",
      status: "ACTIVE",
      joinedDate: "2024-08-15",
    },
    {
      id: "stf-07",
      name: "Grace Chepkorir",
      email: "catering@hotelkalya.com",
      phone: "+254 728 990011",
      department: "Outside Catering",
      role: "CATERING_STAFF",
      whatsapp: "254719766649",
      status: "ACTIVE",
      joinedDate: "2024-09-01",
    },
  ];
}

function generateSeedConferences(): ConferenceBooking[] {
  return [
    {
      id: "CONF-2026-001",
      clientName: "County Department of Agriculture",
      organization: "West Pokot County Government",
      phone: "+254 720 123456",
      email: "agriculture@westpokot.go.ke",
      hallName: "Mount Elgon Ballroom",
      startDate: "2026-09-26",
      endDate: "2026-09-28",
      delegates: 85,
      seatingLayout: "Classroom",
      cateringPackage: "Full Day Delegate Package (KES 2,800/pax)",
      avEquipment: ["HD Projector", "Wireless Lapel Mics", "PA System", "High-Speed Wi-Fi"],
      totalAmount: 238000,
      status: "CONFIRMED",
      createdAt: "2026-09-15T09:00:00Z",
    },
    {
      id: "CONF-2026-002",
      clientName: "Health Outreach Partners",
      organization: "USAID Regional Consortium",
      phone: "+254 733 987654",
      email: "programs@healthpartners.org",
      hallName: "Cherang'any Conference Suite",
      startDate: "2026-09-24",
      endDate: "2026-09-25",
      delegates: 40,
      seatingLayout: "U-Shape",
      cateringPackage: "Half Day Conference Package (KES 2,400/pax)",
      avEquipment: ["Dual Screens", "Conference Audio Hub", "Whiteboards"],
      totalAmount: 96000,
      status: "IN_PROGRESS",
      createdAt: "2026-09-18T14:30:00Z",
    },
    {
      id: "CONF-2026-003",
      clientName: "Kenya National Union of Teachers",
      organization: "KNUT West Pokot Branch",
      phone: "+254 711 554433",
      email: "knut.pokot@gmail.com",
      hallName: "Kapenguria Boardroom",
      startDate: "2026-10-02",
      endDate: "2026-10-02",
      delegates: 20,
      seatingLayout: "Boardroom",
      cateringPackage: "Executive Board Package (KES 2,750/pax)",
      avEquipment: ["Video Conference Bar", "Smart Interactive Board"],
      totalAmount: 55000,
      status: "QUOTED",
      createdAt: "2026-09-22T11:15:00Z",
    },
  ];
}

function generateSeedCatering(): CateringBooking[] {
  return [
    {
      id: "CAT-2026-001",
      clientName: "Chepareria Farmers Cooperative",
      phone: "+254 722 445566",
      email: "chepareriafarmers@gmail.com",
      eventType: "Annual General Meeting",
      location: "Chepareria Agricultural Showgrounds",
      eventDate: "2026-10-05",
      guestCount: 350,
      menuPackage: "Grand Buffet: Nyama Choma + Traditional Kienyeji + Fresh Fruit Platter",
      staffAssigned: ["Grace Chepkorir", "Denis Limo", "Sarah Kemboi"],
      totalAmount: 315000,
      status: "CONFIRMED",
      createdAt: "2026-09-12T16:00:00Z",
    },
    {
      id: "CAT-2026-002",
      clientName: "Kapenguria County Hospital Doctors Guild",
      phone: "+254 728 776655",
      email: "doctorsguild@krh.org",
      eventType: "Annual Dinner & Awards Night",
      location: "Makutano Medical Centre Gardens",
      eventDate: "2026-09-29",
      guestCount: 75,
      menuPackage: "Continental 3-Course Banquet + Beverage Service",
      staffAssigned: ["Grace Chepkorir"],
      totalAmount: 120000,
      status: "PREPARING",
      createdAt: "2026-09-20T10:00:00Z",
    },
  ];
}

function generateSeedEvents(): EventBooking[] {
  return [
    {
      id: "EVT-2026-001",
      clientName: "Brian & Sharon Wedding Reception",
      eventType: "Garden Wedding Reception",
      venueArea: "Grand Manicured Lawns & Main Gazebo",
      phone: "+254 724 332211",
      email: "brian.sharon@gmail.com",
      eventDate: "2026-10-17",
      timeSlot: "Full Day (8:00 AM - 6:00 PM)",
      guestCount: 450,
      setupRequirements: "White high-peak tents, floral arch, banquet tables, sound system generator backup",
      responsibleStaff: "Kevin Lokor",
      totalAmount: 185000,
      status: "CONFIRMED",
      createdAt: "2026-09-10T12:00:00Z",
    },
    {
      id: "EVT-2026-002",
      clientName: "North Rift Business Innovation Gala",
      eventType: "Corporate Sunset Sundowner",
      venueArea: "Hillside View Sunset Terrace",
      phone: "+254 719 887766",
      email: "events@northriftnetwork.co.ke",
      eventDate: "2026-09-28",
      timeSlot: "Evening (4:00 PM - 10:00 PM)",
      guestCount: 80,
      setupRequirements: "Cocktail high tables, ambient warm fairy lights, acoustic live band stage",
      responsibleStaff: "Kevin Lokor",
      totalAmount: 70000,
      status: "CONFIRMED",
      createdAt: "2026-09-21T15:20:00Z",
    },
  ];
}

// =============================================================================
// DATABASE OPERATIONS
// =============================================================================


// --- ROOMS ---

export async function getRooms(onlyPublished: boolean = false): Promise<Room[]> {
  const rooms = await readJsonFile<Room[]>("rooms.json", generateSeedRooms());
  if (onlyPublished) {
    return rooms.filter((r) => !r.publishStatus || r.publishStatus === "published");
  }
  return rooms;
}

export async function getRoomById(id: string): Promise<Room | null> {
  const rooms = await getRooms();
  return rooms.find((r) => r.id === id || r.roomNumber === id) || null;
}

export async function createRoom(data: Omit<Room, "id"> & { id?: string }): Promise<Room> {
  const rooms = await getRooms();
  const newRoom: Room = {
    ...data,
    id: data.id || `room-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    publishStatus: data.publishStatus || "published",
    reservationStatus: data.reservationStatus || "AVAILABLE",
    housekeepingStatus: data.housekeepingStatus || "READY",
    isActive: data.isActive !== undefined ? data.isActive : true,
  };
  rooms.push(newRoom);
  await writeJsonFile("rooms.json", rooms);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "CREATED_ROOM",
    target: newRoom.roomNumber,
    details: `Added new room ${newRoom.name} (${newRoom.roomNumber}) priced at KES ${newRoom.basePrice}`,
  });

  return newRoom;
}

export async function updateRoom(id: string, updates: Partial<Room>): Promise<Room | null> {
  const rooms = await getRooms();
  const index = rooms.findIndex((r) => r.id === id || r.roomNumber === id);
  if (index === -1) return null;

  const old = rooms[index];
  rooms[index] = { ...rooms[index], ...updates };
  await writeJsonFile("rooms.json", rooms);

  let details = `Updated room ${rooms[index].roomNumber}`;
  if (updates.basePrice && updates.basePrice !== old.basePrice) {
    details += ` - Price changed from KES ${old.basePrice} to KES ${updates.basePrice}`;
  }
  if (updates.publishStatus && updates.publishStatus !== old.publishStatus) {
    details += ` - Publish status changed to ${updates.publishStatus}`;
  }
  if (updates.reservationStatus && updates.reservationStatus !== old.reservationStatus) {
    details += ` - Reservation status changed to ${updates.reservationStatus}`;
  }
  if (updates.housekeepingStatus && updates.housekeepingStatus !== old.housekeepingStatus) {
    details += ` - Housekeeping status changed to ${updates.housekeepingStatus}`;
  }

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "UPDATED_ROOM",
    target: rooms[index].roomNumber,
    details,
  });

  return rooms[index];
}

export async function deleteRoom(id: string): Promise<{ success: boolean; error?: string }> {
  const rooms = await getRooms();
  const idx = rooms.findIndex((r) => r.id === id || r.roomNumber === id);
  if (idx === -1) {
    return { success: false, error: "Room not found" };
  }
  const removed = rooms[idx];
  rooms.splice(idx, 1);
  await writeJsonFile("rooms.json", rooms);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "DELETED_ROOM",
    target: removed.roomNumber,
    details: `Deleted room ${removed.name} (${removed.roomNumber})`,
  });

  return { success: true };
}

// --- DOUBLE-BOOKING PREVENTION & AVAILABILITY ENGINE ---

export interface AvailabilityCheckResult {
  available: boolean;
  conflict?: Booking;
  reason?: string;
}

/**
 * Checks whether a room is available for the given date span.
 * Strictly prevents overlapping confirmed/checked-in reservations.
 * Also checks if the room is OUT_OF_ORDER or under MAINTENANCE.
 */
export async function checkRoomAvailability(
  roomId: string,
  checkIn: string,
  checkOut: string,
  excludeReservationId?: string
): Promise<AvailabilityCheckResult> {
  const room = await getRoomById(roomId);
  if (!room) {
    return { available: false, reason: "Room does not exist." };
  }

  if (room.housekeepingStatus === "OUT_OF_ORDER") {
    return {
      available: false,
      reason: `Room ${room.roomNumber} is currently Out of Order (${room.outOfOrderReason || "Maintenance"}).`,
    };
  }

  if (room.reservationStatus === "MAINTENANCE" || room.reservationStatus === "BLOCKED") {
    return {
      available: false,
      reason: `Room ${room.roomNumber} is currently blocked for scheduled maintenance.`,
    };
  }

  const inDate = new Date(checkIn).getTime();
  const outDate = new Date(checkOut).getTime();

  if (isNaN(inDate) || isNaN(outDate) || outDate <= inDate) {
    return { available: false, reason: "Invalid check-in and check-out date range." };
  }

  const bookings = await getBookings();

  // Find any active reservation with overlapping dates
  const conflict = bookings.find((b) => {
    if (b.roomId !== room.id && b.roomNumber !== room.roomNumber) return false;
    if (excludeReservationId && b.id === excludeReservationId) return false;
    if (b.status === "CANCELLED" || b.status === "CHECKED_OUT") return false;

    const bIn = new Date(b.checkInDate).getTime();
    const bOut = new Date(b.checkOutDate).getTime();

    // Overlap condition: (inDate < bOut) && (outDate > bIn)
    return inDate < bOut && outDate > bIn;
  });

  if (conflict) {
    return {
      available: false,
      conflict,
      reason: `Room ${room.roomNumber} is already booked from ${conflict.checkInDate} to ${conflict.checkOutDate} (Booking ref: ${conflict.id}).`,
    };
  }

  return { available: true };
}

/**
 * Returns all rooms that are strictly available between checkIn and checkOut,
 * matching guest count and optional room type.
 */
export async function searchAvailableRooms(params: {
  checkIn: string;
  checkOut: string;
  guests?: number;
  typeSlug?: string;
}): Promise<{ availableRooms: Room[]; unavailableRooms: Room[] }> {
  const allRooms = await getRooms();
  const availableRooms: Room[] = [];
  const unavailableRooms: Room[] = [];

  for (const room of allRooms) {
    // Capacity filter
    if (params.guests && room.capacity.maxGuests < params.guests) {
      unavailableRooms.push(room);
      continue;
    }

    // Type filter
    if (params.typeSlug && params.typeSlug !== "all" && room.typeSlug !== params.typeSlug) {
      unavailableRooms.push(room);
      continue;
    }

    const check = await checkRoomAvailability(room.id, params.checkIn, params.checkOut);
    if (check.available) {
      availableRooms.push(room);
    } else {
      unavailableRooms.push(room);
    }
  }

  return { availableRooms, unavailableRooms };
}

/**
 * Generates day-by-day availability calendar for a room for a given month
 */
export async function getRoomMonthCalendar(
  roomId: string,
  year: number,
  month: number // 1-12
): Promise<Array<{ date: string; day: number; status: "AVAILABLE" | "RESERVED" | "PENDING" | "CHECKED_IN" | "MAINTENANCE" }>> {
  const room = await getRoomById(roomId);
  const bookings = await getBookings();
  const roomBookings = bookings.filter(
    (b) =>
      (b.roomId === roomId || b.roomNumber === room?.roomNumber) &&
      b.status !== "CANCELLED" &&
      b.status !== "CHECKED_OUT"
  );

  const daysInMonth = new Date(year, month, 0).getDate();
  const result: Array<{ date: string; day: number; status: "AVAILABLE" | "RESERVED" | "PENDING" | "CHECKED_IN" | "MAINTENANCE" }> = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dateTime = new Date(dateStr).getTime();

    // Check if room itself is in maintenance
    if (room?.housekeepingStatus === "OUT_OF_ORDER" || room?.reservationStatus === "MAINTENANCE") {
      result.push({ date: dateStr, day, status: "MAINTENANCE" });
      continue;
    }

    // Check bookings
    let dayStatus: "AVAILABLE" | "RESERVED" | "PENDING" | "CHECKED_IN" = "AVAILABLE";
    for (const b of roomBookings) {
      const bIn = new Date(b.checkInDate).getTime();
      const bOut = new Date(b.checkOutDate).getTime();

      if (dateTime >= bIn && dateTime < bOut) {
        if (b.status === "CHECKED_IN") {
          dayStatus = "CHECKED_IN";
        } else if (b.status === "CONFIRMED") {
          dayStatus = "RESERVED";
        } else if (b.status === "PENDING") {
          dayStatus = "PENDING";
        }
        break;
      }
    }

    result.push({ date: dateStr, day, status: dayStatus });
  }

  return result;
}

// --- BOOKINGS / RESERVATIONS ---

export async function getBookings(): Promise<Booking[]> {
  return readJsonFile<Booking[]>("reservations.json", generateSeedBookings());
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const bookings = await getBookings();
  return bookings.find((b) => b.id.toUpperCase() === id.toUpperCase()) || null;
}

export async function createBooking(data: {
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  adults?: number;
  children?: number;
  paymentStatus?: "Paid" | "Deposit" | "Pay on Arrival";
  paymentMethod?: string;
  specialRequests?: string;
}): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  const room = await getRoomById(data.roomId);
  if (!room) {
    return { success: false, error: "Selected room does not exist." };
  }

  // Double booking check
  const avail = await checkRoomAvailability(data.roomId, data.checkInDate, data.checkOutDate);
  if (!avail.available) {
    return { success: false, error: avail.reason || "Double booking prevented: Room is occupied." };
  }

  const inDate = new Date(data.checkInDate);
  const outDate = new Date(data.checkOutDate);
  const nights = Math.max(1, Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24)));
  const totalAmount = nights * room.basePrice;

  const bookings = await getBookings();
  const nextSeq = bookings.length + 147;
  const newBookingId = `RES-${inDate.getFullYear()}-${String(nextSeq).padStart(6, "0")}`;

  const newBooking: Booking = {
    id: newBookingId,
    guestName: data.guestName.trim(),
    guestPhone: data.guestPhone.trim(),
    guestEmail: data.guestEmail.trim(),
    roomId: room.id,
    roomNumber: room.roomNumber,
    roomType: room.type,
    checkInDate: data.checkInDate,
    checkOutDate: data.checkOutDate,
    nights,
    adults: data.adults || 1,
    children: data.children || 0,
    totalAmount,
    paymentStatus: data.paymentStatus || "Pay on Arrival",
    paymentMethod: data.paymentMethod || "M-Pesa STK Push",
    status: "CONFIRMED",
    specialRequests: data.specialRequests,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  bookings.unshift(newBooking);
  await writeJsonFile("reservations.json", bookings);

  // Update room status
  await updateRoom(room.id, { reservationStatus: "RESERVED" });

  // Log audit event
  await logAuditEvent({
    userId: "system",
    userName: data.guestName,
    role: "GUEST",
    action: "CREATED_RESERVATION",
    target: newBookingId,
    details: `Created reservation for Room ${room.roomNumber} (${data.checkInDate} to ${data.checkOutDate}, KES ${totalAmount})`,
  });

  return { success: true, booking: newBooking };
}

export async function updateBookingStatus(
  id: string,
  newStatus: ReservationLifecycleStatus,
  operatorName = "Staff"
): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  const bookings = await getBookings();
  const index = bookings.findIndex((b) => b.id.toUpperCase() === id.toUpperCase());
  if (index === -1) return { success: false, error: "Booking not found." };

  const current = bookings[index];
  const oldStatus = current.status;
  current.status = newStatus;
  current.updatedAt = new Date().toISOString();

  if (newStatus === "CHECKED_IN") {
    current.checkedInAt = new Date().toISOString();
    await updateRoom(current.roomId, { reservationStatus: "CHECKED-IN" });
  } else if (newStatus === "CHECKED_OUT") {
    current.checkedOutAt = new Date().toISOString();
    // After check-out, room reservation is AVAILABLE, but housekeeping becomes DIRTY
    await updateRoom(current.roomId, {
      reservationStatus: "AVAILABLE",
      housekeepingStatus: "DIRTY",
    });
  } else if (newStatus === "CANCELLED") {
    // When cancelled, room is freed up immediately
    await updateRoom(current.roomId, { reservationStatus: "AVAILABLE" });
  }

  await writeJsonFile("reservations.json", bookings);

  await logAuditEvent({
    userId: "staff",
    userName: operatorName,
    role: "RECEPTION",
    action: `UPDATED_BOOKING_STATUS`,
    target: current.id,
    details: `Status changed from ${oldStatus} to ${newStatus}`,
  });

  return { success: true, booking: current };
}

// --- HOUSEKEEPING ---

export async function getHousekeepingLogs(): Promise<HousekeepingTask[]> {
  return readJsonFile<HousekeepingTask[]>("housekeeping.json", []);
}

export async function updateHousekeepingStatus(
  roomId: string,
  newStatus: HousekeepingStatus,
  staffName: string,
  notes?: string
): Promise<{ success: boolean; room?: Room; error?: string }> {
  const room = await getRoomById(roomId);
  if (!room) return { success: false, error: "Room not found." };

  const prevStatus = room.housekeepingStatus;
  room.housekeepingStatus = newStatus;

  // Derive reservation status if out of order
  if (newStatus === "OUT_OF_ORDER") {
    room.reservationStatus = "MAINTENANCE";
    room.outOfOrderReason = notes || "Scheduled Maintenance";
  } else if (room.reservationStatus === "MAINTENANCE") {
    room.reservationStatus = "AVAILABLE";
    room.outOfOrderReason = undefined;
  }

  await updateRoom(room.id, room);

  // Record housekeeping log
  const logs = await getHousekeepingLogs();
  const task: HousekeepingTask = {
    id: `HK-${Date.now()}`,
    roomId: room.id,
    roomNumber: room.roomNumber,
    previousStatus: prevStatus,
    newStatus,
    staffName,
    notes,
    timestamp: new Date().toISOString(),
  };
  logs.unshift(task);
  await writeJsonFile("housekeeping.json", logs);

  // Record audit log
  await logAuditEvent({
    userId: staffName,
    userName: staffName,
    role: "HOUSEKEEPING",
    action: "UPDATED_ROOM_STATUS",
    target: `Room ${room.roomNumber}`,
    details: `Housekeeping transition: ${prevStatus} -> ${newStatus}${notes ? ` (${notes})` : ""}`,
  });

  return { success: true, room };
}

// --- STAFF ROSTER ---

export async function getStaffMembers(): Promise<StaffMember[]> {
  return readJsonFile<StaffMember[]>("staff.json", generateSeedStaff());
}

export async function createStaffMember(data: Omit<StaffMember, "id" | "joinedDate">): Promise<StaffMember> {
  const staff = await getStaffMembers();
  const newStaff: StaffMember = {
    ...data,
    id: `stf-${String(staff.length + 1).padStart(2, "0")}`,
    joinedDate: new Date().toISOString().split("T")[0],
  };
  staff.push(newStaff);
  await writeJsonFile("staff.json", staff);
  return newStaff;
}

export async function updateStaffMember(id: string, updates: Partial<StaffMember>): Promise<StaffMember | null> {
  const staff = await getStaffMembers();
  const idx = staff.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  staff[idx] = { ...staff[idx], ...updates };
  await writeJsonFile("staff.json", staff);
  return staff[idx];
}

// --- SERVICE CONTACTS ---

export async function getServiceContacts(): Promise<ServiceContact[]> {
  return readJsonFile<ServiceContact[]>(
    "service_contacts.json",
    Object.values(DEFAULT_SERVICE_CONTACTS)
  );
}

export async function updateServiceContact(
  serviceKey: string,
  updates: Partial<ServiceContact>
): Promise<ServiceContact | null> {
  const contacts = await getServiceContacts();
  const idx = contacts.findIndex((c) => c.serviceKey === serviceKey);
  if (idx === -1) return null;
  contacts[idx] = { ...contacts[idx], ...updates };
  await writeJsonFile("service_contacts.json", contacts);
  return contacts[idx];
}

// --- AUDIT LOGS ---

export async function getAuditLogs(): Promise<AuditLog[]> {
  return readJsonFile<AuditLog[]>("audit_logs.json", [
    {
      id: "aud-001",
      userId: "system",
      userName: "System Initialization",
      role: "ADMIN",
      action: "BOOTSTRAP_DATABASE",
      target: "Hotel Kalya Database Engine",
      details: "Database repository seeded with 41 rooms, active bookings, and staff roster.",
      timestamp: "2026-09-24T06:00:00Z",
    },
  ]);
}

export async function logAuditEvent(entry: Omit<AuditLog, "id" | "timestamp">): Promise<void> {
  const logs = await getAuditLogs();
  logs.unshift({
    ...entry,
    id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
  });
  // Keep latest 250 logs
  await writeJsonFile("audit_logs.json", logs.slice(0, 250));
}

// --- ANALYTICS ---

export async function getOperationalAnalytics(): Promise<OperationalAnalytics> {
  const rooms = await getRooms();
  const bookings = await getBookings();

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.reservationStatus === "CHECKED-IN").length;
  const dirtyRooms = rooms.filter((r) => r.housekeepingStatus === "DIRTY").length;
  const cleaningRooms = rooms.filter((r) => r.housekeepingStatus === "CLEANING").length;
  const outOfOrderRooms = rooms.filter((r) => r.housekeepingStatus === "OUT_OF_ORDER").length;
  const availableRooms = rooms.filter(
    (r) => r.reservationStatus === "AVAILABLE" && r.housekeepingStatus === "READY"
  ).length;

  const todayStr = "2026-09-24";
  const todayArrivals = bookings.filter((b) => b.checkInDate === todayStr && b.status !== "CANCELLED").length;
  const todayDepartures = bookings.filter((b) => b.checkOutDate === todayStr && b.status !== "CANCELLED").length;

  const activeReservations = bookings.filter((b) => b.status === "CONFIRMED" || b.status === "CHECKED_IN");
  const totalMonthlyRevenue = bookings
    .filter((b) => b.status !== "CANCELLED")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const averageDailyRate =
    bookings.length > 0
      ? Math.round(totalMonthlyRevenue / bookings.reduce((sum, b) => sum + Math.max(1, b.nights), 0))
      : 7500;

  const occupancyRatePercentage = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  return {
    totalRooms,
    availableRooms,
    occupiedRooms,
    dirtyRooms,
    cleaningRooms,
    outOfOrderRooms,
    occupancyRatePercentage,
    todayArrivals,
    todayDepartures,
    activeReservationsCount: activeReservations.length,
    totalMonthlyRevenue,
    averageDailyRate,
    pendingKitchenOrders: 3,
  };
}

// --- CONFERENCES ---

export async function getConferenceBookings(): Promise<ConferenceBooking[]> {
  return readJsonFile<ConferenceBooking[]>("conference_bookings.json", generateSeedConferences());
}

export async function createConferenceBooking(
  data: Omit<ConferenceBooking, "id" | "createdAt">
): Promise<ConferenceBooking> {
  const bookings = await getConferenceBookings();
  const newBooking: ConferenceBooking = {
    ...data,
    id: `CONF-${new Date().getFullYear()}-${String(bookings.length + 10).padStart(3, "0")}`,
    createdAt: new Date().toISOString(),
  };
  bookings.unshift(newBooking);
  await writeJsonFile("conference_bookings.json", bookings);

  await logAuditEvent({
    userId: "staff",
    userName: data.clientName,
    role: "EVENT_COORDINATOR",
    action: "CREATED_CONFERENCE_BOOKING",
    target: newBooking.id,
    details: `${data.hallName} booked for ${data.delegates} delegates (${data.startDate} to ${data.endDate})`,
  });

  return newBooking;
}

export async function updateConferenceBookingStatus(
  id: string,
  status: ConferenceBooking["status"],
  operatorName = "Events Team"
): Promise<ConferenceBooking | null> {
  const bookings = await getConferenceBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) return null;

  bookings[idx].status = status;
  await writeJsonFile("conference_bookings.json", bookings);

  await logAuditEvent({
    userId: "staff",
    userName: operatorName,
    role: "EVENT_COORDINATOR",
    action: "UPDATED_CONFERENCE_STATUS",
    target: id,
    details: `Status updated to ${status}`,
  });

  return bookings[idx];
}

// --- OUTSIDE CATERING ---

export async function getCateringBookings(): Promise<CateringBooking[]> {
  return readJsonFile<CateringBooking[]>("catering_bookings.json", generateSeedCatering());
}

export async function createCateringBooking(
  data: Omit<CateringBooking, "id" | "createdAt">
): Promise<CateringBooking> {
  const bookings = await getCateringBookings();
  const newBooking: CateringBooking = {
    ...data,
    id: `CAT-${new Date().getFullYear()}-${String(bookings.length + 10).padStart(3, "0")}`,
    createdAt: new Date().toISOString(),
  };
  bookings.unshift(newBooking);
  await writeJsonFile("catering_bookings.json", bookings);

  await logAuditEvent({
    userId: "staff",
    userName: data.clientName,
    role: "CATERING_STAFF",
    action: "CREATED_CATERING_BOOKING",
    target: newBooking.id,
    details: `Outside catering for ${data.guestCount} pax at ${data.location}`,
  });

  return newBooking;
}

export async function updateCateringBookingStatus(
  id: string,
  status: CateringBooking["status"],
  operatorName = "Catering Team"
): Promise<CateringBooking | null> {
  const bookings = await getCateringBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) return null;

  bookings[idx].status = status;
  await writeJsonFile("catering_bookings.json", bookings);

  await logAuditEvent({
    userId: "staff",
    userName: operatorName,
    role: "CATERING_STAFF",
    action: "UPDATED_CATERING_STATUS",
    target: id,
    details: `Status updated to ${status}`,
  });

  return bookings[idx];
}

// --- GARDEN & EVENTS ---

export async function getEventBookings(): Promise<EventBooking[]> {
  return readJsonFile<EventBooking[]>("events.json", generateSeedEvents());
}

export async function createEventBooking(
  data: Omit<EventBooking, "id" | "createdAt">
): Promise<EventBooking> {
  const events = await getEventBookings();
  const newEvent: EventBooking = {
    ...data,
    id: `EVT-${new Date().getFullYear()}-${String(events.length + 10).padStart(3, "0")}`,
    createdAt: new Date().toISOString(),
  };
  events.unshift(newEvent);
  await writeJsonFile("events.json", events);

  await logAuditEvent({
    userId: "staff",
    userName: data.clientName,
    role: "EVENT_COORDINATOR",
    action: "CREATED_EVENT_BOOKING",
    target: newEvent.id,
    details: `${data.eventType} at ${data.venueArea} for ${data.guestCount} guests`,
  });

  return newEvent;
}

export async function updateEventBookingStatus(
  id: string,
  status: EventBooking["status"],
  operatorName = "Events Team"
): Promise<EventBooking | null> {
  const events = await getEventBookings();
  const idx = events.findIndex((e) => e.id === id);
  if (idx === -1) return null;

  events[idx].status = status;
  await writeJsonFile("events.json", events);

  await logAuditEvent({
    userId: "staff",
    userName: operatorName,
    role: "EVENT_COORDINATOR",
    action: "UPDATED_EVENT_STATUS",
    target: id,
    details: `Status updated to ${status}`,
  });

  return events[idx];
}

// --- ROLES & PERMISSIONS MANAGEMENT ---

export const DEFAULT_ROLES: RoleDefinition[] = [
  {
    id: "role_admin",
    roleCode: "ADMIN",
    title: "General Manager / Super Admin",
    department: "Executive Management",
    description: "Complete unrestricted administrative control, audit logs, system settings, financial accounting, and staff roster.",
    permissions: [
      "reservations:read",
      "reservations:write",
      "rooms:read",
      "rooms:write",
      "housekeeping:read",
      "housekeeping:write",
      "restaurant:orders",
      "kitchen:kds",
      "conference:manage",
      "catering:manage",
      "events:manage",
      "reports:view",
      "staff:manage",
      "roles:manage",
      "settings:manage",
      "audit:view",
    ],
    isSystemRole: true,
    createdAt: "2026-09-01T08:00:00Z",
    updatedAt: "2026-09-01T08:00:00Z",
  },
  {
    id: "role_manager",
    roleCode: "MANAGER",
    title: "Operations Duty Manager",
    department: "Operations & Front Office",
    description: "Daily shift supervision, guest arrivals/departures, room assignments, departmental overrides, and operations KPIs.",
    permissions: [
      "reservations:read",
      "reservations:write",
      "rooms:read",
      "rooms:write",
      "housekeeping:read",
      "housekeeping:write",
      "restaurant:orders",
      "kitchen:kds",
      "conference:manage",
      "catering:manage",
      "events:manage",
      "reports:view",
      "staff:manage",
      "audit:view",
    ],
    isSystemRole: true,
    createdAt: "2026-09-01T08:00:00Z",
    updatedAt: "2026-09-01T08:00:00Z",
  },
  {
    id: "role_receptionist",
    roleCode: "RECEPTIONIST",
    title: "Front Desk & Reservations Officer",
    department: "Front Office",
    description: "Guest check-ins, check-outs, booking folio generation, room key assignments, and WhatsApp guest inquiries.",
    permissions: [
      "reservations:read",
      "reservations:write",
      "rooms:read",
      "rooms:write",
      "housekeeping:read",
    ],
    isSystemRole: true,
    createdAt: "2026-09-01T08:00:00Z",
    updatedAt: "2026-09-01T08:00:00Z",
  },
  {
    id: "role_housekeeping",
    roleCode: "HOUSEKEEPING",
    title: "Housekeeping & Sanitation Attendant",
    department: "Housekeeping & Laundry",
    description: "Room cleanliness updates, turnover tracking (Dirty -> Cleaning -> Clean -> Ready), and out-of-order room flagging.",
    permissions: [
      "rooms:read",
      "housekeeping:read",
      "housekeeping:write",
    ],
    isSystemRole: true,
    createdAt: "2026-09-01T08:00:00Z",
    updatedAt: "2026-09-01T08:00:00Z",
  },
  {
    id: "role_waiter",
    roleCode: "WAITER",
    title: "Dining Waitstaff & Service Captain",
    department: "Food & Beverage",
    description: "Table dining orders, customer room service tickets, bill generation, and kitchen order dispatch.",
    permissions: [
      "restaurant:orders",
    ],
    isSystemRole: true,
    createdAt: "2026-09-01T08:00:00Z",
    updatedAt: "2026-09-01T08:00:00Z",
  },
  {
    id: "role_chef",
    roleCode: "CHEF",
    title: "Head Chef & Kitchen Line Cook",
    department: "Kitchen Operations",
    description: "Kitchen Display System (KDS), ticket timing, food prep progression (Received -> Preparing -> Ready), and pass dispatch.",
    permissions: [
      "restaurant:orders",
      "kitchen:kds",
    ],
    isSystemRole: true,
    createdAt: "2026-09-01T08:00:00Z",
    updatedAt: "2026-09-01T08:00:00Z",
  },
  {
    id: "role_events",
    roleCode: "EVENT_COORDINATOR",
    title: "Conference & Garden Events Coordinator",
    department: "Corporate Events & Grounds",
    description: "Mount Elgon & Cherang'any hall bookings, delegate equipment setup, AV gear, and picturesque garden experiences.",
    permissions: [
      "conference:manage",
      "events:manage",
    ],
    isSystemRole: true,
    createdAt: "2026-09-01T08:00:00Z",
    updatedAt: "2026-09-01T08:00:00Z",
  },
  {
    id: "role_catering",
    roleCode: "CATERING_STAFF",
    title: "Outside Catering Logistics Specialist",
    department: "Outside Catering",
    description: "County summit banquets, field delivery transport, menu packages, buffet logistics, and equipment registers.",
    permissions: [
      "catering:manage",
    ],
    isSystemRole: true,
    createdAt: "2026-09-01T08:00:00Z",
    updatedAt: "2026-09-01T08:00:00Z",
  },
  {
    id: "role_maintenance",
    roleCode: "MAINTENANCE",
    title: "Facilities & Maintenance Engineer",
    department: "Engineering & Facilities",
    description: "HVAC, plumbing, electrical repairs, room maintenance blocking, and facilities inspection logs.",
    permissions: [
      "rooms:read",
      "rooms:write",
      "housekeeping:read",
    ],
    isSystemRole: true,
    createdAt: "2026-09-01T08:00:00Z",
    updatedAt: "2026-09-01T08:00:00Z",
  },
  {
    id: "role_accountant",
    roleCode: "ACCOUNTANT",
    title: "Financial Auditor & Accounts Controller",
    department: "Finance & Accounts",
    description: "Revenue audits, Daraja M-Pesa reconciliations, daily folios, ADR, and tax receipts.",
    permissions: [
      "reports:view",
      "reservations:read",
      "audit:view",
    ],
    isSystemRole: true,
    createdAt: "2026-09-01T08:00:00Z",
    updatedAt: "2026-09-01T08:00:00Z",
  },
];

export async function getRoles(): Promise<RoleDefinition[]> {
  return readJsonFile<RoleDefinition[]>("roles.json", DEFAULT_ROLES);
}

export async function getRoleByCode(roleCode: string): Promise<RoleDefinition | null> {
  const roles = await getRoles();
  return roles.find((r) => r.roleCode.toUpperCase() === roleCode.toUpperCase()) || null;
}

export async function createRole(
  data: Omit<RoleDefinition, "id" | "createdAt" | "updatedAt">
): Promise<RoleDefinition> {
  const roles = await getRoles();
  const cleanCode = data.roleCode.trim().toUpperCase().replace(/[^A-Z0-9_]/g, "_");

  const existing = roles.find((r) => r.roleCode === cleanCode);
  if (existing) {
    throw new Error(`Role with code '${cleanCode}' already exists.`);
  }

  const newRole: RoleDefinition = {
    ...data,
    id: `role_${cleanCode.toLowerCase()}_${Date.now().toString(36)}`,
    roleCode: cleanCode,
    isSystemRole: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  roles.push(newRole);
  await writeJsonFile("roles.json", roles);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "CREATED_ROLE",
    target: cleanCode,
    details: `Created new organizational role: ${data.title} (${data.department}) with ${data.permissions.length} permissions`,
  });

  return newRole;
}

export async function updateRole(
  id: string,
  data: Partial<Omit<RoleDefinition, "id" | "isSystemRole" | "createdAt">>
): Promise<RoleDefinition | null> {
  const roles = await getRoles();
  const idx = roles.findIndex((r) => r.id === id);
  if (idx === -1) return null;

  const current = roles[idx];
  const updated: RoleDefinition = {
    ...current,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  roles[idx] = updated;
  await writeJsonFile("roles.json", roles);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "UPDATED_ROLE",
    target: current.roleCode,
    details: `Updated role definition for ${updated.title}`,
  });

  return updated;
}

export async function deleteRole(id: string): Promise<{ success: boolean; error?: string }> {
  const roles = await getRoles();
  const idx = roles.findIndex((r) => r.id === id);
  if (idx === -1) {
    return { success: false, error: "Role not found." };
  }

  if (roles[idx].isSystemRole) {
    return { success: false, error: "Default system roles cannot be deleted." };
  }

  const deletedRole = roles[idx];
  roles.splice(idx, 1);
  await writeJsonFile("roles.json", roles);

  await logAuditEvent({
    userId: "admin",
    userName: "System Administrator",
    role: "ADMIN",
    action: "DELETED_ROLE",
    target: deletedRole.roleCode,
    details: `Deleted custom role ${deletedRole.title}`,
  });

  return { success: true };
}

// Re-export all dynamic CMS database methods
export * from "./cms-db";

