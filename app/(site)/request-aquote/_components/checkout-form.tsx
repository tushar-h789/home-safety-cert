import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
console.log("public key:", process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);


export default function CheckoutForm() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log("response api:",response);
    if (response.ok) {
      const data = await response.json();
      console.log('Checkout session ID:', data.id);
    } else {
      console.error('Error fetching API:', response);
    }
    

    const { id } = await response.json();
    const stripe = await stripePromise;

    const { error } = await stripe!.redirectToCheckout({
      sessionId: id,
    });

    if (error) {
      console.warn(error.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleCheckout}
        className="bg-blue-500 text-white py-2 px-4 rounded"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Checkout'}
      </button>
    </div>
  );
}
