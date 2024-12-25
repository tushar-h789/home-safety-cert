import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function OrderFailedPage() {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Failed</h1>
        <p className="text-gray-600 mb-6">
          We&apos;re sorry, but there was an issue processing your order. Please
          try again or contact our support team for assistance.
        </p>

        <div className="space-y-4">
          <Link href="/cart" replace className="block">
            <Button variant="outline" className="w-full">
              Return to Cart
            </Button>
          </Link>
          <Link href="/contact" replace className="block">
            <Button className="w-full">Contact Support</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
