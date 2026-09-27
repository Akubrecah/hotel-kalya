import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  badge?: string;
  badgeColor?: "maroon" | "sage" | "amber" | "gold" | "dark";
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
  dark?: boolean;
}

const badgeStyles = {
  maroon: "text-brand-maroon bg-brand-amber-light",
  sage: "text-brand-sage bg-emerald-50 border border-emerald-100",
  amber: "text-brand-amber-dark bg-brand-amber-light",
  gold: "text-brand-amber bg-black border border-brand-amber/40",
  dark: "text-neutral-300 bg-neutral-800 border border-neutral-700",
};

export function SectionHeader({
  badge,
  badgeColor = "maroon",
  title,
  description,
  centered = true,
  className,
  dark = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-3xl mb-12 sm:mb-16 space-y-3",
        centered && "text-center mx-auto",
        className
      )}
    >
      {badge && (
        <span
          className={cn(
            "text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full inline-block select-none",
            badgeStyles[badgeColor]
          )}
        >
          {badge}
        </span>
      )}
      <h2
        className={cn(
          "font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight",
          dark ? "text-white" : "text-brand-maroon-dark"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-sm sm:text-base leading-relaxed",
            dark ? "text-neutral-400" : "text-gray-600"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
