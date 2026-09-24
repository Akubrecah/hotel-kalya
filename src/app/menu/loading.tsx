import React from "react";
import { Utensils } from "lucide-react";

export default function MenuLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-3 max-w-xl">
        <div className="h-6 w-32 bg-brand-amber/20 rounded-full" />
        <div className="h-10 w-64 bg-gray-200 rounded-xl" />
        <div className="h-4 w-96 bg-gray-100 rounded-lg" />
      </div>

      {/* Categories skeleton */}
      <div className="flex gap-2 overflow-hidden py-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-10 w-28 bg-gray-200 rounded-full flex-shrink-0" />
        ))}
      </div>

      {/* Menu items grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-4">
            <div className="h-44 w-full bg-gray-200 rounded-xl" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="h-5 w-36 bg-gray-200 rounded" />
                <div className="h-5 w-16 bg-brand-amber/30 rounded" />
              </div>
              <div className="h-3 w-full bg-gray-100 rounded" />
              <div className="h-3 w-4/5 bg-gray-100 rounded" />
            </div>
            <div className="h-10 w-full bg-gray-100 rounded-xl" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-400 py-4">
        <Utensils className="w-4 h-4 text-brand-amber animate-spin" />
        <span>Loading farm-to-table culinary menu...</span>
      </div>
    </div>
  );
}
