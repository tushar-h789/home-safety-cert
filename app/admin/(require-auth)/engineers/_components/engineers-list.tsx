import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Pagination } from "@/types/order";
import { Checkbox } from "@/components/ui/checkbox";
import { EngineersWithRelation } from "@/types/engineers";
import EngineersTableRow from "./engineers-table-row";
import TableEmpty from "@/app/admin/_components/table-empty";

export default async function EngineersList({
  engineers: engineers,
}: {
  engineers: EngineersWithRelation[];
  pagination: Pagination;
}) {

  // console.log("engineers details",engineers);
  
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
                <TableHead className="w-[25%]">User</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="hidden md:table-cell">
                  Specialty
                </TableHead>
                <TableHead className="hidden md:table-cell ">Address</TableHead>
                <TableHead className="hidden md:table-cell w-[17%]">
                  Created at
                </TableHead>
                <TableHead className="w-10">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            {engineers.length > 0 ? (
              <TableBody>
                {engineers.map((engineer) => (
                  <EngineersTableRow key={engineer.id} engineer={engineer} />
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
