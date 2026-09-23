import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://manifestkapchorwa.org";

  // Static public pages
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/services",
    "/devotions",
    "/events",
    "/register",
    "/prayer",
    "/testimony",
    "/give",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  try {
    // Dynamic devotion routes
    const devotions = await prisma.devotion.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });

    const devotionRoutes: MetadataRoute.Sitemap = devotions.map((d) => ({
      url: `${baseUrl}/devotions/${d.slug}`,
      lastModified: d.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...devotionRoutes];
  } catch {
    return staticRoutes;
  }
}
