import { NextRequest, NextResponse } from "next/server";
import { getAnnouncements, getActiveAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

    const announcements = activeOnly ? await getActiveAnnouncements() : await getAnnouncements();
    return NextResponse.json({
      success: true,
      total: announcements.length,
      announcements,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch announcements: " + String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title || !body.message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (title, message)." },
        { status: 400 }
      );
    }

    const item = await createAnnouncement(body);
    return NextResponse.json({ success: true, announcement: item }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create announcement: " + String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Missing announcement ID." },
        { status: 400 }
      );
    }

    const updated = await updateAnnouncement(body.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Announcement not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, announcement: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update announcement: " + String(error) },
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
        { success: false, error: "Missing announcement ID." },
        { status: 400 }
      );
    }

    const result = await deleteAnnouncement(id);
    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete announcement: " + String(error) },
      { status: 500 }
    );
  }
}
