"use client";


import DynamicBreadcrumb from "@/components/dynamic-breadcrumb";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { calculateSubtotal, calculateTotal, cn } from "@/lib/utils";
import { StaffWithRelations } from "@/types/engineers";
import { OrderWithRelation } from "@/types/order";

import dayjs from "dayjs";
import {
  Bed,
  Building,
  CalendarDays,
  CarFront,
  Check,
  ChevronLeft,
  ChevronsUpDown,
  Clock,
  Copyright,
  Download,
  Home,
  Map,
  Package,
  Phone,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import {
  sendEmailToCustomerOrderCancelled,
  sendEmailToCustomerOrderCompleted,
  sendEmailToCustomerOrderConfirmation,
} from "../../../customers/actions";
import generateInvoice from "../../actions";



import { Badge } from "@/components/ui/badge";
import { LoadingButton } from "@/components/ui/loading-button";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { BUSINESS_NAME } from "@/shared/data";
import { updateOrder, updateOrderStatus, updatePaymentStatus } from "../actions";
import { ContentLayout } from "@/app/admin/_components/admin-panel/content-layout";
import SendEmailDialog from "./send-email-dialog";
import PackageTableRow from "./service-table-row";
import { ORDER_STATUS_OPTIONS, PAYMENT_STATUS_OPTION } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

export default function EditOrderForm({
  orderDetails,
  engineers,
}: {
  orderDetails: OrderWithRelation;
  engineers: StaffWithRelations[] | null;
}) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [openAssignedEngineers, setOpenAssignedEngineers] = useState(false);
  const [selectedEngineer, setSelectedEngineer] = useState(
    orderDetails?.assignedEngineerId ?? ""
  );
  const [selectedEngineerEmail, setSelectedEngineerEmail] = useState("");
  useEffect(() => {
    if (orderDetails?.assignedEngineerId) {
      engineers?.find(
        (engineer) =>
          engineer.id === selectedEngineer &&
          setSelectedEngineerEmail(engineer.email)
      );
    }
  }, [orderDetails?.assignedEngineerId, engineers, selectedEngineer]);

  const [status, setStatus] = useState<OrderStatus>(orderDetails.status);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    orderDetails.paymentStatus
  );
  const [isPending, startTransition] = useTransition();

  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Orders", href: "/admin/orders" },
    {
      label: `Edit ${orderDetails?.invoice}`,
      href: `/admin/orders/${orderDetails?.invoice}`,
      isCurrentPage: true,
    },
  ];

  const handleUpdateOrderStatus = (value: OrderStatus) => {
    startTransition(async () => {
      if (orderDetails?.id) {
        setStatus(value);
        const result = await updateOrderStatus(orderDetails.id, value);
        toast({
          title: result.success ? "Success" : "Error",
          description: result.message,
          variant: result.success ? "success" : "destructive",
        });
        if (value === "CONFIRMED") {
          const emailData = {
            receiver: orderDetails?.user.email,
            subject: "Order Confirmation",
            content: `Dear ${orderDetails?.user.name},\n\nThank you for your order. Your order has been confirmed. Your order number is ${orderDetails?.invoice}.`,
            orderDetails: orderDetails,
          };
          const response = await sendEmailToCustomerOrderConfirmation(
            emailData
          );
          toast({
            title: response.success ? "Success" : "Error",
            description: response.message,
            variant: response.success ? "success" : "destructive",
          });
        }
        if (value === "COMPLETED") {
          const emailData = {
            receiver: orderDetails?.user.email,
            subject: "Order Completed",
            content: `Dear ${orderDetails?.user.name},\n\nWe are pleased to inform you that your order has been successfully completed. Your order number is ${orderDetails?.invoice}. If you have any questions or need further assistance, please feel free to contact us.\n\nThank you for choosing ${BUSINESS_NAME}!\n\nBest regards,\nThe ${BUSINESS_NAME} Team`,
            orderDetails: orderDetails,
          };

          const response = await sendEmailToCustomerOrderCompleted(emailData);
          toast({
            title: response.success ? "Success" : "Error",
            description: response.message,
            variant: response.success ? "success" : "destructive",
          });
        }
        if (value === "CANCELLED") {
          const emailData = {
            receiver: orderDetails?.user.email,
            subject: "Order Cancelled",
            content: `Dear ${orderDetails?.user.name},We regret to inform you that your order has been canceled. Your order number was ${orderDetails?.invoice}.`,
            orderDetails: orderDetails,
          };

          const response = await sendEmailToCustomerOrderCancelled(emailData);
          toast({
            title: response.success ? "Success" : "Error",
            description: response.message,
            variant: response.success ? "success" : "destructive",
          });
        }
      }
    });
  };
  const handleUpdatePaymentStatus = (value: PaymentStatus) => {
    startTransition(async () => {
      if (orderDetails?.id) {
        setPaymentStatus(value);
        const result = await updatePaymentStatus(orderDetails.id, value);
        toast({
          title: result.success ? "Success" : "Error",
          description: result.message,
          variant: result.success ? "success" : "destructive",
        });
      }
    });
  };

  const handleSelectEngineer = (engineerId: string) => {
    setSelectedEngineer(engineerId);

    if (engineerId === orderDetails?.assignedEngineerId) {
      return;
    }

    //TODO: orderDetails.id, engineerId replace to {
        //   orderId: orderDetails?.id,
        //   assignedEngineerId: engineerId,  
        // }
    startTransition(async () => {
      if (orderDetails?.id) {
        const result = await updateOrder({
          orderId: orderDetails?.id,
          assignedEngineerId: engineerId,  
        });
        setOpenAssignedEngineers(false);
        toast({
          title: result.success ? "Success" : "Error",
          description: result.message,
          variant: result.success ? "success" : "destructive",
        });
      }
    });
  };
  const handleSelectEngineerEmail = (engineerEmail: string) => {
    setSelectedEngineerEmail(engineerEmail);
  };

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      const response = await generateInvoice(orderDetails.id);

      if (!response?.data) {
        throw new Error();
      }

      const binaryString = atob(response.data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);

      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create a Blob from the binary data
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // Trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice_${orderDetails.invoice}`;
      a.click();
    } catch (error) {
      // console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ContentLayout title="Edit Order">
      <DynamicBreadcrumb items={breadcrumbItems} />

      <div className="mb-6 mt-7">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center mb-2">
            <Link href="/admin/orders">
              <Button variant="outline" size="icon" className="h-7 w-7 mr-2">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Edit {orderDetails?.invoice}</h1>
          </div>
          <div className="flex gap-3">
            <Select
              value={status as OrderStatus}
              onValueChange={(value) => {
                if (value) {
                  handleUpdateOrderStatus(value as OrderStatus);
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {ORDER_STATUS_OPTIONS.map((option) => (
                    <SelectItem value={option} key={option}>
                      {option.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <LoadingButton
              type="button"
              disabled={isLoading}
              loading={isLoading}
              className="text-sm h-9 font-medium flex items-center"
              onClick={handleDownload}
              variant="default"
            >
              {!isLoading && <Download className="mr-2 h-4 w-4" />}
              Download Invoice
            </LoadingButton>
          </div>
        </div>
        <Badge variant="outline">
          Placed:{" "}
          {dayjs(new Date(orderDetails.createdAt)).format("DD-MM-YYYY HH:mm A")}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Assigned Engineers</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <Popover
                  open={openAssignedEngineers}
                  onOpenChange={setOpenAssignedEngineers}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openAssignedEngineers}
                      className="w-full sm:w-[400px] justify-between"
                    >
                      {selectedEngineer
                        ? engineers?.find(
                            (engineer) => engineer.id === selectedEngineer
                          )?.name
                        : "Select engineer"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Search engineer..." />
                      <CommandList>
                        <CommandEmpty>No engineer found.</CommandEmpty>
                        <CommandGroup>
                          {engineers?.map((engineer) => (
                            <CommandItem
                              value={engineer.name ?? ""}
                              key={engineer.id}
                              onSelect={() => handleSelectEngineer(engineer.id)}
                              onChange={() =>
                                handleSelectEngineerEmail(engineer.email)
                              }
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  engineer.id === selectedEngineer
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {engineer.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <SendEmailDialog
                  engineerEmail={selectedEngineerEmail}
                  orderDetails={orderDetails}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              {orderDetails?.packages && orderDetails.packages.length > 0 ? (
                <>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Unit</TableHead>
                          <TableHead>Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderDetails.packages.map((pack) => (
                          <PackageTableRow pack={pack} key={pack?.id} />
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Payment Method:</span>
                      <span>
                        {orderDetails.paymentMethod.replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Payment Status:</span>
                      <span>
                        <Select
                          value={paymentStatus as PaymentStatus}
                          onValueChange={(value) => {
                            if (value) {
                              handleUpdatePaymentStatus(value as PaymentStatus);
                            }
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Update Payment Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {PAYMENT_STATUS_OPTION.map((option) => (
                                <SelectItem value={option} key={option}>
                                  {option.replace("_", " ")}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Subtotal:</span>
                      <span>£{calculateSubtotal(orderDetails.packages)}</span>
                    </div>
                    {orderDetails.isCongestionZone && (
                      <div className="flex justify-between">
                        <span>Congestion Zone Fee:</span>
                        <span>£5.00</span>
                      </div>
                    )}
                    {orderDetails.parkingOptions !== "FREE" && (
                      <div className="flex justify-between">
                        <span>Parking Fee:</span>
                        <span>£5.00</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>£{calculateTotal(orderDetails)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No services added
                  </h3>
                  <p className="text-sm text-gray-500">
                    There are no services associated with this order.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Schedule Info</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5 text-gray-500" />
                  <span className="text-sm">
                    {orderDetails?.date
                      ? dayjs(new Date(orderDetails.date)).format("DD MMM YYYY")
                      : "Date not available"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span className="text-sm">
                    {orderDetails?.inspectionTime ?? "Time not set"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Notes</h2>
              <p className="text-gray-700">
                {orderDetails?.orderNotes || "No notes available"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
            <div className="flex items-center mb-4">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarFallback>
                  {orderDetails?.user?.name?.charAt(0) ?? "A"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{orderDetails?.user.name}</p>
                <p className="text-sm text-gray-500">
                  {orderDetails?.user.email}
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-gray-500" />
                <span>{orderDetails?.user?.phone || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Map className="h-5 w-5 text-gray-500 mt-1" />
                <span>
                  {orderDetails?.user?.address?.street &&
                    `${orderDetails.user.address.street}, `}
                  {orderDetails?.user?.address?.city &&
                    `${orderDetails.user.address.city} `}
                  {orderDetails?.user?.address?.postcode}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Property Details</h2>
            <div className="space-y-3 text-sm">
                {/* TODO: property type command */}
              <div className="flex items-center gap-2">
                {orderDetails?.propertyType === "RESIDENTIAL" ? (
                  <Home className="h-5 w-5 text-gray-500" />
                ) : (
                  <Building className="h-5 w-5 text-gray-500" />
                )}
                <span>{orderDetails?.propertyType || "N/A"}</span>
              </div>
              {orderDetails?.propertyType === "RESIDENTIAL" && (
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-gray-500" />
                  <span>{orderDetails?.residentialType || "N/A"}</span>
                </div>
              )}
              {orderDetails?.propertyType === "COMMERCIAL" && (
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-gray-500" />
                  <span>{orderDetails?.commercialType || "N/A"}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <CarFront className="h-5 w-5 text-gray-500" />
                <span>
                  {orderDetails?.parkingOptions === "PAID"
                    ? "Paid parking available"
                    : orderDetails?.parkingOptions === "NO"
                    ? "No parking available"
                    : "Free parking available"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Copyright className="h-5 w-5 text-gray-500" />
                <span>
                  {orderDetails?.isCongestionZone
                    ? "In Congestion Zone"
                    : "Outside Congestion Zone"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Activity</h2>
            {/* Add order activity content here */}
            <p className="text-gray-500">No recent activity</p>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
