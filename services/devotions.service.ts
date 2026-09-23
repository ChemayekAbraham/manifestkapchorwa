import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { DevotionInput } from "@/validators/devotion";

export class DevotionsService {
  private static async generateUniqueSlug(title: string, currentId?: string): Promise<string> {
    const baseSlug = slugify(title) || "devotional";

    // Query all matching existing slugs in a single round trip
    const existing = await prisma.devotion.findMany({
      where: {
        slug: { startsWith: baseSlug },
        ...(currentId ? { NOT: { id: currentId } } : {}),
      },
      select: { slug: true },
    });

    const slugSet = new Set(existing.map((d) => d.slug));
    if (!slugSet.has(baseSlug)) {
      return baseSlug;
    }

    let count = 1;
    while (slugSet.has(`${baseSlug}-${count}`)) {
      count++;
    }
    return `${baseSlug}-${count}`;
  }

  static async create(data: DevotionInput) {
    const slug = data.slug ? slugify(data.slug) : await this.generateUniqueSlug(data.title);

    return prisma.devotion.create({
      data: {
        title: data.title.trim(),
        slug,
        excerpt: data.excerpt?.trim() || data.content.slice(0, 160).trim() + "...",
        content: data.content.trim(),
        author: data.author?.trim() || "Pastor / Ministry Team",
        published: data.published ?? false,
        publishedAt: data.published ? (data.publishedAt ? new Date(data.publishedAt) : new Date()) : null,
      },
    });
  }

  static async update(id: string, data: Partial<DevotionInput>) {
    const existing = await prisma.devotion.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Devotion not found");
    }

    let slug = existing.slug;
    if (data.slug && data.slug !== existing.slug) {
      slug = await this.generateUniqueSlug(data.slug, id);
    } else if (data.title && !data.slug && data.title !== existing.title) {
      slug = await this.generateUniqueSlug(data.title, id);
    }

    let publishedAt = existing.publishedAt;
    if (data.published && !existing.published && !data.publishedAt) {
      publishedAt = new Date();
    } else if (data.publishedAt) {
      publishedAt = new Date(data.publishedAt);
    }

    return prisma.devotion.update({
      where: { id },
      data: {
        ...(data.title ? { title: data.title.trim() } : {}),
        slug,
        ...(data.excerpt !== undefined ? { excerpt: data.excerpt?.trim() || null } : {}),
        ...(data.content ? { content: data.content.trim() } : {}),
        ...(data.author ? { author: data.author.trim() } : {}),
        ...(data.published !== undefined ? { published: data.published } : {}),
        publishedAt,
      },
    });
  }

  static async delete(id: string) {
    return prisma.devotion.delete({ where: { id } });
  }

  static async getBySlug(slug: string, requirePublished = true) {
    return prisma.devotion.findFirst({
      where: {
        slug,
        ...(requirePublished ? { published: true } : {}),
      },
    });
  }

  static async getById(id: string) {
    return prisma.devotion.findUnique({ where: { id } });
  }

  static async listPublic(page = 1, pageSize = 10) {
    const [total, items] = await Promise.all([
      prisma.devotion.count({ where: { published: true } }),
      prisma.devotion.findMany({
        where: { published: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { publishedAt: "desc" },
      }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  static async listAdmin(search?: string, page = 1, pageSize = 20) {
    const where = search
      ? {
          OR: [
            { title: { contains: search.trim(), mode: "insensitive" as const } },
            { author: { contains: search.trim(), mode: "insensitive" as const } },
          ],
        }
      : {};

    const [total, items] = await Promise.all([
      prisma.devotion.count({ where }),
      prisma.devotion.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
