"use server";

import prisma from "@/lib/prisma";
import { OrderStatus, Prisma, Role } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import dayjs from "dayjs";
import exceljs from "exceljs";
import { revalidatePath } from "next/cache";
import puppeteer from "puppeteer";
import { CreateOrderFormInput, createOrderSchema } from "./new/schema";
import { sendEmail } from "@/lib/send-email";
import { BUSINESS_NAME, EMAIL_ADDRESS } from "@/shared/data";
import { notifyUserOrderPlacedEmailHtml } from "@/lib/notify-customer-order-placed-email";
import { getEngineerById } from "../engineers/actions"
import { notifyEngineerEmailHtml } from "@/lib/notify-engineer-email";
import { cache } from "react";
import { endOfDay, startOfDay, subDays } from "date-fns";

export const getOrders = cache(
  async (
    page: number = 1,
    pageSize: number = 10,
    search: string = "",
    sortBy: string = "createdAt",
    sortOrder: "asc" | "desc" = "desc",
    filterStatus: OrderStatus | "" = ""
  ) => {
    try {
      const skip = (page - 1) * pageSize;

      const whereClause: Prisma.OrderWhereInput = {
        AND: [
          search
            ? {
                OR: [
                  { invoice: { contains: search, mode: "insensitive" } },
                  {
                    user: { email: { contains: search, mode: "insensitive" } },
                  },
                  { user: { name: { contains: search, mode: "insensitive" } } },
                ],
              }
            : {},
          filterStatus ? { status: filterStatus } : {},
        ],
      };

      // Create orderBy clause
      const orderByClause: Prisma.OrderOrderByWithRelationInput = {};
      switch (sortBy) {
        case "name":
          orderByClause.user = { name: sortOrder };
          break;
        case "email":
          orderByClause.user = { email: sortOrder };
          break;
        case "price":
          orderByClause.totalPrice = sortOrder;
          break;
        case "createdAt":
          orderByClause.createdAt = sortOrder;
          break;
        default:
          orderByClause.createdAt = "desc";
      }

      const [orders, totalCount] = await Promise.all([
        prisma.order.findMany({
          where: whereClause,
          skip,
          take: pageSize,
          include: {
            user: {
              include: {
                address: true,
              },
            },
          },
          orderBy: orderByClause,
        }),
        prisma.order.count({ where: whereClause }),
      ]);
      // Generate Excel file

      return {
        orders,
        pagination: {
          currentPage: page,
          pageSize,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
        },
      };
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw new Error("Failed to fetch orders");
    }
  }
);


export const getTodayStats = async () => {
  const today = new Date();
  const yesterday = subDays(today, 1);

  try {
    const [todayOrders, yesterdayOrders] = await Promise.all([
      prisma.order.findMany({
        where: {
          date: {
            gte: startOfDay(today),
            lte: endOfDay(today),
          },
        },
        select: {
          id: true,
          status: true,
          totalPrice: true,
        },
      }),
      prisma.order.findMany({
        where: {
          date: {
            gte: startOfDay(yesterday),
            lt: startOfDay(today),
          },
        },
        select: {
          id: true,
          status: true,
          totalPrice: true,
        },
      }),
    ]);

    const todayTotalOrders = todayOrders.length;
    const yesterdayTotalOrders = yesterdayOrders.length;
    const todayCompletedOrders = todayOrders.filter(
      (order) => order.status === OrderStatus.COMPLETED
    ).length;
    const yesterdayCompletedOrders = yesterdayOrders.filter(
      (order) => order.status === OrderStatus.COMPLETED
    ).length;
    const todayEarnings = todayOrders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );
    const yesterdayEarnings = yesterdayOrders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    return {
      todayTotalOrders,
      yesterdayTotalOrders,
      todayCompletedOrders,
      yesterdayCompletedOrders,
      todayEarnings,
      yesterdayEarnings,
    };
  } catch (error) {
    console.error("Error fetching today's stats:", error);
    throw error;
  }
};

