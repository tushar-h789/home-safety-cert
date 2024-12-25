import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  ShoppingCart,
  Plug,
  HardHat,
  Cog
} from "lucide-react";

import WebIcon from "@/app/(site)/_components/icons/web-icom";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/admin",
          label: "Dashboard",
          active: pathname.includes("/admin/dashboard"),
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Management",
      menus: [
        {
          href: "/admin/orders",
          label: "Orders",
          active: pathname.includes("/admin/orders"),
          icon: ShoppingCart,
          submenus: []
        },
        {
          href: "/admin/customers",
          label: "Customers",
          active: pathname.includes("/customers"),
          icon: Users,
          submenus: []
        },
        {
          href: "/admin/packages",
          label: "Packages",
          active: pathname.includes("/packages"),
          icon: Plug,
          submenus: []
        },
        {
          href: "/admin/engineers",
          label: "Engineers",
          active: pathname.includes("/engineers"),
          icon: HardHat,
          submenus: []
        },
        {
          href: "/admin/certificates",
          label: "Certificates",
          active: pathname.includes("/certificates"),
          icon: HardHat,
          submenus: []
        },
      ]
    },
    {
      groupLabel: "Configuration",
      menus: [
        {
          href: "/admin/settings",
          label: "Settings",
          active: pathname.includes("/settings"),
          icon: Cog,
          submenus: []
        },
        // {
        //   href: "/admin/account",
        //   label: "Account",
        //   active: pathname.includes("/account"),
        //   icon: Settings,
        //   submenus: []
        // }
      ]
    }
  ];
}
