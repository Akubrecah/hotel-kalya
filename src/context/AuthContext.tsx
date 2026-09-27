"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile } from "@/types";

import { DEMO_ACCOUNTS } from "@/lib/auth-accounts";
export { DEMO_ACCOUNTS };

export interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isLoaded: boolean;
  activeStaffRole: string;
  setActiveStaffRole: (role: string) => void;
  switchWorkspaceDepartment: (department: string) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (details: Partial<UserProfile>) => Promise<void>;
  switchAccount: (accountKey: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "hotel_kalya_auth_user";
const AUTH_TOKEN_KEY = "hotel_kalya_auth_token";
const ROLE_STORAGE_KEY = "hotel_kalya_active_staff_role";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize user as null identically on SSR and first client render to guarantee zero hydration mismatch
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeStaffRole, setActiveStaffRoleState] = useState<string>("RECEPTIONIST");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Helper to establish server session cookie and token
  const establishServerSession = async (userProfile: UserProfile): Promise<string | null> => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({ user: userProfile }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        return data.token;
      }
    } catch (e) {
      console.error("Failed to establish server session:", e);
    }
    return null;
  };

  // Hydrate session client-side after initial mount asynchronously
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      if (cancelled) return;
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsed: UserProfile = JSON.parse(stored);
          setUser(parsed);
          const resolvedRole = parsed.staffRole || (parsed.role === "admin" ? "ADMIN" : "RECEPTIONIST");
          setActiveStaffRoleState(resolvedRole);
        }
        // Verify with server session
        const sRes = await fetch("/api/auth/session", { credentials: "include" });
        if (sRes.ok) {
          const sData = await sRes.json();
          if (sData.success && sData.user) {
            setUser(sData.user);
            const resolvedRole = sData.user.staffRole || (sData.user.role === "admin" ? "ADMIN" : "RECEPTIONIST");
            setActiveStaffRoleState(resolvedRole);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sData.user));
          }
        }
      } catch (e) {
        console.error("Failed to load auth user", e);
      } finally {
        setIsLoaded(true);
      }
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  const setActiveStaffRole = (role: string) => {
    setActiveStaffRoleState(role);
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, role);
    } catch {
      // ignore
    }
  };

  const switchWorkspaceDepartment = (dept: string) => {
    if (!user) return;
    const updated = { ...user, activeWorkspaceDepartment: dept };
    setUser(updated);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    establishServerSession(updated).catch(() => {});
  };

  const switchAccount = async (accountKey: string) => {
    const acc = DEMO_ACCOUNTS[accountKey];
    if (acc) {
      setUser(acc);
      const role = acc.staffRole || (acc.role === "admin" ? "ADMIN" : "RECEPTIONIST");
      setActiveStaffRoleState(role);
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(acc));
        localStorage.setItem(ROLE_STORAGE_KEY, role);
      } catch {
        // ignore
      }
      try {
        const res = await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ accountKey }),
        });
        const data = await res.json();
        if (data.success && data.token) {
          localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        }
      } catch (e) {
        console.error("Failed to switch account on server:", e);
      }
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (!email || !password) {
        return { success: false, error: "Please provide both email and password." };
      }

      if (password.length < 4) {
        return { success: false, error: "Password must be at least 4 characters long." };
      }

      // Call server login endpoint to establish signed session cookie
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!data.success || !data.user) {
        return { success: false, error: data.error || "Authentication failed." };
      }

      const matchedUser: UserProfile = data.user;
      setUser(matchedUser);
      if (matchedUser.staffRole) {
        setActiveStaffRole(matchedUser.staffRole);
      }

      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(matchedUser));
        if (data.token) {
          localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        }
      } catch {
        // ignore
      }

      return { success: true };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Authentication failed.";
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (!name || !email || !password) {
        return { success: false, error: "All required fields must be filled." };
      }

      const newUser: UserProfile = {
        id: "usr_" + Math.random().toString(36).substring(2, 9),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone?.trim(),
        role: "guest",
        createdAt: new Date().toISOString(),
      };

      setUser(newUser);
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
      } catch {
        // ignore
      }

      try {
        const res = await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ isGuestRegistration: true, user: newUser }),
        });
        const data = await res.json();
        if (data.success && data.token) {
          localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        }
      } catch (e) {
        console.error("Failed to register session cookie:", e);
      }
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Signup failed.";
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    setActiveStaffRoleState("RECEPTIONIST");
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(ROLE_STORAGE_KEY);
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
  };

  const updateProfile = async (details: Partial<UserProfile>): Promise<void> => {
    if (!user) return;
    const updated = { ...user, ...details };
    setUser(updated);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    await establishServerSession(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoaded,
        activeStaffRole,
        setActiveStaffRole,
        switchWorkspaceDepartment,
        login,
        signup,
        logout,
        updateProfile,
        switchAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
