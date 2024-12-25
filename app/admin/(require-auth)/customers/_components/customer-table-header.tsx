"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Download, Search, SortAsc, SortDesc, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import dayjs from "dayjs";
import { exportCustomers } from "../actions";
import { LoadingButton } from "@/components/ui/loading-button";
// import CreateUser from "../../orders/new/_components/create-user";
import { FaHelmetSafety, FaUser, FaUserGroup } from "react-icons/fa6";
import useQueryString from "@/hooks/use-query-string";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "@/hooks/use-toast";
import CreateUser from "../../orders/new/_components/create-user";

export default function CustomerTableHeader() {
  const router = useRouter();
  const { createQueryString } = useQueryString();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const initialSearchValue = searchParams.get("search") ?? "";
  const sortBy = searchParams.get("sort_by") ?? "";
  const sortOrder = searchParams.get("sort_order") ?? "";

  const [searchValue, setSearchValue] = useState(initialSearchValue);
  const debouncedSearchValue = useDebounce(searchValue, 300); // 300ms delay

  useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        search: debouncedSearchValue,
      })}`
    );
  }, [debouncedSearchValue, pathname, router, createQueryString]);

  const handleExportCustomers = async () => {
    startTransition(async () => {
      const result = await exportCustomers();
      if (result.success) {
        // Handle successful deletion (e.g., show a success message, update UI)
        const excelData = result.data as string;
        const byteArray = new Uint8Array(
          atob(excelData)
            .split("")
            .map((char) => char.charCodeAt(0))
        );
        const blob = new Blob([byteArray], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const downloadUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute(
          "download",
          `Customers - ${dayjs().format("YYYY-MM-DD@hh:mm:ss")}.xlsx`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast({
          title: "Customers  Downloaded",
          description: result.message,
          variant: "success",
        });
      } else {
        toast({
          title: "Customers download failed",
          description: result.message,
          variant: "destructive",
        });
        console.error(result.message);
      }
    });
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-4 mt-7">
        <h1 className="text-2xl font-bold mb-2 flex items-center">
          <FaUserGroup className="text-primary mr-2" />
          Customer List
        </h1>

        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <LoadingButton
            type="button"
            disabled={isPending}
            loading={isPending}
            className="text-sm h-9 font-medium flex items-center"
            onClick={handleExportCustomers}
            variant="outline"
          >
            {!isPending && <Download className="mr-2 h-4 w-4" />}
            Download Excel
          </LoadingButton>

          {/* TODO: createUser component are uncomment */}
          <CreateUser userType="CUSTOMER" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto mb-5">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search customer..."
            className="pl-10 w-full"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        <Select
          value={sortBy}
          onValueChange={(value) => {
            if (value) {
              router.push(
                `${pathname}?${createQueryString({
                  sort_by: value,
                })}`
              );
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SortAsc className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="createdAt">Created At</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortOrder}
          onValueChange={(value) => {
            if (value) {
              router.push(
                `${pathname}?${createQueryString({
                  sort_order: value,
                })}`
              );
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            {sortOrder === "asc" ? (
              <SortAsc className="mr-2 h-4 w-4" />
            ) : (
              <SortDesc className="mr-2 h-4 w-4" />
            )}

            <SelectValue placeholder="Sort Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Desc</SelectItem>
            <SelectItem value="asc">Asc</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
