"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { serviceData } from "@/shared/data";

export default function ServiceMainContent() {
  const pathname = usePathname();

  // Find the relevant service data based on the current path
  const currentService = serviceData.find(
    (service) => service.path === pathname
  );
//   console.log("path", pathname);
//   console.log("current", currentService);

  if (!currentService) {
    return <div>Service not found</div>;
  }

  return (
    <div>
      <main className="w-full">
        <div>
          <h2 className="text-3xl font-semibold text-heading mb-4">
            {/* {currentService.pageContent.title} */}
          </h2>
          <div
            className="mb-6 text-para leading-7"
            dangerouslySetInnerHTML={{
              __html: currentService.pageContent.html,
            }}
          />
        </div>
      </main>
    </div>
  );
}
