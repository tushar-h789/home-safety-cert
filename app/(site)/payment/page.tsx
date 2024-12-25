import React, { Suspense } from "react";
import PaymentCompo from "./_components/payment-compo";

interface PaymentDetailsProps {
  setCurrentStep: (step: number) => void; // Set the type for setCurrentStep
  redirectStatus?: string; // Assuming redirectStatus is a prop. Change type accordingly.
}

const PaymentPage: React.FC<PaymentDetailsProps> = ({ setCurrentStep, redirectStatus }) => {
  return <PaymentCompo redirectStatus={redirectStatus} />;
};

export default PaymentPage;
