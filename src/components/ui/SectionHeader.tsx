import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  badge?: string;
  badgeColor?: "maroon" | "sage" | "amber";
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

const badgeStyles = {
  maroon: "text-brand-maroon bg-brand-amber-light",
  sage: "text-brand-sage bg-emerald-50 border border-emerald-100",
  amber: "text-brand-amber-dark bg-brand-amber-light",
};

export function SectionHeader({
  badge,
  badgeColor = "maroon",
  title,
  description,
  centered = true,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-3xl mb-16 space-y-3",
        centered && "text-center mx-auto",
        className
      )}
    >
      {badge && (
        <span
          className={cn(
            "text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block",
            badgeStyles[badgeColor]
          )}
        >
          {badge}
        </span>
      )}
      <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-maroon-dark">
        {title}
      </h2>
      {description && (
        <p className="text-gray-600 text-sm sm:text-base">{description}</p>
      )}
    </div>
  );
}
