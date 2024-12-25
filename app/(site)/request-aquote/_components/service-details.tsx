"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import CommonBanner from "@/app/_components/common-banner";
import Link from "next/link";

// Zod schema definition
const schema = z
  .object({
    gas: z.boolean(),
    gasAppliances: z.string().nullable().optional(),
    eicr: z.boolean(),
    eicrUnits: z.string().nullable().optional(),
    epc: z.boolean(),
    epcBedrooms: z.string().nullable().optional(),
    epcProperty: z.string().nullable().optional(),
    epcService: z.string().nullable().optional(),
    service: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.gas && data.eicr && data.epc) {
        return true;
      }
      return false;
    },
    {
      message: "You must select at least one service",
      path: ["service"],
    }
  )
  .refine((data) => !data.gas || (data.gas && data.gasAppliances), {
    message: "Select the number of appliances if Gas is selected",
    path: ["gasAppliances"],
  })
  .refine((data) => !data.eicr || (data.eicr && data.eicrUnits), {
    message: "Select the number of units if EICR is selected",
    path: ["eicrUnits"],
  })
  .refine(
    (data) =>
      !data.epc ||
      (data.epc && data.epcBedrooms && data.epcProperty && data.epcService),
    {
      message: "All EPC fields must be filled if EPC is selected",
      path: ["epc"],
    }
  );

type FormData = z.infer<typeof schema>;

