"use client";

import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import ArrowIcon from "@/app/(site)/_components/icons/arrow-icon";
import FireIcon from "@/app/(site)/_components/icons/fire-icon";
import ElectricIcon from "@/app/(site)/_components/icons/electric-icon";
import HorizontalIcon from "@/app/(site)/_components/icons/horizontal-line-icon";
import Pat from "@/app/(site)/_components/icons/pat-icon";
import EmergencyLightIcon from "@/app/(site)/_components/icons/electric-light-icon";
import FireAlarmIcon from "@/app/(site)/_components/icons/fire-alarm-icon";
import FireRiskIcon from "@/app/(site)/_components/icons/fire-risk-assignment";
import { HomeIcon } from "lucide-react";

export default function HomeSafetySolutions() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  useEffect(() => {
    if (emblaApi) {
      // console.log(emblaApi.slideNodes()); // Access API
    }
  }, [emblaApi]);

  // Data for the cards in an array of objects
  const cardsData = [
    {
      id: 1,
      price: "$60",
      title: "Gas Safety Certificate",
      description:
        "Stay safe and compliant with our gas safety certificate for your home",
      icon: <FireIcon className="w-20 h-20 text-primary pb-3" />, // Custom icon
    },
    {
      id: 2,
      price: "$60",
      title: "Electric Certificate (EICR)",
      description:
        "Stay safe and compliant with our electric safety certificate for your home",
      icon: <ElectricIcon className="w-20 h-20 text-primary pb-3" />,
    },
    {
      id: 3,
      price: "$60",
      title: "EPC",
      description:
        "Stay safe and compliant with our EPC certificate for your home",
      icon: <HorizontalIcon className="w-20 h-20 text-primary pb-3" />,
    },
    {
      id: 4,
      price: "$80",
      title: "PAT",
      description:
        "Stay safe and compliant with our PAT certificate for your home",
      icon: <Pat className="w-20 h-20 text-primary pb-3" />,
    },
    {
      id: 5,
      price: "$80",
      title: "Emergency Light Certification",
      description:
        "Stay safe and compliant with our PAT certificate for your home",
      icon: <EmergencyLightIcon className="w-20 h-20 text-primary pb-3" />,
    },
    {
      id: 6,
      price: "$130",
      title: "Fire Alarm Certificate",
      description:
        "Stay safe and compliant with our fire alarm certificate for your home",
      icon: <FireAlarmIcon className="w-20 h-20 text-primary pb-3" />,
    },
    {
      id: 7,
      price: "$250",
      title: "Fire Risk Assessment",
      description:
        "Stay safe and compliant with our fire risk assessment for your home",
      icon: <FireRiskIcon className="w-20 h-20 text-primary pb-3" />,
    },
    {
      id: 8,
      price: "$0",
      title: "HMO",
      description:
        "Stay safe and compliant with our HMO certificate for your home",
      icon: <HomeIcon className="w-20 h-20 text-primary pb-3" />,
    },
  ];

  return (
    <section className="mt-10 md:mt-24 lg:mt-36">
      <div className="container overflow-x-hidden">
        <h2 className="text-heading font-medium lg:font-semibold text-2xl lg:text-4xl text-center">
          Our Comprehensive Home Safety Solutions
        </h2>

        <div className="mt-20 lg:mt-20">
          <div className="embla_two" ref={emblaRef}>
            <div className="embla__container_two">
              {cardsData.map((card) => (
                <div key={card.id} className="embla__slide_two shadow-md h-20 ">
                  <div className="px-6 relative">
                    <div className="bg-secondary absolute -top-10 right-0 price p-6">
                      <p className="font-semibold text-heading select-none">
                        {card.price}
                      </p>
                    </div>
                    {/* Icon */}
                    {card.icon}
                    {/* Title */}
                    <h2 className="font-medium text-xl text-heading select-none ">
                      {card.title}
                    </h2>
                    {/* Description */}
                    <p className="text-para my-4 select-none leading-9 ">
                      {card.description}
                    </p>
                    {/* Button */}
                    <div className="flex items-center">
                      <button className="uppercase bg-primary text-white font-semibold rounded-full px-8 py-2 mt-4 shadow-lg select-none hover:bg-secondary  flex items-center transition-all duration-100 ease-linear">
                        Buy Now
                        <ArrowIcon className="ml-2 w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
