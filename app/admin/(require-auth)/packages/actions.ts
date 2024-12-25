"use server";

import prisma from "@/lib/prisma";
import { PackageType, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import { PackageFormInputType } from "./schema";

export const getPackages = cache(
  async (
    page: number = 1,
    pageSize: number = 10,
    search: string = "",
    filterType: PackageType | "" = ""
  ) => {
    try {
      const skip = (page - 1) * pageSize;

      // Build the where clause for filtering by type and search
      const whereClause: Prisma.PackageWhereInput = {
        AND: [
          search
            ? {
                OR: [
                  { name: { contains: search, mode: "insensitive" } },
                  { unitType: { contains: search, mode: "insensitive" } },
                ],
              }
            : {},
          filterType ? { type: filterType } : {},
        ],
      };

      // Fetch the services and the total count
      const [services, totalCount] = await Promise.all([
        prisma.package.findMany({
          where: whereClause,
          skip,
          take: pageSize,
          include: {
            order: true,
          },
        }),
        prisma.package.count({ where: whereClause }),
      ]);

      return {
        services,
        pagination: {
          currentPage: page,
          pageSize,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
        },
      };
    } catch (error) {
      console.error("Error fetching services:", error);
      throw new Error("Failed to fetch services");
    }
  }
);

export async function deletePackage(serviceId: string) {
  try {
    const deletedService = await prisma.package.delete({
      where: {
        id: serviceId,
      },
    });

    revalidatePath("/admin/packages");
    revalidatePath("/admin/orders/new");
    revalidatePath("/book-now");

    return {
      message: "Service deleted successfully!",
      data: deletedService,
      success: true,
    };
  } catch (error) {
    console.error("Error deleting service:", error);
    return {
      message: "An error occurred while deleting the service.",
      success: false,
    };
  }
}

export async function createPackage(data: PackageFormInputType) {
  try {
    // Create the service with the associated packages
    const createdPackage = await prisma.package.create({
      data: {
        name: data.name,
        type: data.type,
        price:
          typeof data.price === "number" ? data.price : parseFloat(data.price),

        serviceName: data.serviceName,
        category: data.category,
        propertyType: data.propertyType,
        residentialType:
          data.propertyType === "RESIDENTIAL" ? data.residentialType : null,
        commercialType:
          data.propertyType === "COMMERCIAL" ? data.commercialType : null,
        unitType: data.unitType,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/packages");
    revalidatePath("/book-now");
    revalidatePath("/admin/orders/new");
    revalidatePath("/services/[category_id]/[service_id]", "page");

    return {
      message: "Package created successfully!",
      data: createdPackage,
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "An error occurred while creating the service.",
      success: false,
    };
  }
}

export async function updatePackage(
  packageId: string,
  data: Partial<PackageFormInputType>
) {
  try {
    const updatedPackage = await prisma.package.update({
      where: {
        id: packageId,
      },
      data: {
        name: data.name ?? undefined,
        type: data.type ?? undefined,
        price:
          data.price !== undefined
            ? typeof data.price === "number"
              ? data.price
              : parseFloat(data.price)
            : undefined,
        serviceName: data.serviceName ?? undefined,
        category: data.category ?? undefined,
        propertyType: data.propertyType ?? undefined,
        residentialType:
          data.propertyType === "RESIDENTIAL"
            ? data.residentialType ?? undefined
            : null,
        commercialType:
          data.propertyType === "COMMERCIAL"
            ? data.commercialType ?? undefined
            : null,
        unitType: data.unitType ?? undefined,
      },
    });

    // Revalidate paths if needed
    revalidatePath("/admin/packages");
    revalidatePath("/");
    revalidatePath("/book-now");
    revalidatePath("/admin/orders/new");
    revalidatePath("/services/[category_id]/[service_id]", "page");

    return {
      message: "Package updated successfully!",
      data: updatedPackage,
      success: true,
    };
  } catch (error) {
    console.error("Error updating package:", error);
    return {
      message: "An error occurred while updating the package.",
      success: false,
    };
  }
}

export const getPackageById = cache(async (packageId: string) => {
  try {
    const packageData = await prisma.package.findUnique({
      where: {
        id: packageId,
      },
    });

    if (!packageData) {
      return {
        message: "Package not found",
        success: false,
        data: null,
      };
    }

    return {
      message: "Package fetched successfully!",
      data: packageData,
      success: true,
    };
  } catch (error) {
    console.error("Error fetching package by ID:", error);
    return {
      message: "An error occurred while fetching the package.",
      success: false,
      data: null,
    };
  }
});