export const getTodayOrders = async () => {
  const today = new Date();

  try {
    const orders = await prisma.order.findMany({
      where: {
        date: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
        status: {
          notIn: [OrderStatus.CANCELLED, OrderStatus.COMPLETED],
        },
      },
      select: {
        id: true,
        invoice: true,
        inspectionTime: true,
        status: true,
        paymentStatus: true,
        date: true,
        createdAt: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    return orders;
  } catch (error) {
    console.error("Error fetching today's orders:", error);
    throw error;
  }
};



export const getOrderById = cache(async (orderId: string) => {
  try {
    if (!orderId) {
      console.error("No product ID available");
      // console.log("orderId",orderId);
      
      return null;
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        assignedEngineer: true,
        user: {
          include: {
            address: true,
          },
        },
        packages: true,
      },
    });

    return order;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw new Error("Failed to fetch order");
  }
});

export async function deleteOrder(orderId: string) {
  try {
    const deletedOrder = await prisma.order.delete({
      where: {
        id: orderId,
      },
    });

    revalidatePath("/admin/orders");

    return {
      message: "Order deleted successfully!",
      data: deletedOrder,
      success: true,
    };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      message: "An error occurred while deleting the order.",
      success: false,
    };
  }
}

export async function exportOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          include: {
            address: true,
          },
        },
      },
    });
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Orders");
    worksheet.columns = [
      { header: "Invoice ID", key: "invoice_id", width: 20 },
      { header: "Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 20 },
      { header: "Address", key: "address", width: 60 },
      { header: "Cost", key: "cost", width: 15 },
      { header: "Placed On", key: "createdAt", width: 20 },
    ];

    orders.forEach((order) => {
      worksheet.addRow({
        invoice_id: order.invoice,
        name: order.user?.name,
        email: order.user?.email,
        // phone: order.user?.phone,
        address: `${
          order.user?.address?.street ? order.user?.address?.street + "," : ""
        } ${order.user?.address?.city ?? ""} ${
          order.user?.address?.postcode ?? ""
        }`,
        cost: order.totalPrice,
        createdAt: dayjs(order?.user?.createdAt).format("DD MMMM YYYY"),
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const excelData = Buffer.from(buffer).toString("base64");
    return {
      message: "Orders Data Downloaded Successfully",
      data: excelData,
      success: true,
    };
  } catch (error) {
    return {
      message: "An error occured when downloading orders data" + error,
      success: false,
    };
  }
}

export default async function generateInvoice(orderId: string) {
  try {
    if (!orderId) {
      console.error("No order ID available");
      return null;
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        user: {
          include: {
            address: true,
          },
        },
        packages: true,
      },
    });

    if (!order) {
      return {
        message: "No order found",
        success: false,
      };
    }

    const parkingFee = order.parkingOptions === "FREE" ? 0 : 5;
    const congestionFee = order.isCongestionZone ? 5 : 0;
    const cartTotal = order.packages.reduce((sum, item) => sum + item.price, 0);
    const totalPrice = cartTotal + parkingFee + congestionFee;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Professional Invoice</title>
    <style>
        :root {
            --primary-color: #2c3e50;
            --secondary-color: #34495e;
            --accent-color: #3498db;
            --background-color: #ecf0f1;
            --text-color: #2c3e50;
            --border-color: #bdc3c7;
        }
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: var(--text-color);
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 800px;
            margin: 40px auto;
            background-color: white;
            padding: 40px;
        }
        .header {
            border-bottom: 2px solid var(--primary-color);
            padding-bottom: 10px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        .logo {
            max-width: 150px;
            height: auto;
        }
        .company-details {
            text-align: right;
            font-size: 0.9em;
        }
        .invoice-title {
            font-size: 28px;
            color: var(--primary-color);
            margin: 0 0 10px 0;
        }
        .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        .client-details, .invoice-info {
            flex-basis: 48%;
        }
        .section-title {
            font-size: 18px;
            color: var(--secondary-color);
            margin-bottom: 10px;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
        }
        thead {
            background-color: var(--secondary-color);
            color: white;
        }
        .amount-column {
            text-align: right;
        }
        .total-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-top: 20px;
        }
        .payment-status-section {
            flex-basis: 48%;
        }
        .totals {
            flex-basis: 48%;
            text-align: right;
        }
        .total-row {
            font-size: 1.2em;
            font-weight: bold;
            color: var(--accent-color);
        }
        .bank-details {
            margin-top: 20px;
            font-size: 0.9em;
            border-top: 1px solid var(--border-color);
            padding-top: 10px;
        }
        .bank-details-grid {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 5px 10px;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 0.9em;
            color: var(--secondary-color);
        }
        .payment-status {
            font-weight: bold;
            padding: 5px 10px;
            border-radius: 4px;
            display: inline-block;
            margin-top: 10px;
        }
        .status-UNPAID { background-color: #fecaca; color: #991b1b; }
        .status-PARTIALLY_PAID { background-color: #fef3c7; color: #92400e; }
        .status-PAID { background-color: #d1fae5; color: #065f46; }
        .status-REFUNDED { background-color: #e0e7ff; color: #3730a3; }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <img src="/api/placeholder/150/75" alt="Company Logo" class="logo">
            <div class="company-details">
                <h1 class="invoice-title">INVOICE</h1>
                <p>Home Safety Cert Limited<br>
                43 Felton Road, Barking<br>
                London, Great Britain, UK<br>
                United Kingdom</p>
            </div>
        </header>

        <div class="invoice-details">
            <div class="client-details">
                <h2 class="section-title">Bill To</h2>
                <p>
                    ${order?.user.name}<br>
                    ${order?.user.address?.street},<br>
                    ${order?.user.address?.city}, ${
      order?.user.address?.postcode
    }<br>
                    United Kingdom
                </p>
            </div>
            <div class="invoice-info">
                <h2 class="section-title">Invoice Details</h2>
                <p>
                    <strong>Invoice Number:</strong> ${order.invoice}<br>
                    <strong>Date:</strong> ${dayjs(order.date).format(
                      "MMMM DD, YYYY"
                    )}<br>
                    <strong>Due Date:</strong> ${dayjs(order.date)
                      .add(3, "day")
                      .format("MMMM DD, YYYY")}
                </p>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Description</th>
                    <th class="amount-column">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${order?.packages
                  .map(
                    (item) => `
                <tr>
                    <td>${item.name}</td>
                    <td class="amount-column">£${item.price.toFixed(2)}</td>
                </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>

        <div class="total-section">
            <div class="payment-status-section">
                
                <div class="payment-status status-${order.paymentStatus}">
                    ${order.paymentStatus}
                </div>
            </div>
            <div class="totals">
                <p><strong>Subtotal:</strong> £${cartTotal}</p>
                ${
                  order.isCongestionZone
                    ? `<p><strong>Congestion Zone Fee:</strong> £5.00</p>`
                    : ""
                }
                ${
                  order.parkingOptions !== "FREE"
                    ? `<p><strong>Parking Fee:</strong> £5.00</p>`
                    : ""
                }
                <p class="total-row">Total: £${totalPrice.toFixed(2)}</p>
            </div>
        </div>

        ${
          order.paymentMethod !== "CREDIT_CARD"
            ? `{" "}
              <div class="bank-details">
                <div class="bank-details-grid">
                  <span>
                    <strong>Bank:</strong>
                  </span>
                  <span>International Bank of Commerce</span>
                  <span>
                    <strong>Account:</strong>
                  </span>
                  <span>Home Safety Cert Limited</span>
                  <span>
                    <strong>Account No:</strong>
                  </span>
                  <span>1234567890</span>
                  <span>
                    <strong>Sort Code:</strong>
                  </span>
                  <span>12-34-56</span>
                </div>
              </div>
              <div class="footer">
                <p>
                  Thank you for your business. Please make payment within 15
                  days of the invoice date.
                </p>
              </div>
              `
            : ""
        }
    </div>
</body>
</html>
`;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the content of the page to the provided HTML
    await page.setContent(htmlContent);

    // Generate the PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    const pdfBase64 = Buffer.from(pdfBuffer).toString("base64");
    await browser.close();

    return {
      message: "Invoice Generated Successfully",
      data: pdfBase64,
      success: true,
    };
  } catch (error) {
    console.error("Error generating PDF:", error);
    return {
      message: "An error occured when generating invoice" + error,
      success: false,
    };
  }
}

export async function createOrder(data: CreateOrderFormInput) {
  try {
    const validatedData = createOrderSchema.parse(data);
    const packageIds = validatedData.packages.map((pkg) => pkg.packageId);

    const packages = await prisma.package.findMany({
      where: {
        id: {
          in: packageIds,
        },
      },
      select: {
        price: true,
      },
    });

    const packageTotal = packages.reduce((total, pkg) => total + pkg.price, 0);

    const totalPrice =
      packageTotal +
      (data.isCongestionZone ? 5 : 0) +
      (data.parkingOptions === "NO" || data.parkingOptions === "PAID" ? 5 : 0);

    const createdOrder = await prisma.order.create({
      data: {
        userId: data.userId,
        assignedEngineerId: data.assignedEngineer,
        propertyType: data.propertyType,
        residentialType: data.residentialType,
        isCongestionZone: data.isCongestionZone,
        parkingOptions: data.parkingOptions,
        date: data.date,
        inspectionTime: data.inspectionTime,
        totalPrice: totalPrice,
        invoice: data.invoiceId,
        status: "CONFIRMED",
        paymentStatus: "UNPAID",
        paymentMethod: data.paymentMethod,
        packages: {
          connect: data.packages.map((pack) => ({ id: pack.packageId })),
        },
      },
      include: {
        packages: true,
        user: {
          include: {
            address: true,
          },
        },
        assignedEngineer: true,
      },
    });

    await sendEmail({
      fromEmail: EMAIL_ADDRESS,
      fromName: "Home Safety Cert",
      to: createdOrder?.user.email ?? "",
      subject: "Order Placed Successfully",
      html: notifyUserOrderPlacedEmailHtml(createdOrder),
    });

    if (createdOrder.assignedEngineer) {
      const content = `Dear ${createdOrder.assignedEngineer.name},\n\nYou have been assigned a new order. The order number is ${createdOrder.invoice}. Please review the details and proceed with the necessary steps to complete the assigned tasks. Ensure all protocols are followed, and keep the customer updated on the progress.\n\nIf you encounter any issues or need further assistance, feel free to reach out to the management team.\n\nThank you for your dedication and hard work.\n\nBest regards,\nThe ${BUSINESS_NAME} Management Team`;

      await sendEmail({
        fromEmail: EMAIL_ADDRESS,
        fromName: "Home Safety Cert",
        to: createdOrder.assignedEngineer.email,
        subject: "New Service Order",
        html: notifyEngineerEmailHtml(createdOrder, content),
      });
    }

    // Revalidate paths if needed
    revalidatePath("/admin/orders");
    revalidatePath("/admin/orders/[order_id]", "page");
    revalidatePath(`/admin/customers/${createdOrder.userId}`);
    revalidatePath("/admin/engineers/[engineer_id]", "page");

    return {
      message: "Order created successfully!",
      emailMessage: "Email sent successrylly!",
      data: createdOrder,
      success: true,
      emailSuccess: true,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "An error occurred while creating the order.",
      emailMessage: "An error occoured while sending email",
      emailSuccess: false,
    };
  }
}

interface CreateUserInput {
  name: string;
  email: string;
  phone: string | "";
  address: {
    city: string | "";
    street: string | "";
    postcode: string | "";
  };
  expertise?: string;
}

export async function createUser(data: CreateUserInput, userType: Role) {
  try {
    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: "123456",
        role: userType,
        phone: data.phone,
        ...(userType === "STAFF" && { expertise: data.expertise }),
        address: data.address
          ? {
              create: {
                street: data.address.street,
                city: data.address.city,
                postcode: data.address.postcode,
              },
            }
          : undefined,
      },
      include: {
        address: true,
      },
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin/orders/new");
    revalidatePath("/admin/customers");
    revalidatePath("/admin/engineers");

    return {
      message: "User created successfully!",
      data: newUser,
      success: true,
    };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          return {
            message: `A user with this ${error.meta?.target} already exists.`,
            success: false,
          };
        case "P2003":
          return {
            message: `Foreign key constraint failed on the field: ${error.meta?.field_name}`,
            success: false,
          };
        case "P2005":
          return {
            message: `Invalid value provided for ${error.meta?.field_name}.`,
            success: false,
          };
        case "P2006":
          return {
            message: `The value provided is too long for the field: ${error.meta?.field_name}.`,
            success: false,
          };
        case "P2011":
          return {
            message: `Missing required field: ${error.meta?.field_name}.`,
            success: false,
          };
        case "P2025":
          return {
            message: `Record does not exist.`,
            success: false,
          };
        default:
          return {
            message: "An unknown error occurred.",
            success: false,
          };
      }
    } else {
      console.error("Unhandled error:", error);
      return {
        message: "An unexpected error occurred.",
        success: false,
      };
    }
  }
}
