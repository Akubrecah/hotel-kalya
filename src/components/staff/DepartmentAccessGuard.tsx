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
        <div className="max-w-xl w-full bg-white rounded-3xl p-8 border border-red-200/80 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto text-red-600 shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full inline-block">
              HTTP 403 • Department Access Denied
            </span>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {access.routeName || "Restricted Department Workstation"}
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed max-w-md mx-auto">
              Under Hotel Kalya enterprise RBAC policies, this operational area is restricted to{" "}
              <strong className="text-gray-900">
                {access.department ? DEPARTMENTS[access.department]?.name : "authorized department staff"}
              </strong>.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/70 text-left space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center text-gray-500 pb-1 border-b border-gray-200">
              <span>Your Staff Account</span>
              <span className="font-bold text-gray-800">{user.name}</span>
            </div>
            <div className="flex justify-between items-center text-gray-500 pb-1 border-b border-gray-200">
              <span>Assigned Department</span>
              <span className="font-bold text-gray-800">{userDept}</span>
            </div>
            <div className="flex justify-between items-center text-gray-500 pb-1 border-b border-gray-200">
              <span>Current Role</span>
              <span className="font-bold text-gray-800">{userRole}</span>
            </div>
            <div className="flex justify-between items-center text-red-600">
              <span>Required Permission</span>
              <span className="font-bold">{access.requiredPermission}</span>
            </div>
          </div>

          {matchingAddtlDept ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-left space-y-3">
              <div className="flex items-center gap-2 text-amber-900 text-xs font-bold">
                <Building2 className="w-4 h-4 text-amber-700" />
                <span>Authorized Cross-Department Workspace Available</span>
              </div>
              <p className="text-[11px] text-amber-800">
                You are registered with secondary access to <strong>{matchingAddtlDept}</strong>. Switch to this workspace to access this module.
              </p>
              <button
                type="button"
                onClick={() => {
                  switchWorkspaceDepartment(matchingAddtlDept);
                  router.refresh();
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md transition-all"
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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 transition-colors"
            >
              <KeyRound className="w-4 h-4" />
              <span>View My Permissions</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
