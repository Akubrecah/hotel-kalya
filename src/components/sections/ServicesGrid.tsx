import { SERVICES_LIST } from "@/lib/constants";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function ServicesGrid() {
  return (
    <section className="py-20 bg-brand-amber-light/30 border-t border-b border-brand-amber-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="What We Offer"
          title="A Complete Hospitality & Events Destination"
          description="From our brochure to reality: experience our full spectrum of professional hospitality, accommodation, culinary, and outdoor services in Kapenguria."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES_LIST.map((svc) => (
            <ServiceCard key={svc.id} service={svc} />
          ))}
        </div>
      </div>
    </section>
  );
}
