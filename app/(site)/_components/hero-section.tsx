"use client";

import React, { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import hero_one from "@/public/images/hero-1.webp";
import hero_two from "@/public/images/hero-2.webp";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import OpenIcon from "@/app/(site)/_components/icons/open-icon";
import ArrowIcon from "@/app/(site)/_components/icons/arrow-icon";

export default function HeroSection() {
  // const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false }, [Autoplay()]);
  const [animate, setAnimate] = useState(false);

  const handleEmblaApi = useCallback(() => {
    if (emblaApi) {
      // console.log(emblaApi.slideNodes());
    }
  }, [emblaApi]);

  useEffect(() => {
    handleEmblaApi();

    const interval = setInterval(() => {
      setAnimate((prev) => !prev); // Toggle animation state every 2 seconds
    }, 2000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [handleEmblaApi]);

  // Define support section content using an array of objects
  const supportItems = [
    {
      icon: <OpenIcon className="w-8 h-8 md:w-10 md:h-10" />, // Smaller icons for mobile, larger for md+
      title: "Opening Hours",
      description: "Mon - Fri: 08:00 - 18:00",
    },
    {
      icon: <OpenIcon className="w-8 h-8 md:w-10 md:h-10" />,
      title: "Customer Support",
      description: "24/7 Customer Service",
    },
    {
      icon: <OpenIcon className="w-8 h-8 md:w-10 md:h-10" />,
      title: "Emergency Services",
      description: "Available 24/7",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-[90vh] md:h-[85vh] lg:h-[90vh] overflow-hidden">
        <div className="embla" ref={emblaRef}>
          <div className="embla__container absolute w-full h-full">
            {/* Slide 1 */}
            <div className="embla__slide relative w-full h-full">
              <Image
                src={hero_one}
                layout="fill"
                objectFit="cover"
                alt="Hero Image 1"
                priority
                className="z-10"
              />

              {/* text */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent z-20">
                <div
                  className={`container hero-one-text hero-one-text w-full px-6 sm:px-10 md:px-16 lg:px-24 ml-[30%]  ${
                    animate ? "animate-slideIn" : ""
                  } transition-all duration-1000`}
                >
                  <p className="text-lg md:text-md font-semibold text-slate-700">
                    Certified Safety for Your Property
                  </p>
                  <h2 className="font-bold lg:font-bold text-[42px] sm:text-2xl md:text-4xl my-2 sm:my-4 md:my-6 text-heading leading-snug lg:leading-relaxed">
                    Ensuring Your Property <br />
                    Safety and Compliance
                  </h2>
                  <div className="flex items-center">
                    <button className="uppercase bg-primary text-white text-sm md:font-semibold rounded-full px-6 md:px-8 py-2 mt-4 shadow-lg select-none hover:bg-secondary flex items-center transition-all duration-100 ease-linear">
                      Buy Now
                      <ArrowIcon className="ml-2 w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 2 */}
            <div className="embla__slide relative w-full h-full">
              <Image
                src={hero_two}
                layout="fill"
                objectFit="cover"
                alt="Hero Image 2"
                priority
                className="z-10"
              />

              {/* text */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent z-20">
                <div
                  className={`container hero-one-text hero-one-text w-full px-6 sm:px-10 md:px-16 lg:px-24 ml-[30%]  ${
                    animate ? "animate-slideIn" : ""
                  } transition-all duration-1000`}
                >
                  <p className="text-lg  md:text-base font-semibold text-slate-700">
                    Certified Safety for Your Property
                  </p>
                  <h2 className="font-bold  text-[42px] sm:text-2xl md:text-4xl my-2 sm:my-4 md:my-6 text-heading leading-snug lg:leading-relaxed">
                    Ensuring Your Property <br />
                    Safety and Compliance
                  </h2>
                  <div className="flex items-center">
                    <button className="uppercase bg-primary text-white text-sm md:font-semibold rounded-full px-6 md:px-8 py-2 mt-4 shadow-lg select-none hover:bg-secondary flex items-center transition-all duration-100 ease-linear">
                      Buy Now
                      <ArrowIcon className="ml-2 w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="hidden md:block bg-primary w-[90%] sm:w-[80%] md:w-[80%] py-6 md:py-3 lg:py-4 rounded-r-full md:-my-8 z-10 absolute pr-3 md:pr-5">
        <div className="container flex flex-col sm:flex-row items-center justify-end md:gap-2 lg:gap-8">
          {supportItems.map((item, index) => (
            <div key={index} className="text-white flex items-center gap-2">
              {item.icon}
              <div>
                <h4 className="font-medium text-sm lg:text-lg">{item.title}</h4>
                <p className="mt-1 text-xs lg:text-md hover:text-secondary">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
