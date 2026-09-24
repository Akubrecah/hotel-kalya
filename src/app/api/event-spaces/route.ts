import { NextRequest, NextResponse } from "next/server";
import { getEventSpaces, createEventSpace, updateEventSpace, deleteEventSpace } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const onlyPublished = searchParams.get("published") === "true";

    const spaces = await getEventSpaces(onlyPublished);
    return NextResponse.json({
      success: true,
      total: spaces.length,
      spaces,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch event spaces: " + String(error) },
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

    const space = await createEventSpace(body);
    return NextResponse.json({ success: true, space }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create event space: " + String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Missing space ID." },
        { status: 400 }
      );
    }

    const updated = await updateEventSpace(body.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Event space not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, space: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update event space: " + String(error) },
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
        { success: false, error: "Missing space ID." },
        { status: 400 }
      );
    }

    const result = await deleteEventSpace(id);
    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete event space: " + String(error) },
      { status: 500 }
    );
  }
}
