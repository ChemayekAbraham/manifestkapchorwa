import { z } from "zod";
import { GenderEnum, MemberCategoryEnum, MemberStatusEnum } from "./person";

export const WHITELISTED_REPORT_FIELDS = [
  "fullName",
  "phone",
  "email",
  "gender",
  "dateOfBirth",
  "village",
  "parish",
  "subCounty",
  "district",
  "category",
  "status",
  "notes",
  "dateJoined",
  "createdAt",
] as const;

export const ReportTypeEnum = z.enum([
  "membership-summary",
  "growth",
  "new-converts",
  "attendance",
  "location",
  "inactive",
  "custom",
]);

export const ExportFormatEnum = z.enum(["csv", "xlsx", "pdf"]);

export const ReportFilterSchema = z.object({
  type: ReportTypeEnum.default("membership-summary"),
  format: ExportFormatEnum.optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  category: MemberCategoryEnum.optional(),
  status: MemberStatusEnum.optional(),
  gender: GenderEnum.optional(),
  village: z.string().optional(),
  parish: z.string().optional(),
  subCounty: z.string().optional(),
  district: z.string().optional(),
  eventId: z.string().optional(),
  // For Custom Builder
  fields: z.array(z.enum(WHITELISTED_REPORT_FIELDS)).optional(),
  sortBy: z.enum(WHITELISTED_REPORT_FIELDS).optional().default("dateJoined"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  groupBy: z.enum(["category", "gender", "status", "village", "parish", "subCounty", "district"]).optional(),
});

export type ReportFilterInput = z.infer<typeof ReportFilterSchema>;
