"use server";

import { CustomerDetails } from "@/hooks/use-order-store";
import {
  generateInvoiceId,
  generateInvoiceTemplate,
} from "@/lib/generate-invoice";
import { notifyAdminOrderPlacedEmailHtml } from "@/lib/notify-admin-order-placed";
import { placedOrderEmailHtml } from "@/lib/placed-order-html";
import prisma from "@/lib/prisma";
import { handlePrismaError } from "@/lib/prisma-error";
import { sendEmail } from "@/lib/send-email";
import { EMAIL_ADDRESS } from "@/shared/data";
import { Order, PaymentMethod, Prisma, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { jsPDF } from "jspdf";

// Updated OrderData type without cartItems
type OrderData = {
  customerDetails: CustomerDetails;
  paymentMethod: PaymentMethod;
  subTotal: number;
  vat: number;
  totalPrice: number; // Final total price including VAT
};

export type OrderWithRelation = Prisma.OrderGetPayload<{
  include: {
    user: {
      include: {
        address: true;
      };
    };
  };
}>;

// Function to generate an invoice
async function generateInvoice(order: OrderWithRelation) {
  try {
    if (!order) {
      console.error("No order available to generate invoice");
      return null;
    }

    // Use subTotal, VAT, and total price for the invoice
    const { totalPrice } = order;
    console.log("order", order);
    

    // Create a new PDF document
    const doc = new jsPDF();

    // Generate the invoice template
    generateInvoiceTemplate(doc, {
      order,
      subTotal: order.subTotal,
      totalPrice,
    });

    // Get the PDF as a base64 string
    const pdfBase64 = doc.output("datauristring").split(",")[1];

    return {
      message: "Invoice Generated Successfully",
      data: pdfBase64,
      success: true,
    };
  } catch (error) {
    console.error("Error generating PDF:", error);
    return {
      message: handlePrismaError(error).message,
      data: null,
      success: false,
    };
  }
}

// Function to create an order without cartItems
export async function createOrder(orderData: OrderData): Promise<{
  success: boolean;
  data: Order | null;
  message: string;
}> {
  const { customerDetails, paymentMethod, subTotal, vat, totalPrice } = orderData;

  try {
    const result = await prisma.$transaction(
      async (transactionPrisma) => {
        // User role check
        const existingUser = await transactionPrisma.user.findUnique({
          where: { email: customerDetails.email },
          select: { id: true, role: true },
        });

        if (
          existingUser &&
          (existingUser.role === Role.ADMIN || existingUser.role === Role.STAFF)
        ) {
          throw new Error(
            "Admins and staff members are not allowed to place orders."
          );
        }

        // User upsert
        const upsertedUser = await transactionPrisma.user.upsert({
          where: { email: customerDetails.email },
          update: {
            name: customerDetails.name,
            phone: customerDetails.phone,
            address: {
              update: {
                city: customerDetails.city,
                street: customerDetails.houseStreet,
                postcode: customerDetails.postCode,
              },
            },
          },
          create: {
            name: customerDetails.name,
            email: customerDetails.email,
            password: "12345678", // Store the hashed password
            phone: customerDetails.phone,
            role: Role.CUSTOMER,
            address: {
              create: {
                city: customerDetails.city,
                street: customerDetails.houseStreet,
                postcode: customerDetails.postCode,
              },
            },
          },
        });

        // Order creation
        const invoiceNumber = await generateInvoiceId();

        const createdOrder = await transactionPrisma.order.create({
          data: {
            userId: upsertedUser.id,
            // date: customerDetails.orderDate,
            subTotal: subTotal,
            vat: vat,
            totalPrice: totalPrice,
            invoice: invoiceNumber,
            paymentMethod: paymentMethod,
            paymentStatus: paymentMethod === "CREDIT_CARD" ? "PAID" : "UNPAID",
            status: "PENDING",
          },
          include: {
            user: {
              include: {
                address: true,
              },
            },
          },
        });
        

        // Invoice generation
        const invoice = await generateInvoice(createdOrder);

        if (!invoice?.data) {
          console.log(invoice);
          throw new Error(invoice?.message);
        }

        // Email sending
        const attachments = [
          {
            ContentType: "application/pdf",
            Filename: `Invoice_${createdOrder.invoice}.pdf`,
            Base64Content: invoice?.data,
          },
        ];

        await sendEmail({
          fromEmail: EMAIL_ADDRESS,
          fromName: "Home Safety Cert",
          to: createdOrder.user.email,
          subject: "Thank You for Your Order",
          html: placedOrderEmailHtml(
            createdOrder.user.name ?? "",
            createdOrder.invoice
          ),
          attachments,
        });

        // Then, send a copy to the admin
        await sendEmail({
          fromEmail: EMAIL_ADDRESS,
          fromName: "Home Safety Cert",
          to: EMAIL_ADDRESS, // This is the admin's email address
          subject: `New Order Received - ${createdOrder.invoice}`,
          html: notifyAdminOrderPlacedEmailHtml(createdOrder),
          attachments,
        });

        console.log("All steps completed successfully within the transaction");
        return createdOrder;
      },
      {
        maxWait: 5000, // 5 seconds max to wait for a transaction slot
        timeout: 30000, // 30 seconds max to allow the transaction to run
      }
    );

    // Transaction succeeded, now we can revalidate paths
    revalidatePath("/admin", "layout");

    return {
      success: true,
      data: result,
      message: "Your order has been successfully placed",
    };
  } catch (error) {
    console.error(
      "Transaction failed, all changes have been rolled back:",
      error
    );
    const message = handlePrismaError(error).message;

    return {
      success: false,
      data: null,
      message,
    };
  }
}
