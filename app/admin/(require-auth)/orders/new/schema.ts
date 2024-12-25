import { PaymentMethod } from "@prisma/client";
import { z } from "zod";

export const createOrderSchema = z.object({
  userId: z
    .string({
      required_error: "User ID is required",
    })
    .cuid({
      message: "Please select a valid customer",
    }),

  assignedEngineer: z
    .string()
    .cuid({
      message: "Please select a valid engineer",
    })
    .optional()
    .nullable(),

  propertyType: z.enum(["RESIDENTIAL", "COMMERCIAL"], {
    required_error: "Please select a property type",
    invalid_type_error: "Invalid property type selected",
  }),

  residentialType: z
    .enum(
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
        required_error: "Please select a resident type",
        invalid_type_error: "Invalid resident type selected",
      }
    )
    .optional(),

  commercialType: z
    .enum(["PUB", "STORE", "OFFICE", "RESTAURANT", "WAREHOUSE", "OTHER"], {
      required_error: "Please select a commercial property type",
      invalid_type_error: "Invalid commercial property selected",
    })
    .optional(),

  packages: z
    .array(
      z.object({
        packageId: z.string().cuid({
          message: "Please select a valid package",
        }),
      })
    )
    .min(1, {
      message: "At least one service must be selected",
    }),
  parkingOptions: z.enum(["PAID", "FREE", "NO"], {
    required_error: "Please select a parking option",
    invalid_type_error: "Invalid parking option selected",
  }),
  isCongestionZone: z.boolean({
    required_error: "Please indicate if the property is in a congestion zone",
  }),

  inspectionTime: z.enum(["MORNING", "AFTERNOON", "EVENING"], {
    required_error: "Please select an inspection time slot",
    invalid_type_error: "Invalid time slot selected",
  }),
  date: z.coerce
    .date({
      required_error: "Please select a valid date",
      invalid_type_error: "Invalid date format",
    })
    .min(new Date(new Date().setHours(0, 0, 0, 0)), {
      message: "Inspection date must be today or in the future",
    }),

  invoiceId: z.string({
    required_error: "Invoice ID is required",
  }),
  paymentMethod: z.nativeEnum(PaymentMethod, {
    required_error: "Please select a payment method",
    invalid_type_error: "Invalid payment method selected",
  }),
});

export type CreateOrderFormInput = z.infer<typeof createOrderSchema>;

export const createUserSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(2, {
      message: "Name must be at least 2 characters long",
    }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Please enter a valid email address",
    }),
  phone: z.string({
    required_error: "Phone number is required",
  }),

  expertise: z.string().optional(),

  street: z
    .string({
      required_error: "Street address is required",
    })
    .min(3, {
      message: "Street address must be at least 3 characters long",
    }),
  city: z
    .string({
      required_error: "City is required",
    })
    .min(2, {
      message: "City name must be at least 2 characters long",
    }),
  postcode: z
    .string({
      required_error: "Postcode is required",
    })
    .refine((val) => /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/.test(val), {
      message: "Please enter a valid UK postcode",
    }),
});

export type CreateUserFormInput = z.infer<typeof createUserSchema>;
