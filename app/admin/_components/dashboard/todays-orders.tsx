"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatus, PaymentStatus, Prisma } from "@prisma/client";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { updateOrder } from "../../(require-auth)/orders/[order_id]/actions";

type PartialOrder = Prisma.OrderGetPayload<{
  select: {
    id: true;
    invoice: true;
    inspectionTime: true;
    status: true;
    paymentStatus: true;
    date: true;
    createdAt: true;
  };
}>;

type TodaysOrdersProps = {
  orders: PartialOrder[];
};

const formatEnumValue = (value: string): string => {
  return value
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

export default function TodaysOrders({ orders }: TodaysOrdersProps) {
  const [isPending, startTransition] = useTransition();
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    setUpdatingOrderId(orderId);
    startTransition(async () => {
      try {
        const result = await updateOrder({ orderId, orderStatus: newStatus });

        if (result.success) {
          toast({
            title: "Status updated",
            description: "Order status has been successfully updated.",
            variant: "success",
          });
        } else {
          throw new Error(result.message || "Failed to update order status");
        }
      } catch (error) {
        console.error("Error updating order status:", error);
        toast({
          title: "Error",
          description: "Failed to update order status. Please try again.",
          variant: "destructive",
        });
      } finally {
        setUpdatingOrderId(null);
      }
    });
  };

  const handlePaymentStatusChange = async (
    orderId: string,
    newStatus: PaymentStatus
  ) => {
    setUpdatingOrderId(orderId);
    startTransition(async () => {
      try {
        const result = await updateOrder({ orderId, paymentStatus: newStatus });

        if (result.success) {
          toast({
            title: "Payment status updated",
            description: "Order payment status has been successfully updated.",
          });
        } else {
          throw new Error(result.message || "Failed to update payment status");
        }
      } catch (error) {
        console.error("Error updating payment status:", error);
        toast({
          title: "Error",
          description: "Failed to update payment status. Please try again.",
          variant: "destructive",
        });
      } finally {
        setUpdatingOrderId(null);
      }
    });
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg font-semibold text-gray-600">
          No orders for today
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Check back later or create a new order.
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-[320px] overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-white z-10">
          <TableRow>
            <TableHead className="w-1/4">Order ID</TableHead>
            <TableHead className="w-1/4">Status</TableHead>
            <TableHead className="w-1/4">Payment Status</TableHead>
            <TableHead className="w-1/4">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              className="cursor-pointer hover:bg-gray-100"
            >
              <Link href={`/admin/orders/${order.id}`} className="contents">
                <TableCell className="w-1/4">{order.invoice}</TableCell>
              </Link>
              <TableCell className="w-1/4" onClick={(e) => e.stopPropagation()}>
                <div className="w-full">
                  <Select
                    value={order.status}
                    onValueChange={(value) =>
                      handleStatusChange(order.id, value as OrderStatus)
                    }
                    disabled={isPending && updatingOrderId === order.id}
                  >
                    <SelectTrigger className="w-full">
                      {isPending && updatingOrderId === order.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <SelectValue placeholder="Select status" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(OrderStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {formatEnumValue(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TableCell>
              <TableCell className="w-1/4" onClick={(e) => e.stopPropagation()}>
                <div className="w-full">
                  <Select
                    value={order.paymentStatus}
                    onValueChange={(value) =>
                      handlePaymentStatusChange(
                        order.id,
                        value as PaymentStatus
                      )
                    }
                    disabled={isPending && updatingOrderId === order.id}
                  >
                    <SelectTrigger className="w-full">
                      {isPending && updatingOrderId === order.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <SelectValue placeholder="Select payment status" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(PaymentStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {formatEnumValue(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TableCell>
              <Link href={`/admin/orders/${order.id}`} className="contents">
                <TableCell className="w-1/4">{order.inspectionTime}</TableCell>
              </Link>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
