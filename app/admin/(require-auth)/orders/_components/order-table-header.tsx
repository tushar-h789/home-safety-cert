"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useDebounce } from "@/hooks/use-debounce";
import useQueryString from "@/hooks/use-query-string";
import { kebabToNormal } from "@/lib/utils";
import dayjs from "dayjs";
import {
  Download,
  Filter,
  Plus,
  Search,
  ShoppingBag,
  SortAsc,
  SortDesc,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { FaCartShopping } from "react-icons/fa6";
import { exportOrders } from "../actions";
import { ORDER_STATUS_OPTIONS } from "@/lib/constants";

export default function OrderTableHeader() {
  const router = useRouter();
  const { createQueryString } = useQueryString();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const initialSearchValue = searchParams.get("search") ?? "";
  const sortBy = searchParams.get("sort_by") ?? "";
  const sortOrder = searchParams.get("sort_order") ?? "";
  const filterStatus = searchParams.get("filter_status") ?? "";

  const [searchValue, setSearchValue] = useState(initialSearchValue);
  const debouncedSearchValue = useDebounce(searchValue, 300); // 300ms delay

  useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        search: debouncedSearchValue,
      })}`
    );
  }, [debouncedSearchValue, pathname, router, createQueryString]);

  const handleExportOrders = async () => {
    startTransition(async () => {
      const result = await exportOrders();
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
          `Orders - ${dayjs().format("YYYY-MM-DD@hh:mm:ss")}.xlsx`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast({
          title: "Orders  Downloaded",
          description: result.message,
          variant: "success",
        });
      } else {
        toast({
          title: "Orders download failed",
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
          <FaCartShopping className="mr-2 text-primary" />
          Order List
        </h1>

        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <LoadingButton
            type="button"
            disabled={isPending}
            loading={isPending}
            className="text-sm h-9 font-medium flex items-center"
            onClick={handleExportOrders}
            variant="outline"
          >
            {!isPending && <Download className="mr-2 h-4 w-4" />}
            Download Excel
          </LoadingButton>

          <Link href="/admin/orders/new">
            <Button
              size="sm"
              className="h-9 w-full text-sm font-medium flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Order
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto mb-5">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search orders..."
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
          <SelectTrigger className="w-[160px]">
            <SortAsc className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="price">Cost</SelectItem>
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
          <SelectTrigger className="w-[160px]">
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

        <Select
          value={filterStatus}
          onValueChange={(value) => {
            if (value) {
              router.push(
                `${pathname}?${createQueryString({
                  filter_status: value !== "ALL" ? value : "",
                })}`
              );
            }
          }}
        >
          <SelectTrigger className="w-[160px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">ALL</SelectItem>
            {ORDER_STATUS_OPTIONS.map((option) => (
              <SelectItem value={option} key={option}>
                {kebabToNormal(option)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
