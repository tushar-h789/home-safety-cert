import { PaymentMethod } from "@prisma/client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";


// Assuming this is in use-order-store.ts or a similar file
export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  city: string;
  houseStreet: string;
  postCode: string;
}

// Define the type for the Order state
interface OrderState {
  customerDetails: CustomerDetails;
  paymentMethod: PaymentMethod;
  subTotal: number; // Subtotal for the confirmation page
  vat: number; // VAT for the confirmation page
  totalPrice: number; // Total price for the confirmation page

  setCustomerDetails: (details: Partial<CustomerDetails>) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setSubtotal: (value: number) => void;
  setVat: (value: number) => void;
  setTotalPrice: (value: number) => void;
}

// Define the initial state for CustomerDetails
const initialCustomerDetails: CustomerDetails = {
  name: "",
  email: "",
  phone: "",
  city: "",
  houseStreet: "",
  postCode: "",
};

// Zustand store for managing order and customer details
const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      customerDetails: initialCustomerDetails, // Initialize default customer details
      paymentMethod: PaymentMethod.CREDIT_CARD, // Default payment method
      subTotal: 0, // Initial subTotal set to 0
      vat: 0, // Initial VAT set to 0
      totalPrice: 0, // Initial total price set to 0

      // Set customer details by merging existing details with the new ones
      setCustomerDetails: (details: Partial<CustomerDetails>) =>
        set((state) => ({
          customerDetails: { ...state.customerDetails, ...details },
        })),

      // Set the payment method
      setPaymentMethod: (method: PaymentMethod) =>
        set({ paymentMethod: method }),

      // Set the subTotal for the confirmation page
      setSubtotal: (value: number) =>
        set({ subTotal: value }),

      // Set the VAT for the confirmation page
      setVat: (value: number) =>
        set({ vat: value }),

      // Set the total price for the confirmation page
      setTotalPrice: (value: number) =>
        set({ totalPrice: value }),
    }),
    {
      name: "order-storage", // Name for the persisted storage key
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
    }
  )
);

export default useOrderStore;
