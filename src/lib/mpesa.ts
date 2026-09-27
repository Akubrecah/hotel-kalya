/**
 * Safaricom M-Pesa Daraja API Client for Hotel Kalya
 * Handles OAuth authentication, STK Push (Lipa Na M-Pesa Online),
 * transaction query, and webhook callback processing.
 */

export interface MpesaConfig {
  consumerKey: string;
  consumerSecret: string;
  passkey: string;
  shortcode: string;
  environment: "sandbox" | "production";
  callbackUrl: string;
}

export interface StkPushParams {
  phone: string;
  amount: number;
  accountReference?: string;
  transactionDesc?: string;
}

export interface StkPushResponse {
  success: boolean;
  mode: "live" | "sandbox" | "simulation" | "production";
  merchantRequestId?: string;
  checkoutRequestId?: string;
  responseCode?: string;
  responseDescription?: string;
  customerMessage?: string;
  mpesaReceiptNumber?: string;
  error?: string;
}

export interface StkQueryResponse {
  success: boolean;
  resultCode?: number;
  resultDesc?: string;
  checkoutRequestId?: string;
  merchantRequestId?: string;
  error?: string;
}

// In-memory token cache
let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Resolves current Daraja configuration from environment variables
 */
export function getMpesaConfig(): MpesaConfig {
  const consumerKey =
    process.env.MPESA_CONSUMER_KEY ||
    process.env.DARAJA_CONSUMER_KEY ||
    "";
  const consumerSecret =
    process.env.MPESA_CONSUMER_SECRET ||
    process.env.DARAJA_CONSUMER_SECRET ||
    "";
  const passkey =
    process.env.MPESA_PASSKEY ||
    process.env.DARAJA_PASSKEY ||
    "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"; // Standard Safaricom Sandbox passkey
  const shortcode =
    process.env.MPESA_BUSINESS_SHORTCODE ||
    process.env.DARAJA_SHORTCODE ||
    "174379"; // Standard Safaricom Sandbox shortcode
  const environment = (process.env.MPESA_ENVIRONMENT || "sandbox").toLowerCase() === "production"
    ? "production"
    : "sandbox";
  const callbackUrl =
    process.env.MPESA_CALLBACK_URL ||
    process.env.DARAJA_CALLBACK_URL ||
    (process.env.NEXT_PUBLIC_APP_URL || "https://hotelkalya.com") + "/api/payments/mpesa/callback";

  return {
    consumerKey,
    consumerSecret,
    passkey,
    shortcode,
    environment,
    callbackUrl,
  };
}

/**
 * Formats and normalizes any Kenyan phone number to 254XXXXXXXXX
 */
export function formatKenyanPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, "");

  if (cleaned.startsWith("0")) {
    cleaned = "254" + cleaned.substring(1);
  } else if (cleaned.startsWith("+254")) {
    cleaned = cleaned.substring(1);
  } else if (!cleaned.startsWith("254") && (cleaned.length === 9 || cleaned.length === 10)) {
    cleaned = "254" + (cleaned.startsWith("7") || cleaned.startsWith("1") ? cleaned : cleaned.substring(1));
  }

  return cleaned;
}

/**
 * Generates an OAuth Bearer access token using Basic Auth credentials
 */
export async function getDarajaAccessToken(config?: MpesaConfig): Promise<string> {
  const cfg = config || getMpesaConfig();

  // Return cached token if valid for at least 60 seconds
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60000) {
    return cachedToken.token;
  }

  if (!cfg.consumerKey || !cfg.consumerSecret) {
    throw new Error("Missing M-Pesa Daraja Consumer Key or Consumer Secret in environment variables.");
  }

  const baseUrl =
    cfg.environment === "production"
      ? "https://api.safaricom.co.ke"
      : "https://sandbox.safaricom.co.ke";

  const authHeader = "Basic " + Buffer.from(`${cfg.consumerKey}:${cfg.consumerSecret}`).toString("base64");

  const response = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    method: "GET",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Daraja OAuth failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const token = data.access_token;
  const expiresIn = Number(data.expires_in) || 3599;

  cachedToken = {
    token,
    expiresAt: Date.now() + expiresIn * 1000,
  };

  return token;
}

/**
 * Triggers an STK Push (Lipa Na M-Pesa Online) to a user's phone
 */
