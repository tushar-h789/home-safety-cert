import { TableCell, TableRow } from "@/components/ui/table";
import { Package } from "@prisma/client";
import React from "react";

export default function PackageTableRow({ pack }: { pack: Package }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{pack.name}</TableCell>
      <TableCell>{pack.category}</TableCell>
      <TableCell>{pack.unitType}</TableCell>
      <TableCell>£{pack.price}</TableCell>
    </TableRow>
  );
}
