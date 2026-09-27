"use client";

import { UserProfile } from "@/types";

const AUTH_STORAGE_KEY = "hotel_kalya_auth_user";
const AUTH_TOKEN_KEY = "hotel_kalya_auth_token";

/**
 * Gets the current authenticated staff user from localStorage if in client environment.
 */
export function getStoredAuthUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

/**
 * Gets the current cryptographically signed session token from localStorage.
 */
export function getStoredAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Enhanced fetch wrapper for staff and admin endpoints that automatically
 * includes authenticated session credentials and Bearer token.
 */
export async function staffFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const token = getStoredAuthToken();
  const headers = new Headers(init?.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(input, {
    ...init,
    headers,
    credentials: "include", // Transmit HttpOnly session cookie
  });
}
