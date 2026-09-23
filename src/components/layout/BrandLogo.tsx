"use client";

import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  light?: boolean;
}

export function BrandLogo({ className, light = false }: BrandLogoProps) {
  return (
    <div className={cn("flex items-center gap-3 select-none", className)}>
      {/* Hexagon with Dove and HK monogram */}
      <div className="relative flex-shrink-0 w-11 h-12 flex items-center justify-center">
        <svg viewBox="0 0 100 115" className="w-full h-full drop-shadow-sm">
          {/* Hexagon border matching the brochure */}
          <polygon
            points="50 3, 97 28, 97 87, 50 112, 3 87, 3 28"
            fill={light ? "#7C1322" : "#F2AE1C"}
            stroke={light ? "#F2AE1C" : "#7C1322"}
            strokeWidth="6"
            strokeLinejoin="round"
          />
          {/* Dove / Bird silhouette — peace & welcoming hospitality */}
          <path
            d="M 50,22 C 54,18 63,16 68,20 C 65,23 60,25 56,26 C 62,26 69,27 71,31 C 66,33 58,32 53,33 C 51,35 48,37 45,39 C 42,37 38,36 34,35 C 37,33 43,32 46,30 C 42,28 35,26 38,22 C 43,24 47,25 50,22 Z"
            fill={light ? "#F2AE1C" : "#7C1322"}
          />
          {/* HK Monogram */}
          <text
            x="50"
            y="78"
            textAnchor="middle"
            fontFamily="serif"
            fontWeight="bold"
            fontSize="42"
            fill={light ? "#F2AE1C" : "#7C1322"}
            letterSpacing="1"
          >
            HK
          </text>
        </svg>
      </div>

      {/* Brand typography with tagline */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "font-serif tracking-wider font-extrabold text-lg sm:text-xl",
              light ? "text-white" : "text-brand-maroon"
            )}
          >
            HOTEL
          </span>
          <span
            className={cn(
              "font-serif tracking-wider font-extrabold text-lg sm:text-xl",
              light ? "text-brand-amber" : "text-brand-amber-dark"
            )}
          >
            KALYA
          </span>
        </div>
        <span
          className={cn(
            "text-[9px] uppercase tracking-[0.22em] font-semibold",
            light ? "text-brand-amber-light" : "text-brand-maroon/80"
          )}
        >
          HOSPITALITY REDEFINED
        </span>
        <span className="text-[8.5px] uppercase tracking-[0.16em] font-medium text-brand-sage">
          KAPENGURIA • WEST POKOT
        </span>
      </div>
    </div>
  );
}
