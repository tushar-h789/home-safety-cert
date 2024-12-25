import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function EngineersLoading() {
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[25%]">Image</TableHead>
              <TableHead className="hidden md:table-cell">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead className="hidden md:table-cell w-[23%]">
                Address
              </TableHead>
              <TableHead className="hidden md:table-cell w-[18%]">
                Created at
              </TableHead>
              <TableHead className="w-10">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array(5)
              .fill(null)
              .map((item) => (
                <TableRow key={item}>
                  <TableCell className="font-medium flex items-center">
                    <Avatar className="mr-3">
                      <AvatarFallback>
                        <Skeleton className="h-12 w-12 rounded-full" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="w-full">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-full mt-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter>
        <Skeleton className="h-4 w-36" />
      </CardFooter>
    </Card>
  );
}
