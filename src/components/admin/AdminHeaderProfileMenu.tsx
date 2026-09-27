"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ExternalLink,
  LogOut,
  ChevronDown,
  Users,
  Settings,
  History,
  KeyRound,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export function AdminHeaderProfileMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger: Executive Identity Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl border transition-all duration-200 select-none text-left",
          isOpen
            ? "bg-brand-maroon/10 border-brand-maroon/30 shadow-md ring-2 ring-brand-maroon/15"
            : "bg-white hover:bg-gray-50 border-gray-200/90 shadow-2xs hover:border-brand-maroon/20 hover:shadow-xs"
        )}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="relative">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-maroon to-[#1E0B0F] text-brand-amber font-serif font-black flex items-center justify-center text-sm shadow-xs border border-brand-amber/30">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
        </div>

        <div className="hidden xl:block min-w-0 max-w-[130px]">
          <p className="text-xs font-bold text-gray-900 truncate leading-tight">
            {user.name}
          </p>
          <p className="text-[10px] text-brand-amber-dark font-black uppercase tracking-wider truncate leading-tight mt-0.5">
            Executive Admin
          </p>
        </div>

        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-gray-400 transition-transform duration-200",
            isOpen && "rotate-180 text-brand-maroon"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-gray-200/90 py-3 z-50 animate-in fade-in zoom-in-95 duration-150 text-gray-800">
          {/* Executive User Card */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-maroon to-[#1A070B] text-brand-amber font-serif font-black flex items-center justify-center text-lg shadow-md border border-brand-amber/40 shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {user.name}
                </p>
                <span className="px-1.5 py-0.5 rounded-md bg-brand-maroon text-white text-[9px] font-black uppercase tracking-wider shrink-0">
                  Admin
                </span>
              </div>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                  Full Platform Authority
                </span>
              </div>
            </div>
          </div>

          {/* Quick Admin Actions */}
          <div className="p-2 space-y-1">
            <Link
              href="/staff/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-brand-maroon bg-brand-cream/60 hover:bg-brand-cream transition-colors border border-brand-maroon/10"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-brand-amber-dark" />
                <span>Switch to Staff Operations Portal</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-brand-maroon">
                Open →
              </span>
            </Link>

            <Link
              href="/admin/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-500" />
              <span>Hotel Brand &amp; System Settings</span>
            </Link>

            <Link
              href="/admin/roles"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <KeyRound className="w-4 h-4 text-gray-500" />
              <span>Roles &amp; Access Control (RBAC)</span>
            </Link>

            <Link
              href="/admin/audit-log"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <History className="w-4 h-4 text-gray-500" />
              <span>System Audit Logs &amp; Activity</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ExternalLink className="w-4 h-4 text-gray-500" />
                <span>View Live Guest Website</span>
              </div>
              <span className="text-[10px] text-gray-400">hotelkalya.com</span>
            </Link>
          </div>

          {/* Footer Action: Sign Out */}
          <div className="p-2 border-t border-gray-100 mt-1">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Admin Console</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
