import WebIcon from "@/app/(site)/_components/icons/web-icom";
import { ModeToggle } from "../mode-toggle";
import { SheetMenu } from "./sheet-menu";
import { UserNav } from "./user-nav";
import BarIcon from "@/app/(site)/_components/icons/bar-icon";
import Link from "next/link";
import { WebNav } from "./web-nav";


interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-dashboardSecondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <h1 className="font-bold">{title}</h1>
        </div>
        <div className="flex flex-1 items-center justify-end gap-4 hover:text-secondary">
          <WebNav/>
          <UserNav />
        </div>
      </div>
    </header>
  );
}
