import { NextRequest, NextResponse } from "next/server";
import { getReviews, createReview, updateReview, deleteReview } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const onlyApproved = searchParams.get("approved") === "true";

    const reviews = await getReviews(onlyApproved);
    return NextResponse.json({
      success: true,
      total: reviews.length,
      reviews,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch customer reviews: " + String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.authorName || !body.comment || !body.rating) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (authorName, comment, rating)." },
        { status: 400 }
      );
    }

    const review = await createReview({
      authorName: body.authorName,
      authorLocation: body.authorLocation || "Kapenguria",
      rating: Number(body.rating),
      date: body.date || new Date().toISOString().split("T")[0],
      category: body.category || "General",
      comment: body.comment,
      source: body.source || "Direct Guest Feedback",
      isApproved: body.isApproved !== undefined ? Boolean(body.isApproved) : true,
      isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : false,
    });
    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to submit review: " + String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Missing review ID." },
        { status: 400 }
      );
    }

    const updated = await updateReview(body.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Review not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, review: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update review: " + String(error) },
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
        { success: false, error: "Missing review ID." },
        { status: 400 }
      );
    }

    const result = await deleteReview(id);
    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete review: " + String(error) },
      { status: 500 }
    );
  }
}
