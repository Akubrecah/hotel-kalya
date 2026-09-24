import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://hotelkalya.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/account/", "/dashboard/", "/cms/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
