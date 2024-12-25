import { z } from "zod";

// Enums for Select options
export const PackageCategorySchema = z.enum(
  ["ELECTRICAL", "FIRE", "GAS", "HEALTH_SAFETY"],
  {
    errorMap: () => ({ message: "Invalid package category selected" }),
  }
);

export const PackageTypeSchema = z.enum(
  ["CERTIFICATE", "REPAIR", "INSTALLATION", "INSPECTION", "OTHER"],
  {
    errorMap: () => ({ message: "Invalid package type selected" }),
  }
);

export const PropertyTypeSchema = z.enum(
  ["RESIDENTIAL", "COMMERCIAL", "NOT_APPLICABLE"],
  {
    errorMap: () => ({ message: "Invalid property type selected" }),
  }
);

export const ResidentialTypeSchema = z.enum(
  [
    "BUNGALOW",
    "MID_TERRACED_HOUSE",
    "DETACHED_HOUSE",
    "SEMI_DETACHED_HOUSE",
    "FLAT",
    "APARTMENT",
    "OTHER",
  ],
  {
    errorMap: () => ({ message: "Invalid residential type selected" }),
  }
);

export const CommercialTypeSchema = z.enum(
  ["PUB", "STORE", "OFFICE", "RESTAURANT", "WAREHOUSE", "OTHER"],
  {
    errorMap: () => ({ message: "Invalid commercial type selected" }),
  }
);

export const packageSchema = z.object({
  name: z
    .string({
      required_error: "Package name is required",
    })
    .min(1, { message: "Package name cannot be empty" }),
  type: PackageTypeSchema,
  category: PackageCategorySchema,
  price: z
    .string({
      required_error: "Price is required",
    })
    .min(1, { message: "Price cannot be empty" }),
  serviceName: z
    .string({
      required_error: "Service name is required",
    })
    .min(1, { message: "Service name cannot be empty" }),
  propertyType: PropertyTypeSchema,
  residentialType: ResidentialTypeSchema.optional(),
  commercialType: CommercialTypeSchema.optional(),
  unitType: z.string().optional(),
});

export type PackageFormInputType = z.infer<typeof packageSchema>;
