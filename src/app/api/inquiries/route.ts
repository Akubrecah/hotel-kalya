import { NextRequest, NextResponse } from "next/server";
import { authorizeApiRequest } from "@/lib/rbac";

export interface InquiryRecord {
  id: string;
  type: "contact" | "reservation" | "dining" | "intake";
  name: string;
  phone: string;
  email: string;
  organization?: string;
  subject: string;
  details: Record<string, unknown>;
  status: "New" | "In Review" | "Contacted" | "Approved" | "Completed" | "Archived";
  priority: "High" | "Medium" | "Low";
  source: string;
  createdAt: string;
}

// In-memory store for demo & local persistence
const INQUIRIES_STORE: InquiryRecord[] = [
  {
    id: "INQ-2026-001",
    type: "contact",
    name: "Dr. Emmanuel Rotich",
    phone: "+254 722 334455",
    email: "e.rotich@westpokot.go.ke",
    organization: "County Government of West Pokot (Agriculture Dept)",
    subject: "3-Day County Food Security Strategy Seminar",
    details: {
      delegates: 55,
      preferredHall: "Main Conference Hall A",
      dates: "2026-10-12 to 2026-10-14",
      cateringRequired: "Full Board (Morning Tea, Buffet Lunch, Afternoon Tea)",
      specialRequirements: "Cordless microphones, projector, backup generator guarantee.",
    },
    status: "In Review",
    priority: "High",
    source: "Website Contact Form",
    createdAt: "2026-09-24T08:15:00Z",
  },
  {
    id: "INQ-2026-002",
    type: "intake",
    name: "Haron Pkopus",
    phone: "+254 719 766649",
    email: "manager@hotelkalya.com",
    organization: "Hotel Kalya Ltd",
    subject: "Website Project Master Intake & Architecture Launch",
    details: {
      projectName: "Hotel Kalya Digital Hospitality Platform",
      budget: "KES 650,000",
      targetGoLive: "2026-11-05",
      keyModules: [
        "Multi-page responsive booking platform",
        "Digital dining menu & kitchen KDS",
        "Admin operations console & PDF generator",
        "M-Pesa STK push integration",
      ],
      decisionMakers: "Managing Director, General Manager, Head of Finance",
    },
    status: "Approved",
    priority: "High",
    source: "DOC-001 Client Intake Form",
    createdAt: "2026-09-23T11:30:00Z",
  },
  {
    id: "INQ-2026-003",
    type: "reservation",
    name: "Sharon Jepchumba",
    phone: "+254 714 990011",
    email: "sharon.j@safari-rift.co.ke",
    organization: "North Rift Eco-Tours",
    subject: "Room Booking — Executive Suite",
    details: {
      room: "Executive Deluxe Suite (Suite 204)",
      checkIn: "2026-09-29",
      checkOut: "2026-10-02",
      nights: 3,
      guests: "2 Adults",
      ratePerNight: 8500,
      totalAmount: 25500,
      paymentMethod: "M-Pesa STK Push (Paid)",
      specialRequests: "Quiet floor, valley hill view, airport pickup coordination.",
    },
    status: "Approved",
    priority: "Medium",
    source: "Online Booking Engine",
    createdAt: "2026-09-23T15:45:00Z",
  },
  {
    id: "INQ-2026-004",
    type: "dining",
    name: "Table 8 — Peter Lomerur",
    phone: "+254 721 556677",
    email: "plomerur@gmail.com",
    subject: "Restaurant Dining & Bar Slip",
    details: {
      tableNumber: "Table 08 (Garden Terrace)",
      items: [
        { name: "Kienyeji Chicken Wet Fry (Full)", qty: 1, price: 1600 },
        { name: "Brown Ugali with Traditional Greens", qty: 2, price: 300 },
        { name: "Fresh Passion Juice (500ml)", qty: 2, price: 500 },
      ],
      totalAmount: 2400,
      spiceLevel: "Medium Spice",
      notes: "Serve with hot chilli on the side.",
    },
    status: "Completed",
    priority: "Medium",
    source: "Digital Table QR Order",
    createdAt: "2026-09-24T09:20:00Z",
  },
  {
    id: "INQ-2026-005",
    type: "contact",
    name: "Beatrice Chepkemoi",
    phone: "+254 733 998877",
    email: "beatrice.chepkemoi@outlook.com",
    organization: "Private Family Event",
    subject: "Outside Catering for Traditional Dowry Ceremony (Koito)",
    details: {
      location: "Makutano Outskirts, Kapenguria",
      expectedGuests: 180,
      date: "2026-11-14",
      serviceRequested: "Buffet setup, buffet warming chafer dishes, service staff, Kalya signature roasted goat.",
    },
    status: "New",
    priority: "High",
    source: "Website Catering Inquiry",
    createdAt: "2026-09-24T06:40:00Z",
  },
];

export async function GET(request: NextRequest) {
  try {
    const auth = authorizeApiRequest(request, "inquiries:manage", ["FRONT_OFFICE", "MANAGEMENT", "EXECUTIVE"]);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    let filtered = [...INQUIRIES_STORE];

    if (type && type !== "all") {
      filtered = filtered.filter((i) => i.type === type);
    }
    if (status && status !== "all") {
      filtered = filtered.filter((i) => i.status === status);
    }

    // Sort newest first
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      total: filtered.length,
      inquiries: filtered,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch inquiries: " + String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newId = `INQ-${new Date().getFullYear()}-${String(INQUIRIES_STORE.length + 1).padStart(3, "0")}`;

    const newRecord: InquiryRecord = {
      id: newId,
      type: body.type || "contact",
      name: body.name || "Anonymous Guest",
      phone: body.phone || "+254 700 000000",
      email: body.email || "",
      organization: body.organization || "",
      subject: body.subject || "General Inquiry",
      details: body.details || {},
      status: "New",
      priority: body.priority || "Medium",
      source: body.source || "Website Form Submission",
      createdAt: new Date().toISOString(),
    };

    INQUIRIES_STORE.unshift(newRecord);

    return NextResponse.json({
      success: true,
      inquiry: newRecord,
      message: "Form submission recorded successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to save inquiry: " + String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = authorizeApiRequest(request, "inquiries:manage", ["FRONT_OFFICE", "MANAGEMENT", "EXECUTIVE"]);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { id, status } = body;

    const record = INQUIRIES_STORE.find((i) => i.id === id);
    if (!record) {
      return NextResponse.json(
        { success: false, error: `Inquiry with ID ${id} not found` },
        { status: 404 }
      );
    }

    if (status) {
      record.status = status;
    }

    return NextResponse.json({
      success: true,
      inquiry: record,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update inquiry: " + String(error) },
      { status: 500 }
    );
  }
}
