// app/admin/certificates/page.tsx

import DynamicBreadcrumb from "@/components/dynamic-breadcrumb";
import { CertificatesPagination } from "./_components/certificates-pagination";
import { Suspense } from "react";
import CertificatesLoading from "./_components/certificates-loading";
import { getCertificates } from "./actions";
import CertificatesTableHeader from "./_components/certificates-table-header";
import { ContentLayout } from "../../_components/admin-panel/content-layout";
import CertificatesList from "./_components/certificates-list";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Certificates", href: "/admin/certificates", isCurrentPage: true },
];

export default async function AdminCertificatesPage({
  searchParams,
}: {
  searchParams: {
    search: string;
    page: string;
    sort_order: "asc" | "desc";
    sort_by: string; // This can be a field like `serviceName` or `dateOfIssue`
  };
}) {
  const { search, page, sort_order, sort_by } = searchParams;

  const { certificates, pagination } = await getCertificates(
    parseInt(page) || 1,
    10,
    search,
    sort_by,
    sort_order,
  );

  return (
    <ContentLayout title="Certificates">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <CertificatesTableHeader />
      <Suspense fallback={<CertificatesLoading />}>
        <CertificatesList certificates={certificates} pagination={pagination} />
      </Suspense>
      <CertificatesPagination certificates={certificates} pagination={pagination} />
    </ContentLayout>
  );
}
