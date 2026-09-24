import { NextRequest, NextResponse } from "next/server";
import { getOffers, createOffer, updateOffer, deleteOffer } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const onlyPublished = searchParams.get("published") === "true";

    const offers = await getOffers(onlyPublished);
    return NextResponse.json({
      success: true,
      total: offers.length,
      offers,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch offers: " + String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title || !body.offerPrice) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (title, offerPrice)." },
        { status: 400 }
      );
    }

    const offer = await createOffer(body);
    return NextResponse.json({ success: true, offer }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create offer: " + String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Missing offer ID." },
        { status: 400 }
      );
    }

    const updated = await updateOffer(body.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Offer not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, offer: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update offer: " + String(error) },
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
        { success: false, error: "Missing offer ID." },
        { status: 400 }
      );
    }

    const result = await deleteOffer(id);
    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete offer: " + String(error) },
      { status: 500 }
    );
  }
}
