"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";
import WebIcon from "@/app/(site)/_components/icons/web-icom";

export function WebNav() {
  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="relative  w-8 rounded-full">
                <Avatar className=" w-8">
                  {/* <AvatarImage src="#" alt="Avatar" /> */}
                  <AvatarFallback className="bg-transparent">
                    <Link href="/">
                      <WebIcon className="w-5 h-5" />
                    </Link>
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Visit Website</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </DropdownMenu>
  );
}
