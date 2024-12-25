import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export default function VisitWebsite() {
  return (
    <Link href="/" className="h-8">
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button
              className="rounded-full w-8 h-8 bg-background"
              variant="outline"
              size="icon"
            >
              <Globe className="absolute w-[1.2rem] h-[1.2rem] rotate-0 scale-1000 transition-transform ease-in-out duration-500 dark:-rotate-90 dark:scale-0" />
              <span className="sr-only">Visit Website</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Visit Website</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Link>
  );
}
