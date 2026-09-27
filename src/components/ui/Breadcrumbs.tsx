import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  dark?: boolean;
}

export function Breadcrumbs({ items, className = "", dark = false }: BreadcrumbsProps) {
  // Safeguard: Filter out any redundant 'Home' entry passed by caller
  const sanitizedItems = items.filter(
    (item) => item.label.toLowerCase() !== "home" && item.href !== "/"
  );

  return (
    <div className={cn("w-full", dark ? "bg-[#09090B]" : "bg-transparent")}>
      <nav
        aria-label="Breadcrumb"
        className={cn(
          "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs font-medium",
          dark ? "text-neutral-400" : "text-gray-500",
          className
        )}
      >
        <ol
          className="flex flex-wrap items-center gap-1.5 sm:gap-2"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          {/* Home Root */}
          <li
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="flex items-center gap-1.5"
          >
            <Link
              href="/"
              itemProp="item"
              className={cn(
                "flex items-center gap-1 transition-colors",
                dark
                  ? "text-neutral-400 hover:text-brand-amber"
                  : "text-gray-500 hover:text-brand-maroon"
              )}
            >
              <Home className="w-3.5 h-3.5 text-brand-amber flex-shrink-0" />
              <span itemProp="name" className="sr-only sm:not-sr-only">
                Home
              </span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>

          {sanitizedItems.map((item, index) => {
            const isLast = index === sanitizedItems.length - 1;
            const position = index + 2;

            return (
              <li
                key={`${item.label}-${index}`}
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
                className="flex items-center gap-1.5 sm:gap-2"
              >
                <ChevronRight
                  className={cn(
                    "w-3 h-3 flex-shrink-0",
                    dark ? "text-neutral-600" : "text-gray-400"
                  )}
                />

                {isLast || !item.href ? (
                  <span
                    itemProp="name"
                    aria-current="page"
                    className={cn(
                      "font-bold px-2 py-0.5 rounded",
                      dark
                        ? "text-brand-amber bg-neutral-900 border border-neutral-800"
                        : "text-brand-maroon-dark bg-brand-amber-light/40"
                    )}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    itemProp="item"
                    className={cn(
                      "transition-colors",
                      dark
                        ? "text-neutral-300 hover:text-brand-amber"
                        : "text-gray-600 hover:text-brand-maroon"
                    )}
                  >
                    <span itemProp="name">{item.label}</span>
                  </Link>
                )}
                <meta itemProp="position" content={String(position)} />
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
