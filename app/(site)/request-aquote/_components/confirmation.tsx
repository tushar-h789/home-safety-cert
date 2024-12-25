import React, { useEffect, useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface SelectedService {
  name: string;
  details: string;
  price: number;
}

interface AdditionalOption {
  name: string;
  details: string;
  price: number;
}

interface ConfirmationProps {
  setCurrentStep: (step: number) => void; // Set the type for setCurrentStep
}

const ConfirmationComponent: React.FC<ConfirmationProps> = ({setCurrentStep}) => {
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [additionalOptions, setAdditionalOptions] = useState<AdditionalOption[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);

  useEffect(() => {
    const storedData = localStorage.getItem("serviceDetails");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const { data } = parsedData;
      const selected: SelectedService[] = [];
      const additional: AdditionalOption[] = [];
      let total = 0;

      // Gas selection
      if (data.gas) {
        const gasPrice =
          data.gasAppliances === "1" ? 80 : data.gasAppliances === "2" ? 100 : 120;
        total += gasPrice;
        selected.push({
          name: "Gas",
          details: `${data.gasAppliances} x appliances`,
          price: gasPrice,
        });
      }

      // EICR selection
      if (data.eicr) {
        const eicrPrice =
          data.eicrUnits === "1" ? 150 : data.eicrUnits === "2" ? 200 : 0;
        total += eicrPrice;
        selected.push({
          name: "EICR",
          details: `${data.eicrUnits} x units`,
          price: eicrPrice,
        });
      }

      // EPC selection
      if (data.epc) {
        const epcBedroomLabel = data.epcBedrooms === "1" ? "0-3 Bedrooms" : "4-6 Bedrooms";
        const epcBedroomPrice = data.epcBedrooms === "1" ? 80 : 100;
        total += epcBedroomPrice;
        selected.push({
          name: "EPC",
          details: epcBedroomLabel,
          price: epcBedroomPrice,
        });

        // Additional options for EPC
        const epcLocationLabel = data.epcProperty === "2" ? "Inside TFL Zone 1" : "Outside TFL Zone 5";
        const epcLocationPrice = data.epcProperty === "2" ? 30 : 10;
        total += epcLocationPrice;
        additional.push({
          name: "EPC Location",
          details: epcLocationLabel,
          price: epcLocationPrice,
        });

        const epcServiceLabel = data.epcService === "1" ? "Within 24 Hours" : data.epcService === "2" ? "Within 48 Hours" : "";
        const epcServicePrice = data.epcService === "1" ? 100 : data.epcService === "2" ? 40 : 0;
        total += epcServicePrice;
        additional.push({
          name: "EPC Service",
          details: epcServiceLabel,
          price: epcServicePrice,
        });
      }

      setSelectedServices(selected);
      setAdditionalOptions(additional);
      setTotalPrice(total);

      const vat = total * 0.2;
      const finalTotalWithVat = total + vat;
      setFinalTotal(finalTotalWithVat);
      
      // Store final total in local storage
      localStorage.setItem("finalTotal", finalTotalWithVat.toString());
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentStep(3);
    // router.push("/payment");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto shadow-2xl p-6 rounded-md">
      <h2 className="text-2xl font-semibold mb-4">3. Confirmation</h2>

      <Card>
        <div className="flex items-center justify-between font-semibold">
          <CardHeader>Services</CardHeader>
          <CardHeader>Charges</CardHeader>
        </div>
        {selectedServices.map((service, index) => (
          <div className="px-4 py-2 border" key={index}>
            <div>
              <p className="text-lg font-medium">{service.name}</p>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">{service.details}</p>
                <p className="font-medium">£{service.price}</p>
              </div>
            </div>
          </div>
        ))}
      </Card>

      {additionalOptions.length > 0 && (
        <Card className="my-4">
          <div className="flex items-center justify-between font-semibold">
            <CardHeader>Additional</CardHeader>
            <CardHeader>Charges</CardHeader>
          </div>
          {additionalOptions.map((option, index) => (
            <div className="px-4 py-2 border" key={index}>
              <div>
                <p className="text-lg font-medium">{option.name}</p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">{option.details}</p>
                  <p className="font-medium">£{option.price}</p>
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}

      <Card className="my-4">
        <div className="px-4 py-2 border">
          <div className="border-b-2 pb-2">
            <p className="text-lg font-medium">Subtotal</p>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Service + Additional</p>
              <p className="font-medium">£{totalPrice}</p>
            </div>
          </div>
          <div className="py-2">
            <p className="text-lg font-medium">VAT</p>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">20% of Subtotal</p>
              <p className="font-medium">£{(totalPrice * 0.2).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-3">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-lg">Total</p>
          <p className="font-semibold text-lg">£{finalTotal.toFixed(2)}</p>
        </div>
      </Card>

      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded-full mt-4 uppercase border-2 shadow-lg hover:bg-transparent hover:text-primary ease-linear duration-100"
      >
        Next: Payment Details
      </button>
    </form>
  );
};

export default ConfirmationComponent;
