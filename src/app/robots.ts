import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.shaperadar.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/assessment", "/membership", "/terms", "/privacy", "/disclaimer"],
        disallow: ["/admin/", "/app/", "/api/"]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
