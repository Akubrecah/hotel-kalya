"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  dark = false,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative w-full max-w-lg rounded-2xl p-6 shadow-2xl transition-all animate-in zoom-in-95 duration-200",
          dark
            ? "bg-[#141417] border border-[#2A2A32] text-white"
            : "bg-white border border-gray-200 text-brand-dark",
          className
        )}
      >
        <button
          onClick={onClose}
          className={cn(
            "absolute right-4 top-4 p-1.5 rounded-lg transition-colors",
            dark
              ? "text-neutral-400 hover:text-white hover:bg-neutral-800"
              : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          )}
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {title && (
          <div className="mb-4 pr-6">
            <h3
              className={cn(
                "font-serif text-xl font-bold",
                dark ? "text-white" : "text-brand-maroon-dark"
              )}
            >
              {title}
            </h3>
            {description && (
              <p
                className={cn(
                  "text-xs sm:text-sm mt-1",
                  dark ? "text-neutral-400" : "text-gray-600"
                )}
              >
                {description}
              </p>
            )}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
