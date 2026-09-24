"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile } from "@/types";

export const DEMO_ACCOUNTS: Record<string, UserProfile> = {
  admin: {
    id: "staff_sarah_01",
    name: "Sarah Rotich",
    email: "admin@hotelkalya.com",
    phone: "+254 719 766649",
    role: "admin",
    staffRole: "ADMIN",
    department: "Executive Management",
    createdAt: "2026-08-01T08:00:00Z",
  },
  receptionist: {
    id: "staff_dennis_01",
    name: "Dennis Kiplagat",
    email: "reception@hotelkalya.com",
    phone: "+254 712 998877",
    role: "staff",
    staffRole: "RECEPTIONIST",
    department: "Front Office",
    createdAt: "2026-08-15T08:00:00Z",
  },
  housekeeping: {
    id: "staff_limo_01",
    name: "Denis Limo",
    email: "housekeeping@hotelkalya.com",
    phone: "+254 723 445566",
    role: "staff",
    staffRole: "HOUSEKEEPING",
    department: "Housekeeping",
    createdAt: "2026-08-20T08:00:00Z",
  },
  waiter: {
    id: "staff_faith_01",
    name: "Faith Jepchirchir",
    email: "waiter@hotelkalya.com",
    phone: "+254 734 556677",
    role: "staff",
    staffRole: "WAITER",
    department: "Food & Beverage",
    createdAt: "2026-08-22T08:00:00Z",
  },
  chef: {
    id: "staff_patrick_01",
    name: "Chef Patrick Mwangi",
    email: "kitchen@hotelkalya.com",
    phone: "+254 745 667788",
    role: "staff",
    staffRole: "CHEF",
    department: "Kitchen Operations",
    createdAt: "2026-08-10T08:00:00Z",
  },
  event_coordinator: {
    id: "staff_kevin_01",
    name: "Kevin Lokor",
    email: "events@hotelkalya.com",
    phone: "+254 756 778899",
    role: "staff",
    staffRole: "EVENT_COORDINATOR",
    department: "Events & Conferences",
    createdAt: "2026-08-18T08:00:00Z",
  },
  catering: {
    id: "staff_grace_01",
    name: "Grace Chepkorir",
    email: "catering@hotelkalya.com",
    phone: "+254 767 889900",
    role: "staff",
    staffRole: "CATERING_STAFF",
    department: "Outside Catering",
    createdAt: "2026-08-25T08:00:00Z",
  },
  guest: {
    id: "user_kalya_demo_01",
    name: "James Chemosit",
    email: "guest@hotelkalya.com",
    phone: "+254 712 345678",
    role: "guest",
    dietaryPreferences: ["Halal", "Local Cuisine"],
    createdAt: "2026-09-01T10:00:00Z",
  },
};

export interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isLoaded: boolean;
  activeStaffRole: string;
  setActiveStaffRole: (role: string) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (details: Partial<UserProfile>) => Promise<void>;
  switchAccount: (accountKey: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "hotel_kalya_auth_user";
const ROLE_STORAGE_KEY = "hotel_kalya_active_staff_role";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize user as null identically on SSR and first client render to guarantee zero hydration mismatch
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeStaffRole, setActiveStaffRoleState] = useState<string>("RECEPTIONIST");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Hydrate session client-side after initial mount asynchronously
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      if (cancelled) return;
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsed: UserProfile = JSON.parse(stored);
          setUser(parsed);
          const resolvedRole = parsed.staffRole || (parsed.role === "admin" ? "ADMIN" : "RECEPTIONIST");
          setActiveStaffRoleState(resolvedRole);
        }
      } catch (e) {
        console.error("Failed to load auth user from localStorage", e);
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

  const switchAccount = (accountKey: string) => {
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
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (!email || !password) {
        return { success: false, error: "Please provide both email and password." };
      }

      if (password.length < 4) {
        return { success: false, error: "Password must be at least 4 characters long." };
      }

      const lowerEmail = email.toLowerCase().trim();
      let matchedUser: UserProfile | null = null;

      for (const key of Object.keys(DEMO_ACCOUNTS)) {
        if (DEMO_ACCOUNTS[key].email.toLowerCase() === lowerEmail) {
          matchedUser = DEMO_ACCOUNTS[key];
          break;
        }
      }

      if (!matchedUser) {
        matchedUser = {
          id: "usr_" + Math.random().toString(36).substring(2, 9),
          name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
          email: lowerEmail,
          role: lowerEmail.includes("admin") ? "admin" : lowerEmail.includes("staff") ? "staff" : "guest",
          staffRole: lowerEmail.includes("admin") ? "ADMIN" : undefined,
          createdAt: new Date().toISOString(),
        };
      }

      setUser(matchedUser);
      if (matchedUser.staffRole) {
        setActiveStaffRole(matchedUser.staffRole);
      }
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(matchedUser));
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
      await new Promise((resolve) => setTimeout(resolve, 300));

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
      localStorage.removeItem(ROLE_STORAGE_KEY);
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
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoaded,
        activeStaffRole,
        setActiveStaffRole,
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
