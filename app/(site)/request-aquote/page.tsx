'use client';

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ServiceDetails from "./_components/service-details";
import Stepper from "./_components/stepper";
import PersonalDetails from "./_components/personal-details";
import ConfirmationDetails from "./_components/confirmation";
// import Payment from "./_components/payment";
import CommonBanner from "@/app/_components/common-banner";
import PaymentPage from "../payment/page";

const RequestQuotePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Parse the current step from query params or set to 0 by default
  const [currentStep, setCurrentStep] = useState<number>(parseInt(searchParams.get("active_step") || "0"));

  // Store which steps are completed
  const [stepsCompleted, setStepsCompleted] = useState<number>(0); // Keep track of how many steps are completed

  // Handles the step change (but restricts access to only previous or current steps)
  const handleStepChange = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
      router.push(`/request-aquote?active_step=${step}`);
    } else {
      alert("You need to complete the current step before proceeding.");
    }
  };

  // Function to advance to the next step (only if the current step is valid)
  const goToNextStep = () => {
    if (currentStep < stepsCompleted + 1) {
      setCurrentStep(currentStep + 1);
      setStepsCompleted(currentStep + 1);
      router.push(`/request-aquote?active_step=${currentStep + 1}`);
    }
  };

  useEffect(() => {
    // Sync currentStep with the query parameter when the page loads
    const stepFromQuery = parseInt(searchParams.get("active_step") || "0");
    if (stepFromQuery !== currentStep) {
      setCurrentStep(stepFromQuery);
    }
  }, [searchParams]);

  return (
    <section>
      <div className="mb-6">
        <CommonBanner
          heading="Request a Quote"
          firstPageName="Home"
          secondPageName="Request a Quote"
        />
      </div>
      <div className="container text-center pt-5">
        <h2>3 Simple Steps to Your Quote</h2>
        <p className="my-2 text-para">
          Obtaining a quote for our Home Safety Certification services is quick
          and easy. Follow our <br /> three simple steps to get a quote tailored
          to your needs.
        </p>
      </div>
      <div className="flex">
        {/* Form */}
        <div className="w-3/4 p-4">
          {/* Display current step's content */}
          {currentStep === 0 && <ServiceDetails setCurrentStep={goToNextStep} />}
          {currentStep === 1 && <PersonalDetails setCurrentStep={goToNextStep} />}
          {currentStep === 2 && <ConfirmationDetails setCurrentStep={goToNextStep} />}
          {currentStep === 3 && <PaymentPage setCurrentStep={goToNextStep} redirectStatus="yourRedirectStatusHere" />}
        </div>

        {/* Stepper */}
        <div className="w-1/4 p-4 -ml-64">
          <Stepper currentStep={currentStep} handleStepChange={handleStepChange} stepsCompleted={stepsCompleted} />
        </div>
      </div>
    </section>
  );
};

export default RequestQuotePage;
