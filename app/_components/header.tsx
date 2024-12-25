"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import BarIcon from "../(site)/_components/icons/bar-icon";
import FireAlarmIcon from "../(site)/_components/icons/fire-alarm-icon";
import FireIcon from "../(site)/_components/icons/fire-icon";
import ElectricIcon from "../(site)/_components/icons/electric-icon";
import HorizontalIcon from "../(site)/_components/icons/horizontal-line-icon";
import Pat from "../(site)/_components/icons/pat-icon";
import EmergencyLightIcon from "../(site)/_components/icons/electric-light-icon";
import FireRiskIcon from "../(site)/_components/icons/fire-risk-assignment";
import HomeIcon from "../(site)/_components/icons/home-icon";
import RightArrowIcon from "../(site)/_components/icons/right-arraw";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isActive = (href: string) => pathname === href;
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const services = [
    {
      name: "Gas Safety Certificate",
      description: "Stay safe and compliant with our gas saf",
      icon: <FireIcon className="w-10" />,
    },
    {
      name: "Electric Certificate (EICR)",
      description: "Ensure electrical safety with our EICR c",
      icon: <ElectricIcon className="w-10" />,
    },
    {
      name: "EPC",
      description: "Measure your property's energy efficienc",
      icon: <HorizontalIcon className="w-10" />,
    },
    {
      name: "PAT",
      description: "Get peace of mind with our reliable PAT",
      icon: <Pat className="w-10" />,
    },
    {
      name: "Emergency Light Certification",
      description: "Expert certification for fully functiona",
      icon: <EmergencyLightIcon className="w-10" />,
    },
    {
      name: "Fire Alarm C",
      description: "Get reliable certification for your fire",
      icon: <FireAlarmIcon className="w-10" />,
    },
    {
      name: "Fire Risk Assessment",
      description: "Minimize fire risks with our expert asse",
      icon: <FireRiskIcon className="w-10" />,
    },
    {
      name: "HMO",
      description: "Comprehensive HMO inspections for maximu",
      icon: <HomeIcon className="w-10" />,
    },
  ];

  return (
    <section className="shadow-lg py-3 md:py-0">
      <div className="container flex items-center justify-between">
        <div className="w-full flex items-center justify-between">
          <Link href="/">
            <h2 className="text-primary text-lg font-medium">
              Home Safety Cert
            </h2>
          </Link>
          <BarIcon
            className="w-6 pt-3 text-primary md:hidden cursor-pointer"
            onClick={toggleMenu}
          />
        </div>

        {/* Desktop Menu */}
        <ul className="md:flex items-center gap-4 text-primary text-sm font-medium hidden list-none relative mr-10">
          <Link href="/">
            <li
              className={`hover:bg-slate-100 uppercase px-2 py-5 ${
                isActive("/") ? "text-secondary" : ""
              }`}
            >
              Home
            </li>
          </Link>
          <Link href="/about">
            <li
              className={`hover:bg-slate-100 uppercase px-2 py-5 ${
                isActive("/about") ? "text-secondary" : ""
              }`}
            >
              About
            </li>
          </Link>
          <li
            className="relative flex items-center uppercase gap-2 hover:bg-slate-100 px-2 py-5 cursor-pointer"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <p className={`${isActive("/services") ? "text-secondary" : ""}`}>
              Services
            </p>
            <FontAwesomeIcon icon={faChevronDown} className="w-3" />

            {/* Updated Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute capitalize -left-[600px] top-full w-[930px] bg-white shadow-lg border rounded-lg z-10 grid grid-cols-3 gap-4 p-4">
                {services.map((service, index) => (
                  <Link
                    href={`/services/${service.name
                      .toLowerCase()
                      .replace(/ /g, "-")}`}
                    key={index}
                  >
                    <div className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded">
                      <div className="text-2xl">{service.icon}</div>
                      <div>
                        <h5 className="text-primary font-semibold text-sm">
                          {service.name}
                        </h5>
                        <p className="text-gray-600 text-xs">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </li>
          <Link href="/pricing">
            <li
              className={`hover:bg-slate-100 uppercase px-2 py-5 ${
                isActive("/pricing") ? "text-secondary" : ""
              }`}
            >
              Pricing
            </li>
          </Link>
          <Link href="/contact">
            <li
              className={`hover:bg-slate-100 uppercase px-2 py-5 ${
                isActive("/contact") ? "text-secondary" : ""
              }`}
            >
              Contact
            </li>
          </Link>
          <Link href="/blog">
            <li
              className={`hover:bg-slate-100 uppercase px-2 py-5 ${
                isActive("/blog") ? "text-secondary" : ""
              }`}
            >
              Blog
            </li>
          </Link>
          <Link href="/projects">
            <li
              className={`hover:bg-slate-100 uppercase px-2 py-5 ${
                isActive("/projects") ? "text-secondary" : ""
              }`}
            >
              Projects
            </li>
          </Link>
          <Link href="/request-aquote?active_step=0">
            <div className="w-full">
              <li
                className={`relative overflow-hidden rounded-xl text-heading bg-secondary uppercase px-5 py-3 my-1 whitespace-nowrap transition-all duration-100 ease-linear border  hover:bg-white hover:border ${
                  isActive("/request-aquote") ? "text-primary" : "hover:text-primary"
                }`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-50 transform scale-x-105 scale-y-105 -z-10 transition-transform duration-300 ease-in-out"></span>
                Request A Quote 
                {/* <Highpe className="w-4 "/> */}
              </li>
            </div>
          </Link>
        </ul>

        {/* Mobile Menu */}
        <div
          className={`md:hidden flex flex-col items-center gap-4 uppercase text-primary text-sm font-medium bg-white w-full absolute left-0 z-10 shadow-lg transition-all duration-500 ease-in-out ${
            isMenuOpen
              ? "max-h-screen opacity-95 top-9"
              : "max-h-0 opacity-0 top-9"
          } overflow-hidden`}
        >
          <Link href="/">
            <li
              className={`hover:bg-slate-100 px-2 py-5 w-full text-center list-none ${
                isActive("/") ? "text-secondary" : ""
              }`}
            >
              Home
            </li>
          </Link>
          <Link href="/about">
            <li
              className={`hover:bg-slate-100 px-2 py-5 w-full text-center list-none ${
                isActive("/about") ? "text-secondary" : ""
              }`}
            >
              About
            </li>
          </Link>
          <Link href="/service">
            <li
              className="hover:bg-slate-100 px-2 py-5 w-full text-center flex items-center justify-center gap-2 list-none"
              onClick={toggleDropdown}
            >
              <p>Services</p>
            </li>
          </Link>
          {/* <FontAwesomeIcon icon={faChevronDown} className="w-3" /> */}
          {/* {isDropdownOpen && (
            <div className="w-full h-[800px] z-10 bg-white shadow-inner">
              {services.map((service, index) => (
                <Link href={`/services/${service.name.toLowerCase().replace(/ /g, '-')}`} key={index}>
                  <div className="flex items-center gap-3 p-2 hover:bg-slate-100">
                    <div className="text-xl">{service.icon}</div>
                    <div>
                      <h5 className="text-primary font-semibold text-xs">{service.name}</h5>
                      <p className="text-gray-600 text-xs">{service.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )} */}
          <Link href="/pricing">
            <li
              className={`hover:bg-slate-100 px-2 py-5 w-full text-center list-none ${
                isActive("/pricing") ? "text-secondary" : ""
              }`}
            >
              Pricing
            </li>
          </Link>
          <Link href="/contact">
            <li
              className={`hover:bg-slate-100 px-2 py-5 w-full text-center list-none ${
                isActive("/contact") ? "text-secondary" : ""
              }`}
            >
              Contact
            </li>
          </Link>
          <Link href="/booknow">
            <li
              className={`hover:bg-slate-100 px-2 py-5 w-full text-center list-none ${
                isActive("/booknow") ? "text-secondary" : ""
              }`}
            >
              Book Now
            </li>
          </Link>
        </div>
      </div>
    </section>
  );
}
