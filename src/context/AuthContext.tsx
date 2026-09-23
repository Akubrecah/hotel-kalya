"use client";

import React, { createContext, useContext, useState } from "react";
import { UserProfile } from "@/types";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (details: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "hotel_kalya_auth_user";

// Pre-seeded demo user for immediate review/testing
const DEMO_USER: UserProfile = {
  id: "user_kalya_demo_01",
  name: "James Chemosit",
  email: "guest@hotelkalya.com",
  phone: "+254 712 345678",
  role: "guest",
  dietaryPreferences: ["Halal", "Local Cuisine"],
  createdAt: "2026-09-01T10:00:00Z",
};

// Front-desk & operations manager account
const DEMO_ADMIN: UserProfile = {
  id: "user_kalya_admin_01",
  name: "Sarah Rotich (Duty Manager)",
  email: "admin@hotelkalya.com",
  phone: "+254 719 766649",
  role: "staff",
  createdAt: "2026-08-01T08:00:00Z",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // Simulate network verification delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (!email || !password) {
        return { success: false, error: "Please provide both email and password." };
      }

      // Check if password has minimum length
      if (password.length < 6) {
        return { success: false, error: "Password must be at least 6 characters long." };
      }

      // If demo admin, demo user or saved credentials
      let authenticatedUser: UserProfile;
      if (email.toLowerCase() === DEMO_ADMIN.email.toLowerCase()) {
        authenticatedUser = DEMO_ADMIN;
      } else if (email.toLowerCase() === DEMO_USER.email.toLowerCase()) {
        authenticatedUser = DEMO_USER;
      } else {
        authenticatedUser = {
          id: "usr_" + Math.random().toString(36).substring(2, 9),
          name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
          email: email.toLowerCase(),
          role: "guest",
          createdAt: new Date().toISOString(),
        };
      }

      setUser(authenticatedUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser));
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
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (!name || !email || !password) {
        return { success: false, error: "All required fields must be filled." };
      }

      if (password.length < 6) {
        return { success: false, error: "Password must be at least 6 characters long." };
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
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed.";
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const updateProfile = async (details: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...details };
    setUser(updated);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
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
