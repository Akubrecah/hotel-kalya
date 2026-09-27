"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, ArrowRight, Lock, KeyRound, Building2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { canAccessRoute, DEPARTMENTS, DepartmentCode } from "@/lib/rbac";

export function DepartmentAccessGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoaded, switchWorkspaceDepartment } = useAuth();

  if (!isLoaded || !user) {
    return <>{children}</>;
  }

  const access = canAccessRoute(user, pathname);

  if (!access.allowed) {
    const userRole = user.staffRole || (user.role === "admin" ? "ADMIN" : "STAFF");
    const userDept = user.department || "General Staff";

    // Check if user has an additional department that would authorize this route
    const matchingAddtlDept = user.additionalDepartments?.find((dept) => {
      const simulatedUser = { ...user, department: dept, activeWorkspaceDepartment: dept };
      return canAccessRoute(simulatedUser, pathname).allowed;
    });

    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white rounded-3xl p-8 border border-brand-maroon/15 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-maroon/10 border border-brand-maroon/20 flex items-center justify-center mx-auto text-brand-maroon shadow-inner">
            <ShieldAlert className="w-8 h-8 text-brand-maroon" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-brand-maroon bg-brand-maroon/10 border border-brand-maroon/20 px-3 py-1 rounded-full inline-block">
              HTTP 403 • Department Access Denied
            </span>
            <h2 className="text-2xl font-serif font-black text-brand-dark tracking-tight">
              {access.routeName || "Restricted Department Workstation"}
            </h2>
            <p className="text-xs text-brand-dark/70 leading-relaxed max-w-md mx-auto">
              Under Hotel Kalya enterprise RBAC policies, this operational area is restricted to{" "}
              <strong className="text-brand-dark font-bold">
                {access.department ? DEPARTMENTS[access.department]?.name : "authorized department staff"}
              </strong>.
            </p>
          </div>

          <div className="bg-brand-cream rounded-2xl p-4 border border-brand-maroon/15 text-left space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center text-brand-dark/60 pb-1 border-b border-brand-maroon/10">
              <span>Your Staff Account</span>
              <span className="font-bold text-brand-dark">{user.name}</span>
            </div>
            <div className="flex justify-between items-center text-brand-dark/60 pb-1 border-b border-brand-maroon/10">
              <span>Assigned Department</span>
              <span className="font-bold text-brand-dark">{userDept}</span>
            </div>
            <div className="flex justify-between items-center text-brand-dark/60 pb-1 border-b border-brand-maroon/10">
              <span>Current Role</span>
              <span className="font-bold text-brand-dark">{userRole}</span>
            </div>
            <div className="flex justify-between items-center text-brand-maroon">
              <span>Required Permission</span>
              <span className="font-bold">{access.requiredPermission}</span>
            </div>
          </div>

          {matchingAddtlDept ? (
            <div className="p-4 bg-brand-amber/10 border border-brand-amber/30 rounded-2xl text-left space-y-3">
              <div className="flex items-center gap-2 text-brand-dark text-xs font-bold">
                <Building2 className="w-4 h-4 text-brand-amber-dark" />
                <span className="font-serif font-bold">Authorized Cross-Department Workspace Available</span>
              </div>
              <p className="text-[11px] text-brand-dark/80">
                You are registered with secondary access to <strong>{matchingAddtlDept}</strong>. Switch to this workspace to access this module.
              </p>
              <button
                type="button"
                onClick={() => {
                  switchWorkspaceDepartment(matchingAddtlDept);
                  router.refresh();
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-amber hover:bg-brand-amber-dark text-brand-maroon font-extrabold text-xs shadow-md transition-all"
              >
                <span>Switch to {matchingAddtlDept} Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : null}

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/staff/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-maroon text-white font-extrabold text-xs uppercase tracking-wider hover:bg-brand-maroon-dark transition-all shadow-md"
            >
              <ArrowLeft className="w-4 h-4 text-brand-amber" />
              <span>Return to My Dashboard</span>
            </Link>
            <Link
              href="/staff/profile"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-cream border border-brand-maroon/20 text-brand-dark font-bold text-xs hover:bg-white transition-colors"
            >
              <KeyRound className="w-4 h-4 text-brand-maroon" />
              <span>View My Permissions</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
