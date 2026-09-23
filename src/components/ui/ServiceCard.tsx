import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";
import type { ServiceItem } from "@/lib/constants";

interface ServiceCardProps {
  service: ServiceItem;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-brand-amber-light/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-brand-maroon-dark text-brand-amber flex items-center justify-center shadow">
          <span className="text-lg">✦</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-bold text-brand-sage uppercase tracking-wider">
            {service.tagline}
          </span>
          <h3 className="font-serif text-xl font-bold text-brand-maroon-dark mt-1 mb-2.5">
            {service.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-4 leading-relaxed">
            {service.desc}
          </p>

          {/* Features */}
          <div className="space-y-1.5 mb-5 border-t border-brand-amber-light pt-3">
            {service.features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-amber flex-shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Link
          href={service.href}
          className="w-full bg-brand-maroon/10 hover:bg-brand-maroon text-brand-maroon hover:text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
        >
          <span>{service.cta}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
