// /components/Breadcrumb.tsx
import React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItemProps {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItemProps[];
  isTransparent?: boolean;
}

const DynamicBreadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  isTransparent = false,
}) => {
  const textColorClass = isTransparent ? "text-white" : "text-body-dark";

  const textHoverColorClass = isTransparent
    ? "hover:text-white hover:underline"
    : "text-body-dark hover:text-primary";

  const lastItemColorClass = isTransparent ? "text-secondary" : "text-primary";

  return (
    <Breadcrumb>
      <BreadcrumbList className={textColorClass}>
        {items.map((item, index) => (
          <React.Fragment key={item.label}>
            <BreadcrumbItem>
              {item.isCurrentPage ? (
                <BreadcrumbPage
                  className={`${textColorClass} ${lastItemColorClass}`}
                >
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    href={item.href ?? ""}
                    className={`${textColorClass} ${textHoverColorClass}`}
                  >
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>

            {index !== items.length - 1 && (
              <BreadcrumbSeparator className={`${textColorClass}`} />
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;
