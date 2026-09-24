import { NextRequest, NextResponse } from "next/server";
import { getCateringPackages, createCateringPackage, updateCateringPackage, deleteCateringPackage } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const onlyPublished = searchParams.get("published") === "true";

    const packages = await getCateringPackages(onlyPublished);
    return NextResponse.json({
      success: true,
      total: packages.length,
      packages,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch catering packages: " + String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.pricePerPerson) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (name, pricePerPerson)." },
        { status: 400 }
      );
    }

    const pkg = await createCateringPackage(body);
    return NextResponse.json({ success: true, package: pkg }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create catering package: " + String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Missing package ID." },
        { status: 400 }
      );
    }

    const updated = await updateCateringPackage(body.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Catering package not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, package: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update catering package: " + String(error) },
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
        { success: false, error: "Missing package ID." },
        { status: 400 }
      );
    }

    const result = await deleteCateringPackage(id);
    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete catering package: " + String(error) },
      { status: 500 }
    );
  }
}
