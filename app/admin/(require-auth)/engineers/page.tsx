import DynamicBreadcrumb from "@/components/dynamic-breadcrumb";

import { EngineersPagination } from "./_components/engineers-pagination";
import { Suspense } from "react";
import EngineersLoading from "./_components/engineers-loading";

import { getEngineers } from "./actions";
import EngineersTableHeader from "./_components/engineers-table-header";
import EngineersList from "./_components/engineers-list";
import { OrderStatus } from "@prisma/client";
import { ContentLayout } from "../../_components/admin-panel/content-layout";
const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Engineers", href: "/admin/engineers", isCurrentPage: true },
];

export default async function AdminEngineersPage({
  searchParams,
}: {
  searchParams: {
    search: string;
    page: string;    
    sort_order: "asc" | "desc";  
    sort_by:OrderStatus
  };
}) {
  const { search, page, sort_order, sort_by} = searchParams;
  const { users: engineers, pagination } = await getEngineers(
    parseInt(page) || 1,
    10,
    search,   
    sort_by,
    sort_order,    
  );

  return (
    <ContentLayout title="Engineers">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <EngineersTableHeader />
      <Suspense fallback={<EngineersLoading />}>
        <EngineersList engineers={engineers} pagination={pagination} />
      </Suspense>
      <EngineersPagination engineers={engineers} pagination={pagination} />
    </ContentLayout>
  );
}
