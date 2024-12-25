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

import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useQueryString from "@/hooks/use-query-string";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { SERVICE_TYPE_OPTIONS } from "@/lib/constants";
import { kebabToNormal } from "@/lib/utils";
import {
  Download,
  Filter,
  HandPlatter,
  Plug,
  Plus,
  Search,
} from "lucide-react";
import { FaPlug } from "react-icons/fa6";

export default function ServiceTableHeader() {
  const router = useRouter();
  const { createQueryString } = useQueryString();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialSearchValue = searchParams.get("search") ?? "";
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

  return (
    <>
      <div className="flex justify-between items-center mb-4 mt-7">
        <h1 className="text-2xl font-bold mb-2 flex items-center">
          <FaPlug className="text-primary mr-2" />
          Package List
        </h1>

        <Link href="/admin/packages/new">
          <Button className="h-9 w-full text-sm font-medium flex">
            <Plus className="mr-2 h-4 w-4" />
            Add New Package
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto mb-5">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search services..."
            className="pl-10 w-full"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

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
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">ALL</SelectItem>
            {SERVICE_TYPE_OPTIONS.map((option) => (
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
