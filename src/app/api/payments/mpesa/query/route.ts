import { NextResponse } from "next/server";
import { queryDarajaStkStatus } from "@/lib/mpesa";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { checkoutRequestId } = body;

    if (!checkoutRequestId) {
      return NextResponse.json(
        { success: false, error: "checkoutRequestId is required to query status." },
        { status: 400 }
      );
    }

    const queryResult = await queryDarajaStkStatus(checkoutRequestId);

    return NextResponse.json(queryResult);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
