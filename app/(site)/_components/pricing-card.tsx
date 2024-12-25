import React from "react";
import ArrowIcon from "./icons/arrow-icon";
import { Button } from "@/components/ui/button";

// Types for services and plans
interface Service {
  name: string;
  price: string;
}

interface Plan {
  id: number;
  title: string;
  icon?: React.ReactNode;
  priceStart: string;
  services: Service[];
  additionalServices: Service[];
}

interface PricingCardProps {
  plan: Plan;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan }) => {
  return (
    <div className="bg-white p-1 shadow-xl card-body cursor-pointer">
      <h3 className="text-heading font-semibold text-xl p-4 bg-slate-100 text-center transition-colors hover:bg-primary">
        {plan.title}
      </h3>

      <div className="w-full mt-10">
        {plan.icon && <div className="flex justify-center">{plan.icon}</div>}

        <div className="flex items-center justify-center gap-2 my-5">
          <span className="text-sm leading-4">
            Starts <br className="hidden md:inline" /> From
          </span>
          <p className="text-3xl text-heading">{plan.priceStart}</p>
        </div>

        {/* Services List */}
        <ServiceList title="Services" services={plan.services} />

        {/* Additional Services */}
        <ServiceList
          title="Additional Service"
          services={plan.additionalServices}
        />

        <div className="flex items-center justify-center my-8">
          <Button
            variant="outline"
            className="uppercase font-semibold rounded-full text-primary hover:bg-primary hover:text-white flex items-center px-8 py-2 mt-4 select-none hover:px-10 hover:scale-105 transition-all duration-300 ease-linear"
          >
            Get Started
            <ArrowIcon className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Reusable component for service lists
const ServiceList: React.FC<{ title: string; services: Service[] }> = ({
  title,
  services,
}) => (
  <>
    <h4 className="font-semibold text-heading text-xl text-center my-8">
      {title}
    </h4>
    <ul className="w-full">
      {services.map((service, index) => (
        <li
          key={index}
          className="flex items-center justify-between mx-7 border-b border-b-slate-200 pb-2 text-para"
        >
          <p className="w-[80%] leading-7">{service.name}</p>
          <span className="font-semibold text-primary text-lg w-[20%] text-end">
            {service.price}
          </span>
        </li>
      ))}
    </ul>
  </>
);

export default PricingCard;
