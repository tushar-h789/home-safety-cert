"use client";

import { usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import gasImgTwo from "@/public/images/gas-safety-img2.jpg";
import Image from "next/image";
import LocationIcon from "../../_components/icons/location";
import MessageIcon from "../../_components/icons/message-icon";
import PhoneIcon from "../../_components/icons/phone-icon";
import ClockIcon from "../../_components/icons/clock-icon";
import ServiceMainContent from "./service-main-contant";
import { serviceData } from "@/shared/data";

export default function ServiceContent() {
  const currentPath = usePathname();
  // console.log(currentPath);

  return (
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto p-4 my-10 gap-6">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 mb-6 md:mb-0 md:mr-6">
        <Card>
          <CardContent className="p-0">
            {serviceData.map((item, index) => (
              <div key={index}>
                <a href={item.path}>
                  <div
                    className={`p-4 cursor-pointer hover:bg-gray-100 hover:text-black ${
                      currentPath === item.path
                        ? `bg-primary text-white ${
                            index === 0
                              ? "rounded-t-xl" // First item - top corners rounded
                              : index === serviceData.length - 1
                              ? "rounded-b-xl" // Last item - bottom corners rounded
                              : "" // Others - no special rounding
                          }`
                        : `hover ${
                            index === 0
                              ? "hover:rounded-t-xl" // Hover - top corners rounded
                              : index === serviceData.length - 1
                              ? "hover:rounded-b-xl" // Hover - bottom corners rounded
                              : "" // Others - no special rounding
                          }`
                    }`}
                  >
                    {item.label}
                  </div>
                </a>
                {index < serviceData.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="my-5 relative w-full h-[300px] sm:h-[400px] lg:h-[400px] overflow-hidden">
          <Image
            src={gasImgTwo}
            width={200}
            height={400}
            alt="gas image"
            className="w-full h-[400px] object-cover"
          />

          {/* Gradient overlay to darken the image at the bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/90 to-transparent z-10"></div>

          {/* Text content */}
          <div className="absolute top-[50%] lg:top-[60%] left-4 right-4 z-20 text-center transform -translate-y-1/2 text-white lg:left-10">
            <h3 className="text-lg lg:text-xl font-bold mb-2 drop-shadow-lg">
              Have Any Questions? <br /> Call Us Today
            </h3>
            <Separator className="bg-gray-50 my-4 h-[0.08px]" />
            <p className="text-base lg:text-2xl mb-1 drop-shadow-md">
              Call: 123-4546-7890
            </p>
            <p className="text-base text-center my-4 drop-shadow-md">
              support@sitename.com
            </p>
          </div>
        </div>

        {/* Get in touch */}
        <Card className="my-4">
          <h3 className="font-medium text-heading text-center p-4 uppercase bg-slate-200 rounded-t-xl">
            Get in touch
          </h3>
          <Separator className="h-[1px] bg-slate-100" />
          <ul className="px-4">
            <li className="flex items-center gap-3 my-4">
              <LocationIcon className="text-secondary w-6" />
              <p className="text-para leading-6">
                184 Main Rd E, St Albans VIC 3021, Australia
              </p>
            </li>
            <li className="flex items-center gap-3 my-4">
              <MessageIcon className="text-secondary w-4" />
              <p className="text-para leading-6 hover:text-secondary">
                info@example.com
              </p>
            </li>
            <li className="flex items-center gap-3 my-4">
              <PhoneIcon className="text-secondary w-4" />
              <p className="text-para leading-6">(+01) 123 456 7890</p>
            </li>
            <li className="flex items-center gap-3 my-4">
              <ClockIcon className="text-secondary w-8" />
              <p className="text-para leading-6">
                Mon to Sat - 9:00am to 6:00pm (Sunday Closed)
              </p>
            </li>
          </ul>
        </Card>
      </aside>

      {/* Main Content */}
      <main className="w-full md:w-3/4">
        <ServiceMainContent />
      </main>
    </div>
  );
}
