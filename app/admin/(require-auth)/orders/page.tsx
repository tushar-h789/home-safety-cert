import DynamicBreadcrumb from "@/components/dynamic-breadcrumb";
import OrderList from "./_components/order-list";
import OrderTableHeader from "./_components/order-table-header";
import { OrderPagination } from "./_components/order-pagination";
import { Suspense } from "react";
import OrdersLoading from "./_components/orders-loading";
import { getOrders } from "./actions";
import { OrderStatus } from "@prisma/client";
import { ContentLayout } from "../../_components/admin-panel/content-layout";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Orders", href: "/admin/orders", isCurrentPage: true },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: {
    search: string;
    page: string;
    sort_by: OrderStatus;
    sort_order: "asc" | "desc";
    filter_status: OrderStatus;
  };
}) {
  const { search, page, sort_by, sort_order, filter_status } = searchParams;
  const { orders, pagination } = await getOrders(
    parseInt(page) || 1,
    10,
    search,
    sort_by,
    sort_order,
    filter_status
  );

  return (
    <ContentLayout title="Orders">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <OrderTableHeader />
      <Suspense fallback={<OrdersLoading />}>
        <OrderList orders={orders} pagination={pagination} />
      </Suspense>

      <OrderPagination orders={orders} pagination={pagination} />
    </ContentLayout>
  );
}
