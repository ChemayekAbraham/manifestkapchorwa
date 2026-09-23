import { z } from "zod";

export const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);
export const MemberCategoryEnum = z.enum([
  "MEMBER",
  "VISITOR",
  "WORKER",
  "NEW_CONVERT",
  "YOUTH",
  "CHILD",
]);
export const MemberStatusEnum = z.enum(["ACTIVE", "INACTIVE", "TRANSFERRED"]);

export const PersonSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  phone: z.string().max(20).optional().nullable(),
  email: z.string().email("Invalid email address").max(100).optional().nullable().or(z.literal("")),
  gender: GenderEnum.optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  village: z.string().max(100).optional().nullable(),
  parish: z.string().max(100).optional().nullable(),
  subCounty: z.string().max(100).optional().nullable(),
  district: z.string().max(100).default("Kapchorwa").optional().nullable(),
  category: MemberCategoryEnum.default("MEMBER"),
  status: MemberStatusEnum.default("ACTIVE"),
  notes: z.string().max(1000).optional().nullable(),
  dateJoined: z.string().optional().nullable(),
});

export const PersonFilterSchema = z.object({
  search: z.string().optional(),
  category: MemberCategoryEnum.optional(),
  status: MemberStatusEnum.optional(),
  gender: GenderEnum.optional(),
  village: z.string().optional(),
  parish: z.string().optional(),
  subCounty: z.string().optional(),
  district: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(25),
  sortBy: z.enum(["fullName", "dateJoined", "createdAt", "category", "status"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type PersonInput = z.infer<typeof PersonSchema>;
export type PersonFilterInput = z.infer<typeof PersonFilterSchema>;
