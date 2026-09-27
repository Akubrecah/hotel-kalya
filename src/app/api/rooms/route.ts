import { NextRequest, NextResponse } from "next/server";
import { getRooms, searchAvailableRooms, createRoom, updateRoom, deleteRoom } from "@/lib/db";
import { authorizeApiRequest } from "@/lib/rbac";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const guests = searchParams.get("guests") ? parseInt(searchParams.get("guests")!, 10) : undefined;
    const typeSlug = searchParams.get("typeSlug") || undefined;
    const status = searchParams.get("status") || undefined;
    const onlyPublished = searchParams.get("published") === "true";

    // If date range is specified, run availability search
    if (checkIn && checkOut) {
      const { availableRooms, unavailableRooms } = await searchAvailableRooms({
        checkIn,
        checkOut,
        guests,
        typeSlug,
      });

      const filteredAvailable = onlyPublished
        ? availableRooms.filter((r) => !r.publishStatus || r.publishStatus === "published")
        : availableRooms;

      return NextResponse.json({
        success: true,
        checkIn,
        checkOut,
        totalAvailable: filteredAvailable.length,
        totalUnavailable: unavailableRooms.length,
        availableRooms: filteredAvailable,
        unavailableRooms,
      });
    }

    let rooms = await getRooms(onlyPublished);

    if (typeSlug && typeSlug !== "all") {
      rooms = rooms.filter((r) => r.typeSlug === typeSlug);
    }
    if (status && status !== "all") {
      rooms = rooms.filter((r) => r.reservationStatus?.toLowerCase() === status.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      total: rooms.length,
      rooms,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch rooms: " + String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = authorizeApiRequest(request, "rooms:write", ["MANAGEMENT", "EXECUTIVE"]);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    if (!body.roomNumber || !body.name || !body.type || !body.basePrice) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (roomNumber, name, type, basePrice)." },
        { status: 400 }
      );
    }

    const newRoom = await createRoom(body);

    return NextResponse.json({
      success: true,
      room: newRoom,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create room: " + String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = authorizeApiRequest(request, "rooms:write", ["MANAGEMENT", "EXECUTIVE", "HOUSEKEEPING"]);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const id = body.id || body.roomNumber;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing room id or roomNumber." },
        { status: 400 }
      );
    }

    const updated = await updateRoom(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Room not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      room: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update room: " + String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = authorizeApiRequest(request, "rooms:write", ["MANAGEMENT", "EXECUTIVE"]);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing room ID." },
        { status: 400 }
      );
    }

    const result = await deleteRoom(id);
    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete room: " + String(error) },
      { status: 500 }
    );
  }
}

