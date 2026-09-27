import { NextResponse } from "next/server";
import { initiateDarajaStkPush, formatKenyanPhoneNumber } from "@/lib/mpesa";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, amount, reference, description } = body;

    if (!phone || !amount) {
      return NextResponse.json(
        {
          success: false,
          error: "Phone number and payment amount are required.",
        },
        { status: 400 }
      );
    }

    const formattedPhone = formatKenyanPhoneNumber(phone);
    if (formattedPhone.length !== 12 || !formattedPhone.startsWith("254")) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Kenyan phone number format. Please provide e.g. 0712345678 or 254712345678.",
        },
        { status: 400 }
      );
    }

    const payAmount = Math.max(1, Math.round(Number(amount)));

    // Initiate real or sandbox STK push via Daraja
    const stkResult = await initiateDarajaStkPush({
      phone: formattedPhone,
      amount: payAmount,
      accountReference: reference || "HotelKalya",
      transactionDesc: description || "KalyaServices",
    });

    if (!stkResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: stkResult.error || "Failed to initiate M-Pesa STK Push.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      mode: stkResult.mode,
      checkoutRequestId: stkResult.checkoutRequestId,
      merchantRequestId: stkResult.merchantRequestId,
      mpesaReceiptNumber: stkResult.mpesaReceiptNumber,
      phone: formattedPhone,
      amount: payAmount,
      accountReference: reference || "Hotel Kalya",
      transactionDescription: description || "Hotel Kalya Services",
      customerMessage:
        stkResult.customerMessage ||
        `An M-Pesa STK PIN prompt has been initiated on ${formattedPhone}. Please enter your M-Pesa PIN on your phone to complete KES ${payAmount.toLocaleString()}.`,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
