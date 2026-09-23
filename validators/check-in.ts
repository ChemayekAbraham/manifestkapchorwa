import { z } from "zod";

export const ServiceCheckInSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  serviceName: z.string().min(1, "Please select the service you are attending"),
  serviceId: z.string().optional(),
});

export type ServiceCheckInInput = z.infer<typeof ServiceCheckInSchema>;

