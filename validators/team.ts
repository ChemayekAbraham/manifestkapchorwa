import { z } from "zod";

export const teamMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  role: z.string().min(2, "Role/Title must be at least 2 characters").max(100),
  phone: z.string().min(8, "Phone number is required"),
  imageUrl: z.string().optional().nullable(),
  bio: z.string().max(500, "Bio should be under 500 characters").optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  order: z.coerce.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

export const updateTeamMemberSchema = teamMemberSchema.partial();

export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>;
