"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Checkbox } from "@/components/ui/checkbox";;
import { Package } from "@prisma/client";
import { deletePackage } from "../actions";
import { useToast } from "@/hooks/use-toast";

export default function ServiceTableRow({ pack }: { pack: Package }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // Stop the propagation to prevent routing

    startTransition(async () => {
      const result = await deletePackage(pack.id);
      // console.log("Delete package result:", result.message);
      

      if (result.success) {
        toast({
          title: "Service Deleted",
          description: result.message,
          variant: "success",
        });
      } else {
        // Handle error (e.g., show an error message)
        toast({
          title: "Error Deleting Service",
          description: result.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <TableRow
      onClick={() => router.push(`/admin/packages/${pack.id}`)}
      className={`cursor-pointer ${isPending ? "opacity-30" : "opacity-100"}`}
    >
      <TableCell>
        <div className="flex justify-center">
          <Checkbox />
        </div>
      </TableCell>

      <TableCell className="w-[15%]">{pack.name}</TableCell>
      <TableCell className="w-[15%]">£{pack.price}</TableCell>
      <TableCell className="">
        <Badge variant="outline">{pack.category || "N/A"}</Badge>
      </TableCell>
      <TableCell className="">{pack.type || "N/A"}</TableCell>
      <TableCell className="hidden md:table-cell">
        {pack.unitType || "N/A"}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {pack.propertyType || "N/A"}
      </TableCell>
      <TableCell className="w-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                handleDelete(e);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
