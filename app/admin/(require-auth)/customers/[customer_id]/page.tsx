
import SingleEntryNotFound from "@/components/single-entry-notfound";
import { getCustomerById, getOrdersByUsers } from "../actions";
import EditCustomerForm from "./_components/edit-user-from";

export default async function AdminCustomerDetailsPage({
  params,
}: {
  params: {
    customer_id: string;
  };
}) {
  const { customer_id } = params;
// console.log('customer page:',params);


  const customer = await getCustomerById(customer_id);

  if (!customer) {
    return <SingleEntryNotFound entryId={customer_id} name="customer" />;
  }

  return (
    <>
      <EditCustomerForm user={customer} />
    </>
  );
}
