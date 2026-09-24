import { NextRequest, NextResponse } from "next/server";
import { getMenuCategories, createMenuCategory, updateMenuCategory, deleteMenuCategory } from "@/lib/db";

export async function GET() {
  try {
    const categories = await getMenuCategories();
    return NextResponse.json({
      success: true,
      total: categories.length,
      categories,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch menu categories: " + String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (name, slug)." },
        { status: 400 }
      );
    }

    const newCategory = await createMenuCategory(body);
    return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create menu category: " + String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Missing category ID." },
        { status: 400 }
      );
    }

    const updated = await updateMenuCategory(body.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Category not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, category: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update category: " + String(error) },
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
        { success: false, error: "Missing category ID." },
        { status: 400 }
      );
    }

    const result = await deleteMenuCategory(id);
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete category: " + String(error) },
      { status: 500 }
    );
  }
}
