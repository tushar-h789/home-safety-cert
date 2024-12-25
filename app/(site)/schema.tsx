import * as z from "zod";

export const reviewSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  rating: z.number().min(1).max(5),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
