"use client";

import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { CertificateWithRelation } from "@/types/certificates"; // Adjust based on your types
import { deleteCertificate } from "../actions"; // Adjust import path accordingly
import { useToast } from "@/hooks/use-toast";

export default function CertificatesTableRow({
  certificate,
}: {
  certificate: CertificateWithRelation;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // Stop the propagation to prevent routing

    startTransition(async () => {
      const result = await deleteCertificate(certificate.id);
      // console.log("result", result);
      

      if (result.success) {
        toast({
          title: "Certificate Deleted",
          description: result.message,
          variant: "success",
        });
      } else {
        toast({
          title: "Error Deleting Certificate",
          description: result.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <TableRow
    onClick={() => router.push(`/admin/certificates/${certificate.id}`)}
      className={`cursor-pointer ${isPending ? "opacity-30" : "opacity-100"}`}
    >
      <TableCell>
        <div className="flex justify-center">
          <Checkbox />
        </div>
      </TableCell>

      <TableCell className="w-[25%]">
        <div className="flex">
          <Avatar className="mr-3">
            <AvatarFallback>{certificate?.serviceName?.charAt(0) ?? "C"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{certificate.serviceName}</p>
            <p className="text-xs text-gray-500 font-normal">
              Issued by: {certificate.issuedBy}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        {dayjs(new Date(certificate.dateOfIssue)).format("DD-MM-YYYY")}
      </TableCell>
      <TableCell>
        {certificate.expiryDate
          ? dayjs(new Date(certificate.expiryDate)).format("DD-MM-YYYY")
          : "No Expiry"}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {dayjs(new Date(certificate.createdAt)).format("DD-MM-YYYY HH:mm A")}
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
            <DropdownMenuItem onClick={() => router.push(`/admin/certificates/edit/${certificate.id}`)}>
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
