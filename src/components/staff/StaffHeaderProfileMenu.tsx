"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  User,
  ShieldCheck,
  ExternalLink,
  LogOut,
  ChevronDown,
  Layers,
  Sparkles,
  Check,
  RefreshCw,
  Clock,
  KeyRound,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface StaffHeaderProfileMenuProps {
  currentRoleObj: {
    code: string;
    label: string;
    dept: string;
    name: string;
  };
  onOpenRoleSwitcher: () => void;
  onOpenAdminDetails?: () => void;
}

export function StaffHeaderProfileMenu({
  currentRoleObj,
  onOpenRoleSwitcher,
  onOpenAdminDetails,
}: StaffHeaderProfileMenuProps) {
  const { user, logout, switchWorkspaceDepartment } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
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

  // Close on Escape key
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

  const effectiveRole = (
    user.staffRole || (user.role === "admin" ? "ADMIN" : "RECEPTIONIST")
  ).toUpperCase();
  const isAdminOrManager =
    user.role === "admin" ||
    effectiveRole === "ADMIN" ||
    effectiveRole === "MANAGER";

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button: Sleek Luxury Identity Pill */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl border transition-all duration-200 select-none text-left",
          isOpen
            ? "bg-brand-maroon/10 border-brand-maroon/30 shadow-md ring-2 ring-brand-maroon/15"
            : "bg-white hover:bg-brand-cream border-brand-maroon/15 shadow-xs hover:border-brand-maroon/30"
        )}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {/* Staff Avatar with Status Badge */}
        <div className="relative">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-maroon to-brand-maroon-dark text-brand-amber font-serif font-black flex items-center justify-center text-sm shadow-xs border border-brand-amber/30">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
        </div>

        {/* Text Metadata */}
        <div className="hidden xl:block min-w-0 max-w-[130px]">
          <p className="text-xs font-bold text-brand-dark truncate leading-tight">
            {user.name}
          </p>
          <p className="text-[10px] text-brand-maroon font-semibold truncate leading-tight mt-0.5">
            {currentRoleObj.label}
          </p>
        </div>

        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-brand-maroon/40 transition-transform duration-200",
            isOpen && "rotate-180 text-brand-maroon"
          )}
        />
      </button>

      {/* Dropdown Menu Pane */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-3xl shadow-2xl border border-brand-maroon/15 py-3 z-50 animate-in fade-in zoom-in-95 duration-150 text-brand-dark">
          {/* Header Card inside Dropdown */}
          <div className="px-4 py-3 border-b border-brand-maroon/10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-maroon to-brand-maroon-dark text-brand-amber font-serif font-black flex items-center justify-center text-lg shadow-md border border-brand-amber/40 shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-brand-dark truncate font-serif">
                  {user.name}
                </p>
                {isAdminOrManager && (
                  <span className="px-1.5 py-0.5 rounded-md bg-brand-maroon/10 text-brand-maroon text-[9px] font-black uppercase tracking-wider shrink-0">
                    Lead
                  </span>
                )}
              </div>
              <p className="text-xs text-brand-dark/60 truncate">{user.email}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                  Active On Duty • {currentRoleObj.dept}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Department / Station Switcher (If multi-assigned) */}
          {user.additionalDepartments && user.additionalDepartments.length > 0 && (
            <div className="px-4 py-2.5 border-b border-brand-maroon/10 bg-brand-cream/60">
              <span className="text-[10px] uppercase font-bold text-brand-maroon tracking-wider flex items-center gap-1 mb-1.5">
                <Layers className="w-3 h-3 text-brand-amber-dark" />
                <span>Switch Active Department</span>
              </span>
              <div className="space-y-1">
                {[user.department || "Operations", ...user.additionalDepartments].map(
                  (dept) => {
                    const isCurrent =
                      (user.activeWorkspaceDepartment || user.department) === dept;
                    return (
                      <button
                        key={dept}
                        type="button"
                        onClick={() => {
                          switchWorkspaceDepartment(dept);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between",
                          isCurrent
                            ? "bg-brand-maroon text-white font-bold shadow-xs"
                            : "hover:bg-white text-brand-dark"
                        )}
                      >
                        <span className="truncate">{dept}</span>
                        {isCurrent && (
                          <Check className="w-3.5 h-3.5 text-brand-amber" />
                        )}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {/* Primary Quick Actions */}
          <div className="p-2 space-y-1">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenRoleSwitcher();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-brand-maroon bg-brand-amber/15 hover:bg-brand-amber/25 border border-brand-amber/30 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-brand-amber-dark" />
              <span>Simulate Another Duty Persona</span>
            </button>

            {isAdminOrManager && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-brand-maroon hover:bg-brand-cream transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-brand-amber-dark" />
                  <span>Executive Admin Console</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-brand-amber-dark">
                  Open Desk →
                </span>
              </Link>
            )}

            <Link
              href="/staff/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-brand-dark hover:bg-brand-cream transition-colors"
            >
              <User className="w-4 h-4 text-brand-maroon/60" />
              <span>Shift Duties &amp; Profile</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-brand-dark hover:bg-brand-cream transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ExternalLink className="w-4 h-4 text-brand-amber-dark" />
                <span>View Public Guest Site</span>
              </div>
              <span className="text-[10px] text-brand-dark/50">hotelkalya.com</span>
            </Link>

            {onOpenAdminDetails && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenAdminDetails();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-brand-dark/60 hover:bg-brand-cream transition-colors"
              >
                <KeyRound className="w-4 h-4 text-brand-amber-dark" />
                <span>Demo Credentials Reference</span>
              </button>
            )}
          </div>

          {/* Footer Action: Sign Out */}
          <div className="p-2 border-t border-brand-maroon/10 mt-1">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Workstation</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
