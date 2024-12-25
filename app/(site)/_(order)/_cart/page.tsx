"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import useOrderStore from "@/hooks/use-order-store";
import { X, ShoppingCart, Home, Wrench } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { cartItems, removeItem } = useOrderStore();

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="container mx-auto py-8 max-w-screen-xl px-4 md:px-8 lg:px-16">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card
                  key={item.id}
                  className="p-5 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex h-full">
                    <div className="flex-grow space-y-3">
                      <h3 className="font-semibold text-lg">{item.name}</h3>

                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center">
                          <Wrench className="w-5 h-5 mr-2 text-primary" />
                          <span className="text-gray-900">
                            {item.serviceName || ""}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Home className="w-5 h-5 mr-2 text-primary" />
                          <span className="text-gray-900 capitalize">
                            {`For ${item.propertyType
                              .toLowerCase()
                              .replace("_", " ")} Property`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-end ml-4 min-h-[100px]">
                      <p className="font-bold text-primary text-lg">
                        £{item.price.toFixed(2)}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="hover:bg-red-100 hover:text-red-600 transition-shadow duration-300"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-4">
                Looks like you haven&apos;t added anything to your cart yet.
              </p>
              <Link href="/book-now">
                <Button variant="outline" className="mt-2">
                  Start Shopping
                </Button>
              </Link>
            </Card>
          )}
        </div>

        {/* Order summary section remains unchanged */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-4">
              <span>Total:</span>
              <span className="font-semibold">
                £{totalPrice.toFixed(2)}{" "}
                <span className="text-body font-normal text-sm">
                  (inc. Tax)
                </span>
              </span>
            </div>

            <div className="mt-20">
              <Link href="/book-now" className="mt-10 block">
                <Button
                  className="w-full mb-3 h-11 text-base"
                  variant="outline"
                >
                  Continue Booking
                </Button>
              </Link>
              <Link href="/checkout">
                <Button className="w-full h-11 text-base" variant="default">
                  Checkout Now
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
