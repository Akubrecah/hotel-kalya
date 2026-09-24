"use client";

import { UserProfile } from "@/types";

const AUTH_STORAGE_KEY = "hotel_kalya_auth_user";

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
 * Enhanced fetch wrapper for staff and admin endpoints that automatically
 * injects user identification, role, department, and permissions headers.
 */
export async function staffFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const user = getStoredAuthUser();
  const headers = new Headers(init?.headers);

  if (user) {
    headers.set("x-user-id", user.id);
    headers.set("x-user-name", user.name);
    headers.set("x-user-role", user.role);
    if (user.staffRole) headers.set("x-user-staff-role", user.staffRole);
    const effectiveDept = user.activeWorkspaceDepartment || user.department;
    if (effectiveDept) headers.set("x-user-department", effectiveDept);
    if (user.permissions && Array.isArray(user.permissions)) {
      headers.set("x-user-permissions", JSON.stringify(user.permissions));
    }
    // Base64 encoded payload for bearer token compatibility
    try {
      const token = btoa(unescape(encodeURIComponent(JSON.stringify(user))));
      headers.set("Authorization", `Bearer ${token}`);
    } catch {
      // ignore
    }
  }

  return fetch(input, {
    ...init,
    headers,
  });
}
