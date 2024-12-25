"use client";

import DynamicBreadcrumb from "@/components/dynamic-breadcrumb";
import { Button } from "@/components/ui/button";


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CustomerWithRelation } from "@/types/customer";
import { StaffWithRelations } from "@/types/engineers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Package } from "@prisma/client";
import { format } from "date-fns";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Plus,
  Trash,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";

import { CreateOrderFormInput, createOrderSchema } from "../schema";
import CreateUser from "./create-user";
import { createOrder } from "../../actions";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { ContentLayout } from "@/app/admin/_components/admin-panel/content-layout";
import { useToast } from "@/components/ui/use-toast";

export default function CreateOrderForm({
  customers,
  engineers,
  packages,
  invoiceId,
}: {
  customers: CustomerWithRelation[];
  engineers: StaffWithRelations[];
  packages: Package[];
  invoiceId: string;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");

  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Orders", href: "/admin/orders" },
    { label: "Create Order", href: "/admin/orders/new", isCurrentPage: true },
  ];

  const form = useForm<CreateOrderFormInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      propertyType: "RESIDENTIAL",
      packages: [
        {
          packageId: "",
        },
      ],
      invoiceId: invoiceId,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;
  const [isPending, startTransition] = useTransition();
  const [openUserComboBox, setOpenUserComboBox] = useState<boolean>(false);
  const [openEngineerComboBox, setOpenEngineerComboBox] =
    useState<boolean>(false);

  const {
    fields: serviceFields,
    append: appendService,
    remove: removeService,
  } = useFieldArray<CreateOrderFormInput>({
    control,
    name: "packages",
  });

  const selectedPackages = form.watch("packages");
  const isCongestionZone = form.watch("isCongestionZone");
  const parkingOptions = form.watch("parkingOptions");

  const priceSummary = () => {
    const subtotal = selectedPackages.reduce((total, pkg) => {
      const selectedPackage = packages.find((p) => p.id === pkg.packageId);
      return total + (selectedPackage?.price || 0);
    }, 0);

    const congestionCharge = isCongestionZone ? 5 : 0;
    const parkingCharge = parkingOptions !== "FREE" ? 5 : 0;
    const total = subtotal + congestionCharge + parkingCharge;

    return { subtotal, congestionCharge, parkingCharge, total };
  };

  const onCreateOrderSubmit: SubmitHandler<CreateOrderFormInput> = async (
    data
  ) => {
    startTransition(async () => {
      try {
        const result = await createOrder(data);
        // console.log("result order:", result);
        

        if (result.success) {
          toast({
            title: "Success",
            description: result.message,
            variant: "success",
          });

          toast({
            title: result.emailSuccess ? "Success" : "Error",
            description: result.emailMessage,
            variant: result.emailSuccess ? "success" : "destructive",
          });

          router.push("/admin/orders");
        } else {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unknown error occurred",
          variant: "destructive",
        });
      }
    });
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors and try again.",
        variant: "destructive",
      });
    }
  }, [errors, toast]);

  return (
    <ContentLayout title="Create Order">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onCreateOrderSubmit)}
          className="space-y-8 mt-7 mb-20"
        >
          <div>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold mb-2">Create New Order</h1>

              <div className="flex justify-end gap-3">
                <Link href="/admin/orders">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 w-full text-sm font-medium flex"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </Link>

                <LoadingButton
                  onClick={() => handleSubmit(onCreateOrderSubmit)()}
                  disabled={isPending}
                  loading={isPending}
                  className="h-9 w-full text-sm font-medium flex"
                >
                  {!isPending && <Check className="mr-2 h-4 w-4" />}
                  Create Order
                </LoadingButton>
              </div>
            </div>
            <p className="text-gray-600">
              Please fill out the details below to create a new inspection
              order.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>
                Provide the customer&lsquo;s details or create a new customer
                profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-12">
                <div className="col-span-4">
                  <FormField
                    control={control}
                    name="userId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Customer</FormLabel>
                        <FormControl>
                          <Popover
                            open={openUserComboBox}
                            onOpenChange={setOpenUserComboBox}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openUserComboBox}
                                className="w-full justify-between"
                              >
                                {field.value ? (
                                  customers?.find(
                                    (customer) => customer.id === field.value
                                  )?.email
                                ) : (
                                  <span className="text-muted-foreground">
                                    Select a customer
                                  </span>
                                )}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[350px] p-0">
                              <Command>
                                <CommandInput placeholder="Search customers..." />
                                <CommandList>
                                  <CommandEmpty>
                                    No customers found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {customers?.map((customer) => (
                                      <CommandItem
                                        key={customer.id}
                                        value={customer.email}
                                        onSelect={() => {
                                          field.onChange(customer.id);
                                          setCustomerEmail(customer.email);
                                          setCustomerName(customer.name ?? "");
                                          setOpenUserComboBox(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value === customer.id
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {customer.email}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-2 mt-8">
                  <CreateUser userType="CUSTOMER" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inspection Details</CardTitle>
              <CardDescription>
                Specify the date, time, and assigned engineer for the
                inspection.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-12">
                <div className="col-span-3">
                  <FormField
                    control={control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inspection Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-3">
                  <FormField
                    control={control}
                    name="inspectionTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inspection Time</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select inspection time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MORNING">
                              08:00 AM - 12:00 PM
                            </SelectItem>
                            <SelectItem value="AFTERNOON">
                              12:00 PM - 04:00 PM
                            </SelectItem>
                            <SelectItem value="EVENING">
                              04:00 PM - 08:00 PM
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-6 sm:block hidden"></div>

                <div className="col-span-3">
                  <FormField
                    control={control}
                    name="assignedEngineer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assigned Engineer</FormLabel>
                        <FormControl>
                          <Popover
                            open={openEngineerComboBox}
                            onOpenChange={setOpenEngineerComboBox}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openEngineerComboBox}
                                className="w-full justify-between"
                              >
                                {field.value ? (
                                  engineers?.find(
                                    (engineer) => engineer.id === field.value
                                  )?.email
                                ) : (
                                  <span className="text-muted-foreground">
                                    Select an engineer
                                  </span>
                                )}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[250px] p-0">
                              <Command>
                                <CommandInput placeholder="Search engineers..." />
                                <CommandList>
                                  <CommandEmpty>
                                    No engineers found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {engineers?.map((engineer) => (
                                      <CommandItem
                                        key={engineer.id}
                                        value={engineer.email}
                                        onSelect={() => {
                                          field.onChange(engineer.id);
                                          setOpenEngineerComboBox(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value === engineer.id
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {engineer.email}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Property Information</CardTitle>
              <CardDescription>
                Provide details about the property and parking situation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-12">
                <div className="col-span-4">
                  <FormField
                    control={form.control}
                    name="propertyType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Property Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="RESIDENTIAL" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Residential
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="COMMERCIAL" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Commercial
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <p>Select Property</p>
                </div>

                <div className="col-span-4">
                  <FormField
                    control={form.control}
                    name="parkingOptions"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Is Parking Available?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="FREE" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Free
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="NO" />
                              </FormControl>
                              <FormLabel className="font-normal">No</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="PAID" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Paid
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-4">
                  <FormField
                    control={form.control}
                    name="isCongestionZone"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Is Property in Congestion Zone?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) =>
                              field.onChange(value === "true")
                            }
                            value={field.value ? "true" : "false"}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="true" />
                              </FormControl>
                              <FormLabel className="font-normal">Yes</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="false" />
                              </FormControl>
                              <FormLabel className="font-normal">No</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {form.watch("propertyType") === "RESIDENTIAL" && (
                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name="residentialType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Residential Type (Optional)</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select residential type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="BUNGALOW">Bungalow</SelectItem>
                              <SelectItem value="MID_TERRACED_HOUSE">
                                Mid Terraced House
                              </SelectItem>
                              <SelectItem value="DETACHED_HOUSE">
                                Detached House
                              </SelectItem>
                              <SelectItem value="SEMI_DETACHED_HOUSE">
                                Semi-detached House
                              </SelectItem>
                              <SelectItem value="FLAT">Flat</SelectItem>
                              <SelectItem value="APARTMENT">
                                Apartment
                              </SelectItem>
                              <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {form.watch("propertyType") === "COMMERCIAL" && (
                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name="commercialType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Commercial Type (Optional)</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select commercial type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="PUB">Pub</SelectItem>
                              <SelectItem value="STORE">Store</SelectItem>
                              <SelectItem value="OFFICE">Office</SelectItem>
                              <SelectItem value="RESTAURANT">
                                Restaurant
                              </SelectItem>
                              <SelectItem value="WAREHOUSE">
                                Warehouse
                              </SelectItem>
                              <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Services</CardTitle>
              <CardDescription>
                Select the services to be performed during the inspection.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {serviceFields.map((field, index) => (
                <div key={field.id} className="grid gap-4 sm:grid-cols-12 mb-4">
                  <div className="col-span-3">
                    <FormField
                      control={control}
                      name={`packages.${index}.packageId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service {index + 1}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a service" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {packages?.map((service) => (
                                <SelectItem key={service.id} value={service.id}>
                                  {service.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeService(index)}
                      disabled={serviceFields.length === 1}
                      className="mt-8"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="default"
                size="sm"
                className="mt-2"
                onClick={() => appendService({ packageId: "" })}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>
                Review the pricing details and choose the preferred payment
                method for this order.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="sm:grid grid-cols-12 gap-4">
                  <div className="col-span-9">
                    <div className="bg-gray-50 p-4 rounded-md border">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Price Summary
                      </h4>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Subtotal:</span>
                          <span className="text-gray-900">
                            £{priceSummary().subtotal.toFixed(2)}
                          </span>
                        </div>
                        {priceSummary().congestionCharge > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">
                              Congestion Zone Charge:
                            </span>
                            <span className="text-gray-900">
                              £{priceSummary().congestionCharge.toFixed(2)}
                            </span>
                          </div>
                        )}
                        {priceSummary().parkingCharge > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">
                              Parking Charge:
                            </span>
                            <span className="text-gray-900">
                              £{priceSummary().parkingCharge.toFixed(2)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm font-medium pt-1 border-t border-gray-200">
                          <span className="text-gray-900">Total:</span>
                          <span className="text-gray-900">
                            £{priceSummary().total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-3 hidden sm:block"></div>

                  <div className="col-span-3">
                    <FormField
                      control={control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method</FormLabel>
                          <Select onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select payment method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="CASH_TO_ENGINEER">
                                Cash To Engineer
                              </SelectItem>
                              <SelectItem value="BANK_TRANSFER">
                                Bank Transfer
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </ContentLayout>
  );
}
