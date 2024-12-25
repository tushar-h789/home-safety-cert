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

import { Prisma } from "@prisma/client";
import TableEmpty from "@/app/admin/_components/table-empty";
import OrderTableRow from "./order-table-row";

export type OrderWithUserRelation = Prisma.OrderGetPayload<{
  include: {
    user: {
      include: {
        address: true;
      };
    };
  };
}>;

export default async function OrderList({
  orders,
  pagination,
}: {
  orders: OrderWithUserRelation[];
  pagination: Pagination;
}) {

  // console.log("total orders", orders);
  
  return (
    <Card className="flex flex-col justify-between">
      <CardContent className="p-0">
        <div className="overflow-auto h-[calc(100vh-323px)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">
                  <div className="flex justify-center items-center">
                    <Checkbox />
                  </div>
                </TableHead>
                <TableHead className="w-[25%]">User</TableHead>
                <TableHead className="hidden md:table-cell">Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Cost</TableHead>
                <TableHead className="hidden md:table-cell ">Address</TableHead>
                <TableHead className="hidden md:table-cell w-[17%]">
                  Created at
                </TableHead>
                <TableHead className="w-10">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            {orders.length > 0 ? (
              <TableBody>
                {orders.map((order) => (
                  <OrderTableRow key={order.id} order={order} />
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
