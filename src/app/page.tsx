import {
  HeroSection,
  AboutSection,
  ServicesGrid,
  AccommodationPreview,
  DiningPreview,
  ConferencePreview,
  CateringBanner,
  GardenShowcase,
  ReviewsSection,
  LocationSection,
} from "@/components/sections";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesGrid />
      <AccommodationPreview />
      <DiningPreview />
      <ConferencePreview />
      <CateringBanner />
      <GardenShowcase />
      <ReviewsSection />
      <LocationSection />
    </>
  );
}
