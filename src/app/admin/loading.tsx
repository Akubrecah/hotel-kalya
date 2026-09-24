import React from "react";
import { LayoutDashboard } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse max-w-7xl mx-auto">
      {/* Top Banner Skeleton */}
      <div className="h-28 w-full bg-brand-maroon/20 rounded-3xl" />

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
            <div className="flex justify-between">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-8 w-8 bg-gray-100 rounded-xl" />
            </div>
            <div className="h-8 w-20 bg-gray-300 rounded" />
            <div className="h-3 w-32 bg-gray-100 rounded" />
          </div>
        ))}
      </div>

      {/* Tables Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 w-full bg-gray-50 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 w-full bg-gray-50 rounded-xl" />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-400 py-2">
        <LayoutDashboard className="w-4 h-4 text-brand-maroon animate-spin" />
        <span>Synchronizing Front-Desk operations console...</span>
      </div>
    </div>
  );
}
