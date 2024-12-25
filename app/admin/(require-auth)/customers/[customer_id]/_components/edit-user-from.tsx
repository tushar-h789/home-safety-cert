"use client";

import DynamicBreadcrumb from "@/components/dynamic-breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Prisma } from "@prisma/client";
import {
  AlertCircle,
  Calendar,
  Mail,
  MapPin,
  Phone,
  Wrench,
} from "lucide-react";
import { ContentLayout } from "@/app/admin/_components/admin-panel/content-layout";
import { Badge } from "@/components/ui/badge";

export type Certificate = {
  serviceName: string;
  dateOfIssue: Date;
  expiryDate: Date;
  user?: {
    name: string;
  };
};

export type CustomerWithOrders = Prisma.UserGetPayload<{
  include: {
    address: true;
    orders: {
      include: {
        packages: true;
      };
    };
    certificates: true;
  };
}>;

export type EngineerWithAssignedOrders = Prisma.UserGetPayload<{
  include: {
    address: true;
    assignedOrders: {
      include: {
        packages: true;
      };
    };
    certificates: true;
  };
}>;

export default function EditCustomerForm({
  user,
  selectedCertificate,
}: {
  user: CustomerWithOrders | EngineerWithAssignedOrders;
  selectedCertificate?: Certificate | null;
}) {
  const isCustomer = user?.role === "CUSTOMER";
  const isStaff = user?.role === "STAFF";

  const orders = isCustomer
    ? (user as CustomerWithOrders)?.orders
    : (user as EngineerWithAssignedOrders)?.assignedOrders;

  const certificates = user || null;
  // console.log("certificates Details", user);

  const serviceName = certificates.serviceName;

  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin" },
    {
      label: isCustomer ? "Customers" : isStaff ? "Engineers" : "Certificates",
      href: isCustomer
        ? "/admin/customers"
        : isStaff
        ? "/admin/engineers"
        : "/admin/certificates",
    },
    {
      label: serviceName ? ` ${serviceName}` : `${user.name}`,
      href: isCustomer
        ? `/admin/customers/${user.id}`
        : isStaff
        ? `/admin/engineers/${user.id}`
        : `/admin/certificates/${user.id}`,
      isCurrentPage: true,
    },
  ];

  const ordersArray = Array.isArray(orders) ? orders : [];

  const totalSpent = ordersArray.reduce((sum, order) => {
    const price = order.totalPrice ?? 0;
    return sum + price;
  }, 0);

  const completedOrders = ordersArray.filter(
    (order) => order.status === "COMPLETED"
  );
  const pendingOrders = ordersArray.filter((order) =>
    ["PENDING", "IN_PROGRESS", "CONFIRMED"].includes(order.status)
  );
  const cancelledOrders = ordersArray.filter(
    (order) => order.status === "CANCELLED"
  );

  const infoItems = [
    { icon: Mail, label: "Email", value: user.email },
    { icon: Phone, label: "Phone", value: user.phone || "N/A" },
    {
      icon: MapPin,
      label: "Address",
      value: user.address
        ? `${user.address.street}, ${user.address.city}, ${user.address.postcode}`
        : "N/A",
    },
    {
      icon: Calendar,
      label: "Joined",
      value: format(new Date(user.createdAt), "dd MMMM yyyy"),
    },
  ];

  if (isStaff) {
    infoItems.push({
      icon: Wrench,
      label: "Expertise",
      value: (user as EngineerWithAssignedOrders).expertise || "N/A",
    });
  }

  const showCertificatesCard =
    certificates &&
    typeof certificates === "object" &&
    ("serviceName" in certificates ||
      "dateOfIssue" in certificates ||
      "expiryDate" in certificates);

  return (
    <ContentLayout
      title={`${isStaff ? "Engineer" : "Customer"}: ${
        user.name ||
        (showCertificatesCard ? certificates.serviceName : "No Certificate")
      }`}
    >
      <DynamicBreadcrumb items={breadcrumbItems} />

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <StatCard
          title={isCustomer ? "Total Spent" : "Total Earned"}
          value={`£${totalSpent.toFixed(2)}`}
        />
        <StatCard title="Completed Orders" value={completedOrders.length} />
        <StatCard title="Pending Orders" value={pendingOrders.length} />
        <StatCard title="Cancelled Orders" value={cancelledOrders.length} />
      </div>

      {/* Order and Certificates Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <OrderHistoryCard orders={ordersArray} />
        {showCertificatesCard ? (
          <CertificatesCard certificates={certificates} />
        ) : (
          <UserInfoCard user={user} infoItems={infoItems} />
        )}
      </div>
    </ContentLayout>
  );
}

// Components for better readability
function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-purple-100 text-purple-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  } as const;

  return (
    <Badge
      className={`${
        statusColors[status as keyof typeof statusColors] ||
        "bg-gray-100 text-gray-800"
      } px-2 py-1 text-xs font-medium`}
    >
      {status.replace("_", " ")}
    </Badge>
  );
}

function EmptyStateUI({ message }: { message?: string }) {
  return (
    <div className="text-center py-12">
      <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        {message || "No orders"}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        This user hasn&apos;t placed any orders yet.
      </p>
    </div>
  );
}

function OrderHistoryCard({ orders }: { orders: any[] }) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.invoice}</TableCell>
                  <TableCell>
                    {format(new Date(order.date), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>£{order.totalPrice.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyStateUI message="No orders found for this user." />
        )}
      </CardContent>
    </Card>
  );
}

function CertificatesCard({ certificates }: { certificates: any }) {
  const certificate = certificates.length > 0 ? certificates[0] : null;
  // Calculate the duration in days if both dates are present
  const issuedDate = certificates?.dateOfIssue
    ? new Date(certificates.dateOfIssue)
    : null;
  const expiryDate = certificates?.expiryDate
    ? new Date(certificates.expiryDate)
    : null;
  const durationInDays =
    issuedDate && expiryDate
      ? Math.ceil(
          (expiryDate.getTime() - issuedDate.getTime()) / (1000 * 3600 * 24)
        ) // Convert ms to days
      : null;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-600 to-green-400 text-white">
        <CardTitle className="text-2xl font-bold">
          {certificates.serviceName}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {certificates ? (
          <div className="space-y-6">
            <div className="flex flex-col">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Service Name:
                </span>
                <span className="text-md font-medium text-gray-900">
                  {certificates.serviceName || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Issued Date:
                </span>
                <span className="text-md font-medium text-gray-900">
                  {certificates.dateOfIssue
                    ? format(new Date(certificates.dateOfIssue), "dd/MM/yyyy")
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Expiry Date:
                </span>
                <span className="text-md font-medium text-gray-900">
                  {certificates.expiryDate
                    ? format(new Date(certificates.expiryDate), "dd/MM/yyyy")
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Duration (Days):
                </span>
                <span className="text-md font-medium text-gray-900">
                  {durationInDays !== null ? `${durationInDays} days` : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">
                  User Name:
                </span>
                <span className="text-md font-medium text-gray-900">
                  {certificates.user?.name || "N/A"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <EmptyStateUI message="No certificates found for this user." />
        )}
      </CardContent>
    </Card>
  );
}

function UserInfoCard({
  user,
  infoItems,
}: {
  user: CustomerWithOrders | EngineerWithAssignedOrders;
  infoItems: any[];
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {infoItems.map((item, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0">
                <item.icon className="h-5 w-5 text-gray-400 mr-3" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {item.label}
                </p>
                <p className="mt-1 text-sm text-gray-900">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
