import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://manifestkapchorwa.org";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/login", "/api/admin/", "/api/auth/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
