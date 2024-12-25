"use server";

import { notifyUserCancelEmailHtml } from "@/lib/notify-customer-order-cancel-email";
import { notifyUserCompleteEmailHtml } from "@/lib/notify-customer-order-completd-email";
import { notifyUserConfirmEmailHtml } from "@/lib/notify-customer-order-confirm-email";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/send-email";
import { EMAIL_ADDRESS } from "@/shared/data";
import { SendEmailDataType } from "@/types/misc";
import { Prisma, Role } from "@prisma/client";
import dayjs from "dayjs";
import exceljs from "exceljs";
import { revalidatePath } from "next/cache";
import { cache } from "react";

export const getUsers = cache(
  async (
    type: Role,
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
          { role: type },
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
      const [users, totalCount] = await Promise.all([
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
        users,
        pagination: {
          currentPage: page,
          pageSize,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
        },
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }
  }
);

export async function deleteCustomer(customerId: string) {
  try {
    const deletedCustomer = await prisma.user.delete({
      where: {
        id: customerId,
      },
    });

    revalidatePath("/admin/customers");
    revalidatePath("/admin/orders/new");
    revalidatePath("/admin/orders");

    return {
      message: "Customer deleted successfully!",
      data: deletedCustomer,
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

export async function exportCustomers() {
  try {
    const users = await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      include: {
        address: true,
      },
    });

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Customers");

    worksheet.columns = [
      { header: "Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 20 },
      { header: "Address", key: "address", width: 60 },
      { header: "Placed On", key: "createdAt", width: 20 },
    ];

    users.forEach((user) => {
      worksheet.addRow({
        name: user?.name,
        email: user?.email,
        phone: user?.phone,
        address: `${user?.address?.street ? user?.address?.street + "," : ""} ${
          user?.address?.city ?? ""
        } ${user?.address?.postcode ?? ""}`,
        createdAt: dayjs(user?.createdAt).format("DD MMMM YYYY"),
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const excelData = Buffer.from(buffer).toString("base64");

    return {
      message: "Customer Data Downloaded Successfully",
      data: excelData,
      success: true,
    };
  } catch (error) {
    return {
      message: "An error occured when downloading customers data" + error,
      success: false,
    };
  }
}

//get Customer By Id
export const getCustomerById = cache(async (customerId: string) => {
  try {
    const customer = await prisma.user.findUnique({
      where: { id: customerId },
      include: {
        address: true,
        orders: {
          include: {
            packages: true,
          },
        },
      },
    });

    if (!customer) {
      return null;
    }

    return customer;
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw new Error("Failed to fetch customer");
  }
});

export const getOrdersByUsers = cache(async (userId: string) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        packages: true,
      },
    });
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
});

export async function sendEmailToCustomerOrderConfirmation(
  emailData: SendEmailDataType
) {
  try {
    await sendEmail({
      fromEmail: EMAIL_ADDRESS,
      fromName: "Home Safety Cert",
      to: emailData.receiver,
      subject: emailData.subject,
      html: notifyUserConfirmEmailHtml(
        emailData.orderDetails,
        emailData.content
      ),
    });

    // Revalidate the necessary paths if applicable (example paths)
    revalidatePath(`/admin/orders`);
    revalidatePath(`/admin/orders/${emailData.orderDetails?.id}`);

    return {
      message: "Email sent successfully to customer!",
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
export async function sendEmailToCustomerOrderCompleted(
  emailData: SendEmailDataType
) {
  try {
    await sendEmail({
      fromEmail: EMAIL_ADDRESS,
      fromName: "Home Safety Cert",
      to: emailData.receiver,
      subject: emailData.subject,
      html: notifyUserCompleteEmailHtml(
        emailData.orderDetails,
        emailData.content
      ),
    });

    // Revalidate the necessary paths if applicable (example paths)
    revalidatePath(`/admin/orders`);
    revalidatePath(`/admin/orders/${emailData.orderDetails?.id}`);

    return {
      message: "Email sent successfully to customer!",
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

export async function sendEmailToCustomerOrderCancelled(
  emailData: SendEmailDataType
) {
  try {
    await sendEmail({
      fromEmail: EMAIL_ADDRESS,
      fromName: "Home Safety Cert",
      to: emailData.receiver,
      subject: emailData.subject,
      html: notifyUserCancelEmailHtml(
        emailData.orderDetails,
        emailData.content
      ),
    });

    // Revalidate the necessary paths if applicable (example paths)
    revalidatePath(`/admin/orders`);
    revalidatePath(`/admin/orders/${emailData.orderDetails?.id}`);

    return {
      message: "Email sent successfully to customer!",
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
