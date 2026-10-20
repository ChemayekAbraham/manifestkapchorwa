import { z } from "zod";

export const NewConvertTypeEnum = z.enum(["SOULS_WON", "RECEIVED_JESUS"]);

export const ConvertPersonItemSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  phone: z.string().max(30).optional().nullable().or(z.literal("")),
  village: z.string().max(100).optional().nullable().or(z.literal("")),
  notes: z.string().max(500).optional().nullable().or(z.literal("")),
});

export const NewConvertSchema = z.object({
  convertType: NewConvertTypeEnum,
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100).optional(),
  phone: z.string().max(30).optional().nullable().or(z.literal("")),
  email: z.string().optional().nullable().or(z.literal("")),
  village: z.string().max(100).optional().nullable().or(z.literal("")),
  notes: z.string().max(500).optional().nullable().or(z.literal("")),
  // Batch support for adding multiple people
  people: z.array(ConvertPersonItemSchema).optional(),
});

export type NewConvertInput = z.infer<typeof NewConvertSchema>;
export type ConvertPersonItem = z.infer<typeof ConvertPersonItemSchema>;
