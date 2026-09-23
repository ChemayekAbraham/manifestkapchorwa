import { z } from "zod";
import { GenderEnum, MemberCategoryEnum } from "./person";

export const PublicRegistrationSchema = z.object({
  fullName: z.string().min(2, "Full name is required (minimum 2 characters)").max(100),
  phone: z.string().min(8, "Valid phone number is required").max(20),
  email: z.string().min(1, "Email address is compulsory").email("Please enter a valid email address (e.g. name@gmail.com)").max(100),
  gender: GenderEnum.optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  village: z.string().max(100).optional().nullable(),
  parish: z.string().max(100).optional().nullable(),
  subCounty: z.string().max(100).optional().nullable(),
  district: z.string().max(100).default("Kapchorwa").optional().nullable(),
  category: MemberCategoryEnum.default("MEMBER"),
  notes: z.string().max(500).optional().nullable(),
  // Honeypot field - must be empty
  website_hp: z.string().max(0, "Bot detected").optional().nullable().or(z.literal("")),
});

export type PublicRegistrationInput = z.infer<typeof PublicRegistrationSchema>;
