import { NextResponse } from "next/server";

export interface ReservationRecord {
  id: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  service: string;
  roomNumber?: string;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: string;
  totalAmount: number;
  paymentStatus: "Paid" | "Deposit" | "Pay on Arrival";
  status: "Pending" | "Confirmed" | "Checked-In" | "Completed" | "Cancelled";
  specialRequests?: string;
  createdAt: string;
}

// In-memory persistent seed store for development and demo mode
const DEFAULT_RESERVATIONS: ReservationRecord[] = [
  {
    id: "BK-88421",
    guestName: "James Chemosit",
    guestPhone: "+254 712 345678",
    guestEmail: "guest@hotelkalya.com",
    service: "Executive Deluxe Suite",
    roomNumber: "Suite 204",
    checkInDate: "2026-09-28",
    checkOutDate: "2026-09-30",
    guestsCount: "2 Adults",
    totalAmount: 17000,
    paymentStatus: "Paid",
    status: "Confirmed",
    specialRequests: "High floor facing Kapenguria hills, late check-in at 7:00 PM.",
    createdAt: "2026-09-20T14:32:00Z",
  },
  {
    id: "BK-76192",
    guestName: "Faith Chebet (West Pokot Health Dept)",
    guestPhone: "+254 722 889911",
    guestEmail: "faith.chebet@westpokot.go.ke",
    service: "Main Conference Hall (County Workshop)",
    roomNumber: "Hall A",
    checkInDate: "2026-10-05",
    checkOutDate: "2026-10-07",
    guestsCount: "45 Delegates",
    totalAmount: 125000,
    paymentStatus: "Deposit",
    status: "Confirmed",
    specialRequests: "Full HD projection, dual cordless microphones, morning & afternoon tea.",
    createdAt: "2026-09-18T09:15:00Z",
  },
  {
    id: "BK-64201",
    guestName: "David Kiprop",
    guestPhone: "+254 733 456123",
    guestEmail: "dkiprop@gmail.com",
    service: "Kalya Luxury Cottage",
    roomNumber: "Cottage 3",
    checkInDate: "2026-09-23",
    checkOutDate: "2026-09-25",
    guestsCount: "2 Adults, 1 Child",
    totalAmount: 22000,
    paymentStatus: "Paid",
    status: "Checked-In",
    specialRequests: "Baby cot requested, extra towels.",
    createdAt: "2026-09-21T11:00:00Z",
  },
  {
    id: "BK-51904",
    guestName: "Mercy Wambui",
    guestPhone: "+254 701 987654",
    guestEmail: "mwambui@corp.ke",
    service: "Standard Superior Room",
    roomNumber: "Room 108",
    checkInDate: "2026-09-24",
    checkOutDate: "2026-09-26",
    guestsCount: "1 Adult",
    totalAmount: 9000,
    paymentStatus: "Pay on Arrival",
    status: "Pending",
    specialRequests: "Quiet room away from street, early breakfast at 6:30 AM.",
    createdAt: "2026-09-22T16:45:00Z",
  },
];

// Global state simulation for route handler
const globalStore = global as unknown as { __hotel_kalya_reservations?: ReservationRecord[] };
if (!globalStore.__hotel_kalya_reservations) {
  globalStore.__hotel_kalya_reservations = [...DEFAULT_RESERVATIONS];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status");

  let reservations = globalStore.__hotel_kalya_reservations || DEFAULT_RESERVATIONS;

  if (statusFilter && statusFilter !== "all") {
    reservations = reservations.filter(
      (r) => r.status.toLowerCase() === statusFilter.toLowerCase()
    );
  }

  return NextResponse.json({
    success: true,
    total: reservations.length,
    reservations,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Required fields validation
    if (!body.guestName || !body.guestPhone || !body.service || !body.checkInDate) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing mandatory reservation details (name, phone, service, check-in date).",
        },
        { status: 400 }
      );
    }

    const randomId = "BK-" + Math.floor(10000 + Math.random() * 90000);
    const newReservation: ReservationRecord = {
      id: randomId,
      guestName: body.guestName.trim(),
      guestPhone: body.guestPhone.trim(),
      guestEmail: body.guestEmail?.trim() || "guest@hotelkalya.com",
      service: body.service,
      roomNumber: body.roomNumber || "TBD upon Check-In",
      checkInDate: body.checkInDate,
      checkOutDate: body.checkOutDate || body.checkInDate,
      guestsCount: body.guestsCount || "1 Guest",
      totalAmount: Number(body.totalAmount) || 8500,
      paymentStatus: body.paymentStatus || "Pay on Arrival",
      status: "Confirmed",
      specialRequests: body.specialRequests || "",
      createdAt: new Date().toISOString(),
    };

    if (!globalStore.__hotel_kalya_reservations) {
      globalStore.__hotel_kalya_reservations = [...DEFAULT_RESERVATIONS];
    }
    globalStore.__hotel_kalya_reservations.unshift(newReservation);

    return NextResponse.json(
      {
        success: true,
        message: "Reservation successfully confirmed.",
        reservation: newReservation,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, roomNumber, paymentStatus } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing reservation ID" }, { status: 400 });
    }

    const reservations = globalStore.__hotel_kalya_reservations || DEFAULT_RESERVATIONS;
    const target = reservations.find((r) => r.id === id);

    if (!target) {
      return NextResponse.json({ success: false, error: "Reservation not found" }, { status: 404 });
    }

    if (status) target.status = status;
    if (roomNumber) target.roomNumber = roomNumber;
    if (paymentStatus) target.paymentStatus = paymentStatus;

    return NextResponse.json({
      success: true,
      message: `Reservation ${id} updated successfully.`,
      reservation: target,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
