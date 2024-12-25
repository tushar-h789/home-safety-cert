
import { generateInvoiceId } from "@/lib/generate-invoice";
import { getCustomers, getEngineers, getPackages } from "../[order_id]/actions";
import CreateOrderForm from "./_components/create-order-form";

export default async function AdminCreateOrderPage() {
  const customers = await getCustomers();
  const engineers = await getEngineers();
  const packages = await getPackages();
  const invoiceId = await generateInvoiceId();

  return (
    <CreateOrderForm
      customers={customers}
      engineers={engineers}
      packages={packages}
      invoiceId={invoiceId}
    />
  );
}
