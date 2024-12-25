'use client'

import React, { useState, useEffect } from 'react';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import useOrderStore from "@/hooks/use-order-store";
import { PaymentMethod } from "@prisma/client";
import { Loader2 } from "lucide-react";
import StripePaymentElement from "./stripe-payment-element";

export default function PaymentComponent({ redirectStatus }) {
  console.log("redirectStatus", redirectStatus);
  
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("CREDIT_CARD");
  const { toast } = useToast();
  const { customerDetails } = useOrderStore(); 

  console.log("customerDetails", customerDetails);
  

  
  useEffect(() => {
    const fetchStripeKey = async () => {
      try {
        const response = await fetch("/api/config");
        const data = await response.json();
        console.log("Stripe Key Data:", data);
        setStripePromise(loadStripe(data.publishableKey));
        console.log("Stripe Promise:", loadStripe(data.publishableKey));
      } catch (error) {
        console.error("Error loading Stripe key:", error);
        toast({
          title: "Error",
          description: "Failed to load payment configuration. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchStripeKey();
  }, [toast]);

  
  useEffect(() => {
    const fetchClientSecret = async () => {
      if (!customerDetails) {
        console.error("Customer details are missing!");
        return;
      }
  
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerDetails }),
        });
  
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
  
        const data = await response.json();
        console.log("Response Data:", data); // এখানে চেক করুন clientSecret পাচ্ছেন কিনা
  
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
          console.log("clientSecret", clientSecret);
          
        } else {
          console.error("Client secret not found in the response.");
        }
      } catch (error) {
        console.error("Error fetching client secret:", error);
      }
    };
  
    fetchClientSecret();
  }, [customerDetails]);
  

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripePromise) {
      console.error("Stripe is not loaded yet.");
      return;
    }
    // setStripePromise(loadStripe(stripePromise));
  };

  // Loading UI: stripePromise এবং clientSecret লোড না হলে
  if (!stripePromise || !clientSecret) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Preparing Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-center text-gray-600">
            We Are setting up your payment securely. This may take a few moments.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <Card className="w-full max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <CustomRadio
              id="card"
              value="CREDIT_CARD"
              checked={paymentMethod === "CREDIT_CARD"}
              onChange={handlePaymentMethodChange}
            />
            <label htmlFor="card" className="text-lg font-medium cursor-pointer">
              Pay with Card
            </label>
          </div>
          
          {paymentMethod === "CREDIT_CARD" && (
            <StripePaymentElement />
          )}

          <Separator />

          <div className="flex items-center space-x-2">
            <CustomRadio
              id="bank_transfer"
              value="BANK_TRANSFER"
              checked={paymentMethod === "BANK_TRANSFER"}
              onChange={handlePaymentMethodChange}
            />
            <label htmlFor="bank_transfer" className="text-lg font-medium cursor-pointer">
              Bank Transfer
            </label>
          </div>

          <Separator />

          <div className="flex items-center space-x-2">
            <CustomRadio
              id="cash"
              value="CASH_TO_ENGINEER"
              checked={paymentMethod === "CASH_TO_ENGINEER"}
              onChange={handlePaymentMethodChange}
            />
            <label htmlFor="cash" className="text-lg font-medium cursor-pointer">
              Cash to Engineer
            </label>
          </div>

          <Button className="w-full mt-4" onClick={handleSubmit}>
            Confirm Payment
          </Button>
        </CardContent>
      </Card>
    </Elements>
  );
}

function CustomRadio({ id, value, checked, onChange }) {
  return (
    <div
      className={`w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center cursor-pointer ${
        checked ? "border-blue-600" : ""
      }`}
      onClick={() => onChange(value)}
    >
      <input
        type="radio"
        id={id}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="hidden"
      />
      {checked && <div className="w-3 h-3 rounded-full bg-primary" />}
    </div>
  );
}
