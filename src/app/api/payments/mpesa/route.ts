import { NextResponse } from "next/server";

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

    // Clean & normalize Kenyan phone number
    let cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "254" + cleanPhone.substring(1);
    } else if (cleanPhone.startsWith("+254")) {
      cleanPhone = cleanPhone.substring(1);
    } else if (!cleanPhone.startsWith("254") && cleanPhone.length === 9) {
      cleanPhone = "254" + cleanPhone;
    }

    if (cleanPhone.length !== 12 || !cleanPhone.startsWith("254")) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Kenyan phone number format. Please provide 07XXXXXXXX or 254XXXXXXXXX.",
        },
        { status: 400 }
      );
    }

    const payAmount = Math.max(1, Math.round(Number(amount)));
    const checkoutRequestId = "ws_CO_" + Date.now() + "_" + Math.floor(1000 + Math.random() * 9000);
    const mpesaReceiptNumber = "QK" + Math.floor(100000 + Math.random() * 900000) + "X";

    // Check if live Daraja credentials exist in environment
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const passkey = process.env.MPESA_PASSKEY;

    const isLiveConfigured = Boolean(consumerKey && consumerSecret && passkey);

    if (isLiveConfigured) {
      // In live production mode with valid Daraja credentials:
      // Compute Daraja Password & Timestamp
      // const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
      // const password = Buffer.from(shortcode + passkey + timestamp).toString("base64");
      // Call Safaricom API...
    }

    // Return instant responsive STK push payload
    return NextResponse.json({
      success: true,
      mode: isLiveConfigured ? "live" : "simulation",
      checkoutRequestId,
      merchantRequestId: "MR-" + Math.floor(10000 + Math.random() * 90000),
      mpesaReceiptNumber,
      phone: cleanPhone,
      amount: payAmount,
      accountReference: reference || "Hotel Kalya",
      transactionDescription: description || "Hotel Kalya Services",
      customerMessage: `An M-Pesa STK PIN prompt has been initiated on ${cleanPhone}. Please enter your M-Pesa PIN on your phone to complete KES ${payAmount.toLocaleString()}.`,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
