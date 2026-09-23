import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`py-3 text-xs font-medium text-gray-500 ${className}`}
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
            className="flex items-center gap-1 text-gray-500 hover:text-brand-maroon transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-brand-amber flex-shrink-0" />
            <span itemProp="name" className="sr-only sm:not-sr-only">
              Home
            </span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const position = index + 2;

          return (
            <li
              key={`${item.label}-${index}`}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              className="flex items-center gap-1.5 sm:gap-2"
            >
              <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />

              {isLast || !item.href ? (
                <span
                  itemProp="name"
                  aria-current="page"
                  className="font-bold text-brand-maroon-dark bg-brand-amber-light/40 px-2 py-0.5 rounded"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  itemProp="item"
                  className="text-gray-600 hover:text-brand-maroon transition-colors"
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
  );
}
