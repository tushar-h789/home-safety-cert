import React from "react";
import RightArrowIcon from "../(site)/_components/icons/right-arraw";
import LocationIcon from "../(site)/_components/icons/location";
import MessageIcon from "../(site)/_components/icons/message-icon";
import PhoneIcon from "../(site)/_components/icons/phone-icon";

export default function Footer() {
  return (
    <section className="bg-primary pt-20">
      <div
        className="container w-full gap-2 flex  text-white"
        style={{ paddingBottom: "40px" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
          <div className="mb-5 ">
            <h4 className="font-semibold text-xl text-secondary">
              About Company
            </h4>
            <p className="text-white leading-7 py-4">
              Home Safety Cert provides essential safety certifications for
              homes and properties in London, UK. Our expert inspections ensure
              compliance with regulations, giving you the assurance that your
              property is safe and secure.
            </p>
          </div>

          <div className="md:mx-auto">
            <h4 className="font-semibold text-xl text-secondary">Quick Link</h4>
            <ul className="my-4">
              <a href="#home">
                <li className="flex  gap-1 hover:text-secondary my-4 ">
                  <RightArrowIcon className="w-3" />
                  <p>Home</p>
                </li>
              </a>

              <a href="#about">
                <li className="flex  gap-1 hover:text-secondary my-4 ">
                  <RightArrowIcon className="w-3" />
                  <p>About</p>
                </li>
              </a>

              <a href="#services">
                <li className="flex  gap-1 hover:text-secondary my-4 ">
                  <RightArrowIcon className="w-3" />
                  <p>Services</p>
                </li>
              </a>

              <a href="#pricing">
                <li className="flex  gap-1 hover:text-secondary my-4 ">
                  <RightArrowIcon className="w-3" />
                  <p>Pricing</p>
                </li>
              </a>
              <a href="#contact">
                <li className="flex  gap-1 hover:text-secondary my-4">
                  <RightArrowIcon className="w-3" />
                  <p>Contact</p>
                </li>
              </a>
            </ul>
          </div>

          <div className="mb-7 lg:mx-auto">
            <h4 className="font-semibold text-xl text-secondary">
              Miscellaneous
            </h4>
            <ul className="my-4">
              <a href="">
                <li className="flex  gap-1 hover:text-secondary my-4 ">
                  <RightArrowIcon className="w-3" />
                  <p>Privacy Policy</p>
                </li>
              </a>

              <a href="">
                <li className="flex  gap-1 hover:text-secondary my-4 ">
                  <RightArrowIcon className="w-3" />
                  <p>Terms & Condition</p>
                </li>
              </a>

              <a href="">
                <li className="flex  gap-1 hover:text-secondary my-4 ">
                  <RightArrowIcon className="w-3" />
                  <p>Acceptable Use Policy </p>
                </li>
              </a>
              <a href="">
                <li className="flex  gap-1 hover:text-secondary my-4 ">
                  <RightArrowIcon className="w-3" />
                  <p>Cookie Policy</p>
                </li>
              </a>
            </ul>
          </div>

          <div className="pb-16 lg:mx-auto">
            <h4 className="font-semibold text-xl text-secondary">Contact Us</h4>
            <ul className="my-4">
              <li className="flex  gap-4 my-4 ">
                <LocationIcon className="w-3 text-secondary" />
                <p>London, Great Britain, UK</p>
              </li>

              <li className="flex  gap-4 my-4 ">
                <MessageIcon className="w-3 text-secondary" />
                <p>info@homesafetycert.co.uk</p>
              </li>

              <li className="flex  gap-4 my-4 ">
                <PhoneIcon className="w-3 text-secondary" />
                <p>020 3488 4929</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* copyright part */}
      <div className="container text-white text-center border-t border-teal-700">
        <p className="py-10 text-sm ">
          Copyright © 2024 Home Safety Cert. All rights reserved.
        </p>
      </div>
    </section>
  );
}
