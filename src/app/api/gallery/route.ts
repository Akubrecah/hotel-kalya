import { NextRequest, NextResponse } from "next/server";
import { getGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem } from "@/lib/db";
import { authorizeApiRequest } from "@/lib/rbac";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const onlyPublished = searchParams.get("published") === "true";

    const items = await getGalleryItems(category, onlyPublished);
    return NextResponse.json({
      success: true,
      total: items.length,
      items,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch gallery items: " + String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = authorizeApiRequest(request, "gallery:manage", ["MANAGEMENT", "EXECUTIVE"]);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    if (!body.title || !body.imageUrl || !body.category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (title, imageUrl, category)." },
        { status: 400 }
      );
    }

    const item = await createGalleryItem(body);
    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create gallery item: " + String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = authorizeApiRequest(request, "gallery:manage", ["MANAGEMENT", "EXECUTIVE"]);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Missing item ID." },
        { status: 400 }
      );
    }

    const updated = await updateGalleryItem(body.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Gallery item not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update gallery item: " + String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = authorizeApiRequest(request, "gallery:manage", ["MANAGEMENT", "EXECUTIVE"]);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing item ID." },
        { status: 400 }
      );
    }

    const result = await deleteGalleryItem(id);
    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete gallery item: " + String(error) },
      { status: 500 }
    );
  }
}
