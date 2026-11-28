import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.shaperadar.com";
  const now = new Date();

  const routes = [
    "",
    "/assessment",
    "/membership",
    "/terms",
    "/privacy",
    "/disclaimer",
    "/auth/login",
    "/auth/signup"
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/assessment" ? 0.9 : 0.7
  }));
}
