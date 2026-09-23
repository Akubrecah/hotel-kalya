import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const callbackData = await request.json();

    // Safaricom Daraja STK Callback payload format:
    // { Body: { stkCallback: { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata: { Item: [...] } } } }
    const stkCallback = callbackData?.Body?.stkCallback;

    if (!stkCallback) {
      return NextResponse.json({ success: false, message: "Invalid callback payload" }, { status: 400 });
    }

    const { ResultCode, ResultDesc } = stkCallback;

    if (ResultCode === 0) {
      // Payment Successful
      // Extract ReceiptNumber, Amount, PhoneNumber from CallbackMetadata
      return NextResponse.json({
        ResultCode: 0,
        ResultDesc: "Callback accepted and transaction reconciled successfully.",
      });
    } else {
      // User cancelled, timeout, or insufficient funds
      return NextResponse.json({
        ResultCode: ResultCode,
        ResultDesc: ResultDesc || "Payment was rejected or cancelled by user.",
      });
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ ResultCode: 1, ResultDesc: errorMsg }, { status: 500 });
  }
}
