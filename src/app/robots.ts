import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://hotelkalya.co.ke";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard/", "/cms/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
