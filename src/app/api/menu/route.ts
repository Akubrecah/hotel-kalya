import { NextRequest, NextResponse } from "next/server";
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const onlyPublished = searchParams.get("published") === "true";

    const items = await getMenuItems(category, onlyPublished);
    return NextResponse.json({
      success: true,
      total: items.length,
      items,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch menu items: " + String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.category || body.price === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (name, category, price)." },
        { status: 400 }
      );
    }

    const newItem = await createMenuItem(body);
    return NextResponse.json({ success: true, item: newItem }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create menu item: " + String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Missing item ID." },
        { status: 400 }
      );
    }

    const updated = await updateMenuItem(body.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Menu item not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update menu item: " + String(error) },
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
        { success: false, error: "Missing item ID." },
        { status: 400 }
      );
    }

    const result = await deleteMenuItem(id);
    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete menu item: " + String(error) },
      { status: 500 }
    );
  }
}
