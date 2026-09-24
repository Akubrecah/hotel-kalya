import { NextRequest, NextResponse } from "next/server";
import { getGardens, createGarden, updateGarden, deleteGarden } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const onlyPublished = searchParams.get("published") === "true";

    const gardens = await getGardens(onlyPublished);
    return NextResponse.json({
      success: true,
      total: gardens.length,
      gardens,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch gardens: " + String(error) },
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

    const garden = await createGarden(body);
    return NextResponse.json({ success: true, garden }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create garden: " + String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Missing garden ID." },
        { status: 400 }
      );
    }

    const updated = await updateGarden(body.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Garden not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, garden: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update garden: " + String(error) },
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
        { success: false, error: "Missing garden ID." },
        { status: 400 }
      );
    }

    const result = await deleteGarden(id);
    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete garden: " + String(error) },
      { status: 500 }
    );
  }
}
