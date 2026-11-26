import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://fit-planner-drab.vercel.app";

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
