"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useStripe } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";

export default function PaymentResult() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const stripe = useStripe();

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = searchParams.get("payment_intent_client_secret");

    if (clientSecret) {
      stripe?.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        setStatus(paymentIntent?.status || null);
        setMessage(getPaymentStatusInfo(paymentIntent?.status || "").message);
        setLoading(false);
      });
    } else {
      setStatus("error");
      setMessage("Payment information not found.");
      setLoading(false);
    }
  }, [stripe, searchParams]);

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg text-center">
        <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
        <h2 className="text-2xl font-bold mb-2">Retrieving Payment Status</h2>
        <p className="text-gray-600 mb-4">
          We&apos;re confirming the status of your transaction. This should only
          take a moment.
        </p>
        <p className="text-sm text-gray-500">
          Please do not refresh the page or navigate away.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      {status === "succeeded" && (
        <div className="text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Payment Successful</h2>
          <p className="text-gray-600 mb-4">{message}</p>
          <Button onClick={() => router.push("/")}>Return to Home</Button>
        </div>
      )}

      {status === "processing" && (
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Payment Processing</h2>
          <p className="text-gray-600 mb-4">{message}</p>
          <Button onClick={() => router.push("/")}>Return to Home</Button>
        </div>
      )}

      {(status === "requires_payment_method" ||
        status === "canceled" ||
        status === "error") && (
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
          <p className="text-gray-600 mb-4">{message}</p>
          <Button onClick={() => router.push("/checkout")}>Try Again</Button>
        </div>
      )}
    </div>
  );
}

function getPaymentStatusInfo(status: string): {
  message: string;
  type: "success" | "info" | "warning" | "danger";
} {
  switch (status) {
    case "succeeded":
      return {
        message: "Your payment was successful. Thank you for your order!",
        type: "success",
      };
    case "processing":
      return {
        message:
          "Your payment is being processed. We'll update you once it's complete.",
        type: "info",
      };
    case "requires_payment_method":
      return {
        message:
          "Your payment was not successful. Please try again with a different payment method.",
        type: "danger",
      };
    case "canceled":
      return {
        message:
          "Your payment was canceled. If this was a mistake, please try again.",
        type: "warning",
      };
    default:
      return {
        message:
          "An error occurred during the payment process. Please try again later.",
        type: "danger",
      };
  }
}
