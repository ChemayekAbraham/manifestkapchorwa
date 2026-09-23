import { z } from "zod";

export const NewConvertTypeEnum = z.enum(["SOULS_WON", "RECEIVED_JESUS"]);

export const NewConvertSchema = z.object({
  convertType: NewConvertTypeEnum,
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  phone: z.string().max(30).optional().nullable().or(z.literal("")),
  email: z.string().email("Invalid email address").optional().nullable().or(z.literal("")),
  village: z.string().max(100).optional().nullable().or(z.literal("")),
  notes: z.string().max(500).optional().nullable().or(z.literal("")),
});

export type NewConvertInput = z.infer<typeof NewConvertSchema>;
