import { CustomerDetails } from "@/hooks/use-order-store";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with your secret API key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-10-16",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Request Body from frontend:", body); // Log the request body

    const { customerDetails, finalTotal }: { customerDetails: CustomerDetails; finalTotal: number } = body;

    // Validate required fields
    if (!customerDetails || !finalTotal) {
      return NextResponse.json(
        { message: "Missing customer details or final total." },
        { status: 400 }
      );
    }

    // Ensure finalTotal is a valid number
    if (typeof finalTotal !== "number" || finalTotal <= 0) {
      return NextResponse.json(
        { message: "Final total must be a positive number." },
        { status: 400 }
      );
    }

    // Create the payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalTotal * 100), // Convert finalTotal from pounds to pence
      currency: "gbp",
      payment_method_types: ["card"],
      description: "Service Payment",
      metadata: {
        customerName: customerDetails.name,
        customerEmail: customerDetails.email,
      },
    });

    // Check if the payment intent was created successfully
    if (!paymentIntent.client_secret) {
      throw new Error("Payment intent was created, but no client secret was returned.");
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    
    // Differentiate between Stripe errors and general errors
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { message: "Stripe error: " + error.message },
        { status: 402 }
      );
    }

    return NextResponse.json({ message: "Internal Server Error. Please try again later." }, { status: 500 });
  }
}



// export async function POST(req: NextRequest) {
//   try {
//     const {
//       customerDetails,
//       selectedServices,
//       additionalOptions,
//       finalTotal,
//     }: {
//       customerDetails: CustomerDetails;
//       selectedServices: { name: string; details: string; price: number }[];
//       additionalOptions: { name: string; details: string; price: number }[];
//       finalTotal: number;
//     } = await req.json();

//     // Validate required fields
//     if (!customerDetails || !selectedServices || !finalTotal) {
//       return NextResponse.json(
//         { message: "Missing required fields: customer details, selected services, or final total." },
//         { status: 400 }
//       );
//     }

//     // Ensure finalTotal is a valid number
//     if (typeof finalTotal !== "number" || finalTotal <= 0) {
//       return NextResponse.json(
//         { message: "Final total must be a positive number." },
//         { status: 400 }
//       );
//     }

//     // Convert finalTotal from pounds to pence (Stripe uses the smallest currency unit)
//     const amountInPence = Math.round(finalTotal * 100);

//     // Create the payment intent with Stripe
//     const paymentIntent = await stripe.paymentIntents.create({
//       currency: "gbp",
//       amount: amountInPence,
//       payment_method_types: ["card"],
//       description: "Thanks for your purchase!",
//       metadata: {
//         customerName: customerDetails.name,
//         selectedServices: JSON.stringify(selectedServices),
//         additionalOptions: JSON.stringify(additionalOptions),
//       },
//     });

//     // Check if payment intent was created successfully
//     if (paymentIntent && paymentIntent.client_secret) {
//       return NextResponse.json(
//         {
//           clientSecret: paymentIntent.client_secret,
//           orderId: paymentIntent.id,
//         },
//         { status: 200 }
//       );
//     } else {
//       // In case the paymentIntent exists but does not have a client_secret
//       console.error("Payment intent created but missing client_secret.");
//       return NextResponse.json(
//         { message: "Payment intent was created, but no client secret was returned." },
//         { status: 500 }
//       );
//     }
//   } catch (error: any) {
//     // Handle specific Stripe errors
//     if (error instanceof Stripe.errors.StripeError) {
//       console.error("Stripe error:", error.message);
//       return NextResponse.json(
//         { message: "Stripe error: " + error.message },
//         { status: 402 }
//       );
//     }

//     // General error handling and logging
//     console.error("Error creating payment intent:", error);

//     return NextResponse.json(
//       { message: "Internal Server Error. Please try again later." },
//       { status: 500 }
//     );
//   }
// }
