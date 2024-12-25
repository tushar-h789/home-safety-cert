import { NextResponse } from "next/server";

console.log("key key:", process.env.STRIPE_PUBLISHABLE_KEY);

export async function GET() {
  return NextResponse.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
}
