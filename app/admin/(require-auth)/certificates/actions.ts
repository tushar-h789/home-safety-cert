"use server"; // Indicate that this code is intended for server execution

// import prisma from "@/lib/prisma"; // Import Prisma client
import { Prisma, PrismaClient } from "@prisma/client"; // Import types from Prisma
import { revalidatePath } from "next/cache"; // For revalidating cache
import { cache } from "react"; // For caching the functions
import { CreateCertificateFormInput } from "./new/schema";
const prisma = new PrismaClient(); // Create Prisma client instance

// Fetch Certificates with Pagination, Search, and Sorting
export const getCertificates = cache(
  async (
    page: number = 1,
    pageSize: number = 10,
    search: string = "",
    sortBy: string = "createdAt",
    sortOrder: "asc" | "desc" = "desc"
  ) => {
    try {
      const skip = (page - 1) * pageSize;

      const whereClause: Prisma.CertificateWhereInput = {
        AND: [
          search
            ? {
                OR: [
                  { serviceName: { contains: search, mode: "insensitive" } },
                  { issuedBy: { contains: search, mode: "insensitive" } },
                ],
              }
            : {},
        ],
      };

      const orderByClause: Prisma.CertificateOrderByWithRelationInput = {};
      switch (sortBy) {
        case "serviceName":
          orderByClause.serviceName = sortOrder;
          break;
        case "dateOfIssue":
          orderByClause.dateOfIssue = sortOrder;
          break;
        case "createdAt":
          orderByClause.createdAt = sortOrder;
          break;
        default:
          orderByClause.createdAt = "desc";
      }

      const [certificates, totalCount] = await Promise.all([
        prisma.certificate.findMany({
          where: whereClause,
          skip,
          take: pageSize,
          include: {
            user: true, // Include user information
          },
          orderBy: orderByClause,
        }),
        prisma.certificate.count({ where: whereClause }), // Count total matching certificates
      ]);

      return {
        certificates,
        pagination: {
          currentPage: page,
          pageSize,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize), // Calculate total pages
        },
      };
    } catch (error) {
      console.error("Error fetching certificates:", error);
      throw new Error("Failed to fetch certificates");
    }
  }
);

export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true, 
      },
    });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

// Delete Certificate by ID
export async function deleteCertificate(certificateId: string) {
  try {
    const deletedCertificate = await prisma.certificate.delete({
      where: {
        id: certificateId, // Use the provided certificate ID
      },
    });

    revalidatePath("/admin/certificates"); // Revalidate the certificates page

    return {
      message: "Certificate deleted successfully!",
      data: deletedCertificate,
      success: true,
    };
  } catch (error) {
    console.error("Error deleting certificate:", error);
    return {
      message: "An error occurred while deleting the certificate.",
      success: false,
    };
  }
}


export const getCertificateById = cache(async (certificateId: string) => {
  // Log the incoming ID for debugging
  console.log("Fetching certificate with ID:", certificateId);

  if (!certificateId || typeof certificateId !== "string" || certificateId.trim() === "") {
    throw new Error("Invalid certificate ID provided. Certificate ID must be a non-empty string.");
  }

  try {
    // Adjust the query to fetch certificate details
    const certificate = await prisma.certificate.findUnique({
      where: { id: certificateId },
      include: {
        user: true, // If you want to include related user data
      },
    });

    if (!certificate) {
      throw new Error(`No certificate found with ID: ${certificateId}`);
    }

    return certificate;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      if (error.code === "P2023") {
        throw new Error("Invalid ID format provided.");
      }
    }
    console.error("Error fetching certificate:", error);
    throw new Error("An unexpected error occurred while fetching the certificate");
  }
});


// Upsert Certificate (Create or Update)
export async function upsertCertificate(
  certificateData: {
    id?: string; // Optional ID for updating
    serviceName: string;
    issuedBy: string;
    dateOfIssue: Date;
    expiryDate?: Date;
    userId: string;
  }
) {
  try {
    const { id, serviceName, issuedBy, dateOfIssue, expiryDate, userId } = certificateData;

    const certificate = await prisma.certificate.upsert({
      where: {
        id: id || "", // If no ID is provided, use an empty string (may throw an error if no match)
      },
      create: {
        serviceName,
        issuedBy,
        dateOfIssue,
        expiryDate: expiryDate || null,
        user: {
          connect: {
            id: userId, // Connect the user to the certificate
          },
        },
      },
      update: {
        serviceName,
        issuedBy,
        dateOfIssue,
        expiryDate: expiryDate || null,
      },
    });

    revalidatePath("/admin/certificates"); // Revalidate the certificates page
    revalidatePath(`/admin/certificates/${certificate.id}`); // Revalidate the specific certificate page

    return {
      message: `Certificate ${id ? "updated" : "created"} successfully!`,
      data: certificate, // Return the certificate data
      success: true,
    };
  } catch (error) {
    console.error("Error creating/updating certificate:", error);
    return {
      message: "An error occurred while creating/updating the certificate.",
      success: false,
    };
  }
}

// Create Certificate
export async function createCertificate(certificateData: CreateCertificateFormInput) {
  try {
    const createdCertificate = await prisma.certificate.create({
      data: {
        serviceName: certificateData.serviceName,
        issuedBy: certificateData.issuedBy,
        dateOfIssue: certificateData.issueDate,
        expiryDate: certificateData.expiryDate || null,
        user: {
          connect: {
            id: certificateData.userId,
          },
        },
      },
    });

    return {
      message: "Certificate created successfully!",
      data: createdCertificate,
      success: true,
    };
  } catch (error) {
    console.error("Error creating certificate:", error);
    return {
      message: "An error occurred while creating the certificate.",
      success: false,
    };
  }
}
