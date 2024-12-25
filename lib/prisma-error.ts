import { Prisma } from "@prisma/client";

interface ErrorResponse {
  message: string;
  success: false;
}

// Define a custom error handler function
export function handlePrismaError(error: unknown): {
  message: string;
  success: boolean;
} {
  // Check if the error is a Prisma error
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return {
          message: `A record with this ${error.meta?.target} already exists.`,
          success: false,
        };
      case "P2003":
        return {
          message:
            "Foreign key constraint failed. The related record might not exist.",
          success: false,
        };
      case "P2004":
        return {
          message:
            "A constraint violation occurred. Please check the related data.",
          success: false,
        };
      case "P2005":
        return {
          message:
            "Invalid value provided for one or more fields. Please review your input.",
          success: false,
        };
      case "P2006":
        return {
          message:
            "Data type mismatch. Please ensure that the correct types are provided.",
          success: false,
        };
      case "P2025":
        return {
          message:
            "The requested record could not be found. It might have been deleted or never existed.",
          success: false,
        };
      default:
        return {
          message: `Prisma error: ${error.message}`,
          success: false,
        };
    }
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      message:
        "Failed to connect to the database. Please check your database connection.",
      success: false,
    };
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      message: "Validation failed. Please check the query and input data.",
      success: false,
    };
  } else if (error instanceof Prisma.PrismaClientRustPanicError) {
    return {
      message: "An internal server error occurred. Please try again later.",
      success: false,
    };
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return {
      message:
        "An unknown error occurred. Please try again or contact support.",
      success: false,
    };
  }

  // Fallback for any other errors (not Prisma-related)
  return {
    message: "An unexpected error occurred. Please try again.",
    success: false,
  };
}
