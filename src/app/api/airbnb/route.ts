import { NextRequest, NextResponse } from "next/server";
import { getAirbnbApartments, createAirbnbApartment, updateAirbnbApartment, deleteAirbnbApartment } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const onlyPublished = searchParams.get("published") === "true";

    const apartments = await getAirbnbApartments(onlyPublished);
    return NextResponse.json({
      success: true,
      total: apartments.length,
      apartments,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch serviced apartments: " + String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.pricePerNight) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (name, pricePerNight)." },
        { status: 400 }
      );
    }

    const apt = await createAirbnbApartment(body);
    return NextResponse.json({ success: true, apartment: apt }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create serviced apartment: " + String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Missing apartment ID." },
        { status: 400 }
      );
    }

    const updated = await updateAirbnbApartment(body.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Apartment not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, apartment: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update serviced apartment: " + String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing apartment ID." },
        { status: 400 }
      );
    }

    const result = await deleteAirbnbApartment(id);
    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete serviced apartment: " + String(error) },
      { status: 500 }
    );
  }
}
