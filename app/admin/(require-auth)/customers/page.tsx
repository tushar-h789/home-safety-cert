
import { CustomerPagination } from "./_components/customer-pagination";
import { Suspense } from "react";

import { getUsers } from "./actions";
import CustomerTableHeader from "./_components/customer-table-header";
import CustomerList from "./_components/customer-list";
import { OrderStatus } from "@prisma/client";
import DynamicBreadcrumb from "@/components/dynamic-breadcrumb";
import { ContentLayout } from "../../_components/admin-panel/content-layout";
import CustomersLoading from "./_components/customer-loading";
const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Customers", href: "/admin/customers", isCurrentPage: true },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: {
    search: string;
    page: string;
    sort_order: "asc" | "desc";
    sort_by: OrderStatus;
  };
}) {
  const { search, page, sort_order, sort_by } = searchParams;

  const { users: customers, pagination } = await getUsers(
    "CUSTOMER",
    parseInt(page) || 1,
    10,
    search,
    sort_by,
    sort_order
  );

  return (
    <ContentLayout title="Customers">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <CustomerTableHeader />
      <Suspense fallback={<CustomersLoading />}>
        <CustomerList customers={customers} pagination={pagination} />
      </Suspense>

      <CustomerPagination customers={customers} pagination={pagination} />
    </ContentLayout>
  );
}