// Explicitly define the prop types
interface ServiceDetailsProps {
  setCurrentStep: (step: number) => void; // Set the type for setCurrentStep
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ setCurrentStep }) => {
  const router = useRouter();
  const [isGasChecked, setGasChecked] = useState(false);
  const [isEICRChecked, setEICRChecked] = useState(false);
  const [isEPCChecked, setEPCChecked] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      gas: false,
      gasAppliances: null,
      eicr: false,
      eicrUnits: null,
      epc: false,
      epcBedrooms: null,
      epcProperty: null,
      epcService: null,
    },
  });

   // Calculate total price
   const calculateTotalPrice = (data: FormData) => {
    let total = 0;
    const selected: string[] = [];

    if (data.gas) {
      switch (data.gasAppliances) {
        case "1":
          total += 80;
          selected.push("Gas: 1 Appliance (£80)");
          break;
        case "2":
          total += 100;
          selected.push("Gas: 2 Appliances (£100)");
          break;
        case "3":
          total += 120;
          selected.push("Gas: 3 Appliances (£120)");
          break;
      }
    }

    if (data.eicr) {
      switch (data.eicrUnits) {
        case "1":
          total += 150;
          selected.push("EICR: 1 Unit (£150)");
          break;
        case "2":
          total += 200;
          selected.push("EICR: 2 Units (£200)");
          break;
        case "3":
          selected.push("EICR: 3 Units (Call for Price)");
          break;
      }
    }

    if (data.epc) {
      switch (data.epcBedrooms) {
        case "1":
          total += 80;
          selected.push("EPC: 0-3 Bedrooms (£80)");
          break;
        case "2":
          total += 100;
          selected.push("EPC: 4-6 Bedrooms (£100)");
          break;
      }

      switch (data.epcProperty) {
        case "2":
          total += 30;
          selected.push("EPC: Inside TFL Zone 1 (+£30)");
          break;
        case "3":
          total += 10;
          selected.push("EPC: Outside TFL Zone 5 (+£10)");
          break;
      }

      switch (data.epcService) {
        case "1":
          total += 100;
          selected.push("EPC: Within the next 24 Hours (+£100)");
          break;
        case "2":
          total += 40;
          selected.push("EPC: Within the next 48 Hours (+£40)");
          break;
      }
    }

    setSelectedItems(selected);
    setTotalPrice(total);
  };
  const onSubmit = (data: FormData) => {
    console.log("data",data);
    
    calculateTotalPrice(data);

    // Save form data to local storage
    localStorage.setItem("serviceDetails", JSON.stringify({ data }));

    // setCurrentStep(1);
    // router.push("/request-aquote?active_step=2");
    // Move to the next step
    setCurrentStep(1);
  };

  // Reset category fields when a service is unchecked
  const handleGasChange = (checked: boolean) => {
    setGasChecked(checked);
    setValue("gas", checked);
    if (!checked) {
      setValue("gasAppliances", null);
    }
    // trigger();
  };

  const handleEICRChange = (checked: boolean) => {
    setEICRChecked(checked);
    setValue("eicr", checked);
    if (!checked) {
      setValue("eicrUnits", null);
    }
    // trigger();
  };

  const handleEPCChange = (checked: boolean) => {
    setEPCChecked(checked);
    setValue("epc", checked);
    if (!checked) {
      setValue("epcBedrooms", null);
      setValue("epcProperty", null);
      setValue("epcService", null);
    }
    trigger();
  };

  return (
    <section>
     
      <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-2xl">
      <h3 className="font-semibold text-lg mb-5">1. Service Details</h3>
      {errors.service && (
              <p className="text-red-500 text-sm mb-4">{errors.service.message}</p>
            )}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Gas Section */}
        <div className="mb-4">
          <label className="font-bold items-center space-x-2 inline">
            <Controller
              name="gas"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <input
                  type="checkbox"
                  {...field}
                  checked={value}
                  onChange={(e) => {
                    onChange(e.target.checked);
                    handleGasChange(e.target.checked);
                  }}
                />
              )}
            />
            <span>Gas*</span>
          </label>
           
          <p className="text-sm my-3 text-para">
            How many gas appliances does your property have?
          </p>
          <div className="space-y-2">
            <Controller
              name="gasAppliances"
              control={control}
              render={({ field }) => (
                <>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...field}
                      value="1"
                      checked={field.value === "1"}
                      disabled={!isGasChecked}
                      className="mr-2"
                    />
                    <p>
                      1 Appliance -{" "}
                      <span className="text-primary font-semibold mx-1">
                        (£80)
                      </span>
                    </p>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...field}
                      value="2"
                      checked={field.value === "2"}
                      disabled={!isGasChecked}
                      className="mr-2"
                    />
                    <p>
                      2 Appliances -{" "}
                      <span className="text-primary font-semibold mx-1">
                        (£100)
                      </span>
                    </p>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...field}
                      value="3"
                      checked={field.value === "3"}
                      disabled={!isGasChecked}
                      className="mr-2"
                    />
                    <p>
                      3 Appliances -{" "}
                      <span className="text-primary font-semibold mx-1">
                        (£120)
                      </span>
                    </p>
                  </label>
                </>
              )}
            />
            {errors.gasAppliances && (
              <p className="text-red-500 text-sm">
                {errors.gasAppliances.message}
              </p>
            )}
          </div>
        </div>

        {/* EICR Section */}
        <div className="mb-4">
          <label className="font-bold inline items-center space-x-2">
            <Controller
              name="eicr"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <input
                  type="checkbox"
                  {...field}
                  checked={value}
                  onChange={(e) => {
                    onChange(e.target.checked);
                    handleEICRChange(e.target.checked);
                  }}
                />
              )}
            />
            <span>EICR*</span>
          </label>
            {errors.eicr && (
              <p className="text-red-500 text-sm mb-4">{errors.eicr.message}</p>
            )}
          <p className="text-sm my-3 text-para">
            How many Fuse Boards does your property have?
          </p>
          <div className="space-y-2">
            <Controller
              name="eicrUnits"
              control={control}
              render={({ field }) => (
                <>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...field}
                      value="1"
                      checked={field.value === "1"}
                      disabled={!isEICRChecked}
                      className="mr-2"
                    />
                    1 Unit -{" "}
                    <span className="text-primary font-semibold mx-1">
                      (£150)
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...field}
                      value="2"
                      checked={field.value === "2"}
                      disabled={!isEICRChecked}
                      className="mr-2"
                    />
                    2 Units -{" "}
                    <span className="text-primary font-semibold mx-1">
                      (£200)
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...field}
                      value="3"
                      checked={field.value === "3"}
                      disabled={!isEICRChecked}
                      className="mr-2"
                    />
                    3 Units - (Call for Price)
                  </label>
                </>
              )}
            />
            {errors.eicrUnits && (
              <p className="text-red-500 text-sm">{errors.eicrUnits.message}</p>
            )}
          </div>
        </div>

        {/* EPC Section */}
        <div className="mb-4">
          <label className="font-bold inline items-center space-x-2">
            <Controller
              name="epc"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <input
                  type="checkbox"
                  {...field}
                  onChange={(e) => {
                    onChange(e.target.checked);
                    handleEPCChange(e.target.checked);
                  }}
                />
              )}
            />
            <span>EPC*</span>
          </label>
          {errors.epc && (
            <p className="text-red-500 text-sm">{errors.epc.message}</p>
          )}

          {/* EPC Bedroom */}
          <p className="text-sm my-3 text-para">
            How many Bedrooms does your property have?
          </p>
          <div className="space-y-2">
            <Controller
              name="epcBedrooms"
              control={control}
              render={({ field }) => (
                <>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...field}
                      value="1"
                      checked={field.value === "1"}
                      disabled={!isEPCChecked}
                      className="mr-2"
                    />
                    0-3 Bedrooms -{" "}
                    <span className="text-primary font-semibold mx-1">
                      (£80)
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...field}
                      value="2"
                      checked={field.value === "2"}
                      disabled={!isEPCChecked}
                      className="mr-2"
                    />
                    4-6 Bedrooms -{" "}
                    <span className="text-primary font-semibold mx-1">
                      (£100)
                    </span>
                  </label>
                </>
              )}
            />
            {errors.epcBedrooms && (
              <p className="text-red-500 text-sm">
                {errors.epcBedrooms.message}
              </p>
            )}

            {/* Additional Information */}
            {/* EPC Property */}
            <p className="text-sm pt-7 text-primary font-semibold">
              Is your property inside TFL Zone 1 or outside TFL Zone 5?
            </p>

            <Controller
              name="epcProperty"
              control={control}
              render={({ field }) => (
                <>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...field}
                      value="1"
                      checked={field.value === "1"}
                      disabled={!isEPCChecked}
                      className="mr-2"
                    />
                    No
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...field}
                      value="2"
                      checked={field.value === "2"}
                      disabled={!isEPCChecked}
                      className="mr-2"
                    />
                    Inside TFL Zone 1 -{" "}
                    <span className="text-primary font-semibold mx-1">
                      (+£30)
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...field}
                      value="3"
                      checked={field.value === "3"}
                      disabled={!isEPCChecked}
                      className="mr-2"
                    />
                    Outside TFL Zone 5 -{" "}
                    <span className="text-primary font-semibold mx-1">
                      (+£10)
                    </span>
                  </label>
                </>
              )}
            />
            {errors.epcProperty && (
              <p className="text-red-500 text-sm">
                {errors.epcProperty.message}
              </p>
            )}

            {/* EPC Services */}
            <p className="text-sm pt-7 pb-3 text-para">
              When do you want the service?
            </p>

            <Controller
              name="epcService"
              control={control}
              render={({ field }) => (
                <>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...field}
                      value="1"
                      checked={field.value === "1"}
                      disabled={!isEPCChecked}
                      className="mr-2"
                    />
                    Within the next 24 Hours -{" "}
                    <span className="text-primary font-semibold mx-1">
                      (+£100)
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...field}
                      value="2"
                      checked={field.value === "2"}
                      disabled={!isEPCChecked}
                      className="mr-2"
                    />
                    Within the next 48 Hours -{" "}
                    <span className="text-primary font-semibold mx-1">
                      (+£40)
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...field}
                      value="3"
                      checked={field.value === "3"}
                      disabled={!isEPCChecked}
                      className="mr-2"
                    />
                    Some other time
                  </label>
                </>
              )}
            />
            {errors.epcService && (
              <p className="text-red-500 text-sm">
                {errors.epcService.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        {/* <Link href='/request-aquote?active_step=3'> */}
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-full mt-4 uppercase border-2 shadow-lg hover:bg-transparent hover:text-primary ease-linear duration-100"
          >
          Next: Personal Details
        </button>
          {/* </Link> */}
      </form>
    </div>
    </section>
  );
};

export default ServiceDetails;
