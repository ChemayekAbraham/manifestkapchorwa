import { z } from "zod";

export const TestimonyStatusEnum = z.enum(["PENDING", "APPROVED", "REJECTED", "ARCHIVED"]);

export const PublicTestimonySchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  contact: z.string().max(100).optional().nullable(),
  content: z.string().min(10, "Please share your testimony (minimum 10 characters)").max(3000),
  website_hp: z.string().max(0, "Bot detected").optional().nullable().or(z.literal("")),
});

export const AdminUpdateTestimonySchema = z.object({
  status: TestimonyStatusEnum,
  name: z.string().min(2).max(100).optional(),
  content: z.string().min(10).max(3000).optional(),
});

export type PublicTestimonyInput = z.infer<typeof PublicTestimonySchema>;
export type AdminUpdateTestimonyInput = z.infer<typeof AdminUpdateTestimonySchema>;
