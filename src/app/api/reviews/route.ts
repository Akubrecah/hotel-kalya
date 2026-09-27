import { NextRequest, NextResponse } from "next/server";
import { getReviews, createReview, updateReview, deleteReview } from "@/lib/db";
import { authorizeApiRequest } from "@/lib/rbac";

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

    // Only authenticated staff with reviews:manage can auto-approve reviews
    const auth = authorizeApiRequest(request, "reviews:manage", ["FRONT_OFFICE", "MANAGEMENT", "EXECUTIVE"]);
    const isStaff = auth.authorized;

    const review = await createReview({
      authorName: String(body.authorName).slice(0, 80),
      authorLocation: String(body.authorLocation || "Kapenguria").slice(0, 80),
      rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
      date: body.date || new Date().toISOString().split("T")[0],
      category: body.category || "General",
      comment: String(body.comment).slice(0, 1000),
      source: body.source || "Direct Guest Feedback",
      isApproved: isStaff && body.isApproved !== undefined ? Boolean(body.isApproved) : false,
      isFeatured: isStaff && body.isFeatured !== undefined ? Boolean(body.isFeatured) : false,
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
    const auth = authorizeApiRequest(request, "reviews:manage", ["FRONT_OFFICE", "MANAGEMENT", "EXECUTIVE"]);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

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
    const auth = authorizeApiRequest(request, "reviews:manage", ["FRONT_OFFICE", "MANAGEMENT", "EXECUTIVE"]);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

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
