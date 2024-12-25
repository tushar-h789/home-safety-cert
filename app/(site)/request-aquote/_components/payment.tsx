import React from 'react'
import CheckoutForm from './checkout-form'

export default function PaymentDetails() {
  return (
    <div className="container">
      <h1>Stripe Payment Integration</h1>
      <CheckoutForm />
    </div>
  )
}
