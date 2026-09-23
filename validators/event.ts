import { z } from "zod";

export const EventSchema = z.object({
  name: z.string().min(2, "Event name is required").max(150),
  date: z.string().min(1, "Event date & time is required"),
  location: z.string().max(200).default("Main Sanctuary, Manifest Kapchorwa"),
  description: z.string().max(2000).optional().nullable(),
  published: z.boolean().default(true),
});

export const AttendanceMarkSchema = z.object({
  personId: z.string().min(1, "Person ID is required"),
  status: z.enum(["PRESENT", "ABSENT"]).default("PRESENT"),
  notes: z.string().max(255).optional().nullable(),
});

export const BatchAttendanceSchema = z.object({
  attendance: z.array(
    z.object({
      personId: z.string().min(1),
      status: z.enum(["PRESENT", "ABSENT"]),
      notes: z.string().optional().nullable(),
    })
  ),
});

export type EventInput = z.infer<typeof EventSchema>;
export type AttendanceMarkInput = z.infer<typeof AttendanceMarkSchema>;
