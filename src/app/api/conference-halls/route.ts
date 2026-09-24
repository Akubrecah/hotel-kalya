import { NextRequest, NextResponse } from "next/server";
import { getConferenceHalls, createConferenceHall, updateConferenceHall, deleteConferenceHall } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const onlyPublished = searchParams.get("published") === "true";

    const halls = await getConferenceHalls(onlyPublished);
    return NextResponse.json({
      success: true,
      total: halls.length,
      halls,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch conference halls: " + String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: "Missing required field (name)." },
        { status: 400 }
      );
    }

    const hall = await createConferenceHall(body);
    return NextResponse.json({ success: true, hall }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create conference hall: " + String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Missing hall ID." },
        { status: 400 }
      );
    }

    const updated = await updateConferenceHall(body.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Conference hall not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, hall: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update conference hall: " + String(error) },
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
        { success: false, error: "Missing hall ID." },
        { status: 400 }
      );
    }

    const result = await deleteConferenceHall(id);
    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete conference hall: " + String(error) },
      { status: 500 }
    );
  }
}
