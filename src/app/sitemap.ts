import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hotelkalya.co.ke";
  const currentDate = new Date().toISOString();

  const routes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/services", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/services/accommodation", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/services/food-service", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/services/conferences", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/services/outside-catering", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/services/airbnb", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/services/garden-experience", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/gallery", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/book", priority: 0.9, changeFrequency: "weekly" as const },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
