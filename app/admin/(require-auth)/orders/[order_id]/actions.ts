"use server";

import prisma from "@/lib/prisma";
import { handlePrismaError } from "@/lib/prisma-error";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cache } from "react";

interface UpdateOrderParams {
  orderId: string;
  assignedEngineerId?: string;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
}

export const getEngineersForOrder = cache(async () => {
  try {
    const engineers = await prisma.user.findMany({
      where: {
        role: "STAFF",
      },
      orderBy: { name: "asc" },
      include: {
        address: true,
      },
    });
    return engineers;
  } catch (error) {
    console.error("Error fetching engineers:", error);
    throw new Error("Failed to fetch engineers");
  }
});

// export async function updateOrder(orderId: string, assignedEngineerId: string) {
//   try {
//     const currentOrder = await prisma.order.findUnique({
//       where: {
//         id: orderId,
//       },
//       select: {
//         assignedEngineerId: true,
//       },
//     });

//     if (currentOrder?.assignedEngineerId === assignedEngineerId) {
//       return {
//         message: "No changes detected. Order update skipped.",
//         success: false,
//       };
//     }

//     const updatedOrder = await prisma.order.update({
//       where: {
//         id: orderId,
//       },
//       data: {
//         assignedEngineerId: assignedEngineerId,
//       },
//     });

//     revalidatePath(`/admin/orders`);
//     revalidatePath(`/admin/orders/${updatedOrder.id}`);

//     return {
//       message: "Order updated successfully!",
//       data: updatedOrder,
//       success: true,
//     };
//   } catch (error) {
//     console.error("Error updating order:", error);
//     return {
//       message:
//         "An error occurred while updating the order. Please try again later.",
//       success: false,
//     };
//   }
// }

export async function updateOrder({
  orderId,
  assignedEngineerId,
  orderStatus,
  paymentStatus,
}: UpdateOrderParams) {
  try {
    const currentOrder = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        assignedEngineerId: true,
        status: true,
        paymentStatus: true,
      },
    });

    if (!currentOrder) {
      return {
        message: "Order not found",
        success: false,
      };
    }

    const updateData: any = {};
    let hasChanges = false;

    if (
      assignedEngineerId !== undefined &&
      assignedEngineerId !== currentOrder.assignedEngineerId
    ) {
      updateData.assignedEngineerId = assignedEngineerId;
      hasChanges = true;
    }

    if (orderStatus !== undefined && orderStatus !== currentOrder.status) {
      updateData.status = orderStatus;
      hasChanges = true;
    }

    if (
      paymentStatus !== undefined &&
      paymentStatus !== currentOrder.paymentStatus
    ) {
      updateData.paymentStatus = paymentStatus;
      hasChanges = true;
    }

    if (!hasChanges) {
      return {
        message: "No changes detected. Order update skipped.",
        success: false,
      };
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    revalidatePath("/", "layout");

    return {
      message: "Order updated successfully!",
      data: updatedOrder,
      success: true,
    };
  } catch (error) {
    console.error("Error updating order:", error);
    return handlePrismaError(error);
  }
}



export async function updateOrderStatus(orderId: string, orderStatus: string) {
  try {
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: orderStatus as OrderStatus,
      },
    });

    revalidatePath(`/admin/orders`);
    revalidatePath(`/admin/orders/${updatedOrder.id}`);

    return {
      message: "Order status updated successfully!",
      data: updatedOrder,
      success: true,
    };
  } catch (error) {
    console.error("Error updating order status:", error);
    return {
      message:
        "An error occurred while updating the order status. Please try again later.",
      success: false,
    };
  }
}
export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: string
) {
  try {
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        paymentStatus: paymentStatus as PaymentStatus,
      },
    });

    revalidatePath(`/admin/orders`);
    revalidatePath(`/admin/orders/${updatedOrder.id}`);

    return {
      message: "Order payment status updated successfully!",
      data: updatedOrder,
      success: true,
    };
  } catch (error) {
    console.error("Error updating order payment status:", error);
    return {
      message:
        "An error occurred while updating the order payment status. Please try again later.",
      success: false,
    };
  }
}

export const getCustomers = cache(async () => {
  try {
    const users = await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      include: {
        address: true,
      },
    });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
});

export const getEngineers = cache(async () => {
  try {
    const engineers = await prisma.user.findMany({
      where: { role: "STAFF" },
      orderBy: { name: "asc" },
      include: {
        address: true,
      },
    });
    return engineers;
  } catch (error) {
    console.error("Error fetching engineer:", error);
    throw new Error("Failed to fetch engineer");
  }
});

// TODO: property type are command

export const getPackages = cache(async (propertyType?: PropertyType) => {
  try {
    const packages = await prisma.package.findMany({
      where: {
        propertyType,
      },
      orderBy: {
        price: "asc",
      },
    });
    return packages;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw new Error("Failed to fetch services");
  }
});
