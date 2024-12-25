import { HomeIcon } from "lucide-react";
import ElectricIcon from "../../_components/icons/electric-icon";
import EmergencyLightIcon from "../../_components/icons/electric-light-icon";
import FireIcon from "../../_components/icons/fire-icon";
import FireRiskIcon from "../../_components/icons/fire-risk-assignment";
import HorizontalIcon from "../../_components/icons/horizontal-line-icon";
import Pat from "../../_components/icons/pat-icon";
import { Button } from "@/components/ui/button";
import ArrowIcon from "../../_components/icons/arrow-icon";

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

const pricingPlans = [
  {
    id: 1,
    title: "Gas Safety Certificate",
    icon: <FireIcon className="w-20 h-20 text-primary pb-3 mx-auto" />,
    priceStart: "£60.00",
    services: [
      { name: "Gas meter+Pipe work", price: "£60" },
      {
        name: "Gas meter+Pipe work+ 1 Gas appliance (Boiler, Cooker or Fireplace)",
        price: "£70",
      },
      {
        name: "Gas meter+Pipe work+ 2 Gas appliances (Boiler, Cooker or Fireplace)",
        price: "£80",
      },
      {
        name: "Gas meter+Pipe work+ 3 Gas appliances (Boiler, Cooker or Fireplace)",
        price: "£90",
      },
    ],
    additionalServices: [
      { name: "Gas meter+Pipe work", price: "£60" },
      { name: "Gas meter+Pipe work+ 1 Gas appliance", price: "£70" },
      { name: "Gas meter+Pipe work+ 2 Gas appliances", price: "£80" },
      { name: "Gas meter+Pipe work+ 3 Gas appliances", price: "£90" },
    ],
  },
  {
    id: 2,
    title: "Electric Certificate (EICR)",
    icon: <ElectricIcon className="w-20 h-20 text-primary pb-3 mx-auto" />,
    priceStart: "£160.00",
    services: [
      { name: "One Bedroom/Studio property", price: "£80" },
      { name: "Two Bedrooms property", price: "£120" },
      { name: "Three Bedrooms property", price: "£150" },
      { name: "Four Bedrooms property", price: "£150" },
      { name: "Five Bedrooms property", price: "£150" },
      { name: "Wiring+ 2 appliances", price: "£180" },
    ],
    additionalServices: [
      {
        name: "Consumer Unit - Supply, Installation & Certification ( Complete Job)",
        price: "£50",
      },
    ],
  },
  {
    id: 3,
    title: "EPC",
    icon: <HorizontalIcon className="w-20 h-20 text-primary pb-3 mx-auto" />,
    priceStart: "£500.00",
    services: [
      { name: "Standard boiler installation", price: "£500" },
      { name: "Combi boiler installation", price: "£700" },
      { name: "System boiler installation", price: "£900" },
    ],
    additionalServices: [
      { name: "Old boiler removal", price: "£150" },
      { name: "Additional pipework", price: "£200" },
    ],
  },
  {
    id: 4,
    title: "Fire Risk Assessment",
    icon: <FireRiskIcon className="w-20 h-20 text-primary pb-3 mx-auto" />,
    priceStart: "£300.00",
    services: [
      { name: "Cavity wall insulation", price: "£300" },
      { name: "Loft insulation", price: "£400" },
      { name: "Floor insulation", price: "£500" },
    ],
    additionalServices: [
      { name: "Draft proofing", price: "£100" },
      { name: "Extra insulation materials", price: "£150" },
    ],
  },
  {
    id: 5,
    title: "Emergency Light Certification",
    icon: (
      <EmergencyLightIcon className="w-20 h-20 text-primary pb-3 mx-auto" />
    ),
    priceStart: "£100.00",
    services: [
      { name: "Leak detection and repair", price: "£100" },
      { name: "Drain unblocking", price: "£150" },
      { name: "Pipe installation", price: "£200" },
    ],
    additionalServices: [
      { name: "Emergency repair", price: "£50" },
      { name: "Water heater installation", price: "£300" },
    ],
  },
  {
    id: 6,
    title: "PAT",
    icon: <Pat className="w-20 h-20 text-primary pb-3 mx-auto" />,
    priceStart: "£250.00",
    services: [
      { name: "AC unit installation", price: "£250" },
      { name: "AC unit maintenance", price: "£150" },
      { name: "AC system repair", price: "£200" },
    ],
    additionalServices: [
      { name: "Thermostat installation", price: "£50" },
      { name: "Duct cleaning", price: "£100" },
    ],
  },
  {
    id: 6,
    title: "HMO",
    icon: <HomeIcon className="w-20 h-20 text-primary pb-3 mx-auto" />,
    priceStart: "£250.00",
    services: [
      { name: "AC unit installation", price: "£250" },
      { name: "AC unit maintenance", price: "£150" },
      { name: "AC system repair", price: "£200" },
    ],
    additionalServices: [
      { name: "Thermostat installation", price: "£50" },
      { name: "Duct cleaning", price: "£100" },
    ],
  },
  {
    id: 6,
    title: "Fire Alarm Certificate",
    priceStart: "£250.00",
    services: [
      { name: "AC unit installation", price: "£250" },
      { name: "AC unit maintenance", price: "£150" },
      { name: "AC system repair", price: "£200" },
    ],
    additionalServices: [
      { name: "Thermostat installation", price: "£50" },
      { name: "Duct cleaning", price: "£100" },
    ],
  },
];

export default function PricingPageCard() {
  return (
    <section className="container">
      <div className="text-center mt-28 mb-10">
        <h2 className="text-3xl font-semibold text-heading leading-10">
          Transparent Pricing for Peace of Mind
        </h2>
        <p className="text-para leading-6 my-3">
          Explore our pricing options for hassle-free landlord safety
          certifications. We keep it simple and <br /> transparent, so you can
          focus on property safety and compliance without any surprises.
        </p>
      </div>

      <div className="max-w-[800px] mx-auto gap-y-20 grid grid-cols-1 pb-32">
        {pricingPlans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white p-1 shadow-xl card-body cursor-pointer"
          >
            <h3 className="text-heading font-semibold text-xl p-4 bg-slate-100 text-center transition-colors hover:bg-primary">
              {plan.title}
            </h3>

            <div className="w-full mt-10">
              {plan.icon && (
                <div className="flex justify-center">{plan.icon}</div>
              )}

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
                  className="uppercase font-semibold rounded-full text-primary hover:bg-primary hover:text-white flex items-center px-8 py-2 mt-4 select-none transition-all duration-100 ease-linear"
                >
                  Get Started
                  <ArrowIcon className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

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
