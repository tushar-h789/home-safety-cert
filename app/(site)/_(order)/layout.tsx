import { Suspense } from "react";
import StepperLoader from "./_components/stepper-loader";
import StepperController from "./_components/stepper-controller";
import CommonBanner from "@/app/_components/common-banner";

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
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
      <div className="container flex flex-col md:flex-row">
        {/* Stepper */}
        <div className="w-full md:w-1/4 p-4 order-1 md:order-2">
          <div className="bg-section-background">
            <Suspense fallback={<StepperLoader />}>
              <StepperController />
            </Suspense>
          </div>
        </div>

        {/* Form */}
        <div className="w-full md:w-3/4 p-4 order-2 md:order-1">{children}</div>
      </div>
    </>
  );
}