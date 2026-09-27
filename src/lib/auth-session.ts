import crypto from "crypto";
import { UserProfile } from "@/types";

// Cryptographic Secret for Server-Side Session Tokens
const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  "hotel_kalya_enterprise_session_hmac_secret_2026_kapenguria_secured";

const TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface SessionPayload {
  user: UserProfile;
  iat: number;
  exp: number;
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str, "utf8")
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf8");
}

function computeHmac(data: string): string {
  return crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(data)
    .digest("base64url");
}

/**
 * Signs a cryptographic session token with HMAC-SHA256.
 */
export function signSessionToken(user: UserProfile): string {
  const payload: SessionPayload = {
    user,
    iat: Date.now(),
    exp: Date.now() + TOKEN_EXPIRY_MS,
  };
  const payloadEncoded = base64UrlEncode(JSON.stringify(payload));
  const signature = computeHmac(payloadEncoded);
  return `${payloadEncoded}.${signature}`;
}

/**
 * Verifies a cryptographic session token and returns the authenticated UserProfile,
 * or null if missing, forged, or expired.
 */
export function verifySessionToken(token: string): UserProfile | null {
  if (!token || typeof token !== "string") return null;

  const parts = token.trim().split(".");
  if (parts.length !== 2) return null;

  const [payloadEncoded, signature] = parts;
  if (!payloadEncoded || !signature) return null;

  try {
    const expectedSignature = computeHmac(payloadEncoded);

    // Constant-time comparison to prevent timing attacks
    const sigBuffer = Buffer.from(signature, "utf8");
    const expectedBuffer = Buffer.from(expectedSignature, "utf8");

    if (sigBuffer.length !== expectedBuffer.length) return null;
    if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return null;

    const payloadJson = base64UrlDecode(payloadEncoded);
    const payload: SessionPayload = JSON.parse(payloadJson);

    // Expiration check
    if (!payload.exp || Date.now() > payload.exp) return null;
    if (!payload.user || !payload.user.id || !payload.user.role) return null;

    return payload.user;
  } catch {
    return null;
  }
}

/**
 * Extracts and verifies the authenticated user from an incoming HTTP request.
 * Prioritizes:
 * 1. "session" Cookie header (HttpOnly)
 * 2. "Authorization: Bearer <signed-token>"
 *
 * NOTE: Unauthenticated headers (x-user-role, x-user-id, etc.) are strictly rejected.
 */
export function getSessionUser(request: Request): UserProfile | null {
  // 1. Check Cookie header
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)session=([^;]+)/);
  if (match && match[1]) {
    const cookieUser = verifySessionToken(decodeURIComponent(match[1]));
    if (cookieUser) return cookieUser;
  }

  // 2. Check Authorization Bearer header
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.replace("Bearer ", "").trim();
    const bearerUser = verifySessionToken(token);
    if (bearerUser) return bearerUser;
  }

  return null;
}
