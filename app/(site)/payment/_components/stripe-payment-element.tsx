"use client";

import React, { FormEvent, useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useRouter, usePathname } from "next/navigation";
import useOrderStore from "@/hooks/use-order-store";
import { createOrder } from "../action";
import { LoadingButton } from "@/components/ui/loading-button";
import { CreditCard } from "lucide-react";

export default function StripePaymentElement() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const pathname = usePathname();

  // Extract data from useOrderStore
  const { customerDetails, subTotal, vat, totalPrice } = useOrderStore();
  console.log("customerDetails", customerDetails, subTotal, vat, totalPrice);
  

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage(null);

    if (!stripe || !elements) {
      setErrorMessage("Stripe is not properly initialized.");
      return;
    }

    if (!customerDetails.email) {
      setErrorMessage("Please ensure customer details are provided.");
      return;
    }

    try {
      setLoading(true);

      // Create order in the system before attempting Stripe payment
      const orderResponse = await createOrder({
        customerDetails,
        paymentMethod: "CREDIT_CARD",
        subTotal,
        vat,
        totalPrice, // Pass final total price including VAT
      });

      console.log("orderResponse", orderResponse);
      

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || "Failed to create order");
      }

      // Proceed with Stripe payment confirmation
      const response = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-confirmation`,
        },
        redirect: "if_required",
      });
      console.log("response", response);
      

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.paymentIntent) {
        const status = response.paymentIntent.status;
        router.replace(
          `${pathname}?payment_intent=${response.paymentIntent.id}&payment_intent_client_secret=${response.paymentIntent.client_secret}&redirect_status=${status}`
        );

        
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      setErrorMessage(error.message || "An error occurred during payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-5" onSubmit={handleSubmit}>
      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

      <PaymentElement
        options={{
          defaultValues: {
            billingDetails: {
              email: customerDetails.email,
              name: customerDetails.name,
              phone: customerDetails.phone,
              address: {
                country: "GB",
                city: customerDetails.city,
                postal_code: customerDetails.postCode,
                line1: customerDetails.houseStreet,
              },
            },
          },
        }}
      />

      <div className="mt-5 flex justify-between">
        <LoadingButton type="submit" loading={loading || !stripe || !elements}>
          {!loading && <CreditCard className="w-5 h-5 mr-2" />}
          {loading ? "Processing..." : "Complete Payment"}
        </LoadingButton>
      </div>
    </form>
  );
}
