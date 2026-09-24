import React from "react";
import { Bed } from "lucide-react";

export default function RoomsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-3 max-w-xl">
        <div className="h-6 w-32 bg-brand-amber/20 rounded-full" />
        <div className="h-10 w-72 bg-gray-200 rounded-xl" />
        <div className="h-4 w-96 bg-gray-100 rounded-lg" />
      </div>

      {/* Filter pills skeleton */}
      <div className="flex gap-2 overflow-hidden py-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-28 bg-gray-200 rounded-full flex-shrink-0" />
        ))}
      </div>

      {/* Rooms grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden space-y-4 pb-6">
            <div className="h-56 w-full bg-gray-200" />
            <div className="px-6 space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-6 w-40 bg-gray-200 rounded" />
                <div className="h-6 w-20 bg-brand-amber/30 rounded" />
              </div>
              <div className="h-3 w-full bg-gray-100 rounded" />
              <div className="h-3 w-4/5 bg-gray-100 rounded" />
              <div className="flex gap-2 pt-2">
                <div className="h-7 w-20 bg-gray-100 rounded-lg" />
                <div className="h-7 w-20 bg-gray-100 rounded-lg" />
                <div className="h-7 w-20 bg-gray-100 rounded-lg" />
              </div>
              <div className="h-12 w-full bg-brand-maroon/20 rounded-xl mt-4" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-400 py-4">
        <Bed className="w-4 h-4 text-brand-amber animate-pulse" />
        <span>Loading accommodation catalogue &amp; suite availability...</span>
      </div>
    </div>
  );
}
