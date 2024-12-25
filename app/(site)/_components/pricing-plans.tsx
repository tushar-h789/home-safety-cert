import ElectricIcon from "@/app/(site)/_components/icons/electric-icon";
import EmergencyLightIcon from "@/app/(site)/_components/icons/electric-light-icon";
import FireIcon from "@/app/(site)/_components/icons/fire-icon";
import FireRiskIcon from "@/app/(site)/_components/icons/fire-risk-assignment";
import HorizontalIcon from "@/app/(site)/_components/icons/horizontal-line-icon";
import Pat from "@/app/(site)/_components/icons/pat-icon";
import PricingCard from "@/app/(site)/_components/pricing-card";
import { HomeIcon } from "lucide-react";

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

export default function PricingPlans() {
  return (
    <section className=" pricing-bg py-8">
      <h2 className="text-center font-semibold text-3xl text-heading pb-10">
        Our Pricing Plans
      </h2>

      <div className="container">
        {/* card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* <div className="col-span-12 md:col-span-6 lg:col-span-4"> */}
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
