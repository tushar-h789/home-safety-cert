import { z } from "zod";

const dayOfWeekEnum = z.enum([
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
]);

const openingDateTimeSchema = z.object({
  dayOfWeek: dayOfWeekEnum,
  openingTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
  closingTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
});

export const siteSettingsSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address for customer inquiries."),

  phone1: z.string().min(1, "Phone number is required"),
  phone2: z.string().optional().or(z.literal("")),
  whatsapp: z.string().optional().or(z.literal("")),

  websiteUrl: z
    .string()
    .url(
      "Please enter a valid website URL, including the protocol (e.g., https://)."
    )
    .optional()
    .or(z.literal("")),
  facebookUrl: z
    .string()
    .url("Please enter a valid Facebook page URL.")
    .optional()
    .or(z.literal("")),
  twitterUrl: z
    .string()
    .url("Please enter a valid Twitter profile URL.")
    .optional()
    .or(z.literal("")),
  instagramUrl: z
    .string()
    .url("Please enter a valid Instagram profile URL.")
    .optional()
    .or(z.literal("")),
  address: z.object({
    street: z.string().min(1, "Please provide the street address."),
    city: z.string().min(1, "Please specify the city."),
    postcode: z.string().min(1, "Please enter the postcode."),
  }),

  openingDateTime: z
    .array(openingDateTimeSchema)
    .refine(
      (items) =>
        new Set(items.map((item) => item.dayOfWeek)).size === items.length,
      "Each day of the week must be unique"
    ),
});

export type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;
