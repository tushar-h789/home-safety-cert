"use client";

import Stepper from "@/components/stepper";
import useOrderStore from "@/hooks/use-order-store";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function StepperController() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { cartItems, customerDetails } = useOrderStore();

  const [activeStep, setActiveStep] = useState(1);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  useEffect(() => {
    // Determine the active step based on the current route
    if (pathname.includes("/service-details")) {
      setActiveStep(1);
    } else if (pathname.includes("/personal-details")) {
      setActiveStep(2);
    } else if (pathname.includes("/confirmation")) {
      setActiveStep(3);
    } else if (pathname.includes("/payment")) {
      setActiveStep(4);
    }

    // Check for redirect_status in search params
    const redirectStatus = searchParams.get("redirect_status");
    if (redirectStatus === "succeeded") {
      setActiveStep(4);
      setPaymentCompleted(true);
    }
  }, [pathname, searchParams]);

  const isCheckoutDisabled = cartItems.length === 0;
  const isPaymentDisabled = cartItems.length === 0 || !customerDetails.name;

  return (
    <Stepper
      steps={[
        { label: "Service Details", link: "/service-details", disabled: false },
        {
          label: "Personal Details",
          link: "/personal-details",
          disabled: isCheckoutDisabled,
        },
        {
          label: "Confirmation",
          link: "/confirmation",
          disabled: isPaymentDisabled,
        },
        {
          label: "Payment",
          link: "/payment",
          disabled: isPaymentDisabled,
        },
      ]}
      activeStep={activeStep}
      paymentCompleted={paymentCompleted}
    />
  );
}