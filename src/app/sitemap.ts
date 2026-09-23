import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hotelkalya.co.ke";
  const currentDate = new Date().toISOString();

  const routes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/accommodation", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/dining", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/conference", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/catering", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/gardens", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/events", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/gallery", priority: 0.7, changeFrequency: "monthly" as const },
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
