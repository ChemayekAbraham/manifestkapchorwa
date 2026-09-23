import { z } from "zod";

export const RoleEnum = z.enum(["SUPER_ADMIN", "ADMIN", "VIEWER"]);

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const CreateUserSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Valid email address is required").max(100),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
  role: RoleEnum.default("ADMIN"),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().max(100).optional(),
  role: RoleEnum.optional(),
  active: z.boolean().optional(),
  password: z.string().min(8).optional().nullable().or(z.literal("")),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
