"use server";

import { notifyEngineerEmailHtml } from "@/lib/notify-engineer-email";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/send-email";
import { EMAIL_ADDRESS } from "@/shared/data";
import { SendEmailDataType } from "@/types/misc";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cache } from "react";

export const getEngineers = cache(
  async (
    page: number = 1,
    pageSize: number = 10,
    search: string = "",
    sortBy: string = "createdAt",
    sortOrder: "asc" | "desc" = "desc"
  ) => {
    try {
      const skip = (page - 1) * pageSize;

      const whereClause: Prisma.UserWhereInput = {
        AND: [
          { role: "STAFF" },
          search
            ? {
                OR: [
                  { email: { contains: search, mode: "insensitive" } },
                  { name: { contains: search, mode: "insensitive" } },
                ],
              }
            : {},
        ],
      };

      // Create orderBy clause for sorting users
      const orderByClause: Prisma.UserOrderByWithRelationInput = {};
      switch (sortBy) {
        case "name":
          orderByClause.name = sortOrder;
          break;
        case "email":
          orderByClause.email = sortOrder;
          break;
        case "createdAt":
          orderByClause.createdAt = sortOrder;
          break;
        default:
          orderByClause.createdAt = "desc";
      }

      // Fetch users and the total count
      const [engineers, totalCount] = await Promise.all([
        prisma.user.findMany({
          where: whereClause,
          skip,
          take: pageSize,
          include: {
            address: true, // Include address if needed
          },
          orderBy: orderByClause,
        }),
        prisma.user.count({ where: whereClause }),
      ]);

      return {
        users: engineers,
        pagination: {
          currentPage: page,
          pageSize,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
        },
      };
    } catch (error) {
      console.error("Error fetching engineers:", error);
      throw new Error("Failed to fetch engineers");
    }
  }
);

export async function deleteEngineer(engineersId: string) {
  try {
    const deletedEngineer = await prisma.user.delete({
      where: {
        id: engineersId,
      },
    });

    revalidatePath("/admin/engineers");
    revalidatePath("/admin/orders/new");
    revalidatePath("/admin/orders/[order_id]", "page");
    revalidatePath(`/admin/orders/${deletedEngineer.id}`);

    return {
      message: "Engineer deleted successfully!",
      data: deletedEngineer,
      success: true,
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      message: "An error occurred while deleting the user.",
      success: false,
    };
  }
}

export const getEngineerById = cache(async (id: string) => {
  if (!id || typeof id !== "string" || id.trim() === "") {
    throw new Error("Invalid engineer ID provided");
  }

  try {
    const engineer = await prisma.user.findUnique({
      where: { id },
      include: {
        address: true,
        assignedOrders: {
          include: {
            packages: true,
          },
        },
      },
    });

    if (!engineer) {
      throw new Error(`Engineer with ID ${id} not found`);
    }

    return engineer;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2023":
          throw new Error("Invalid ID format provided. Please provide a valid ID.");
        default:
          throw new Error("A known database error occurred while fetching the engineer");
      }
    }

    console.error("Error fetching engineer:", error);
    throw new Error("An unexpected error occurred while fetching the engineer. Please try again later.");
  }
});


export async function sendEmailToEngineerAction(emailData: SendEmailDataType) {
  try {
    await sendEmail({
      fromEmail: EMAIL_ADDRESS,
      fromName: "Home Safety Cert",
      to: emailData.receiver,
      subject: emailData.subject,
      html: notifyEngineerEmailHtml(emailData.orderDetails, emailData.content),
    });

    // Revalidate the necessary paths if applicable (example paths)
    revalidatePath(`/admin/orders`);
    revalidatePath(`/admin/orders/${emailData.orderDetails?.id}`);

    return {
      message: "Email sent successfully!",
      success: true,
    };
  } catch (error: any) {
    console.error("Error sending email:", error);
    return {
      message:
        "An error occurred while sending the email. Please try again later.",
      success: false,
    };
  }
}
