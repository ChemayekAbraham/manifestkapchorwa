import { z } from "zod";

export const DevotionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  slug: z.string().max(200).optional(),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string().min(10, "Devotion content must be at least 10 characters"),
  imageUrl: z.string().optional().nullable(),
  author: z.string().max(100).default("Pastor / Ministry Team"),
  published: z.boolean().default(false),
  publishedAt: z.string().optional().nullable(),
});

export type DevotionInput = z.infer<typeof DevotionSchema>;
