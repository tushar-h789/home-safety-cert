// app/admin/certificates/_components/certificates-list.tsx

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/types/order"; // Ensure this import is correct
import { Checkbox } from "@/components/ui/checkbox";
import { CertificateWithRelation } from "@/types/certificates"; // Ensure this import is correct
import CertificatesTableRow from "./certificates-table-row"; // Ensure this import is correct
import TableEmpty from "@/app/admin/_components/table-empty"; // Ensure this import is correct

export default function CertificatesList({
  certificates, // Expecting an array of certificates
  pagination, // Expecting pagination info
}: {
  certificates: CertificateWithRelation[]; // Use the correct type for certificates
  pagination: Pagination; // Use the correct type for pagination
}) {
  return (
    <Card className="flex flex-col justify-between">
      <CardContent className="p-0">
        <div className="overflow-auto h-[calc(100vh-325px)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">
                  <div className="flex justify-center items-center">
                    <Checkbox />
                  </div>
                </TableHead>
                <TableHead className="w-[25%]">Service Name</TableHead>
                <TableHead className="hidden md:table-cell">Issued By</TableHead>
                <TableHead className="hidden md:table-cell">Date of Issue</TableHead>
                <TableHead className="hidden md:table-cell">Expiry Date</TableHead>
                <TableHead className="hidden md:table-cell w-[17%]">Created At</TableHead>
                <TableHead className="w-10">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            {certificates.length > 0 ? (
              <TableBody>
                {certificates.map((certificate) => (
                  <CertificatesTableRow key={certificate.id} certificate={certificate} />
                ))}
              </TableBody>
            ) : (
              <TableEmpty colSpan={7} />
            )}
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
