import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/types/order";
import { Package } from "@prisma/client";
import ServiceTableRow from "./package-table-row";
import TableEmpty from "@/app/admin/_components/table-empty";

export default async function ServiceList({
  services: services,
}: {
  services: Package[];
  pagination: Pagination;
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
                <TableHead className="w-[15%]">Name</TableHead>
                <TableHead className="w-[15%]">Price</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden md:table-cell">Unit</TableHead>
                <TableHead className="hidden md:table-cell">
                  Property Type
                </TableHead>
                <TableHead className="w-10">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            {services.length > 0 ? (
              <TableBody>
                {services.map((service) => (
                  <ServiceTableRow key={service.id} pack={service} />
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