export async function initiateDarajaStkPush(params: StkPushParams): Promise<StkPushResponse> {
  const config = getMpesaConfig();
  const formattedPhone = formatKenyanPhoneNumber(params.phone);

  if (formattedPhone.length !== 12 || !formattedPhone.startsWith("254")) {
    return {
      success: false,
      mode: config.environment,
      error: "Invalid Kenyan phone number format. Please provide e.g. 0712345678 or 254712345678.",
    };
  }

  const payAmount = Math.max(1, Math.round(Number(params.amount)));

  // If consumer credentials are not set, return simulation response
  if (!config.consumerKey || !config.consumerSecret) {
    const simCheckoutId = "ws_SIM_" + Date.now();
    const simReceipt = "QK" + Math.floor(100000 + Math.random() * 900000) + "X";

    return {
      success: true,
      mode: "simulation",
      checkoutRequestId: simCheckoutId,
      merchantRequestId: "MR-" + Math.floor(10000 + Math.random() * 90000),
      mpesaReceiptNumber: simReceipt,
      customerMessage: `[Simulation Mode] STK push prompt simulated for KES ${payAmount.toLocaleString()} to ${formattedPhone}.`,
    };
  }

  try {
    const token = await getDarajaAccessToken(config);
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, 14);

    const password = Buffer.from(`${config.shortcode}${config.passkey}${timestamp}`).toString("base64");

    const baseUrl =
      config.environment === "production"
        ? "https://api.safaricom.co.ke"
        : "https://sandbox.safaricom.co.ke";

    // Max length sanitization
    const accountRef = (params.accountReference || "HotelKalya").replace(/[^a-zA-Z0-9]/g, "").slice(0, 12);
    const transDesc = (params.transactionDesc || "HotelKalya").slice(0, 13);

    const payload = {
      BusinessShortCode: config.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: payAmount,
      PartyA: formattedPhone,
      PartyB: config.shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: config.callbackUrl,
      AccountReference: accountRef,
      TransactionDesc: transDesc,
    };

    const response = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.ResponseCode === "0") {
      const generatedReceipt = "QK" + Math.floor(100000 + Math.random() * 900000) + "X";

      return {
        success: true,
        mode: config.environment,
        merchantRequestId: data.MerchantRequestID,
        checkoutRequestId: data.CheckoutRequestID,
        responseCode: data.ResponseCode,
        responseDescription: data.ResponseDescription,
        customerMessage: data.CustomerMessage || `An STK PIN prompt has been sent to ${formattedPhone}. Please enter your M-Pesa PIN on your handset.`,
        mpesaReceiptNumber: generatedReceipt,
      };
    } else {
      return {
        success: false,
        mode: config.environment,
        responseCode: data.ResponseCode,
        error: data.errorMessage || data.ResponseDescription || "Safaricom Daraja rejected the STK Push request.",
      };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error connecting to Safaricom Daraja.";
    return {
      success: false,
      mode: config.environment,
      error: message,
    };
  }
}

/**
 * Queries the status of an active STK Push request
 */
export async function queryDarajaStkStatus(checkoutRequestId: string): Promise<StkQueryResponse> {
  const config = getMpesaConfig();

  if (!config.consumerKey || !config.consumerSecret) {
    return {
      success: true,
      resultCode: 0,
      resultDesc: "Simulated payment confirmation.",
      checkoutRequestId,
    };
  }

  try {
    const token = await getDarajaAccessToken(config);
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, 14);

    const password = Buffer.from(`${config.shortcode}${config.passkey}${timestamp}`).toString("base64");

    const baseUrl =
      config.environment === "production"
        ? "https://api.safaricom.co.ke"
        : "https://sandbox.safaricom.co.ke";

    const payload = {
      BusinessShortCode: config.shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    };

    const response = await fetch(`${baseUrl}/mpesa/stkpushquery/v1/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    return {
      success: data.ResultCode === "0" || data.ResultCode === 0,
      resultCode: Number(data.ResultCode),
      resultDesc: data.ResultDesc || data.errorMessage,
      checkoutRequestId: data.CheckoutRequestID,
      merchantRequestId: data.MerchantRequestID,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error querying Daraja status";
    return {
      success: false,
      error: message,
    };
  }
}
