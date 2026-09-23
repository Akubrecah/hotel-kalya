import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hotelkalya.co.ke";
  const currentDate = new Date().toISOString();

  const routes = [
    // Primary Public Marketing
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/rooms", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/services", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/services/accommodation", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/services/food-service", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/services/conferences", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/services/outside-catering", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/services/airbnb", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/services/garden-experience", priority: 0.8, changeFrequency: "monthly" as const },

    // Digital Menu & Dining
    { path: "/menu", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/menu/breakfast", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/menu/lunch", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/menu/dinner", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/menu/drinks", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/menu/specials", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/cart", priority: 0.7, changeFrequency: "weekly" as const },

    // Discovery, Location & Reviews
    { path: "/gallery", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/events", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/reviews", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/location", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/book", priority: 0.9, changeFrequency: "weekly" as const },

    // Legal
    { path: "/privacy", priority: 0.4, changeFrequency: "yearly" as const },
    { path: "/terms", priority: 0.4, changeFrequency: "yearly" as const },
    { path: "/cookies", priority: 0.4, changeFrequency: "yearly" as const },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
