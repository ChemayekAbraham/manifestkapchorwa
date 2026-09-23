import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { logger } from "@/lib/logger";

interface SyncedDevotion {
  title: string;
  author: string;
  content: string;
  excerpt: string;
  imageUrl?: string | null;
  publishedAt: Date;
  sourceUrl?: string;
  sourceSlug?: string;
}

export class PhanerooSyncService {
  private static RSS_URL = "https://phaneroo.org/feed/";
  private static LISTING_PAGE_URL = "https://phaneroo.org/daily-devotion/";

  /**
   * Cleans HTML markup from RSS content, extracting clean text with proper paragraphs
   */
  private static cleanDevotionHtml(htmlContent: string): { content: string; excerpt: string; author: string } {
    let rawText = htmlContent;

    // Look for the English tab content if Elementor tabs exist
    const englishTabMatch = htmlContent.match(/<div[^>]*id="elementor-tab-content-[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    if (englishTabMatch) {
      rawText = englishTabMatch[1];
    }

    // Clean HTML into structured paragraphs
    let formatted = rawText
      .replace(/<p[^>]*>/gi, "")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<span[^>]*>/gi, "")
      .replace(/<\/span>/gi, "")
      .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, "$1")
      .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, "$1")
      .replace(/<[^>]+>/g, "") // strip remaining html tags
      .replace(/&nbsp;/g, " ")
      .replace(/&#8217;/g, "'")
      .replace(/&#8220;/g, '"')
      .replace(/&#8221;/g, '"')
      .replace(/&#8212;/g, "—")
      .replace(/&#8211;/g, "–")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\*\+/g, "")
      .replace(/\+\*/g, "")
      .replace(/\*{1,4}/g, "")
      .trim();

    // Clean up multiple consecutive blank lines
    formatted = formatted.replace(/\n{3,}/g, "\n\n");

    let author = "Apostle Grace Lubega";
    if (formatted.startsWith("Apostle Grace Lubega")) {
      author = "Apostle Grace Lubega";
      formatted = formatted.replace(/^Apostle Grace Lubega\s*\n+/, "");
    }

    // Extract clean excerpt from the first explanatory paragraph
    const paragraphs = formatted.split("\n\n").map((p) => p.trim()).filter(Boolean);
    const bodyPara = paragraphs.find(
      (p) =>
        !p.toLowerCase().startsWith("further study") &&
        !p.toLowerCase().startsWith("golden nugget") &&
        !p.toLowerCase().startsWith("prayer") &&
        !/\b(?:\d\s*)?[A-Z][a-z]+\s+\d+:\d+/i.test(p) &&
        p.length > 40
    );
    const excerpt = bodyPara ? bodyPara.slice(0, 180).trim() + "..." : formatted.slice(0, 180).trim() + "...";

    return {
      content: formatted,
      excerpt,
      author,
    };
  }

  /**
   * Scrapes the daily devotion cards from phaneroo.org/daily-devotion/ across multiple pages to map slugs to image URLs
   */
  private static async fetchDevotionImagesMap(maxPages = 5): Promise<Map<string, string>> {
    const imageMap = new Map<string, string>();
    const pageNumbers = Array.from({ length: maxPages }, (_, i) => i + 1);

    await Promise.all(
      pageNumbers.map(async (page) => {
        try {
          const url = page === 1 ? this.LISTING_PAGE_URL : `${this.LISTING_PAGE_URL}page/${page}/`;
          const res = await fetch(url, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Manifest-Kapchorwa/1.0",
            },
            next: { revalidate: 300 },
          });

          if (!res.ok) return;

          const html = await res.text();
          // Match cards with links to daily_devotion and their images
          const regex = /<a[^>]+href="([^"]*daily_devotion\/([^\/"]+)[^"]*)"[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"[\s\S]*?<\/a>/gi;
          let m;
          while ((m = regex.exec(html)) !== null) {
            const rawSlug = m[2].trim().toLowerCase();
            const imgUrl = m[3].trim();
            if (imgUrl && !imgUrl.includes("Phaneroo_logo") && !imgUrl.includes("favicon")) {
              imageMap.set(rawSlug, imgUrl);
              imageMap.set(slugify(rawSlug), imgUrl);
            }
          }
        } catch (e) {
          logger.warn(`Could not fetch devotion images map for page ${page}`, { error: e });
        }
      })
    );

    return imageMap;
  }

  /**
   * Fetches devotions with images from Phaneroo across multiple pages and saves into the database
   */
  static async syncLatestDevotions(options: { maxPages?: number; syncAll?: boolean } = {}): Promise<{
    syncedCount: number;
    updatedCount: number;
    totalProcessed: number;
    newItems: string[];
  }> {
    const maxPages = options.syncAll ? 25 : options.maxPages || 5;

    try {
      const imageMap = await this.fetchDevotionImagesMap(Math.min(maxPages, 10));
      const allItems: SyncedDevotion[] = [];

      for (let page = 1; page <= maxPages; page++) {
        try {
          const feedUrl = page === 1 ? this.RSS_URL : `${this.RSS_URL}?paged=${page}`;
          const rssRes = await fetch(feedUrl, {
            headers: {
              "User-Agent": "Manifest-Kapchorwa-Devotions-Sync/1.0",
              Accept: "application/rss+xml, application/xml, text/xml",
            },
            next: { revalidate: 300 },
          });

          if (!rssRes.ok) {
            // Reached the end of available pages
            break;
          }

          const xml = await rssRes.text();
          const itemRegex = /<item>([\s\S]*?)<\/item>/g;
          let match;
          let pageItemCount = 0;

          while ((match = itemRegex.exec(xml)) !== null) {
            const itemXml = match[1];

            // Extract title
            const titleMatch = itemXml.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
            if (!titleMatch) continue;
            const title = titleMatch[1].trim();

            // Extract pubDate
            const dateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);
            const pubDate = dateMatch ? new Date(dateMatch[1]) : new Date();

            // Extract link & sourceSlug
            const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/i);
            const sourceUrl = linkMatch ? linkMatch[1].trim() : undefined;
            let sourceSlug: string | undefined = undefined;
            if (sourceUrl) {
              const slugMatch = sourceUrl.match(/daily_devotion\/([^\/\?]+)/);
              if (slugMatch) sourceSlug = slugMatch[1].toLowerCase();
            }

            // Match image from imageMap or enclosure
            let imageUrl: string | null = null;
            if (sourceSlug && imageMap.has(sourceSlug)) {
              imageUrl = imageMap.get(sourceSlug)!;
            } else if (imageMap.has(slugify(title))) {
              imageUrl = imageMap.get(slugify(title))!;
            } else {
              const mediaMatch = itemXml.match(/<(?:media:content|enclosure)[^>]+url="([^"]+)"/i);
              if (mediaMatch && !mediaMatch[1].includes("Phaneroo_logo")) {
                imageUrl = mediaMatch[1];
              }
            }

            // Fallback default devotion graphic if specific image not found
            if (!imageUrl) {
              imageUrl = "https://phaneroo.org/wp-content/uploads/2025/08/Devotion_web-thumb_sq.jpg";
            }

            // Extract content:encoded or description
            const contentMatch =
              itemXml.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/i) ||
              itemXml.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);

            if (!contentMatch) continue;

            const { content, excerpt, author } = this.cleanDevotionHtml(contentMatch[1]);

            allItems.push({
              title,
              author,
              content,
              excerpt,
              imageUrl,
              publishedAt: pubDate,
              sourceUrl,
              sourceSlug,
            });
            pageItemCount++;
          }

          if (pageItemCount === 0) {
            // No more items found on this page
            break;
          }
        } catch (pageError) {
          logger.warn(`Error fetching RSS page ${page}`, { error: pageError });
          break;
        }
      }

      if (allItems.length === 0) {
        return { syncedCount: 0, updatedCount: 0, totalProcessed: 0, newItems: [] };
      }

      let syncedCount = 0;
      let updatedCount = 0;
      const newItems: string[] = [];

      for (const item of allItems) {
        // Check if devotion already exists by title
        const existing = await prisma.devotion.findFirst({
          where: {
            title: { equals: item.title, mode: "insensitive" },
          },
        });

        if (!existing) {
          const baseSlug = slugify(item.title) || "phaneroo-devotion";
          let uniqueSlug = baseSlug;
          let counter = 1;

          while (await prisma.devotion.findUnique({ where: { slug: uniqueSlug } })) {
            uniqueSlug = `${baseSlug}-${counter}`;
            counter++;
          }

          await prisma.devotion.create({
            data: {
              title: item.title,
              slug: uniqueSlug,
              author: item.author,
              excerpt: item.excerpt,
              content: item.content,
              imageUrl: item.imageUrl,
              published: true,
              publishedAt: item.publishedAt,
            },
          });

          syncedCount++;
          newItems.push(item.title);
        } else {
          // Update existing devotion with fresh imageUrl and clean content if missing
          const shouldUpdateImage = !existing.imageUrl || existing.imageUrl.includes("Phaneroo_logo");
          const shouldUpdateContent = existing.content.includes("**") || existing.content.includes("*+*");

          if (shouldUpdateImage || shouldUpdateContent) {
            await prisma.devotion.update({
              where: { id: existing.id },
              data: {
                content: item.content,
                excerpt: item.excerpt,
                author: item.author,
                imageUrl: item.imageUrl || existing.imageUrl,
              },
            });
            updatedCount++;
          }
        }
      }

      if (syncedCount > 0 || updatedCount > 0) {
        logger.info(
          `Successfully processed ${allItems.length} Phaneroo devotions (${syncedCount} new, ${updatedCount} updated)`,
          { newItems }
        );
      }

      return {
        syncedCount,
        updatedCount,
        totalProcessed: allItems.length,
        newItems,
      };
    } catch (error) {
      logger.error("Error synchronizing devotions from Phaneroo", error);
      return { syncedCount: 0, updatedCount: 0, totalProcessed: 0, newItems: [] };
    }
  }
}

