import { z } from "zod";

export const PrayerRequestSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  contact: z.string().max(100).optional().nullable(),
  request: z.string().min(5, "Please write your prayer request (minimum 5 characters)").max(2000),
  website_hp: z.string().max(0, "Bot detected").optional().nullable().or(z.literal("")),
});

export const UpdatePrayerRequestSchema = z.object({
  isReviewed: z.boolean().optional(),
  isArchived: z.boolean().optional(),
});

export type PrayerRequestInput = z.infer<typeof PrayerRequestSchema>;
