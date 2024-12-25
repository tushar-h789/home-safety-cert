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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useToast } from "@/components/ui/use-toast";
import {
  COMMERCIAL_TYPE_OPTIONS,
  RESIDENTIAL_TYPE_OPTIONS,
  SERVICE_CATEGORY_OPTION,
  SERVICE_TYPE_OPTIONS,
} from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { PackageFormInputType, packageSchema } from "../../schema";
import { createPackage } from "../../actions";
import { ContentLayout } from "@/app/admin/_components/admin-panel/content-layout";
import { serviceData } from "@/shared/data";

// Utility function to transform strings from "SNAKE_CASE" to "Capitalized Normal Format"
function capitalizeText(snakeString: string): string {
  return snakeString
    .toLowerCase() // Convert the whole string to lowercase
    .split("_") // Split by underscores
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(" "); // Join them back with spaces
}

const FormSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Card className="shadow-md mb-6">
    <CardHeader>
      <CardTitle className="text-xl">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid gap-6 grid-cols-12">{children}</div>
    </CardContent>
  </Card>
);

export default function CreatePackageForm() {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Packages", href: "/admin/packages" },
    {
      label: "Create Package",
      href: "/admin/packages/new",
      isCurrentPage: true,
    },
  ];

  const form = useForm<PackageFormInputType>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      name: "",
      type: undefined,
      category: undefined,
      price: "",
      serviceName: "",
      propertyType: "RESIDENTIAL",
      residentialType: undefined,
      commercialType: undefined,
      unitType: "",
    },
  });

  const { control, handleSubmit, watch } = form;

  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const onCreatePackageSubmit: SubmitHandler<PackageFormInputType> = async (
    data
  ) => {
    startTransition(async () => {
      const result = await createPackage(data);
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
          variant: "success",
        });
        router.push("/admin/packages");
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <ContentLayout title="Create Package">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onCreatePackageSubmit)}
          className="space-y-8 mt-7"
        >
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">Create New Package</h1>
                <p className="text-gray-600 text-sm sm:text-base block sm:hidden">
                  Please fill out the details below to create a package.
                </p>
              </div>
              <div className="flex gap-3">
                <Link href="/admin/packages">
                  <Button
                    variant="outline"
                    type="button"
                    className="h-9 w-full text-sm font-medium flex"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </Link>
                <LoadingButton
                  type="submit"
                  disabled={isPending}
                  loading={isPending}
                  size="sm"
                  className="h-9 w-full text-sm font-medium flex"
                >
                  {!isPending && <Check className="mr-2 h-4 w-4" />}
                  Create Package
                </LoadingButton>
              </div>
            </div>
            <p className="text-gray-600 text-sm sm:text-base hidden sm:block">
              Please fill out the details below to create a package.
            </p>
          </div>

          <FormSection title="Basic Information">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-12 md:col-span-6">
                  <FormLabel className="text-sm font-medium">
                    Package Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="Enter package name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="price"
              render={({ field }) => (
                <FormItem className="col-span-12 md:col-span-6">
                  <FormLabel className="text-sm font-medium">Price</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="Enter package price"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          <FormSection title="Service Details">
            <FormField
              control={control}
              name="serviceName"
              render={({ field }) => (
                <FormItem className="col-span-12 md:col-span-6">
                  <FormLabel className="text-sm font-medium">
                    Service Name
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select package category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {serviceData.map((service) => (
                        <SelectItem key={service.label} value={service.label}>
                          {service.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="category"
              render={({ field }) => (
                <FormItem className="col-span-12 md:col-span-6">
                  <FormLabel className="text-sm font-medium">
                    Package Category
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select package category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SERVICE_CATEGORY_OPTION.map((category, index) => (
                        <SelectItem key={index} value={category}>
                          {capitalizeText(category)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="type"
              render={({ field }) => (
                <FormItem className="col-span-12 md:col-span-6">
                  <FormLabel className="text-sm font-medium">
                    Package Type
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select package type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SERVICE_TYPE_OPTIONS.map((type, index) => (
                        <SelectItem key={index} value={type}>
                          {capitalizeText(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          <FormSection title="Property Information">
            <FormField
              control={control}
              name="propertyType"
              render={({ field }) => (
                <FormItem className="col-span-12 md:col-span-6">
                  <FormLabel className="text-sm font-medium">
                    Property Type
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="RESIDENTIAL">Residential</SelectItem>
                      <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {watch("propertyType") === "RESIDENTIAL" && (
              <FormField
                control={control}
                name="residentialType"
                render={({ field }) => (
                  <FormItem className="col-span-12 md:col-span-6">
                    <FormLabel className="text-sm font-medium">
                      Residential Type (Optional)
                    </FormLabel>
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
                        {RESIDENTIAL_TYPE_OPTIONS.map((type) => (
                          <SelectItem key={type} value={type}>
                            {capitalizeText(type)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {watch("propertyType") === "COMMERCIAL" && (
              <FormField
                control={control}
                name="commercialType"
                render={({ field }) => (
                  <FormItem className="col-span-12 md:col-span-6">
                    <FormLabel className="text-sm font-medium">
                      Commercial Type (Optional)
                    </FormLabel>
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
                        {COMMERCIAL_TYPE_OPTIONS.map((type) => (
                          <SelectItem key={type} value={type}>
                            {capitalizeText(type)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={control}
              name="unitType"
              render={({ field }) => (
                <FormItem className="col-span-12 md:col-span-6">
                  <FormLabel className="text-sm font-medium">
                    Unit Type (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="Enter unit type"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>
        </form>
      </Form>
    </ContentLayout>
  );
}
