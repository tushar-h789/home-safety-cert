
import { z } from "zod";

export const createCertificateSchema = z.object({
  serviceName: z.string({
    required_error: "Service name is required",
  }).min(1, {
    message: "Service name must not be empty",
  }),

  issueDate: z.coerce.date({
    required_error: "Issue date is required",
    invalid_type_error: "Invalid issue date format",
  }).min(new Date(new Date().setHours(0, 0, 0, 0)), {
    message: "Issue date must be today or in the future",
  }),

  expiryDate: z.coerce.date().optional().nullable().refine(
    (val) => !val || val > new Date(),
    {
      message: "Expiry date must be in the future",
    }
  ),

  issuedBy: z.string({
    required_error: "Issuer name is required",
  }).min(1, {
    message: "Issuer name must not be empty",
  }),

  userId: z.string({
    required_error: "User ID is required",
  }).cuid({
    message: "Please provide a valid user ID",
  }),
});

export type CreateCertificateFormInput = z.infer<typeof createCertificateSchema>;
